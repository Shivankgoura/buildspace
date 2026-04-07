import Link from "next/link";
import { FolderKanban, UserPlus, Megaphone, Heart } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { timeAgo } from "@/lib/utils";
import type { FeedEvent } from "@/types";

const eventConfig: Record<string, { icon: typeof FolderKanban; text: string; color: string; href: (e: FeedEvent) => string }> = {
  project_created: {
    icon: FolderKanban,
    text: "created a new project",
    color: "text-[#0070e0] bg-[#0070e0]/10 dark:bg-[#0070e0]/15",
    href: (e) => `/projects/${e.reference_id}`,
  },
  project_joined: {
    icon: UserPlus,
    text: "joined a project",
    color: "text-[#34d399] bg-[#34d399]/10 dark:bg-[#34d399]/15",
    href: (e) => `/projects/${e.reference_id}`,
  },
  opportunity_created: {
    icon: Megaphone,
    text: "posted an opportunity",
    color: "text-[#003087] bg-[#003087]/10 dark:bg-[#449afb]/15 dark:text-[#449afb]",
    href: (e) => `/opportunities/${e.reference_id}`,
  },
  opportunity_interest: {
    icon: Heart,
    text: "is interested in an opportunity",
    color: "text-[#c0392b] bg-[#c0392b]/10 dark:bg-[#c0392b]/15",
    href: (e) => `/opportunities/${e.reference_id}`,
  },
};

interface FeedItemProps {
  event: FeedEvent;
}

export function FeedItem({ event }: FeedItemProps) {
  const config = eventConfig[event.event_type];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Link href={config.href(event)}>
      <div className="flex items-start gap-3 rounded-lg p-3 hover:bg-[#449afb08] dark:hover:bg-[#449afb10] transition-colors">
        <div className={`shrink-0 p-2 rounded-full ${config.color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <span className="font-medium">{event.profile?.full_name || "Someone"}</span>
            {" "}{config.text}
            {event.metadata?.title && (
              <span className="font-medium"> &quot;{event.metadata.title}&quot;</span>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {timeAgo(event.created_at)}
          </p>
        </div>
        {event.profile && (
          <Avatar
            src={event.profile.avatar_url}
            name={event.profile.full_name}
            size="sm"
            className="shrink-0"
          />
        )}
      </div>
    </Link>
  );
}
