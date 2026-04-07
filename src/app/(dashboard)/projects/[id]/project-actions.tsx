"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types";

interface ProjectActionsProps {
  project: Project;
}

export function ProjectActions({ project }: ProjectActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const updateStatus = async (status: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", project.id);

    if (error) {
      toast("Failed to update status", "error");
    } else {
      toast(`Project marked as ${status}`);
      router.refresh();
    }
    setMenuOpen(false);
  };

  const deleteProject = async () => {
    if (!confirm("Are you sure you want to delete this project? This cannot be undone.")) return;

    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", project.id);

    if (error) {
      toast("Failed to delete project", "error");
    } else {
      toast("Project deleted");
      router.push("/projects");
      router.refresh();
    }
  };

  return (
    <div className="relative">
      <Button variant="outline" size="sm" className="gap-2" onClick={() => setMenuOpen(!menuOpen)}>
        <Settings className="h-4 w-4" />
        Manage
      </Button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-lg border border-border bg-card shadow-lg py-1">
            <p className="px-3 py-1.5 text-xs text-muted-foreground font-medium">Change Status</p>
            {["open", "in-progress", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => updateStatus(status)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors capitalize cursor-pointer ${
                  project.status === status ? "text-primary font-medium" : ""
                }`}
              >
                {status.replace("-", " ")}
              </button>
            ))}
            <div className="border-t border-border my-1" />
            <button
              onClick={deleteProject}
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors text-red-600 flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Project
            </button>
          </div>
        </>
      )}
    </div>
  );
}
