import DashboardStatCard from "./DashboardStatCard";
import { FileIcon, ClockIcon, SparkleIcon, UploadIcon } from "../icons/icons";

import type { DashboardStatsProps, StatConfig } from "../dashboard.types";

export default function DashboardStats({ data }: DashboardStatsProps) {
  const cards: StatConfig[] = [
    {
      label: "Total Documents",
      value: data.totalDocuments,
      description: "All documents in the system",
      icon: <FileIcon />,
      variant: "primary",
      to: "/documents",
    },
    {
      label: "Pending Review",
      value: data.pendingReview,
      description: "Awaiting legal review",
      icon: <ClockIcon />,
      variant: "warning",
      to: "/documents?status=pending",
    },
    {
      label: "AI Summaries Ready",
      value: data.aiSummariesReady,
      description: "Summaries generated and ready",
      icon: <SparkleIcon />,
      variant: "success",
      to: "/documents?aiReady=true",
    },
    {
      label: "Recent Uploads",
      value: data.recentUploads,
      description: "Uploaded in the last 7 days",
      icon: <UploadIcon />,
      variant: "primary",
      to: "/documents?sort=date_desc",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <DashboardStatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
