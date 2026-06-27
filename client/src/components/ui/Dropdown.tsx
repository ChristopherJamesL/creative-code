import { useEffect, useRef, useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  id?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const chevron = (
  <svg
    className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-150"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

export default function Dropdown({
  id,
  options,
  value,
  onChange,
  placeholder = "Select…",
  label,
  disabled,
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  // Close when clicking outside the dropdown
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function handleSelect(optValue: string) {
    onChange(optValue);
    setIsOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Trigger */}
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((o) => !o)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={
            "w-full h-10 flex items-center justify-between gap-2 rounded-md border border-border " +
            "bg-background pl-3 pr-3 text-base transition-colors select-none touch-manipulation " +
            "focus:outline-none focus:ring-2 focus:ring-primary " +
            "disabled:opacity-50 disabled:cursor-not-allowed " +
            (isOpen ? "ring-2 ring-primary" : "")
          }
        >
          <span
            className={
              selectedLabel ? "text-foreground" : "text-muted-foreground"
            }
          >
            {selectedLabel ?? placeholder}
          </span>
          <span
            className={`transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
          >
            {chevron}
          </span>
        </button>

        {/* Options menu */}
        {isOpen && (
          <ul
            role="listbox"
            className={
              "absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-md " +
              "max-h-60 overflow-y-auto py-1"
            }
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onMouseDown={(e) => {
                  // mousedown instead of click to fire before the outside-click handler
                  e.preventDefault();
                  handleSelect(opt.value);
                }}
                className={
                  "flex items-center justify-between px-3 py-2 text-sm cursor-pointer " +
                  "transition-colors select-none " +
                  (opt.value === value
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-secondary")
                }
              >
                {opt.label}
                {opt.value === value && (
                  <svg
                    className="h-4 w-4 shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
