import { FileText, Library, Wand2 } from "lucide-react";
import type { FormattingStyle } from "@word-formatter/shared";
import { DocumentViewer } from "../components/DocumentViewer";
import { StylePanel } from "../components/StylePanel";
import { UploadDropzone } from "../components/UploadDropzone";
import { useDocumentUpload } from "../hooks/useDocumentUpload";
import { getCapabilitySummary } from "../services/documentApi";

const starterStyles: FormattingStyle[] = [
  {
    id: "heading-1",
    name: "一级标题",
    category: "heading",
    properties: {
      fontFamily: "SimHei",
      fontSizePt: 16,
      bold: true,
      lineSpacing: 1.5,
      spacingBeforePt: 12,
      spacingAfterPt: 6
    }
  },
  {
    id: "body-text",
    name: "正文",
    category: "body",
    properties: {
      fontFamily: "SimSun",
      fontSizePt: 12,
      lineSpacing: 1.5,
      firstLineIndentPt: 24
    }
  }
];

export function EditorPage() {
  void getCapabilitySummary();
  const { document, error, isUploading, uploadDocument } = useDocumentUpload();

  return (
    <main className="app-shell">
      <aside className="left-rail" aria-label="文档操作">
        <button className="icon-button" title="打开文档" type="button">
          <FileText size={20} />
        </button>
        <button className="icon-button" title="样式库" type="button">
          <Library size={20} />
        </button>
        <button className="icon-button" title="自动排版" type="button">
          <Wand2 size={20} />
        </button>
      </aside>

      <section className="workspace" aria-label="文档编辑区">
        <header className="toolbar">
          <div>
            <p className="eyebrow">Word Formatter</p>
            <h1>网页版 Word 排版工具</h1>
          </div>
          <div className="toolbar-actions">
            <button type="button">上传模板</button>
            <UploadDropzone isUploading={isUploading} onUpload={uploadDocument} />
            <button className="primary" type="button">导出 DOCX</button>
          </div>
        </header>

        {error ? <div className="error-banner">{error}</div> : null}

        <div className="document-stage">
          <DocumentViewer document={document} />
        </div>
      </section>

      <StylePanel styles={starterStyles} />
    </main>
  );
}
