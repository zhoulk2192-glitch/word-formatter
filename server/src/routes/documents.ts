import { Router } from "express";
import multer from "multer";
import { parseDocx } from "../services/docxParser.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});

export const documentsRouter = Router();

documentsRouter.post("/parse", upload.single("document"), async (request, response, next) => {
  try {
    if (!request.file) {
      response.status(400).json({ error: "A DOCX file is required." });
      return;
    }

    const parsed = await parseDocx(request.file.buffer, normalizeUploadedFileName(request.file.originalname));
    response.json(parsed);
  } catch (error) {
    next(error);
  }
});

function normalizeUploadedFileName(fileName: string): string {
  const decoded = Buffer.from(fileName, "latin1").toString("utf8");
  return decoded.includes("\uFFFD") ? fileName : decoded;
}
