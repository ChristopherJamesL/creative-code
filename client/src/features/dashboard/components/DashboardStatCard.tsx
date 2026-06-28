import { Link } from "react-router";
import type { StatCardVariant, DashboardStatCardProps } from "../dashboard.types";

export default function DashboardStatCard({
  label,
  value,
  description,
  icon,
  variant = "primary",
  to,
}: DashboardStatCardProps) {
  const variantClasses: Record<StatCardVariant, string> = {
    primary: "bg-secondary text-foreground",
    warning: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
  };

  const baseClass =
    "flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors";
  const linkClass = `${baseClass} hover:bg-secondary/40 hover:border-border/80 focus:outline-none focus:ring-1 focus:ring-primary`;

  const content = (
    <>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded ${variantClasses[variant]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-semibold text-card-foreground leading-none">{value}</p>
        <p className="mt-1 text-[13px] font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground truncate">{description}</p>
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={linkClass}>
        {content}
      </Link>
    );
  }

  return <div className={baseClass}>{content}</div>;
}
