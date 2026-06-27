import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const base =
  "w-full h-10 rounded-md border bg-background px-3 text-base text-foreground " +
  "placeholder:text-muted-foreground transition-colors " +
  "focus:outline-none focus:ring-2 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
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

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
