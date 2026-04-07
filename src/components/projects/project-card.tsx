import Link from "next/link";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { PROJECT_STATUS } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusInfo = PROJECT_STATUS[project.status as keyof typeof PROJECT_STATUS];

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full hover:shadow-[0_4px_16px_rgba(0,28,100,0.1)] hover:border-[#0070e0]/30 hover:-translate-y-[2px] transition-all duration-200">
        <CardContent className="p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-semibold text-base line-clamp-1">{project.title}</h3>
            <Badge className={`shrink-0 text-xs ${statusInfo?.color || ""}`}>
              {statusInfo?.label || project.status}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {project.description}
          </p>

          {/* Tech Stack */}
          {project.tech_stack?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {project.tech_stack.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.tech_stack.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{project.tech_stack.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              {project.owner && (
                <div className="flex items-center gap-1.5">
                  <Avatar
                    src={project.owner.avatar_url}
                    name={project.owner.full_name}
                    size="sm"
                  />
                  <span className="text-xs text-muted-foreground">
                    {project.owner.full_name}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {project.member_count || 0}/{project.max_members}
              </span>
              <span>{timeAgo(project.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
