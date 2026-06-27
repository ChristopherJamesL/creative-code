import { useDocuments } from "../features/documents/hooks/useDocuments";
import DocumentToolbar from "../features/documents/components/DocumentToolbar";
import DocumentGrid from "../features/documents/components/DocumentGrid";
import StatPill from "../features/documents/components/StatPill";

export default function DocumentsPage() {
  const {
    documents,
    stats,
    search,       setSearch,
    statusFilter, setStatus,
    typeFilter,   setType,
    sort,         setSort,
  } = useDocuments();

  const statItems = [
    { label: "Total documents",    value: stats.total   },
    { label: "Pending review",     value: stats.pending },
    { label: "AI summaries ready", value: stats.aiReady },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage, review, and summarise your legal documents.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {statItems.map((s) => (
          <StatPill key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <DocumentToolbar
        search={search}             onSearchChange={setSearch}
        statusFilter={statusFilter} onStatusChange={setStatus}
        typeFilter={typeFilter}     onTypeChange={setType}
        sort={sort}                 onSortChange={setSort}
        onUpload={() => {}}
      />

      <DocumentGrid documents={documents} />
    </div>
  );
}
