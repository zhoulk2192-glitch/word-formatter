import { XMLBuilder, XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
  textNodeName: "text"
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  suppressEmptyNode: true
});

export function serializeXml(value: unknown): string {
  return builder.build(value);
}

export function ommlToLatex(ommlXml: string): string {
  try {
    const parsed = parser.parse(ommlXml);
    return normalizeLatex(readMathNode(parsed));
  } catch {
    return "";
  }
}

function readMathNode(value: unknown): string {
  if (value == null) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(readMathNode).join("");
  }

  if (typeof value !== "object") {
    return "";
  }

  const node = value as Record<string, unknown>;

  if (typeof node.t === "object") {
    const textNode = node.t as Record<string, unknown>;
    return typeof textNode.text === "string" ? textNode.text : readMathNode(textNode);
  }

  if (typeof node.t === "string") {
    return node.t;
  }

  if (node.f) {
    return readFraction(node.f);
  }

  if (node.sSup) {
    return readScript(node.sSup, "^");
  }

  if (node.sSub) {
    return readScript(node.sSub, "_");
  }

  if (node.rad) {
    return `\\sqrt{${readMathNode(node.rad)}}`;
  }

  return Object.entries(node)
    .filter(([key]) => !key.startsWith("@_"))
    .map(([, child]) => readMathNode(child))
    .join("");
}

function readFraction(value: unknown): string {
  const node = Array.isArray(value) ? value[0] : value;
  if (!node || typeof node !== "object") {
    return "";
  }

  const fraction = node as Record<string, unknown>;
  return `\\frac{${readMathNode(fraction.num)}}{${readMathNode(fraction.den)}}`;
}

function readScript(value: unknown, operator: "^" | "_"): string {
  const node = Array.isArray(value) ? value[0] : value;
  if (!node || typeof node !== "object") {
    return "";
  }

  const script = node as Record<string, unknown>;
  const base = readMathNode(script.e);
  const argument = operator === "^" ? readMathNode(script.sup) : readMathNode(script.sub);
  return `${base}${operator}{${argument}}`;
}

function normalizeLatex(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}
