export interface DocumentNode {
  id: string;
  type: "paragraph" | "heading" | "table" | "image" | "formula";
  text: string;
  styleId?: string;
  formula?: FormulaNode;
}

export interface FormulaNode {
  latex: string;
  omml: string;
  display: boolean;
  alignment?: "left" | "center" | "right";
  scale?: number;
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  nodes: DocumentNode[];
  uploadedAt: string;
}
