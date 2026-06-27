import type { DocStatus, DocType, MockDocument } from "../documents.types";

export const MOCK_DOCUMENTS: MockDocument[] = [
  {
    id: "1",
    title: "Contract for Sale of Property",
    client: "Johnson & Partners",
    type: "pdf",
    status: "approved",
    date: "Jun 18, 2026",
    aiReady: true,
  },
  {
    id: "2",
    title: "Non-Disclosure Agreement",
    client: "Meridian Holdings",
    type: "docx",
    status: "pending",
    date: "Jun 20, 2026",
    aiReady: false,
  },
  {
    id: "3",
    title: "Employment Agreement",
    client: "TechCorp Inc.",
    type: "pdf",
    status: "pending",
    date: "Jun 22, 2026",
    aiReady: false,
  },
  {
    id: "4",
    title: "Commercial Lease Agreement",
    client: "Broad Street Realty",
    type: "pdf",
    status: "approved",
    date: "Jun 15, 2026",
    aiReady: true,
  },
  {
    id: "5",
    title: "Legal Opinion Letter",
    client: "Statefield Capital",
    type: "docx",
    status: "rejected",
    date: "Jun 12, 2026",
    aiReady: false,
  },
  {
    id: "6",
    title: "Motion to Dismiss",
    client: "Pro Se Client",
    type: "pdf",
    status: "pending",
    date: "Jun 24, 2026",
    aiReady: true,
  },
];

export const STATUS_BADGE: Record<
  DocStatus,
  { variant: "success" | "warning" | "destructive"; label: string }
> = {
  approved: { variant: "success", label: "Approved" },
  pending: { variant: "warning", label: "Pending Review" },
  rejected: { variant: "destructive", label: "Rejected" },
};

export const TYPE_BADGE: Record<
  DocType,
  { variant: "info" | "default"; label: string }
> = {
  pdf: { variant: "info", label: "PDF" },
  docx: { variant: "default", label: "DOCX" },
};
