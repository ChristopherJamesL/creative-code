import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./features/auth/auth.router.js";
import documentsRouter from "./features/documents/documents.router.js";
import groupsRouter from "./features/groups/groups.router.js";
import aiRouter from "./features/ai/ai.router.js";
import adminRouter from "./features/admin/admin.router.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/groups", groupsRouter);
app.use("/api/ai", aiRouter);
app.use("/api/admin", adminRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Legal Document API is running." });
});

export default app;
