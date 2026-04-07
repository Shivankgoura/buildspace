import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { OpportunityFilters } from "./opportunity-filters";

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("opportunities")
    .select("*, author:profiles!opportunities_author_id_fkey(*)")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (params.type && params.type !== "all") {
    query = query.eq("type", params.type);
  }

  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`);
  }

  const { data: opportunities } = await query;

  // Get interest counts
  const opportunitiesWithCounts = await Promise.all(
    (opportunities || []).map(async (opp) => {
      const { count } = await supabase
        .from("opportunity_interests")
        .select("*", { count: "exact", head: true })
        .eq("opportunity_id", opp.id);
      return { ...opp, interest_count: count || 0 };
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Opportunities</h1>
          <p className="text-muted-foreground mt-1">
            Find teammates, project roles, and hackathon teams
          </p>
        </div>
        <Link href="/opportunities/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Post Opportunity
          </Button>
        </Link>
      </div>

      <OpportunityFilters />

      {opportunitiesWithCounts.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {opportunitiesWithCounts.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Megaphone}
          title="No opportunities found"
          description="Post an opportunity to find teammates or discover new projects!"
          actionLabel="Post Opportunity"
          actionHref="/opportunities/new"
        />
      )}
    </div>
  );
}
