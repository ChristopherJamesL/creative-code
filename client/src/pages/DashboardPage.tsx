import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import DashboardStats from "../features/dashboard/components/DashboardStats";
import type { DashboardStatsData } from "../features/dashboard/dashboard.types";
import { STATUS_BADGE } from "../features/documents/documents.constants";
import type { DocStatus } from "../features/documents/documents.types";
import type { Document } from "../features/documents/documents.types";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import apiClient from "../api/axios";

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const SEVEN_DAYS_AGO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

export default function DashboardPage() {
  const { data: allDocuments = [], isLoading } = useQuery<Document[]>({
    queryKey: ["documents"],
    queryFn: () =>
      apiClient.get<{ data: Document[] }>("/documents").then((r) => r.data.data),
    staleTime: 30 * 1000,
  });

  const stats: DashboardStatsData = {
    totalDocuments:   allDocuments.length,
    pendingReview:    allDocuments.filter((d) => d.status === "pending").length,
    aiSummariesReady: allDocuments.filter((d) => d.ai_ready).length,
    recentUploads:    allDocuments.filter((d) => new Date(d.created_at) >= SEVEN_DAYS_AGO).length,
  };

  const recentDocs = [...allDocuments]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div>
        <h1 className="text-base font-semibold text-foreground">Dashboard</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Overview of your legal document activity.
        </p>
      </div>

      <DashboardStats data={stats} />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-foreground">Recent Documents</h2>
          <Link
            to="/documents"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="sm" />
          </div>
        ) : recentDocs.length === 0 ? (
          <div className="rounded-lg border border-border bg-card px-4 py-8 text-center">
            <p className="text-xs text-muted-foreground">No documents yet.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card overflow-hidden divide-y divide-border">
            {recentDocs.map((doc) => {
              const status = STATUS_BADGE[doc.status as DocStatus];
              return (
                <Link
                  key={doc.id}
                  to={`/documents/${doc.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/40 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground truncate">{doc.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{doc.client}</p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <span className="text-xs text-muted-foreground w-20 shrink-0 text-right hidden sm:block">
                    {formatDate(doc.date)}
                  </span>
                  <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    Open →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
