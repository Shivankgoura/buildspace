"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Briefcase, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TagInput } from "@/components/ui/tag-input";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { SKILLS_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

const opportunityTypes = [
  {
    value: "teammate",
    label: "Looking for Teammates",
    description: "Find collaborators for your project",
    icon: Users,
    color: "border-green-500 bg-green-50 dark:bg-green-900/20",
  },
  {
    value: "hiring",
    label: "Hiring for Project",
    description: "Recruit members for specific roles",
    icon: Briefcase,
    color: "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
  },
  {
    value: "hackathon",
    label: "Hackathon Team",
    description: "Form a team for an upcoming hackathon",
    icon: Trophy,
    color: "border-purple-500 bg-purple-50 dark:bg-purple-900/20",
  },
];

export default function NewOpportunityPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [skillsNeeded, setSkillsNeeded] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !type) {
      toast("Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: opportunity, error } = await supabase
      .from("opportunities")
      .insert({
        author_id: user.id,
        title: title.trim(),
        description: description.trim(),
        type,
        skills_needed: skillsNeeded,
      })
      .select()
      .single();

    if (error) {
      toast("Failed to post opportunity", "error");
      setLoading(false);
      return;
    }

    // Create feed event
    await supabase.from("feed_events").insert({
      user_id: user.id,
      event_type: "opportunity_created",
      reference_id: opportunity.id,
      reference_type: "opportunity",
      metadata: { title: opportunity.title, type: opportunity.type },
    });

    toast("Opportunity posted successfully!");
    router.push(`/opportunities/${opportunity.id}`);
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/opportunities" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Opportunities
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Post an Opportunity</CardTitle>
          <CardDescription>
            Find teammates, recruit for projects, or form hackathon teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Opportunity Type *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {opportunityTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all cursor-pointer hover:shadow-sm",
                      type === t.value ? t.color : "border-border hover:border-muted-foreground/30"
                    )}
                  >
                    <t.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{t.label}</span>
                    <span className="text-xs text-muted-foreground">{t.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Looking for a React developer for our startup"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you're looking for, requirements, timeline..."
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Skills Needed</label>
              <TagInput
                value={skillsNeeded}
                onChange={setSkillsNeeded}
                suggestions={[...SKILLS_OPTIONS]}
                placeholder="Add required skills..."
                maxTags={10}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Link href="/opportunities">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Posting..." : "Post Opportunity"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
