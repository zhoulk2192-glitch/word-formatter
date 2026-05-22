import type { FormulaNode } from "./formulaTypes";

export interface DocumentNode {
  id: string;
  type: "paragraph" | "heading" | "table" | "image" | "formula";
  text: string;
  styleId?: string;
  formula?: FormulaNode;
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  nodes: DocumentNode[];
  uploadedAt: string;
  page?: {
    marginTopPt?: number;
    marginRightPt?: number;
    marginBottomPt?: number;
    marginLeftPt?: number;
  };
}
