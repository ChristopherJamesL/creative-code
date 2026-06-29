import { Link } from "react-router";
import Badge from "../../../components/ui/Badge";
import { STATUS_BADGE, TYPE_BADGE } from "../documents.constants";
import type { Document } from "../documents.types";
import { useDeleteDocument } from "../hooks/useDeleteDocument";

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface DocumentCardProps {
  doc: Document;
  isAdmin?: boolean;
}

export default function DocumentCard({ doc, isAdmin }: DocumentCardProps) {
  const status = STATUS_BADGE[doc.status];
  const type   = TYPE_BADGE[doc.type];
  const deleteMutation = useDeleteDocument();

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (!window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    deleteMutation.mutate(doc.id);
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/40 transition-colors group">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-secondary text-muted-foreground">
        <FileIcon className="h-3.5 w-3.5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-foreground truncate">{doc.title}</p>
        <p className="text-xs text-muted-foreground truncate">
          {doc.client}
          {doc.document_groups && (
            <span className="ml-1.5 text-muted-foreground/60">· {doc.document_groups.name}</span>
          )}
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        <Badge variant={type.variant}>{type.label}</Badge>
        <Badge variant={status.variant}>{status.label}</Badge>
        {doc.ai_ready && <Badge variant="info">AI</Badge>}
      </div>

      <span className="hidden md:block text-xs text-muted-foreground w-24 shrink-0 text-right">
        {formatDate(doc.date)}
      </span>

      <Link
        to={`/documents/${doc.id}`}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 opacity-0 group-hover:opacity-100"
        tabIndex={0}
      >
        Open →
      </Link>

      {isAdmin && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          aria-label={`Delete ${doc.title}`}
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive disabled:opacity-40 touch-manipulation min-w-11 min-h-11 flex items-center justify-center"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      )}
    </div>
  );
}
