export type DocStatus = "approved" | "pending" | "rejected";
export type DocType = "pdf" | "docx";

export interface MockDocument {
  id: string;
  title: string;
  client: string;
  type: DocType;
  status: DocStatus;
  date: string;
  aiReady: boolean;
}

export interface DocumentStats {
  total: number;
  pending: number;
  aiReady: number;
}

export interface UseDocumentsReturn {
  documents: MockDocument[];
  stats: DocumentStats;
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatus: (value: string) => void;
  typeFilter: string;
  setType: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
}
