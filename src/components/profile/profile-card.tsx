import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/types";

interface ProfileCardProps {
  profile: Profile;
  compact?: boolean;
}

export function ProfileCard({ profile, compact = false }: ProfileCardProps) {
  if (compact) {
    return (
      <Link href={`/profile/${profile.username}`}>
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors">
          <Avatar
            src={profile.avatar_url}
            name={profile.full_name}
            size="sm"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{profile.full_name}</p>
            <p className="text-xs text-muted-foreground truncate">
              @{profile.username}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/profile/${profile.username}`}>
      <Card className="h-full hover:shadow-[0_4px_16px_rgba(0,28,100,0.1)] hover:border-[#0070e0]/30 hover:-translate-y-[2px] transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar
              src={profile.avatar_url}
              name={profile.full_name}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{profile.full_name}</p>
              <p className="text-sm text-muted-foreground truncate">
                @{profile.username}
              </p>
              {profile.bio && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {profile.bio}
                </p>
              )}
              {profile.skills && profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {profile.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {profile.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.skills.length - 4}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
