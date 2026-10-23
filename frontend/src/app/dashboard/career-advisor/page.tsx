"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  TrendingUp,
  Map,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function CareerAdvisorPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("full-stack-developer");
  const [matchData, setMatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [settingGoal, setSettingGoal] = useState(false);

  useEffect(() => {
    async function loadProfiles() {
      try {
        const list = await api.careerAdvisor.getProfiles();
        setProfiles(list);
        const initialSlug = user?.profile?.target_career_slug || "full-stack-developer";
        setSelectedSlug(initialSlug);
      } catch (err) {
        console.error("Failed to load career profiles", err);
      }
    }
    loadProfiles();
  }, [user]);

  useEffect(() => {
    async function loadMatch() {
      if (!selectedSlug) return;
      setLoading(true);
      try {
        const data = await api.careerAdvisor.match(selectedSlug);
        setMatchData(data);
      } catch (err) {
        console.error("Failed to calculate career match", err);
      } finally {
        setLoading(false);
      }
    }
    loadMatch();
  }, [selectedSlug]);

  const handleSetGoal = async () => {
    setSettingGoal(true);
    try {
      await api.careerAdvisor.setGoal(selectedSlug);
      await refreshUser();
      showToast(`Active career goal updated to ${matchData?.career_title || selectedSlug}!`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to set career goal", "error");
    } finally {
      setSettingGoal(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    setGenerating(true);
    try {
      await api.roadmap.generate(selectedSlug);
      showToast("Personalized roadmap generated! Redirecting...", "success");
      router.push("/dashboard/roadmap");
    } catch (err: any) {
      showToast(err.message || "Failed to generate roadmap", "error");
    } finally {
      setGenerating(false);
    }
  };

  const isCurrentActiveGoal = user?.profile?.target_career_slug === selectedSlug;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            <span>Career Advisor & Skill Gap Intelligence</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            Explainable matching of your demonstrated competencies against 12 industry career benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isCurrentActiveGoal && (
            <Button variant="outline" size="sm" onClick={handleSetGoal} isLoading={settingGoal}>
              Set as Active Goal
            </Button>
          )}
          <Button size="sm" onClick={handleGenerateRoadmap} isLoading={generating} icon={<Map className="w-3.5 h-3.5" />}>
            Generate Roadmap
          </Button>
        </div>
      </div>

      {/* Career Profile Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {profiles.map((p) => {
          const isSelected = p.slug === selectedSlug;
          return (
            <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? "bg-primary text-white shadow-sm font-semibold"
                  : "bg-white text-muted hover:text-navy border border-border"
              }`}
            >
              <span>{p.title}</span>
              {user?.profile?.target_career_slug === p.slug && (
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-primary"}`} />
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="h-64 bg-white rounded-xl border border-border animate-pulse" />
      ) : (
        <div className="space-y-6">
          {/* Top Career Overview & Transparent Match Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 cols: Career Details & Match */}
            <Card className="md:col-span-2 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-navy">{matchData?.career_title}</h2>
                    {isCurrentActiveGoal && <Badge variant="primary">Active Goal</Badge>}
                  </div>
                  <p className="text-xs text-muted mt-1">
                    Market Demand: <span className="font-semibold text-navy">{matchData?.market_demand || "High"}</span>
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-muted">Readiness Level</span>
                  <div className="mt-0.5">
                    <Badge variant={matchData?.match_score >= 70 ? "success" : matchData?.match_score >= 40 ? "warning" : "neutral"} size="md">
                      {matchData?.readiness_level}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Match Gauge */}
              <div className="mt-5">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs font-semibold text-muted">Verified Skill Coverage</span>
                  <span className="text-2xl font-bold text-navy">{matchData?.match_score}%</span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(matchData?.match_score || 0, 100)}%` }}
                  />
                </div>
              </div>

              {/* Rationale explanation */}
              <div className="mt-5 p-3.5 rounded-lg bg-[#F8FAFC] border border-border flex items-start gap-2.5 text-xs text-muted">
                <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">{matchData?.explanation}</p>
              </div>
            </Card>

            {/* Right col: Metric Breakdown */}
            <Card className="p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Requirement Summary</span>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">Total Role Requirements</span>
                    <span className="font-bold text-navy">{matchData?.total_required_skills}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-success font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Strong Evidence
                    </span>
                    <span className="font-bold text-navy">{matchData?.strong_evidence_skills.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-primary font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-primary" /> Partial Evidence
                    </span>
                    <span className="font-bold text-navy">{matchData?.partial_evidence_skills.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-error font-medium flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Missing Skills
                    </span>
                    <span className="font-bold text-navy">{matchData?.missing_skills.length}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <Button onClick={handleGenerateRoadmap} isLoading={generating} className="w-full" size="sm">
                  Build Targeted Roadmap &rarr;
                </Button>
              </div>
            </Card>
          </div>

          {/* Three Column Detailed Skill Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Strong Evidence */}
            <Card className="p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-xs font-bold text-navy uppercase tracking-wider">Strong Evidence</span>
                </div>
                <Badge variant="success">{matchData?.strong_evidence_skills.length}</Badge>
              </div>

              {matchData?.strong_evidence_skills.length === 0 ? (
                <p className="text-xs text-muted py-4 text-center">No skills currently verified at this tier.</p>
              ) : (
                <div className="space-y-2.5">
                  {matchData?.strong_evidence_skills.map((s: any) => (
                    <div key={s.skill_name} className="p-3 rounded-lg border border-border bg-[#F8FAFC]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-navy">{s.skill_name}</span>
                        <Badge variant="success" size="sm">Verified</Badge>
                      </div>
                      <p className="text-[11px] text-muted mt-1 truncate">Source: {s.source || "Documented"}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Column 2: Partial Evidence */}
            <Card className="p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="text-xs font-bold text-navy uppercase tracking-wider">Partial Evidence</span>
                </div>
                <Badge variant="warning">{matchData?.partial_evidence_skills.length}</Badge>
              </div>

              {matchData?.partial_evidence_skills.length === 0 ? (
                <p className="text-xs text-muted py-4 text-center">No partial skills recorded.</p>
              ) : (
                <div className="space-y-2.5">
                  {matchData?.partial_evidence_skills.map((s: any) => (
                    <div key={s.skill_name} className="p-3 rounded-lg border border-border bg-[#F8FAFC]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-navy">{s.skill_name}</span>
                        <Badge variant="warning" size="sm">Unverified</Badge>
                      </div>
                      <p className="text-[11px] text-muted mt-1">Self-reported claim. Add project to verify.</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Column 3: Missing Skills (Priority Gaps) */}
            <Card className="p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-error" />
                  <span className="text-xs font-bold text-navy uppercase tracking-wider">Priority Skill Gaps</span>
                </div>
                <Badge variant="error">{matchData?.missing_skills.length}</Badge>
              </div>

              {matchData?.missing_skills.length === 0 ? (
                <p className="text-xs text-muted py-4 text-center">All role prerequisites demonstrated!</p>
              ) : (
                <div className="space-y-2.5">
                  {matchData?.missing_skills.map((s: any) => (
                    <div key={s.skill_name} className="p-3 rounded-lg border border-border bg-[#F8FAFC]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-navy">{s.skill_name}</span>
                        <Badge variant={s.importance === "required" ? "error" : "neutral"} size="sm" className="capitalize">
                          {s.importance}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted mt-1 capitalize">Category: {s.category.replace("_", " ")}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
