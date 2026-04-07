"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";

const typeTabs = [
  { value: "all", label: "All" },
  { value: "teammate", label: "Teammates" },
  { value: "hiring", label: "Hiring" },
  { value: "hackathon", label: "Hackathon" },
];

export function OpportunityFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const activeType = searchParams.get("type") || "all";

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/opportunities?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams("q", search);
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search opportunities..."
          className="pl-10"
        />
      </form>

      <Tabs
        tabs={typeTabs}
        value={activeType}
        onChange={(v) => updateParams("type", v)}
      />
    </div>
  );
}
