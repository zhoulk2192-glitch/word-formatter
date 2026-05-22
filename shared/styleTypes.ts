export type StyleCategory = "heading" | "body" | "caption" | "list" | "page" | "formula" | "custom";

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
  pageMarginTopPt?: number;
  pageMarginRightPt?: number;
  pageMarginBottomPt?: number;
  pageMarginLeftPt?: number;
}

export interface FormattingStyle {
  id: string;
  name: string;
  category: StyleCategory;
  properties: FormattingProperties;
  source?: "template" | "system" | "user";
}

export interface ExtractedStyleLibrary {
  id: string;
  templateFileName: string;
  styles: FormattingStyle[];
  extractedAt: string;
}
