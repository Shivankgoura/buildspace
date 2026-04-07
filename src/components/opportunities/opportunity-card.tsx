import Link from "next/link";
import { Users, Briefcase, Trophy, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { OPPORTUNITY_TYPES } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import type { Opportunity } from "@/types";

const typeIcons = { teammate: Users, hiring: Briefcase, hackathon: Trophy };

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const typeInfo = OPPORTUNITY_TYPES[opportunity.type as keyof typeof OPPORTUNITY_TYPES];
  const Icon = typeIcons[opportunity.type as keyof typeof typeIcons] || Users;

  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <Card className="h-full hover:shadow-[0_4px_16px_rgba(0,28,100,0.1)] hover:border-[#0070e0]/30 hover:-translate-y-[2px] transition-all duration-200">
        <CardContent className="p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md ${typeInfo?.color || "bg-muted"}`}>
                <Icon className="h-4 w-4" />
              </div>
              <Badge className={`text-xs ${typeInfo?.color || ""}`}>
                {typeInfo?.label || opportunity.type}
              </Badge>
            </div>
            {opportunity.status === "closed" && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Closed
              </Badge>
            )}
          </div>

          <h3 className="font-semibold text-base line-clamp-1 mb-2">{opportunity.title}</h3>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {opportunity.description}
          </p>

          {/* Skills needed */}
          {opportunity.skills_needed?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {opportunity.skills_needed.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {opportunity.skills_needed.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{opportunity.skills_needed.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            {opportunity.author && (
              <div className="flex items-center gap-1.5">
                <Avatar
                  src={opportunity.author.avatar_url}
                  name={opportunity.author.full_name}
                  size="sm"
                />
                <span className="text-xs text-muted-foreground">
                  {opportunity.author.full_name}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {opportunity.interest_count !== undefined && (
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  {opportunity.interest_count}
                </span>
              )}
              <span>{timeAgo(opportunity.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
