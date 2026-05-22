import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import { documentsRouter } from "./routes/documents.js";
import { healthRouter } from "./routes/health.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  app.use("/api/health", healthRouter);
  app.use("/api/documents", documentsRouter);
  app.use(errorHandler);

  return app;
}
