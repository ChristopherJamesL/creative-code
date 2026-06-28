import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const base =
  "w-full h-8 rounded border bg-background px-2.5 text-base text-foreground " +
  "placeholder:text-muted-foreground transition-colors " +
  "focus:outline-none focus:ring-1 " +
  "disabled:opacity-40 disabled:cursor-not-allowed";

export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-foreground">
          {label}
        </label>
      )}

      <input
        id={id}
        aria-invalid={!!error}
        className={`${base} ${
          error
            ? "border-destructive focus:ring-destructive"
            : "border-border focus:ring-primary"
        } ${className}`}
        {...props}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
