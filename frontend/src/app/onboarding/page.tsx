"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const CAREER_OPTIONS = [
  { slug: "full-stack-developer", title: "Full-Stack Developer" },
  { slug: "frontend-developer", title: "Frontend Developer" },
  { slug: "backend-developer", title: "Backend Developer" },
  { slug: "ai-ml-engineer", title: "AI/ML Engineer" },
  { slug: "data-scientist", title: "Data Scientist" },
  { slug: "data-analyst", title: "Data Analyst" },
  { slug: "devops-engineer", title: "DevOps Engineer" },
  { slug: "cloud-engineer", title: "Cloud Engineer" },
  { slug: "cybersecurity-analyst", title: "Cybersecurity Analyst" },
  { slug: "software-engineer", title: "Software Engineer" },
  { slug: "qa-engineer", title: "QA Automation Engineer" },
  { slug: "ui-ux-designer", title: "UI/UX Designer" },
];

const COMMON_SKILLS = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL",
  "HTML5", "CSS3", "Git", "Docker", "Linux", "Data Structures & Algorithms"
];

export default function OnboardingPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [institution, setInstitution] = useState("University of Colombo");
  const [degree, setDegree] = useState("B.Sc. in Computer Science");
  const [academicYear, setAcademicYear] = useState(2);
  const [targetCareer, setTargetCareer] = useState("full-stack-developer");
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Python", "Git"]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleFinish = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.auth.onboarding({
        institution,
        degree,
        academic_year: academicYear,
        target_career_slug: targetCareer,
        weekly_study_hours: weeklyHours,
        existing_skills: selectedSkills,
      });
      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to complete onboarding.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm mb-3">
          <Compass className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-navy tracking-tight">Student Academic Onboarding</h2>
        <p className="mt-1 text-xs text-muted">Step {step} of 3: {step === 1 ? "Academic Background" : step === 2 ? "Career Target & Study Time" : "Baseline Skills"}</p>

        {/* Step Indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 max-w-xs mx-auto">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <Card className="p-8 shadow-card">
          {error && (
            <div className="mb-5 flex items-center gap-2 p-3 rounded-lg bg-error-light border border-[#FAD3D3] text-xs text-error">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">Educational Institution</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. University of Moratuwa / UCSC"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">Degree / Study Program</label>
                <input
                  type="text"
                  required
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.Sc. (Hons) in Software Engineering"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">Current Academic Year</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value={1}>1st Year (Undergraduate)</option>
                  <option value={2}>2nd Year (Undergraduate)</option>
                  <option value={3}>3rd Year (Pre-Final)</option>
                  <option value={4}>4th Year (Graduating Finalist)</option>
                  <option value={5}>Postgraduate / Masters</option>
                </select>
              </div>

              <Button onClick={() => setStep(2)} className="w-full mt-4" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                Next: Select Target Career
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">Target Career Goal</label>
                <select
                  value={targetCareer}
                  onChange={(e) => setTargetCareer(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  {CAREER_OPTIONS.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-muted mt-1">You can change or benchmark other careers anytime from the Advisor.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-navy">Weekly Study Hours Available</label>
                  <span className="text-xs font-bold text-primary">{weeklyHours} hrs / week</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={40}
                  step={2}
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted mt-1">
                  <span>4 hrs (Light)</span>
                  <span>10-15 hrs (Recommended)</span>
                  <span>40 hrs (Full-time)</span>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1" icon={<ArrowRight className="w-4 h-4" />}>
                  Next: Select Skills
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Select Technologies You Have Used</label>
                <p className="text-[11px] text-muted mb-3">
                  These will be logged as baseline self-reported skills in your Digital Twin. You can verify them with CV
                  uploads or projects later.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_SKILLS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary-light text-primary font-semibold"
                            : "border-border bg-white text-navy hover:bg-[#F8FAFC]"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                            isSelected ? "border-primary bg-primary text-white" : "border-border"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className="truncate">{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleFinish} isLoading={isLoading} className="flex-1" icon={<CheckCircle2 className="w-4 h-4" />}>
                  Complete Onboarding
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
