"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";
import type { Notification } from "@/types";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    // Set up realtime subscription
    const supabase = createClient();
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        () => loadNotifications()
      )
      .subscribe();

    // Poll every 30s as backup
    const interval = setInterval(loadNotifications, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [loadNotifications]);

  const markAllRead = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markOneRead = async (id: string) => {
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const getLink = (n: Notification) => {
    if (n.reference_type === "project") return `/projects/${n.reference_id}`;
    if (n.reference_type === "opportunity") return `/opportunities/${n.reference_id}`;
    return "/dashboard";
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 relative"
        onClick={() => {
          setOpen(!open);
          if (!open) loadNotifications();
        }}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-80 max-h-96 overflow-auto rounded-lg border border-border bg-card shadow-[0_4px_24px_rgba(0,28,100,0.08)]">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-[#0070e0] dark:text-[#449afb] hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length > 0 ? (
              <div className="divide-y divide-border">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={getLink(n)}
                    onClick={() => {
                      if (!n.read) markOneRead(n.id);
                      setOpen(false);
                    }}
                    className={`flex items-start gap-3 p-3 hover:bg-accent transition-colors ${
                      !n.read ? "bg-[#0070e0]/5 dark:bg-[#449afb]/5" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.read ? "font-medium" : ""}`}>
                        {n.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                    {!n.read && (
                      <div className="h-2 w-2 rounded-full bg-[#0070e0] dark:bg-[#449afb] shrink-0 mt-1.5" />
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No notifications yet
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
