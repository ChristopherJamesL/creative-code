import { useQuery } from "@tanstack/react-query";
import { fetchDocument } from "../api/documents.api";

export function useDocument(id: string) {
  return useQuery({
    queryKey: ["documents", id],
    queryFn: () => fetchDocument(id),
    staleTime: 30 * 1000,
    enabled: !!id,
  });
}

export function useDocumentFileUrl(id: string) {
  const url = id ? `${import.meta.env.VITE_SERVER_URL}/documents/${id}/file` : undefined;
  return { data: url, isLoading: false, isError: false };
}
