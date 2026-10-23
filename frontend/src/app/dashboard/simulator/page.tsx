"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Plus,
  Info,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const POPULAR_SIMULATION_SKILLS = [
  "Docker",
  "AWS",
  "TypeScript",
  "Next.js",
  "PostgreSQL",
  "FastAPI",
  "Kubernetes",
  "System Design",
  "Testing & QA",
  "CI/CD",
  "Machine Learning",
  "Redis",
];

export default function SimulatorPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Docker", "AWS"]);
  const [targetCareer, setTargetCareer] = useState<string>(
    user?.profile?.target_career_slug || "full-stack-developer"
  );
  const [simResult, setSimResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSimulate = async () => {
    if (selectedSkills.length === 0) return;
    setLoading(true);
    try {
      const res = await api.simulator.evaluate({
        target_career_slug: targetCareer,
        skills_to_add: selectedSkills,
      });
      setSimResult(res);
      showToast(`Simulation complete: +${res.score_delta}% score delta!`, "success");
    } catch (err: any) {
      showToast(err.message || "Simulation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-navy flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>Career Future Simulator</span>
        </h1>
        <p className="text-xs text-muted mt-1">
          Predictive scenario planning. Model the precise score impact of acquiring targeted skills before investing study hours.
        </p>
      </div>

      {/* Simulator Inputs & Configuration */}
      <Card className="p-6">
        <CardHeader>
          <div>
            <CardTitle>Configure Simulation Scenario</CardTitle>
            <CardDescription>Select a target career profile and prospective skills to learn</CardDescription>
          </div>
        </CardHeader>

        <div className="space-y-5">
          {/* Target Role Selector */}
          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">Target Career Track</label>
            <select
              value={targetCareer}
              onChange={(e) => setTargetCareer(e.target.value)}
              className="w-full sm:w-80 px-3 py-2 text-xs rounded-lg border border-border bg-white text-navy focus:border-primary focus:outline-none"
            >
              <option value="full-stack-developer">Full-Stack Developer</option>
              <option value="frontend-developer">Frontend Developer</option>
              <option value="backend-developer">Backend Developer</option>
              <option value="ai-ml-engineer">AI/ML Engineer</option>
              <option value="data-scientist">Data Scientist</option>
              <option value="data-analyst">Data Analyst</option>
              <option value="devops-engineer">DevOps Engineer</option>
              <option value="cloud-engineer">Cloud Engineer</option>
              <option value="cybersecurity-analyst">Cybersecurity Analyst</option>
              <option value="software-engineer">Software Engineer</option>
              <option value="qa-engineer">QA Automation Engineer</option>
              <option value="ui-ux-designer">UI/UX Designer</option>
            </select>
          </div>

          {/* Prospective Skills to Simulate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-navy">
                Select Prospective Technologies to Simulate ({selectedSkills.length} selected)
              </label>
              {selectedSkills.length > 0 && (
                <button
                  onClick={() => setSelectedSkills([])}
                  className="text-xs text-muted hover:text-navy hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {POPULAR_SIMULATION_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? "border-primary bg-primary-light text-primary font-semibold"
                        : "border-border bg-white text-navy hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <span>{skill}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-muted" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleSimulate}
              isLoading={loading}
              disabled={selectedSkills.length === 0}
              size="md"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Evaluate Career Impact
            </Button>
          </div>
        </div>
      </Card>

      {/* Simulation Result Presentation */}
      {simResult && (
        <div className="space-y-6 animate-in fade-in">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Baseline Score */}
            <Card className="p-6">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Current Baseline</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-navy">{Math.round(simResult.baseline_match_score)}%</span>
                <span className="text-xs text-muted">demonstrated fit</span>
              </div>
              <div className="w-full bg-[#E2E8F0] h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#94A3B8] h-full rounded-full" style={{ width: `${simResult.baseline_match_score}%` }} />
              </div>
              <p className="text-xs text-muted mt-3">Derived from current verified student profile records.</p>
            </Card>

            {/* Simulated Score */}
            <Card className="p-6 bg-gradient-to-br from-white to-primary-light/30 border-primary/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Projected Outcome</span>
                <Badge variant="success">+{simResult.score_delta}% Increase</Badge>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-primary">{Math.round(simResult.simulated_match_score)}%</span>
                <span className="text-xs text-muted">simulated fit</span>
              </div>
              <div className="w-full bg-[#E2E8F0] h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(simResult.simulated_match_score, 100)}%` }}
                />
              </div>
              <p className="text-xs text-navy font-medium mt-3">
                Projected if candidate completes projects in selected skills.
              </p>
            </Card>

            {/* Estimated Effort */}
            <Card className="p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Estimated Study Effort</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-navy">{simResult.estimated_study_hours}</span>
                  <span className="text-xs text-muted">total learning hours</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted mt-3">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>
                    Approx. {Math.ceil(simResult.estimated_study_hours / (user?.profile?.weekly_study_hours || 10))} weeks at current pace
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Newly Covered vs Remaining Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5">
              <div className="flex items-center gap-2 pb-3 border-b border-border mb-3">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
                  Newly Satisfied Prerequisites ({simResult.newly_covered_skills?.length || 0})
                </h3>
              </div>
              {simResult.newly_covered_skills?.length === 0 ? (
                <p className="text-xs text-muted py-2">
                  None of the simulated technologies were direct requirements for {simResult.career_title}.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {simResult.newly_covered_skills.map((skill: string) => (
                    <Badge key={skill} variant="success" size="md">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <span>{skill}</span>
                    </Badge>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 pb-3 border-b border-border mb-3">
                <AlertCircle className="w-4 h-4 text-warning" />
                <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
                  Remaining Gaps for Full Competency ({simResult.remaining_gaps?.length || 0})
                </h3>
              </div>
              {simResult.remaining_gaps?.length === 0 ? (
                <p className="text-xs text-success py-2">All role requirements satisfied under this scenario!</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {simResult.remaining_gaps.map((skill: string) => (
                    <Badge key={skill} variant="neutral" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Explanation Banner */}
          <div className="p-4 rounded-xl bg-white border border-border shadow-subtle flex items-start gap-3 text-xs text-muted">
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{simResult.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
