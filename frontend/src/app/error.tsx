"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global client-side exception caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full p-8 text-center shadow-card border border-border">
        <div className="w-12 h-12 rounded-full bg-error-light text-error flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-navy">Temporary Interface Refresh Required</h2>
        <p className="text-xs text-muted mt-2 mb-4 leading-relaxed">
          {error?.message || "A client-side state update was interrupted. Click retry to recover session state."}
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <Button onClick={() => reset()} size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry Now
          </Button>
          <Link href="/">
            <Button variant="outline" size="sm" icon={<Home className="w-3.5 h-3.5" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
