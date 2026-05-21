import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  app.use("/api/health", healthRouter);

  return app;
}
