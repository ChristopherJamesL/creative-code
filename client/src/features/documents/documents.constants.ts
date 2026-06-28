import type { DocStatus, DocType } from "./documents.types";

export const STATUS_BADGE: Record<
  DocStatus,
  { variant: "success" | "warning" | "destructive"; label: string }
> = {
  approved: { variant: "success",     label: "Approved" },
  pending:  { variant: "warning",     label: "Pending Review" },
  rejected: { variant: "destructive", label: "Rejected" },
};

export const TYPE_BADGE: Record<
  DocType,
  { variant: "info" | "default"; label: string }
> = {
  pdf:  { variant: "info",    label: "PDF" },
  docx: { variant: "default", label: "DOCX" },
};
