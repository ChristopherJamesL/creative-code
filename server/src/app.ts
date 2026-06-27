import express from "express";
import cors from "cors";

import authRouter from "./features/auth/auth.router.js";
import documentsRouter from "./features/documents/documents.router.js";
import aiRouter from "./features/ai/ai.router.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/ai", aiRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "Legal Document API is running.",
  });
});

export default app;
