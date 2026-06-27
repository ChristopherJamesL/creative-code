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
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
  };

  const baseClass =
    "flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all";
  const linkClass = `${baseClass} hover:border-primary hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`;

  const content = (
    <>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${variantClasses[variant]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-card-foreground">{value}</p>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
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
