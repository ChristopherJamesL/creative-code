import { useQuery } from "@tanstack/react-query";
import { searchDocuments } from "../api/documents.api";
import { useDebounce } from "../../../hooks/useDebounce";

export function useContentSearch(query: string) {
  const debounced = useDebounce(query, 400);

  return useQuery({
    queryKey: ["documents", "search", debounced],
    queryFn: () => searchDocuments(debounced),
    enabled: debounced.trim().length >= 2,
    staleTime: 30 * 1000,
  });
}
