import { useState } from "react";
import { Link } from "react-router";
import { useContentSearch } from "../hooks/useContentSearch";
import { STATUS_BADGE, TYPE_BADGE } from "../documents.constants";
import type { DocStatus, DocType } from "../documents.types";
import Badge from "../../../components/ui/Badge";
import Spinner from "../../../components/ui/Spinner";

function Highlight({ text, query }: { text: string; query: string }) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;

  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-foreground font-medium not-italic rounded-[2px] px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

export default function ContentSearch() {
  const [query, setQuery] = useState("");
  const { data: results, isFetching, isError } = useContentSearch(query);

  const showResults = query.trim().length >= 2;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 h-8 rounded border border-border bg-background px-2.5 focus-within:ring-1 focus-within:ring-primary transition-colors">
        <svg className="h-3.5 w-3.5 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search inside documents…"
          className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
        />
        {isFetching && <Spinner size="sm" />}
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>

      {showResults && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {isError && (
            <p className="px-4 py-4 text-xs text-destructive">Search failed. Try again.</p>
          )}

          {!isError && !isFetching && results?.length === 0 && (
            <p className="px-4 py-4 text-xs text-muted-foreground">
              No documents contain <span className="text-foreground font-medium">"{query}"</span>.
            </p>
          )}

          {results && results.length > 0 && (
            <div className="divide-y divide-border">
              {results.map((doc) => {
                const status = STATUS_BADGE[doc.status as DocStatus];
                const type = TYPE_BADGE[doc.type as DocType];

                return (
                  <div key={doc.id} className="px-4 py-3 hover:bg-secondary/40 transition-colors group">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-[13px] font-medium text-foreground truncate">{doc.title}</p>
                        <div className="hidden sm:flex items-center gap-1 shrink-0">
                          <Badge variant={type.variant}>{type.label}</Badge>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                      </div>
                      <Link
                        to={`/documents/${doc.id}`}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                      >
                        Open →
                      </Link>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-1">{doc.client}</p>
                    {doc.snippet && (
                      <p className="text-xs text-muted-foreground italic leading-relaxed line-clamp-2">
                        <Highlight text={doc.snippet} query={query} />
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
