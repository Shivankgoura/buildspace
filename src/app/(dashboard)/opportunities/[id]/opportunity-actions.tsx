"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Trash2, XCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import type { Opportunity } from "@/types";

interface OpportunityActionsProps {
  opportunity: Opportunity;
}

export function OpportunityActions({ opportunity }: OpportunityActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleStatus = async () => {
    const newStatus = opportunity.status === "open" ? "closed" : "open";
    const supabase = createClient();
    const { error } = await supabase
      .from("opportunities")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", opportunity.id);

    if (error) {
      toast("Failed to update", "error");
    } else {
      toast(`Opportunity ${newStatus === "open" ? "reopened" : "closed"}`);
      router.refresh();
    }
    setMenuOpen(false);
  };

  const deleteOpportunity = async () => {
    if (!confirm("Delete this opportunity? This cannot be undone.")) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("opportunities")
      .delete()
      .eq("id", opportunity.id);

    if (error) {
      toast("Failed to delete", "error");
    } else {
      toast("Opportunity deleted");
      router.push("/opportunities");
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
          <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-lg border border-border bg-card shadow-lg py-1">
            <button
              onClick={toggleStatus}
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2 cursor-pointer"
            >
              {opportunity.status === "open" ? (
                <>
                  <XCircle className="h-3.5 w-3.5" /> Close Opportunity
                </>
              ) : (
                <>
                  <CheckCircle className="h-3.5 w-3.5" /> Reopen Opportunity
                </>
              )}
            </button>
            <div className="border-t border-border my-1" />
            <button
              onClick={deleteOpportunity}
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors text-red-600 flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Opportunity
            </button>
          </div>
        </>
      )}
    </div>
  );
}
