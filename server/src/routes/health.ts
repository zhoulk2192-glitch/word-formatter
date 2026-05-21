import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_request, response) => {
  response.json({
    status: "ok",
    service: "word-formatter-api",
    capabilities: [
      "template-style-extraction",
      "document-preview",
      "manual-style-application",
      "auto-formatting",
      "docx-export"
    ]
  });
});
