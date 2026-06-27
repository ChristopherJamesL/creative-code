import type { HTMLAttributes } from "react";

type Variant = "default" | "success" | "warning" | "destructive" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  default:     "bg-secondary text-secondary-foreground",
  success:     "bg-success/15 text-success",
  warning:     "bg-warning/15 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info:        "bg-primary/10 text-primary",
};

const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium select-none";

export default function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={`${base} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
