import type { FormattingStyle } from "@word-formatter/shared";

interface StylePanelProps {
  styles: FormattingStyle[];
}

export function StylePanel({ styles }: StylePanelProps) {
  return (
    <aside className="style-panel" aria-label="样式面板">
      <header>
        <p className="eyebrow">Styles</p>
        <h2>样式面板</h2>
      </header>

      <div className="style-list">
        {styles.map((style) => (
          <button className="style-item" key={style.id} type="button">
            <span>{getDisplayName(style)}</span>
            <small>{describeStyle(style)}</small>
          </button>
        ))}
      </div>
    </aside>
  );
}

function getDisplayName(style: FormattingStyle): string {
  const normalizedName = style.name.toLowerCase();
  const normalizedId = style.id.toLowerCase();
  const value = `${normalizedId} ${normalizedName}`;

  if (style.category === "page") {
    return "页面设置";
  }

  if (style.category === "formula") {
    return "公式";
  }

  if (/heading\s*1|title|标题\s*1|^1$/.test(value)) {
    return "一级标题";
  }

  if (/heading\s*2|标题\s*2|^2$/.test(value)) {
    return "二级标题";
  }

  if (/heading\s*3|标题\s*3|^3$/.test(value)) {
    return "三级标题";
  }

  if (/normal|body|正文/.test(value)) {
    return "正文";
  }

  if (/caption|题注/.test(value)) {
    return "题注";
  }

  if (/list|列表/.test(value)) {
    return "列表";
  }

  return style.name;
}

function describeStyle(style: FormattingStyle): string {
  const properties = style.properties;
  const parts = [
    getCategoryLabel(style.category),
    properties.fontFamily,
    properties.fontSizePt ? `${properties.fontSizePt}pt` : undefined,
    properties.lineSpacing ? `${properties.lineSpacing}x` : undefined,
    properties.alignment ? getAlignmentLabel(properties.alignment) : undefined,
    properties.formulaScale ? `公式 ${properties.formulaScale}x` : undefined,
    properties.pageMarginTopPt ? `上边距 ${properties.pageMarginTopPt}pt` : undefined
  ].filter(Boolean);

  return parts.join(" · ") || "模板样式";
}

function getCategoryLabel(category: FormattingStyle["category"]): string {
  const labels: Record<FormattingStyle["category"], string> = {
    heading: "标题",
    body: "正文",
    caption: "题注",
    list: "列表",
    page: "页面",
    formula: "公式",
    custom: "自定义"
  };

  return labels[category];
}

function getAlignmentLabel(alignment: NonNullable<FormattingStyle["properties"]["alignment"]>): string {
  const labels: Record<typeof alignment, string> = {
    left: "左对齐",
    center: "居中",
    right: "右对齐",
    justify: "两端对齐"
  };

  return labels[alignment];
}
