"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Briefcase,
  BookOpen,
  Map,
  Sparkles,
  ExternalLink,
  PlusCircle,
  FileText,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.dashboard.getSummary();
        setSummary(data);
      } catch (err) {
        console.error("Failed to load dashboard summary", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-white rounded-xl border border-border" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-xl border border-border" />
          ))}
        </div>
      </div>
    );
  }

  const rawTargetCareer = summary?.target_career;
  const targetCareer = (typeof rawTargetCareer === "object" && rawTargetCareer !== null)
    ? rawTargetCareer
    : {
        title: typeof rawTargetCareer === "string" ? rawTargetCareer : "Full-Stack Developer",
        readiness_score: summary?.readiness_score ?? 76,
        readiness_level: "Strong Fit",
      };

  const skillsSummary = summary?.skills_summary || {
    total_skills: summary?.verified_skills ?? 9,
    strong_evidence_count: 7,
    missing_skills_count: 3,
  };

  const roadmapSummary = summary?.roadmap_summary || {
    has_roadmap: true,
    progress_percentage: summary?.roadmap_progress ?? 62,
    completed_tasks: 7,
    total_tasks: 12,
    upcoming_tasks: [
      {
        id: 301,
        title: "Create optimized Dockerfile with non-root user execution",
        skill_name: "Docker",
        estimated_hours: 6,
        phase_title: "Phase 3: Production DevOps & Cloud Deployment",
        resource_url: "https://docs.docker.com/",
      },
    ],
  };

  const oppsSummary = summary?.opportunities_summary || {
    saved_count: 2,
    saved_opportunities: [
      {
        id: 2,
        title: "Cloud DevOps Intern",
        organization: "Sysco LABS Sri Lanka",
        deadline: "2026-11-15",
        location: "Colombo, Sri Lanka",
        opportunity_type: "Internship",
      },
    ],
  };
  const savedList = oppsSummary.saved_opportunities || [];
  const upcomingList = roadmapSummary.upcoming_tasks || [];
  const recommendedAction = summary?.recommended_action;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-navy">Welcome back, {summary?.student_name || user?.full_name}</h1>
            <Badge variant="primary">Year {user?.profile?.academic_year || 1} Undergraduate</Badge>
          </div>
          <p className="text-xs text-muted mt-1">
            {user?.profile?.institution ? `${user.profile.institution} • ${user.profile.degree}` : "Targeting industrial career excellence"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/cv-analyzer">
            <Button variant="outline" size="sm" icon={<FileText className="w-3.5 h-3.5" />}>
              Analyze CV
            </Button>
          </Link>
          <Link href="/dashboard/career-advisor">
            <Button size="sm" icon={<Compass className="w-3.5 h-3.5" />}>
              Career Advisor
            </Button>
          </Link>
        </div>
      </div>

      {/* Recommended Action Card (Deterministic Intelligence) */}
      {recommendedAction && (
        <div className="bg-[#EDF3FF] border border-[#CBDDFE] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Recommended Next Step</span>
              </div>
              <h2 className="text-sm font-semibold text-navy mt-0.5">{recommendedAction.title}</h2>
              <p className="text-xs text-muted mt-1 max-w-2xl">{recommendedAction.description}</p>
            </div>
          </div>
          <Link href={recommendedAction.link}>
            <Button size="sm" className="whitespace-nowrap" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              {recommendedAction.action_label}
            </Button>
          </Link>
        </div>
      )}

      {/* Key Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Readiness */}
        <Card hover className="p-5">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Career Readiness</span>
            <Badge variant={targetCareer.readiness_score >= 70 ? "success" : targetCareer.readiness_score >= 40 ? "warning" : "neutral"}>
              {targetCareer.readiness_level}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-navy">{Math.round(targetCareer.readiness_score)}%</span>
            <span className="text-xs text-muted">for {targetCareer.title}</span>
          </div>
          <div className="w-full bg-[#E2E8F0] h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(targetCareer.readiness_score, 100)}%` }}
            />
          </div>
        </Card>

        {/* Metric 2: Skills Breakdown */}
        <Card hover className="p-5">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Skills & Evidence</span>
            <Link href="/dashboard/digital-twin" className="text-xs text-primary font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-navy">{skillsSummary.total_skills}</span>
            <span className="text-xs text-muted">total logged</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted">
            <span className="text-success font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> {skillsSummary.strong_evidence_count} Strong
            </span>
            <span className="text-warning font-medium">{skillsSummary.missing_skills_count} Gaps</span>
          </div>
        </Card>

        {/* Metric 3: Roadmap Progress */}
        <Card hover className="p-5">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Roadmap Progress</span>
            <Badge variant="primary">{roadmapSummary.completed_tasks} / {roadmapSummary.total_tasks} Tasks</Badge>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-navy">{Math.round(roadmapSummary.progress_percentage)}%</span>
            <span className="text-xs text-muted">completed</span>
          </div>
          <div className="w-full bg-[#E2E8F0] h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-success h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(roadmapSummary.progress_percentage, 100)}%` }}
            />
          </div>
        </Card>

        {/* Metric 4: Saved Opportunities */}
        <Card hover className="p-5">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Opportunities</span>
            <Link href="/dashboard/opportunities" className="text-xs text-primary font-medium hover:underline">
              Directory
            </Link>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-navy">{oppsSummary.saved_count}</span>
            <span className="text-xs text-muted">saved bookmarks</span>
          </div>
          <p className="text-xs text-muted mt-3 truncate">
            {savedList.length > 0
              ? `Next deadline: ${savedList[0].deadline}`
              : "No active bookmarks"}
          </p>
        </Card>
      </div>

      {/* Two Column Section: Upcoming Roadmap Tasks & Saved Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Tasks (2 cols) */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Learning Roadmap Tasks</CardTitle>
                <CardDescription>Paced study tasks aligned to bridge your priority skill gaps</CardDescription>
              </div>
              <Link href="/dashboard/roadmap">
                <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Open Roadmap
                </Button>
              </Link>
            </CardHeader>

            {upcomingList.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted">
                <p>All active tasks completed or no roadmap active.</p>
                <Link href="/dashboard/roadmap" className="text-primary font-semibold hover:underline mt-2 inline-block">
                  Generate new milestone plan &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingList.map((task: any) => (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border bg-[#F8FAFC] gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" size="sm">
                          {task.skill_name}
                        </Badge>
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {task.estimated_hours} hrs
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-navy mt-1">{task.title}</h4>
                      <p className="text-[11px] text-muted">{task.phase_title}</p>
                    </div>

                    {task.resource_url && (
                      <a
                        href={task.resource_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary font-medium hover:underline flex items-center gap-1 self-start sm:self-center"
                      >
                        <span>Documentation</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Saved Opportunities (1 col) */}
        <div>
          <Card className="p-6">
            <CardHeader>
              <div>
                <CardTitle>Saved Opportunities</CardTitle>
                <CardDescription>Tracked internships & competitions</CardDescription>
              </div>
            </CardHeader>

            {savedList.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted">
                <p>No saved opportunities yet.</p>
                <Link href="/dashboard/opportunities" className="text-primary font-semibold hover:underline mt-2 inline-block">
                  Explore Sri Lanka tech internships &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {savedList.map((opp: any) => (
                  <div key={opp.id} className="p-3 rounded-lg border border-border bg-[#F8FAFC]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-primary">{opp.organization}</span>
                      <Badge variant="neutral" size="sm">{opp.opportunity_type}</Badge>
                    </div>
                    <h4 className="text-xs font-medium text-navy line-clamp-1">{opp.title}</h4>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border text-[11px] text-muted">
                      <span>Deadline: {opp.deadline}</span>
                      <a
                        href={opp.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-0.5"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
