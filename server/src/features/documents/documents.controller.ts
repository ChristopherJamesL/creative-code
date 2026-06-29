import type { Request, Response } from "express";
import { getAllDocuments, createDocument, getDocumentById, searchDocumentContent, getSignedUrl, downloadDocument, deleteDocument } from "./documents.service.js";
import { sendSuccess } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";

export async function httpGetAllDocuments(req: Request, res: Response) {
  const { userId } = req as AuthenticatedRequest;
  try {
    const documents = await getAllDocuments(userId);
    return sendSuccess(res, { data: documents });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch documents";
    res.status(500).json({ error: message });
  }
}

export async function httpCreateDocument(req: Request, res: Response) {
  const { userId } = req as AuthenticatedRequest;
  const file = (req as Request & { file?: Express.Multer.File }).file;

  if (!file) {
    res.status(400).json({ error: "file is required" });
    return;
  }

  const { title, client, type, status, date, group_id } = req.body as Record<string, string>;

  if (!title?.trim() || !client?.trim() || !type || !status || !date) {
    res.status(400).json({ error: "title, client, type, status, and date are required" });
    return;
  }

  try {
    const doc = await createDocument(
      userId,
      { title: title.trim(), client: client.trim(), type, status, date, ...(group_id ? { groupId: group_id } : {}) },
      file,
    );
    return sendSuccess(res, { data: doc, status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create document";
    console.error("[createDocument]", message);
    res.status(500).json({ error: message });
  }
}

export async function httpGetDocument(req: Request, res: Response) {
  const { userId } = req as AuthenticatedRequest;
  const { id } = req.params as { id: string };

  try {
    const doc = await getDocumentById(userId, id);
    return sendSuccess(res, { data: doc });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Document not found";
    console.error("[getDocument] error", id, message);
    res.status(404).json({ error: message });
  }
}

export async function httpSearchDocuments(req: Request, res: Response) {
  const { userId } = req as AuthenticatedRequest;
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

  if (!q) {
    res.status(400).json({ error: "q is required" });
    return;
  }

  try {
    const results = await searchDocumentContent(userId, q);
    return sendSuccess(res, { data: results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed";
    res.status(500).json({ error: message });
  }
}

export async function httpStreamDocument(req: Request, res: Response) {
  const { userId } = req as AuthenticatedRequest;
  const { id } = req.params as { id: string };

  try {
    const { blob, fileType } = await downloadDocument(userId, id);
    const contentType =
      fileType === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    const buffer = Buffer.from(await blob.arrayBuffer());
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Content-Length", buffer.length);
    res.send(buffer);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to stream document";
    console.error("[streamDocument]", id, message);
    res.status(500).json({ error: message });
  }
}

export async function httpDeleteDocument(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  try {
    await deleteDocument(id);
    return sendSuccess(res, { data: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    res.status(500).json({ error: message });
  }
}

export async function httpGetFileUrl(req: Request, res: Response) {
  const { userId } = req as AuthenticatedRequest;
  const { id } = req.params as { id: string };

  try {
    const url = await getSignedUrl(userId, id);
    return sendSuccess(res, { data: { url } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate URL";
    console.error("[getFileUrl] error", id, message);
    res.status(500).json({ error: message });
  }
}
