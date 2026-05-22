import { randomUUID } from "node:crypto";
import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import type { ExtractedStyleLibrary, FormattingProperties, FormattingStyle, StyleCategory } from "@word-formatter/shared";
import { halfPointsToPoints, lineValueToMultiple, twentiethsToPoints } from "./unitConversion.js";

const parser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
  textNodeName: "text",
  parseTagValue: false,
  trimValues: false
});

export async function extractTemplateStyles(buffer: Buffer, fileName: string): Promise<ExtractedStyleLibrary> {
  const zip = await JSZip.loadAsync(buffer);
  const stylesXml = await zip.file("word/styles.xml")?.async("string");
  const documentXml = await zip.file("word/document.xml")?.async("string");

  if (!stylesXml) {
    throw new Error("The template is missing word/styles.xml.");
  }

  const styles = parseStyles(stylesXml);
  const pageStyle = documentXml ? parsePageStyle(documentXml) : undefined;
  const formulaStyle = inferFormulaStyle(documentXml);

  return {
    id: randomUUID(),
    templateFileName: fileName,
    styles: [pageStyle, formulaStyle, ...styles].filter((style): style is FormattingStyle => Boolean(style)),
    extractedAt: new Date().toISOString()
  };
}

function parseStyles(stylesXml: string): FormattingStyle[] {
  const parsed = parser.parse(stylesXml) as Record<string, unknown>;
  const styleNodes = toArray(getPath(parsed, ["styles", "style"]));

  return styleNodes
    .map((styleNode) => parseStyle(styleNode as Record<string, unknown>))
    .filter((style): style is FormattingStyle => Boolean(style));
}

function parseStyle(styleNode: Record<string, unknown>): FormattingStyle | undefined {
  const styleId = getAttr(styleNode, "styleId");
  const type = getAttr(styleNode, "type");

  if (!styleId || type !== "paragraph") {
    return undefined;
  }

  const name = getPath<string>(styleNode, ["name", "@_val"]) ?? styleId;
  const properties = parseFormattingProperties(styleNode);
  if (Object.keys(properties).length === 0) {
    return undefined;
  }

  return {
    id: styleId,
    name,
    category: classifyStyle(styleId, name),
    properties,
    source: "template"
  };
}

function parseFormattingProperties(styleNode: Record<string, unknown>): FormattingProperties {
  const runProperties = getPath<Record<string, unknown>>(styleNode, ["rPr"]) ?? {};
  const paragraphProperties = getPath<Record<string, unknown>>(styleNode, ["pPr"]) ?? {};

  return cleanProperties({
    fontFamily: readFontFamily(runProperties),
    fontSizePt: halfPointsToPoints(getPath(runProperties, ["sz", "@_val"])),
    bold: hasProperty(runProperties, "b"),
    italic: hasProperty(runProperties, "i"),
    lineSpacing: lineValueToMultiple(getPath(paragraphProperties, ["spacing", "@_line"])),
    spacingBeforePt: twentiethsToPoints(getPath(paragraphProperties, ["spacing", "@_before"])),
    spacingAfterPt: twentiethsToPoints(getPath(paragraphProperties, ["spacing", "@_after"])),
    firstLineIndentPt: twentiethsToPoints(getPath(paragraphProperties, ["ind", "@_firstLine"])),
    leftIndentPt: twentiethsToPoints(getPath(paragraphProperties, ["ind", "@_left"])),
    rightIndentPt: twentiethsToPoints(getPath(paragraphProperties, ["ind", "@_right"])),
    alignment: normalizeAlignment(getPath(paragraphProperties, ["jc", "@_val"]))
  });
}

function parsePageStyle(documentXml: string): FormattingStyle | undefined {
  const parsed = parser.parse(documentXml) as Record<string, unknown>;
  const sectionProperties = findFirstKey(parsed, "sectPr") as Record<string, unknown> | undefined;
  const margins = sectionProperties ? (getPath<Record<string, unknown>>(sectionProperties, ["pgMar"]) ?? {}) : {};
  const properties = cleanProperties({
    pageMarginTopPt: twentiethsToPoints(margins["@_top"]),
    pageMarginRightPt: twentiethsToPoints(margins["@_right"]),
    pageMarginBottomPt: twentiethsToPoints(margins["@_bottom"]),
    pageMarginLeftPt: twentiethsToPoints(margins["@_left"])
  });

  if (Object.keys(properties).length === 0) {
    return undefined;
  }

  return {
    id: "page-layout",
    name: "页面设置",
    category: "page",
    properties,
    source: "template"
  };
}

function inferFormulaStyle(documentXml?: string): FormattingStyle | undefined {
  if (!documentXml || !documentXml.includes("oMath")) {
    return undefined;
  }

  return {
    id: "formula-default",
    name: "公式",
    category: "formula",
    properties: {
      formulaAlignment: "center",
      formulaScale: 1
    },
    source: "template"
  };
}

function classifyStyle(styleId: string, name: string): StyleCategory {
  const value = `${styleId} ${name}`.toLowerCase();
  if (/heading|title|标题/.test(value)) {
    return "heading";
  }

  if (/caption|题注/.test(value)) {
    return "caption";
  }

  if (/list|列表/.test(value)) {
    return "list";
  }

  if (/normal|body|正文/.test(value)) {
    return "body";
  }

  return "custom";
}

function readFontFamily(runProperties: Record<string, unknown>): string | undefined {
  const fonts = getPath<Record<string, unknown>>(runProperties, ["rFonts"]);
  return (
    getAttr(fonts, "eastAsia") ??
    getAttr(fonts, "ascii") ??
    getAttr(fonts, "hAnsi") ??
    getAttr(fonts, "cs")
  );
}

function hasProperty(node: Record<string, unknown>, key: string): boolean | undefined {
  if (!Object.prototype.hasOwnProperty.call(node, key)) {
    return undefined;
  }

  const value = node[key];
  if (value && typeof value === "object" && (value as Record<string, unknown>)["@_val"] === "0") {
    return false;
  }

  return true;
}

function normalizeAlignment(value: unknown): FormattingProperties["alignment"] {
  if (value === "center" || value === "right" || value === "left" || value === "justify") {
    return value;
  }

  return undefined;
}

function cleanProperties(properties: FormattingProperties): FormattingProperties {
  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined)) as FormattingProperties;
}

function getAttr(node: unknown, name: string): string | undefined {
  if (!node || typeof node !== "object") {
    return undefined;
  }

  const value = (node as Record<string, unknown>)[`@_${name}`];
  return typeof value === "string" ? value : undefined;
}

function findFirstKey(value: unknown, keyName: string): unknown {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findFirstKey(item, keyName);
      if (found) {
        return found;
      }
    }

    return undefined;
  }

  const node = value as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(node, keyName)) {
    return node[keyName];
  }

  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("@_")) {
      continue;
    }

    const found = findFirstKey(child, keyName);
    if (found) {
      return found;
    }
  }

  return undefined;
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value == null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function getPath<T>(value: unknown, path: string[]): T | undefined {
  let current = value;

  for (const part of path) {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return current as T | undefined;
}
