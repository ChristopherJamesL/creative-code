import { Link, useParams } from "react-router";
import {
  useDocument,
  useDocumentFileUrl,
} from "../features/documents/hooks/useDocument";
import { STATUS_BADGE, TYPE_BADGE } from "../features/documents/documents.constants";
import type { DocStatus, DocType } from "../features/documents/documents.types";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground w-24 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-[13px] text-foreground">{children}</span>
    </div>
  );
}

function FileViewer({ id, type }: { id: string; type: string }) {
  const { data: url } = useDocumentFileUrl(id);

  if (!url) return null;

  return (
    <div className="flex flex-col gap-3">
      {type === "pdf" ? (
        <iframe
          src={url}
          title="Document preview"
          className="w-full rounded-lg border border-border bg-card h-[55vh] lg:h-[82vh]"
        />
      ) : (
        <div className="flex items-center justify-center min-h-64 rounded-lg border border-border bg-card">
          <div className="text-center">
            <svg
              className="h-8 w-8 text-muted-foreground mx-auto mb-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p className="text-[13px] text-muted-foreground mb-3">
              DOCX files can't be previewed in browser.
            </p>
            <a
              href={url}
              download
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              Download file
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      )}

      <a
        href={url}
        download
        className="self-start inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download
      </a>
    </div>
  );
}

export default function DocumentPage() {
  const { id } = useParams<{ id: string }>();
  const { data: doc, isLoading, isError } = useDocument(id ?? "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="md" />
      </div>
    );
  }

  if (isError || !doc) {
    return (
      <div className="max-w-3xl">
        <Link
          to="/documents"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Documents
        </Link>
        <p className="text-sm text-muted-foreground">Document not found.</p>
      </div>
    );
  }

  const status = STATUS_BADGE[doc.status as DocStatus];
  const type = TYPE_BADGE[doc.type as DocType];

  return (
    <div className="flex flex-col gap-6 -mt-4">
      {/* Back */}
      <Link
        to="/documents"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors self-start"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Documents
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-foreground truncate">
            {doc.title}
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">{doc.client}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant={type.variant}>{type.label}</Badge>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Metadata */}
        <div className="rounded-lg border border-border bg-card px-4 py-1 h-fit">
          <MetaRow label="Client">{doc.client}</MetaRow>
          <MetaRow label="Status">
            <Badge variant={status.variant}>{status.label}</Badge>
          </MetaRow>
          <MetaRow label="Type">
            <Badge variant={type.variant}>{type.label}</Badge>
          </MetaRow>
          <MetaRow label="Date">{formatDate(doc.date)}</MetaRow>
          {doc.document_groups && (
            <MetaRow label="Group">{doc.document_groups.name}</MetaRow>
          )}
          {doc.ai_ready && (
            <MetaRow label="AI">
              <Badge variant="info">Ready</Badge>
            </MetaRow>
          )}
          <MetaRow label="Uploaded">
            {new Date(doc.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </MetaRow>
        </div>

        {/* File viewer */}
        <FileViewer id={doc.id} type={doc.type} />
      </div>
    </div>
  );
}
