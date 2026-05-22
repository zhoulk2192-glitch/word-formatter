export interface FormulaNode {
  latex: string;
  omml: string;
  display: boolean;
  alignment?: "left" | "center" | "right";
  scale?: number;
}
