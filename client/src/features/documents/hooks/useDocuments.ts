import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/axios";
import type { Document, DocumentStats, UseDocumentsReturn } from "../documents.types";

export function useDocuments(): UseDocumentsReturn {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const statusFilter = searchParams.get("status") ?? "";
  const typeFilter   = searchParams.get("type")   ?? "";
  const sort         = searchParams.get("sort")   ?? "date_desc";
  const groupFilter  = searchParams.get("group")  ?? "";

  const { data: allDocuments = [], isLoading, isError } = useQuery({
    queryKey: ["documents"],
    queryFn: () =>
      apiClient.get<{ data: Document[] }>("/documents").then((r) => r.data.data),
    staleTime: 30 * 1000,
  });

  function setStatus(value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set("status", value); else next.delete("status");
      return next;
    });
  }

  function setType(value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set("type", value); else next.delete("type");
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

  function setGroup(value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set("group", value); else next.delete("group");
      return next;
    });
  }

  const documents = useMemo(() => {
    return allDocuments
      .filter((d) => {
        const matchesSearch =
          !search ||
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.client.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !statusFilter || d.status === statusFilter;
        const matchesType   = !typeFilter   || d.type   === typeFilter;
        const matchesGroup  = !groupFilter  || d.group_id === groupFilter;
        return matchesSearch && matchesStatus && matchesType && matchesGroup;
      })
      .sort((a, b) => {
        if (sort === "name_asc")  return a.title.localeCompare(b.title);
        if (sort === "name_desc") return b.title.localeCompare(a.title);
        if (sort === "date_asc")  return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date);
      });
  }, [allDocuments, search, statusFilter, typeFilter, sort, groupFilter]);

  const stats = useMemo<DocumentStats>(
    () => ({
      total:   allDocuments.length,
      pending: allDocuments.filter((d) => d.status === "pending").length,
      aiReady: allDocuments.filter((d) => d.ai_ready).length,
    }),
    [allDocuments],
  );

  return {
    documents,
    stats,
    isLoading,
    isError,
    search,
    setSearch,
    statusFilter,
    setStatus,
    typeFilter,
    setType,
    sort,
    setSort,
    groupFilter,
    setGroup,
  };
}
