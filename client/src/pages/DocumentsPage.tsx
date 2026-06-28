import { useState } from "react";
import { useDocuments } from "../features/documents/hooks/useDocuments";
import DocumentToolbar from "../features/documents/components/DocumentToolbar";
import DocumentGrid from "../features/documents/components/DocumentGrid";
import UploadDocumentModal from "../features/documents/components/UploadDocumentModal";
import ContentSearch from "../features/documents/components/ContentSearch";
import { useGroups } from "../features/groups/hooks/useGroups";

const STATUS_LABELS: Record<string, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

const TYPE_LABELS: Record<string, string> = {
  pdf: "PDF",
  docx: "DOCX",
};

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-border bg-secondary px-2 py-0.5 text-[12px] text-foreground">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors touch-manipulation"
      >
        <svg className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </span>
  );
}

export default function DocumentsPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const { data: groups = [] } = useGroups();

  const {
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
  } = useDocuments();

  const activeGroupName = groups.find((g) => g.id === groupFilter)?.name;
  const hasActiveFilters =
    !!search || !!statusFilter || !!typeFilter || !!groupFilter;

  return (
    <div className="flex flex-col gap-4 max-w-5xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold text-foreground">Documents</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {stats.total} documents · {stats.pending} pending · {stats.aiReady}{" "}
            AI ready
          </p>
        </div>
      </div>

      <DocumentToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatus}
        typeFilter={typeFilter}
        onTypeChange={setType}
        sort={sort}
        onSortChange={setSort}
        groupFilter={groupFilter}
        onGroupChange={setGroup}
        onUpload={() => setUploadOpen(true)}
      />

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground mr-0.5">
            Filters:
          </span>

          {search && (
            <FilterChip label={`"${search}"`} onRemove={() => setSearch("")} />
          )}
          {groupFilter && activeGroupName && (
            <FilterChip
              label={`Group: ${activeGroupName}`}
              onRemove={() => setGroup("")}
            />
          )}
          {statusFilter && (
            <FilterChip
              label={STATUS_LABELS[statusFilter] ?? statusFilter}
              onRemove={() => setStatus("")}
            />
          )}
          {typeFilter && (
            <FilterChip
              label={TYPE_LABELS[typeFilter] ?? typeFilter}
              onRemove={() => setType("")}
            />
          )}

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatus("");
              setType("");
              setGroup("");
            }}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors ml-1 touch-manipulation"
          >
            Clear all
          </button>
        </div>
      )}

      <div>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Search in file contents
        </h2>
        <ContentSearch />
      </div>

      <DocumentGrid
        documents={documents}
        isLoading={isLoading}
        isError={isError}
      />

      <UploadDocumentModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />
    </div>
  );
}
