import apiClient from "../../../api/axios";
import type { Document, ContentSearchResult } from "../documents.types";

export async function uploadDocument(formData: FormData): Promise<Document> {
  console.log("document upload form data", formData);
  const { data } = await apiClient.post<{ data: Document }>(
    "/documents",
    formData,
  );
  return data.data;
}

export async function fetchDocument(id: string): Promise<Document> {
  console.log("fetch document http request hit");
  const { data } = await apiClient.get<{ data: Document }>(`/documents/${id}`);
  return data.data;
}

export async function searchDocuments(
  query: string,
): Promise<ContentSearchResult[]> {
  const { data } = await apiClient.get<{ data: ContentSearchResult[] }>(
    "/documents/search",
    {
      params: { q: query },
    },
  );
  return data.data;
}

export async function getDocumentFileUrl(documentId: string): Promise<string> {
  console.log("documentFile http request hit");
  const { data } = await apiClient.get<{ data: { url: string } }>(
    `/documents/${documentId}/file-url`,
  );
  console.log("document file: ", data.data);
  return data.data.url;
}
