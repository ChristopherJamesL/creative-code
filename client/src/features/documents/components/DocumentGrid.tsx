import DocumentCard from "./DocumentCard";
import type { Document } from "../documents.types";
import Spinner from "../../../components/ui/Spinner";

interface DocumentGridProps {
  documents: Document[];
  isLoading?: boolean;
  isError?: boolean;
  isAdmin?: boolean;
}

export default function DocumentGrid({ documents, isLoading, isError, isAdmin }: DocumentGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16 rounded-lg border border-border bg-card">
        <Spinner size="sm" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border border-border bg-card">
        <p className="text-[13px] font-medium text-foreground">Failed to load documents</p>
        <p className="mt-1 text-xs text-muted-foreground">Check your connection and try again.</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border border-border bg-card">
        <p className="text-[13px] font-medium text-foreground">No documents found</p>
        <p className="mt-1 text-xs text-muted-foreground">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border px-4 py-2 bg-muted/60">
        <div className="w-7 shrink-0" />
        <span className="flex-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Document</span>
        <span className="hidden sm:block text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-32 shrink-0">Status</span>
        <span className="hidden md:block text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-24 shrink-0 text-right">Date</span>
        <div className="w-12 shrink-0" />
      </div>

      <div className="divide-y divide-border">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
}
