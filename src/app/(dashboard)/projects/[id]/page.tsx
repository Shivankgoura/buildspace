import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Users } from "lucide-react";
import { PROJECT_STATUS } from "@/lib/constants";
import { ProfileCard } from "@/components/profile/profile-card";
import { JoinProjectButton } from "./join-button";
import { ProjectActions } from "./project-actions";
import Link from "next/link";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, owner:profiles!projects_owner_id_fkey(*)")
    .eq("id", id)
    .single();

  if (!project) notFound();

  // Get members
  const { data: members } = await supabase
    .from("project_members")
    .select("*, profile:profiles!project_members_user_id_fkey(*)")
    .eq("project_id", id);

  // Check if current user is a member
  const { data: { user } } = await supabase.auth.getUser();
  const isMember = members?.some((m) => m.user_id === user?.id);
  const isOwner = project.owner_id === user?.id;
  const canJoin =
    !isMember &&
    project.status === "open" &&
    (members?.length || 0) < project.max_members;

  const statusInfo = PROJECT_STATUS[project.status as keyof typeof PROJECT_STATUS];

  return (
    <div className="space-y-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      {/* Project Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <Badge className={statusInfo?.color}>{statusInfo?.label}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {members?.length || 0}/{project.max_members} members
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Created {new Date(project.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {canJoin && <JoinProjectButton projectId={project.id} projectTitle={project.title} />}
          {isOwner && <ProjectActions project={project} />}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About this project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{project.description}</p>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          {project.tech_stack?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech: string) => (
                    <Badge key={tech} variant="secondary" className="text-sm px-3 py-1">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Owner</CardTitle>
            </CardHeader>
            <CardContent>
              {project.owner && <ProfileCard profile={project.owner} compact />}
            </CardContent>
          </Card>

          {/* Members */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Team Members ({members?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {members?.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    {member.profile && (
                      <ProfileCard profile={member.profile} compact />
                    )}
                    <Badge variant="outline" className="text-xs capitalize shrink-0">
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
