"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, FolderKanban, Megaphone, User, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "profile" | "project" | "opportunity";
  href: string;
}

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const all: SearchResult[] = [];

    // Search profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, username, skills")
      .or(`full_name.ilike.%${q}%,username.ilike.%${q}%`)
      .limit(5);

    profiles?.forEach((p) =>
      all.push({
        id: p.user_id,
        title: p.full_name,
        subtitle: `@${p.username}`,
        type: "profile",
        href: `/profile/${p.username}`,
      })
    );

    // Search projects
    const { data: projects } = await supabase
      .from("projects")
      .select("id, title, status")
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      .limit(5);

    projects?.forEach((p) =>
      all.push({
        id: p.id,
        title: p.title,
        subtitle: `Project - ${p.status}`,
        type: "project",
        href: `/projects/${p.id}`,
      })
    );

    // Search opportunities
    const { data: opps } = await supabase
      .from("opportunities")
      .select("id, title, type")
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      .limit(5);

    opps?.forEach((o) =>
      all.push({
        id: o.id,
        title: o.title,
        subtitle: `Opportunity - ${o.type}`,
        type: "opportunity",
        href: `/opportunities/${o.id}`,
      })
    );

    setResults(all);
    setSelectedIndex(0);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => search(query), 300);
    return () => clearTimeout(timeout);
  }, [query, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      router.push(results[selectedIndex].href);
      setOpen(false);
    }
  };

  const typeIcons = {
    profile: User,
    project: FolderKanban,
    opportunity: Megaphone,
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:border-[#0070e0]/30 transition-all duration-200 cursor-pointer"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-4 rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)} />

      {/* Dialog */}
      <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 rounded-xl border border-border bg-card shadow-[0_4px_24px_rgba(0,28,100,0.12)]">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search profiles, projects, opportunities..."
            className="flex-1 py-3 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
          />
          <button onClick={() => setOpen(false)} className="cursor-pointer">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-2">
          {loading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for &quot;{query}&quot;
            </div>
          )}

          {!loading && !query && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Start typing to search...
            </div>
          )}

          {results.map((result, i) => {
            const Icon = typeIcons[result.type];
            return (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => {
                  router.push(result.href);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer",
                  i === selectedIndex ? "bg-[#0070e0]/8 dark:bg-[#449afb]/10" : "hover:bg-accent/50"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3f3f6] dark:bg-[#1a2035] shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{result.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
