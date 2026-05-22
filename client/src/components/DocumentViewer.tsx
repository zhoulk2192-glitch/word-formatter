import type { UploadedDocument } from "@word-formatter/shared";
import { FormulaPreview } from "./FormulaPreview";

interface DocumentViewerProps {
  document: UploadedDocument | null;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  if (!document) {
    return (
      <article className="document-page empty-document">
        <h2>等待上传文档</h2>
        <p>上传 `.docx` 后，这里会显示解析出的段落、标题和可编辑公式结构。</p>
      </article>
    );
  }

  return (
    <article className="document-page">
      <header className="document-meta">
        <span>{document.fileName}</span>
        <small>{document.nodes.length} 个结构节点</small>
      </header>

      {document.nodes.map((node) => {
        if (node.type === "formula" && node.formula) {
          return (
            <section className="document-node formula-node" data-node-id={node.id} key={node.id}>
              <FormulaPreview formula={node.formula} />
              <code>{node.formula.latex || "OMML formula parsed without LaTeX output yet"}</code>
            </section>
          );
        }

        if (node.type === "heading") {
          return (
            <h2 className="document-node" data-node-id={node.id} key={node.id}>
              {node.text || "空标题"}
            </h2>
          );
        }

        return (
          <p className="document-node" data-node-id={node.id} key={node.id}>
            {node.text || "空段落"}
          </p>
        );
      })}
    </article>
  );
}
