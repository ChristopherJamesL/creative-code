import { randomUUID } from "crypto";
import { createRequire } from "module";
import path from "path";
import { supabase } from "../../config/supabase.js";

const _require = createRequire(import.meta.url);
const pdfParseFn = _require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;

const BUCKET = "documents";

async function extractText(file: {
  buffer: Buffer;
  mimetype: string;
}): Promise<string | null> {
  try {
    if (file.mimetype === "application/pdf") {
      const result = await pdfParseFn(file.buffer);
      return result.text?.trim() || null;
    }
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value?.trim() || null;
    }
    return null;
  } catch (err) {
    console.error("[extractText] failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

function extractSnippet(
  content: string | null,
  query: string,
  radius = 120,
): string {
  if (!content) return "";
  const idx = content.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return "";
  const start = Math.max(0, idx - radius);
  const end = Math.min(content.length, idx + query.length + radius);
  return (
    (start > 0 ? "…" : "") +
    content.slice(start, end) +
    (end < content.length ? "…" : "")
  );
}

export async function getAllDocuments(userId: string) {
  const { data, error } = await supabase
    .from("documents")
    .select("*, document_groups(id, name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createDocument(
  userId: string,
  fields: {
    title: string;
    client: string;
    type: string;
    status: string;
    date: string;
    groupId?: string;
  },
  file: { buffer: Buffer; originalname: string; mimetype: string },
) {
  const ext = path.extname(file.originalname).toLowerCase() || ".pdf";
  const storagePath = `${userId}/${randomUUID()}${ext}`;

  const [uploadResult, content] = await Promise.all([
    supabase.storage
      .from(BUCKET)
      .upload(storagePath, file.buffer, { contentType: file.mimetype }),
    extractText(file),
  ]);

  if (uploadResult.error) throw new Error(uploadResult.error.message);

  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: userId,
      title: fields.title,
      client: fields.client,
      type: fields.type,
      status: fields.status,
      date: fields.date,
      group_id: fields.groupId || null,
      file_url: storagePath,
      content,
    })
    .select("*, document_groups(id, name)")
    .single();

  if (error) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
    throw new Error(error.message);
  }

  return data;
}

export async function getDocumentById(userId: string, documentId: string) {
  const { data, error } = await supabase
    .from("documents")
    .select("*, document_groups(id, name)")
    .eq("id", documentId)
    .eq("user_id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function searchDocumentContent(userId: string, query: string) {
  const { data, error } = await supabase
    .from("documents")
    .select(
      "id, title, client, type, status, date, group_id, document_groups(id, name), content",
    )
    .eq("user_id", userId)
    .ilike("content", `%${query}%`)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((doc) => ({
    id: doc.id,
    title: doc.title,
    client: doc.client,
    type: doc.type as string,
    status: doc.status as string,
    date: doc.date as string,
    document_groups: (Array.isArray(doc.document_groups) ? doc.document_groups[0] ?? null : doc.document_groups) as { id: string; name: string } | null,
    snippet: extractSnippet(doc.content as string | null, query),
  }));
}

export async function downloadDocument(userId: string, documentId: string) {
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("file_url, type")
    .eq("id", documentId)
    .eq("user_id", userId)
    .single();

  if (docError || !doc?.file_url) throw new Error("Document not found");

  const { data, error } = await supabase.storage.from(BUCKET).download(doc.file_url);

  if (error || !data) throw new Error(error?.message ?? "Download failed");

  return { blob: data, fileType: doc.type as string };
}

export async function getSignedUrl(userId: string, documentId: string) {
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("file_url")
    .eq("id", documentId)
    .eq("user_id", userId)
    .single();

  if (docError || !doc?.file_url) throw new Error("Document not found");

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(doc.file_url, 3600);

  if (error) throw new Error(error.message);
  return data.signedUrl;
}
