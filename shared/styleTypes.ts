export type StyleCategory = "heading" | "body" | "caption" | "list" | "page" | "custom";

export interface FormattingProperties {
  fontFamily?: string;
  fontSizePt?: number;
  bold?: boolean;
  italic?: boolean;
  lineSpacing?: number;
  spacingBeforePt?: number;
  spacingAfterPt?: number;
  firstLineIndentPt?: number;
  leftIndentPt?: number;
  rightIndentPt?: number;
  alignment?: "left" | "center" | "right" | "justify";
  formulaScale?: number;
  formulaAlignment?: "left" | "center" | "right";
}

export interface FormattingStyle {
  id: string;
  name: string;
  category: StyleCategory;
  properties: FormattingProperties;
}
