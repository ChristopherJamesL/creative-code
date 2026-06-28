import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "destructive" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/85 active:bg-primary/75",
  secondary:
    "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/70 active:bg-secondary/60",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
  ghost:
    "bg-transparent text-foreground hover:bg-secondary active:bg-secondary/70",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-7  px-2.5 text-xs",
  md: "h-8  px-3   text-[13px]",
  lg: "h-9  px-4   text-sm",
};

const base =
  "inline-flex items-center justify-center font-medium rounded transition-colors select-none touch-manipulation " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 " +
  "disabled:opacity-40 disabled:cursor-not-allowed";

export default function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
