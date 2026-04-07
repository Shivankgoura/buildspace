"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TagInput } from "@/components/ui/tag-input";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { SKILLS_OPTIONS } from "@/lib/constants";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [maxMembers, setMaxMembers] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast("Title and description are required", "error");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Create project
    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        owner_id: user.id,
        title: title.trim(),
        description: description.trim(),
        tech_stack: techStack,
        max_members: maxMembers,
      })
      .select()
      .single();

    if (error) {
      toast("Failed to create project", "error");
      setLoading(false);
      return;
    }

    // Add owner as member
    await supabase.from("project_members").insert({
      project_id: project.id,
      user_id: user.id,
      role: "owner",
    });

    // Create feed event
    await supabase.from("feed_events").insert({
      user_id: user.id,
      event_type: "project_created",
      reference_id: project.id,
      reference_type: "project",
      metadata: { title: project.title },
    });

    toast("Project created successfully!");
    router.push(`/projects/${project.id}`);
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>
            Set up your project and start finding collaborators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Project"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project, its goals, and what you're building..."
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tech Stack</label>
              <TagInput
                value={techStack}
                onChange={setTechStack}
                suggestions={[...SKILLS_OPTIONS]}
                placeholder="Add technologies..."
                maxTags={10}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Team Members</label>
              <Input
                type="number"
                min={1}
                max={20}
                value={maxMembers}
                onChange={(e) => setMaxMembers(parseInt(e.target.value) || 5)}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of team members (including you)
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Link href="/projects">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
