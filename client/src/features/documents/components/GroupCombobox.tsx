import { useEffect, useRef, useState } from "react";
import { useGroups, useCreateGroup } from "../../groups/hooks/useGroups";
import type { Group } from "../../groups/types";

interface GroupComboboxProps {
  value: string;
  onChange: (groupId: string) => void;
  label?: string;
  dropUp?: boolean;
}

export default function GroupCombobox({ value, onChange, label, dropUp = false }: GroupComboboxProps) {
  const { data: groups = [] } = useGroups();
  const createGroup = useCreateGroup();

  const selectedGroup = groups.find((g) => g.id === value);
  const [inputValue, setInputValue] = useState(selectedGroup?.name ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [createError, setCreateError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(selectedGroup?.name ?? "");
  }, [selectedGroup?.name]);

  useEffect(() => {
    if (!isOpen) return;
    function onMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen]);

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const showCreate =
    inputValue.trim() !== "" &&
    !groups.some((g) => g.name.toLowerCase() === inputValue.trim().toLowerCase());

  function handleSelect(groupId: string, groupName: string) {
    onChange(groupId);
    setInputValue(groupName);
    setIsOpen(false);
  }

  function handleClear() {
    onChange("");
    setInputValue("");
    inputRef.current?.focus();
  }

  async function handleCreate() {
    const name = inputValue.trim();
    if (!name) return;
    setCreateError("");
    try {
      const group: Group = await createGroup.mutateAsync(name);
      handleSelect(group.id, group.name);
    } catch {
      setCreateError("Failed to create group");
    }
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-1">
      {label && <span className="text-xs font-medium text-foreground">{label}</span>}

      <div className="relative">
        <div className="flex h-8 items-center rounded border border-border bg-background px-2.5 gap-2 focus-within:ring-1 focus-within:ring-primary transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
              if (e.target.value === "") onChange("");
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                if (showCreate) {
                  handleCreate();
                } else if (filtered.length > 0) {
                  handleSelect(filtered[0].id, filtered[0].name);
                }
              }
              if (e.key === "Escape") {
                e.stopPropagation();
                setIsOpen(false);
                inputRef.current?.blur();
              }
            }}
            placeholder="None"
            className="flex-1 min-w-0 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear group"
            >
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}
        </div>

        {createError && (
          <p className="mt-1 text-[11px] text-destructive">{createError}</p>
        )}

        {isOpen && (filtered.length > 0 || showCreate) && (
          <ul className={`absolute z-50 w-full rounded border border-border bg-card shadow-lg max-h-48 overflow-y-auto py-0.5 ${dropUp ? "bottom-full mb-1" : "mt-1"}`}>
            {filtered.map((g) => (
              <li
                key={g.id}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(g.id, g.name); }}
                className={
                  "px-2.5 py-1.5 text-[13px] cursor-pointer select-none transition-colors " +
                  (g.id === value
                    ? "bg-secondary text-foreground font-medium"
                    : "text-foreground hover:bg-secondary/60")
                }
              >
                {g.name}
              </li>
            ))}
            {showCreate && (
              <li
                onMouseDown={(e) => { e.preventDefault(); handleCreate(); }}
                className="px-2.5 py-1.5 text-[13px] cursor-pointer select-none text-muted-foreground hover:bg-secondary/60 transition-colors border-t border-border mt-0.5 pt-1.5"
              >
                {createGroup.isPending ? "Creating…" : `Create "${inputValue.trim()}"`}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
