"use client";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import type { Profile } from "@/types";

interface DashboardShellProps {
  profile: Profile;
  children: React.ReactNode;
}

export function DashboardShell({ profile, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar profile={profile} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-background">
          <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
