"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error caught by boundary:", error);
  }, [error]);

  return (
    <div className="py-12 flex items-center justify-center">
      <Card className="max-w-lg w-full p-8 text-center shadow-card border border-border">
        <div className="w-12 h-12 rounded-full bg-error-light text-error flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-navy">Dashboard Workspace Notice</h2>
        <p className="text-xs text-muted mt-2 mb-4 leading-relaxed">
          {error?.message || "A data synchronization event completed. Click below to refresh your career metrics."}
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <Button onClick={() => reset()} size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Reload Workspace
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" icon={<LayoutDashboard className="w-3.5 h-3.5" />}>
              Dashboard Overview
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
