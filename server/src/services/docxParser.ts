import { randomUUID } from "node:crypto";
import JSZip from "jszip";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import type { DocumentNode, FormulaNode, UploadedDocument } from "@word-formatter/shared";
import { ommlToLatex } from "./ommlToLatex.js";

const parser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
  textNodeName: "text",
  parseTagValue: false,
  trimValues: false
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  suppressEmptyNode: true
});

export async function parseDocx(buffer: Buffer, fileName: string): Promise<UploadedDocument> {
  let zip: JSZip;

  try {
    zip = await JSZip.loadAsync(buffer);
  } catch {
    throw new Error("Unable to read the DOCX package. Please upload a valid .docx file.");
  }

  const documentXml = await zip.file("word/document.xml")?.async("string");
  if (!documentXml) {
    throw new Error("The file is missing word/document.xml. .doc and non-standard DOCX files are not supported yet.");
  }

  const parsed = parser.parse(documentXml) as Record<string, unknown>;
  const body = getPath<Record<string, unknown>>(parsed, ["document", "body"]);
  if (!body) {
    throw new Error("Unable to read the DOCX body structure.");
  }

  return {
    id: randomUUID(),
    fileName,
    uploadedAt: new Date().toISOString(),
    nodes: toArray(body.p).flatMap((paragraph, index) => parseParagraph(paragraph, index))
  };
}

function parseParagraph(paragraph: unknown, index: number): DocumentNode[] {
  const paragraphNode = paragraph as Record<string, unknown>;
  const text = collectTextSkippingMath(paragraphNode).trim();
  const formulas = extractFormulas(paragraphNode);
  const styleId = getPath<string>(paragraphNode, ["pPr", "pStyle", "@_val"]);
  const isHeading = typeof styleId === "string" && /heading|title/i.test(styleId);

  if (formulas.length > 0 && text.length === 0) {
    return formulas.map((formula, formulaIndex) => createFormulaNode(index, formulaIndex, formula, styleId));
  }

  const nodes: DocumentNode[] = [
    {
      id: `p-${index + 1}`,
      type: isHeading ? "heading" : "paragraph",
      text,
      styleId
    }
  ];

  formulas.forEach((formula, formulaIndex) => {
    nodes.push(createFormulaNode(index, formulaIndex, formula, styleId));
  });

  return nodes;
}

function createFormulaNode(
  paragraphIndex: number,
  formulaIndex: number,
  formula: FormulaNode,
  styleId?: string
): DocumentNode {
  return {
    id: `p-${paragraphIndex + 1}-f-${formulaIndex + 1}`,
    type: "formula",
    text: formula.latex,
    styleId,
    formula
  };
}

function extractFormulas(paragraph: Record<string, unknown>): FormulaNode[] {
  return collectMathNodes(paragraph).map(({ node, display }) => {
    const omml = serializeFormula(node, display);
    return {
      omml,
      latex: ommlToLatex(omml),
      display,
      scale: 1
    };
  });
}

function collectTextSkippingMath(value: unknown): string {
  if (value == null) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(collectTextSkippingMath).join("");
  }

  if (typeof value !== "object") {
    return "";
  }

  const node = value as Record<string, unknown>;
  return Object.entries(node)
    .filter(([key]) => !key.startsWith("@_") && key !== "oMath" && key !== "oMathPara")
    .map(([key, child]) => (key === "t" ? toArray(child).map(readTextNode).join("") : collectTextSkippingMath(child)))
    .join("");
}

function readTextNode(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (node && typeof node === "object" && typeof (node as Record<string, unknown>).text === "string") {
    return (node as Record<string, string>).text;
  }

  return "";
}

function collectMathNodes(value: unknown): Array<{ node: unknown; display: boolean }> {
  if (!value || typeof value !== "object") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectMathNodes);
  }

  const node = value as Record<string, unknown>;
  const direct = [
    ...toArray(node.oMath).map((mathNode) => ({ node: mathNode, display: false })),
    ...toArray(node.oMathPara).map((mathNode) => ({ node: mathNode, display: true }))
  ];
  const nested = Object.entries(node)
    .filter(([key]) => !key.startsWith("@_") && key !== "oMath" && key !== "oMathPara")
    .flatMap(([, child]) => collectMathNodes(child));

  return [...direct, ...nested];
}

function serializeFormula(node: unknown, display: boolean): string {
  const key = display ? "m:oMathPara" : "m:oMath";
  return builder.build({ [key]: node });
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
