import katex from "katex";
import "katex/dist/katex.min.css";
import type { FormulaNode } from "@word-formatter/shared";

interface FormulaPreviewProps {
  formula: FormulaNode;
}

export function FormulaPreview({ formula }: FormulaPreviewProps) {
  const html = katex.renderToString(formula.latex || "\\text{Unsupported formula}", {
    displayMode: formula.display,
    throwOnError: false
  });

  return (
    <div
      className="formula-preview"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        textAlign: formula.alignment ?? "center",
        transform: `scale(${formula.scale ?? 1})`
      }}
    />
  );
}
