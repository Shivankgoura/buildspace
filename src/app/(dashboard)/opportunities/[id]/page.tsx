import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Users, Briefcase, Trophy } from "lucide-react";
import { OPPORTUNITY_TYPES } from "@/lib/constants";
import { ProfileCard } from "@/components/profile/profile-card";
import { InterestButton } from "./interest-button";
import { OpportunityActions } from "./opportunity-actions";
import Link from "next/link";

const typeIcons = { teammate: Users, hiring: Briefcase, hackathon: Trophy };

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: opportunity } = await supabase
    .from("opportunities")
    .select("*, author:profiles!opportunities_author_id_fkey(*)")
    .eq("id", id)
    .single();

  if (!opportunity) notFound();

  // Get interested users
  const { data: interests } = await supabase
    .from("opportunity_interests")
    .select("*, profile:profiles!opportunity_interests_user_id_fkey(*)")
    .eq("opportunity_id", id);

  // Check current user
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthor = opportunity.author_id === user?.id;
  const isInterested = interests?.some((i) => i.user_id === user?.id);

  const typeInfo = OPPORTUNITY_TYPES[opportunity.type as keyof typeof OPPORTUNITY_TYPES];
  const Icon = typeIcons[opportunity.type as keyof typeof typeIcons] || Users;

  return (
    <div className="space-y-6">
      <Link
        href="/opportunities"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Opportunities
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${typeInfo?.color || "bg-muted"}`}>
              <Icon className="h-5 w-5" />
            </div>
            <Badge className={typeInfo?.color}>{typeInfo?.label}</Badge>
            {opportunity.status === "closed" && (
              <Badge variant="outline">Closed</Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold mt-3">{opportunity.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Posted {new Date(opportunity.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {!isAuthor && opportunity.status === "open" && (
            <InterestButton
              opportunityId={opportunity.id}
              opportunityTitle={opportunity.title}
              authorId={opportunity.author_id}
              isInterested={!!isInterested}
            />
          )}
          {isAuthor && <OpportunityActions opportunity={opportunity} />}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{opportunity.description}</p>
            </CardContent>
          </Card>

          {opportunity.skills_needed?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skills Needed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {opportunity.skills_needed.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Posted By</CardTitle>
            </CardHeader>
            <CardContent>
              {opportunity.author && <ProfileCard profile={opportunity.author} compact />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Interested ({interests?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {interests && interests.length > 0 ? (
                <div className="space-y-1">
                  {interests.map((interest) =>
                    interest.profile ? (
                      <ProfileCard key={interest.id} profile={interest.profile} compact />
                    ) : null
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No one yet. Be the first!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
