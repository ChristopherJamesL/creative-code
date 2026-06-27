import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { MOCK_DOCUMENTS } from "../mock/documents";
import type { DocumentStats, UseDocumentsReturn } from "../documents.types";

export function useDocuments(): UseDocumentsReturn {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const statusFilter = searchParams.get("status") ?? "";
  const typeFilter = searchParams.get("type") ?? "";
  const sort = searchParams.get("sort") ?? "date_desc";
  const aiReadyFilter = searchParams.get("aiReady") === "true";

  function setStatus(value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set("status", value);
      else next.delete("status");
      return next;
    });
  }

  function setType(value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set("type", value);
      else next.delete("type");
      return next;
    });
  }

  function setSort(value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("sort", value);
      return next;
    });
  }

  const documents = useMemo(() => {
    return MOCK_DOCUMENTS.filter((d) => {
      const matchesSearch =
        !search ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.client.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || d.status === statusFilter;
      const matchesType = !typeFilter || d.type === typeFilter;
      const matchesAiReady = !aiReadyFilter || d.aiReady === true;
      return matchesSearch && matchesStatus && matchesType && matchesAiReady;
    }).sort((a, b) => {
      if (sort === "name_asc") return a.title.localeCompare(b.title);
      if (sort === "name_desc") return b.title.localeCompare(a.title);
      if (sort === "date_asc") return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });
  }, [search, statusFilter, typeFilter, sort, aiReadyFilter]);

  const stats = useMemo<DocumentStats>(
    () => ({
      total: MOCK_DOCUMENTS.length,
      pending: MOCK_DOCUMENTS.filter((d) => d.status === "pending").length,
      aiReady: MOCK_DOCUMENTS.filter((d) => d.aiReady).length,
    }),
    [],
  );

  return {
    documents,
    stats,
    search,
    setSearch,
    statusFilter,
    setStatus,
    typeFilter,
    setType,
    sort,
    setSort,
  };
}
