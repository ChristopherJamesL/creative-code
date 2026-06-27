import DashboardStats from "../features/dashboard/components/DashboardStats";
import type { DashboardStatsData } from "../features/dashboard/dashboard.types";
import { MOCK_DOCUMENTS } from "../features/documents/mock/documents";

const SEVEN_DAYS_AGO = new Date();
SEVEN_DAYS_AGO.setDate(SEVEN_DAYS_AGO.getDate() - 7);

const stats: DashboardStatsData = {
  totalDocuments: MOCK_DOCUMENTS.length,
  pendingReview: MOCK_DOCUMENTS.filter((d) => d.status === "pending").length,
  aiSummariesReady: MOCK_DOCUMENTS.filter((d) => d.aiReady).length,
  recentUploads: MOCK_DOCUMENTS.filter(
    (d) => new Date(d.date) >= SEVEN_DAYS_AGO,
  ).length,
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your legal document activity.
        </p>
      </div>

      <DashboardStats data={stats} />
    </div>
  );
}
