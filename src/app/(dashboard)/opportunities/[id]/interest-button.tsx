"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";

interface InterestButtonProps {
  opportunityId: string;
  opportunityTitle: string;
  authorId: string;
  isInterested: boolean;
}

export function InterestButton({
  opportunityId,
  opportunityTitle,
  authorId,
  isInterested: initialInterested,
}: InterestButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isInterested, setIsInterested] = useState(initialInterested);

  const handleToggle = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (isInterested) {
      // Remove interest
      const { error } = await supabase
        .from("opportunity_interests")
        .delete()
        .eq("opportunity_id", opportunityId)
        .eq("user_id", user.id);

      if (error) {
        toast("Failed to update", "error");
      } else {
        setIsInterested(false);
        toast("Interest removed");
      }
    } else {
      // Add interest
      const { error } = await supabase
        .from("opportunity_interests")
        .insert({
          opportunity_id: opportunityId,
          user_id: user.id,
        });

      if (error) {
        toast("Failed to express interest", "error");
      } else {
        setIsInterested(true);
        toast("Interest expressed!");

        // Create feed event
        await supabase.from("feed_events").insert({
          user_id: user.id,
          event_type: "opportunity_interest",
          reference_id: opportunityId,
          reference_type: "opportunity",
          metadata: { title: opportunityTitle },
        });

        // Notify author
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", user.id)
          .single();

        if (authorId !== user.id) {
          await supabase.from("notifications").insert({
            user_id: authorId,
            message: `${profile?.full_name || "Someone"} is interested in "${opportunityTitle}"`,
            type: "opportunity_interest",
            reference_id: opportunityId,
            reference_type: "opportunity",
          });
        }
      }
    }

    setLoading(false);
    router.refresh();
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={loading}
      variant={isInterested ? "secondary" : "default"}
      className="gap-2"
    >
      <Heart className={`h-4 w-4 ${isInterested ? "fill-current text-red-500" : ""}`} />
      {loading ? "..." : isInterested ? "Interested" : "I'm Interested"}
    </Button>
  );
}
