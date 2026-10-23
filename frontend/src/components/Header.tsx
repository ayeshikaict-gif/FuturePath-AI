"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, ExternalLink, ShieldCheck, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Compute breadcrumb label
  const pageMap: Record<string, string> = {
    "/dashboard": "Overview",
    "/dashboard/digital-twin": "My Digital Twin",
    "/dashboard/career-advisor": "Career Advisor & Skill Gap",
    "/dashboard/roadmap": "Personalized Learning Roadmap",
    "/dashboard/cv-analyzer": "Smart CV Analyzer",
    "/dashboard/lectures": "Lecture Intelligence Workspace",
    "/dashboard/opportunities": "Opportunity Intelligence",
    "/dashboard/simulator": "Career Future Simulator",
    "/dashboard/portfolio": "Professional Portfolio Builder",
    "/dashboard/settings": "Account Settings",
  };

  const currentPage = pageMap[pathname] || "Dashboard";
  const targetCareerSlug = user?.profile?.target_career_slug || "full-stack-developer";
  const formattedCareer = targetCareerSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-white px-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-muted">
        <Link href="/dashboard" className="hover:text-navy transition-colors">
          FuturePath
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
        <span className="font-semibold text-navy">{currentPage}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Active Target Career Goal Pill */}
        <Link href="/dashboard/career-advisor" className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-muted">Target Career:</span>
          <Badge variant="primary" className="hover:bg-[#deebff] cursor-pointer transition-colors">
            <Compass className="w-3 h-3 text-primary" />
            <span>{formattedCareer}</span>
          </Badge>
        </Link>

        {/* Public Portfolio Link */}
        {user?.profile?.portfolio_published && (
          <Link
            href={`/p/${user.id}`}
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover px-2.5 py-1 rounded-md bg-primary-light transition-colors"
          >
            <span>Public Portfolio</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}

        {/* Verification Status */}
        <div className="hidden md:flex items-center gap-1 text-xs text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          <span>Evidence-Based</span>
        </div>
      </div>
    </header>
  );
}
