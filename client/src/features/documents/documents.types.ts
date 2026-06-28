export type DocStatus = "approved" | "pending" | "rejected";
export type DocType = "pdf" | "docx";

export interface DocumentGroup {
  id: string;
  name: string;
}

export interface Document {
  id: string;
  user_id: string;
  title: string;
  client: string;
  type: DocType;
  status: DocStatus;
  date: string;
  ai_ready: boolean;
  file_url: string | null;
  group_id: string | null;
  document_groups: DocumentGroup | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentStats {
  total: number;
  pending: number;
  aiReady: number;
}

export interface ContentSearchResult {
  id: string;
  title: string;
  client: string;
  type: string;
  status: string;
  date: string;
  document_groups: DocumentGroup | null;
  snippet: string;
}

export interface UseDocumentsReturn {
  documents: Document[];
  stats: DocumentStats;
  isLoading: boolean;
  isError: boolean;
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatus: (value: string) => void;
  typeFilter: string;
  setType: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  groupFilter: string;
  setGroup: (value: string) => void;
}
