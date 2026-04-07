import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Github, Linkedin, Globe, Calendar } from "lucide-react";
import { LogoBrand } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ProfileShareButton } from "./share-button";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bio")
    .eq("username", username)
    .single();

  if (!profile) return { title: "Profile Not Found" };

  return {
    title: `${profile.full_name} - BuildSpace`,
    description: profile.bio || `${profile.full_name}'s developer profile on BuildSpace`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  // Get projects the user is part of
  const { data: memberEntries } = await supabase
    .from("project_members")
    .select("project_id, role, projects(id, title, status, tech_stack)")
    .eq("user_id", profile.user_id);

  const projects = memberEntries?.map((m) => {
    const p = m.projects as unknown as { id: string; title: string; status: string; tech_stack: string[] };
    return { ...p, role: m.role };
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav bar for profile page */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <LogoBrand size="sm" />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button size="sm" variant="outline">Open App</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 py-12">
        <Card>
          <CardContent className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar src={profile.avatar_url} name={profile.full_name} size="xl" />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                  <ProfileShareButton username={profile.username} name={profile.full_name} />
                </div>
                <p className="text-muted-foreground">@{profile.username}</p>
                {profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}

                {/* Links */}
                <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                  {profile.github_url && (
                    <a
                      href={profile.github_url.startsWith("http") ? profile.github_url : `https://${profile.github_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="h-4 w-4" /> GitHub
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url.startsWith("http") ? profile.linkedin_url : `https://${profile.linkedin_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </a>
                  )}
                  {profile.portfolio_url && (
                    <a
                      href={profile.portfolio_url.startsWith("http") ? profile.portfolio_url : `https://${profile.portfolio_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Globe className="h-4 w-4" /> Portfolio
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground justify-center sm:justify-start">
                  <Calendar className="h-3 w-3" />
                  Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </div>
              </div>
            </div>

            {/* Skills */}
            {profile.skills?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {profile.interests?.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest: string) => (
                    <Badge key={interest} variant="outline">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Projects</h2>
                <div className="space-y-2">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">{project.title}</p>
                        <div className="flex gap-1 mt-1">
                          {project.tech_stack?.slice(0, 3).map((tech: string) => (
                            <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">{project.role}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
