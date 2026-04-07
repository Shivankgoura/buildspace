"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";

interface JoinProjectButtonProps {
  projectId: string;
  projectTitle: string;
}

export function JoinProjectButton({ projectId, projectTitle }: JoinProjectButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("project_members").insert({
      project_id: projectId,
      user_id: user.id,
      role: "member",
    });

    if (error) {
      toast(error.message.includes("duplicate") ? "You already joined this project" : "Failed to join project", "error");
    } else {
      // Create feed event
      await supabase.from("feed_events").insert({
        user_id: user.id,
        event_type: "project_joined",
        reference_id: projectId,
        reference_type: "project",
        metadata: { title: projectTitle },
      });

      // Notify project owner
      const { data: project } = await supabase
        .from("projects")
        .select("owner_id")
        .eq("id", projectId)
        .single();

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .single();

      if (project && project.owner_id !== user.id) {
        await supabase.from("notifications").insert({
          user_id: project.owner_id,
          message: `${profile?.full_name || "Someone"} joined your project "${projectTitle}"`,
          type: "project_joined",
          reference_id: projectId,
          reference_type: "project",
        });
      }

      toast("Successfully joined the project!");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <Button onClick={handleJoin} disabled={loading} className="gap-2">
      <UserPlus className="h-4 w-4" />
      {loading ? "Joining..." : "Join Project"}
    </Button>
  );
}
