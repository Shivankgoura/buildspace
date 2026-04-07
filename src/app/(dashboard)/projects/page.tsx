import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFilters } from "./project-filters";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; tech?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select("*, owner:profiles!projects_owner_id_fkey(*)")
    .order("created_at", { ascending: false });

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`);
  }

  if (params.tech) {
    query = query.contains("tech_stack", [params.tech]);
  }

  const { data: projects } = await query;

  // Get member counts
  const projectsWithCounts = await Promise.all(
    (projects || []).map(async (project) => {
      const { count } = await supabase
        .from("project_members")
        .select("*", { count: "exact", head: true })
        .eq("project_id", project.id);
      return { ...project, member_count: count || 0 };
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Discover projects and find your next team
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <Suspense fallback={null}>
        <ProjectFilters />
      </Suspense>

      {projectsWithCounts.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {projectsWithCounts.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Be the first to create a project and start building with others!"
          actionLabel="Create Project"
          actionHref="/projects/new"
        />
      )}
    </div>
  );
}
