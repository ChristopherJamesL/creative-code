import type { ReactNode } from "react";

export interface DashboardStatsData {
  totalDocuments: number;
  pendingReview: number;
  aiSummariesReady: number;
  recentUploads: number;
}

export interface StatConfig {
  label: string;
  value: number;
  description: string;
  icon: ReactNode;
  variant: StatCardVariant;
  to?: string;
}

export interface DashboardStatsProps {
  data: DashboardStatsData;
}

export type StatCardVariant = "primary" | "warning" | "success";

export interface DashboardStatCardProps {
  label: string;
  value: number;
  description: string;
  icon: ReactNode;
  variant?: StatCardVariant;
  to?: string;
}
