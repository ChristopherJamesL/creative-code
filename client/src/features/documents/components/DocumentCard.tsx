import { Link } from "react-router";
import Badge from "../../../components/ui/Badge";
import { STATUS_BADGE, TYPE_BADGE } from "../mock/documents";
import type { MockDocument } from "../documents.types";

function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  );
}

interface DocumentCardProps {
  doc: MockDocument;
}

export default function DocumentCard({ doc }: DocumentCardProps) {
  const status = STATUS_BADGE[doc.status];
  const type = TYPE_BADGE[doc.type];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      {/* Icon + badges */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileIcon className="h-5 w-5" />
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          <Badge variant={type.variant}>{type.label}</Badge>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </div>

      {/* Title + client */}
      <div>
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-card-foreground">
          {doc.title}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{doc.client}</p>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-border pt-2">
        <span className="text-xs text-muted-foreground">{doc.date}</span>
        <div className="flex items-center gap-1.5">
          {doc.aiReady && (
            <Badge variant="info" className="text-[10px]">
              AI Ready
            </Badge>
          )}
          <Link
            to={`/documents/${doc.id}`}
            className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary active:bg-secondary/80 select-none touch-manipulation"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
