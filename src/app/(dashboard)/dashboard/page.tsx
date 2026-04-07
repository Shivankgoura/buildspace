import { createClient } from "@/lib/supabase/server";
import { FolderKanban, Megaphone, Code2, CheckCircle, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeedItem } from "@/components/feed/feed-item";
import { ProjectCard } from "@/components/projects/project-card";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  // Stats
  const { count: projectCount } = await supabase
    .from("project_members")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { count: opportunityCount } = await supabase
    .from("opportunities")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user!.id);

  const skillCount = profile?.skills?.length || 0;
  const profileFields = [profile?.full_name, profile?.bio, profile?.skills?.length > 0, profile?.github_url, profile?.avatar_url];
  const profileCompletion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  const stats = [
    { label: "Projects Joined", value: projectCount || 0, icon: FolderKanban, color: "text-[#0070e0]", bg: "bg-[#0070e0]/10 dark:bg-[#0070e0]/15" },
    { label: "Opportunities", value: opportunityCount || 0, icon: Megaphone, color: "text-[#34d399]", bg: "bg-[#34d399]/10 dark:bg-[#34d399]/15" },
    { label: "Skills", value: skillCount, icon: Code2, color: "text-[#003087] dark:text-[#449afb]", bg: "bg-[#003087]/10 dark:bg-[#449afb]/15" },
    { label: "Profile", value: `${profileCompletion}%`, icon: CheckCircle, color: "text-[#fbbf24]", bg: "bg-[#fbbf24]/10 dark:bg-[#fbbf24]/15" },
  ];

  // Feed events
  const { data: feedEvents } = await supabase
    .from("feed_events")
    .select("*, profile:profiles!feed_events_user_id_fkey(*)")
    .order("created_at", { ascending: false })
    .limit(15);

  // Trending projects (most members recently)
  const { data: trendingProjects } = await supabase
    .from("projects")
    .select("*, owner:profiles!projects_owner_id_fkey(*)")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(3);

  const trendingWithCounts = await Promise.all(
    (trendingProjects || []).map(async (p) => {
      const { count } = await supabase
        .from("project_members")
        .select("*", { count: "exact", head: true })
        .eq("project_id", p.id);
      return { ...p, member_count: count || 0 };
    })
  );

  // Latest opportunities
  const { data: latestOpps } = await supabase
    .from("opportunities")
    .select("id, title, type, created_at")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Developer"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening in your BuildSpace community.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/projects/new">
            <Button className="gap-2" size="sm">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
          <Link href="/opportunities/new">
            <Button variant="outline" className="gap-2" size="sm">
              <Plus className="h-4 w-4" />
              Post Opportunity
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Feed - takes 2 cols */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              {feedEvents && feedEvents.length > 0 ? (
                <div className="space-y-1 divide-y divide-border">
                  {feedEvents.map((event) => (
                    <FeedItem key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">
                    No activity yet. Start by creating a project or posting an opportunity!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-6">
          {/* Trending Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Open Projects</CardTitle>
              <Link href="/projects">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingWithCounts.length > 0 ? (
                trendingWithCounts.map((project) => (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <div className="p-2 rounded-lg hover:bg-accent transition-colors">
                      <p className="font-medium text-sm truncate">{project.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {project.tech_stack?.slice(0, 2).map((tech: string) => (
                          <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                        ))}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {project.member_count}/{project.max_members}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No open projects yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Latest Opportunities */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Latest Opportunities</CardTitle>
              <Link href="/opportunities">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {latestOpps && latestOpps.length > 0 ? (
                latestOpps.map((opp) => (
                  <Link key={opp.id} href={`/opportunities/${opp.id}`}>
                    <div className="p-2 rounded-lg hover:bg-accent transition-colors">
                      <p className="font-medium text-sm truncate">{opp.title}</p>
                      <Badge variant="outline" className="text-xs mt-1 capitalize">{opp.type}</Badge>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No open opportunities yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
