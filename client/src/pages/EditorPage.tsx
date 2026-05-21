import { FileText, Library, Wand2 } from "lucide-react";
import type { FormattingStyle } from "@word-formatter/shared";
import { StylePanel } from "../components/StylePanel";
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
            <button type="button">打开文档</button>
            <button className="primary" type="button">导出 DOCX</button>
          </div>
        </header>

        <div className="document-stage">
          <article className="document-page">
            <h2>第一章 项目背景</h2>
            <p>
              这里会显示上传后的 Word 文档内容。第一阶段先建立可运行的编辑器壳，
              后续步骤会接入 DOCX 渲染、选区映射、样式应用和导出。
            </p>
            <p>
              右侧样式面板会展示从模板中提取出的标题、正文、段落和页面格式，
              用户可以手动刷格式，也可以触发自动排版。
            </p>
          </article>
        </div>
      </section>

      <StylePanel styles={starterStyles} />
    </main>
  );
}
