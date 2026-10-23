"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  BookOpen,
  Target,
  Wrench,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

const SRI_LANKAN_UNIVERSITIES = [
  "Sri Lanka Institute of Information Technology (SLIIT)",
  "University of Colombo - School of Computing (UCSC)",
  "University of Moratuwa",
  "Informatics Institute of Technology (IIT)",
  "National School of Business Management (NSBM)",
  "University of Kelaniya",
  "University of Peradeniya",
  "Other Institution",
];

const DEGREE_PROGRAMS = [
  "B.Sc. (Hons) in Software Engineering",
  "B.Sc. in Computer Science",
  "B.Sc. in Information Technology",
  "B.Sc. in Data Science / AI",
  "B.Sc. in Computer Systems & Networking",
  "B.Sc. in Information Systems",
  "Other Degree",
];

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
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "SQL",
  "MongoDB",
  "Java",
  "C++",
  "Docker",
  "Git",
  "Linux",
  "Tailwind CSS",
  "AWS",
  "Figma",
  "Data Structures & Algorithms",
  "Machine Learning",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState(SRI_LANKAN_UNIVERSITIES[0]);
  const [customInstitution, setCustomInstitution] = useState("");
  const [degree, setDegree] = useState(DEGREE_PROGRAMS[0]);
  const [customDegree, setCustomDegree] = useState("");
  const [academicYear, setAcademicYear] = useState(2);
  const [targetCareer, setTargetCareer] = useState("full-stack-developer");
  const [weeklyHours, setWeeklyHours] = useState(15);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Python",
    "JavaScript",
    "React",
    "Git",
  ]);

  useEffect(() => {
    if (user?.full_name) {
      setFullName(user.full_name);
    }
  }, [user]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const finalInstitution =
    institution === "Other Institution" ? customInstitution.trim() || "University" : institution;

  const finalDegree =
    degree === "Other Degree" ? customDegree.trim() || "B.Sc. in Computing" : degree;

  const handleFinish = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.auth.onboarding({
        full_name: fullName.trim() || user?.full_name || "Student",
        institution: finalInstitution,
        degree: finalDegree,
        academic_year: academicYear,
        target_career_slug: targetCareer,
        weekly_study_hours: weeklyHours,
        existing_skills: selectedSkills,
      });

      await refreshUser();
      showToast("Workspace and personalized roadmap generated!", "success");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to complete onboarding.");
      showToast("Failed to save profile.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm mb-3">
          <Compass className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-navy tracking-tight">Configure Your Student Profile</h2>
        <p className="mt-1 text-xs text-muted">
          Step {step} of 3:{" "}
          {step === 1
            ? "Academic Background & Identity"
            : step === 2
            ? "Career Target & Study Schedule"
            : "Baseline Skills & Experience"}
        </p>

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
                <label className="block text-xs font-semibold text-navy mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ayeshika Sandamali"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">
                  Educational Institution
                </label>
                <select
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  {SRI_LANKAN_UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>
                {institution === "Other Institution" && (
                  <input
                    type="text"
                    value={customInstitution}
                    onChange={(e) => setCustomInstitution(e.target.value)}
                    placeholder="Enter your institution / university name"
                    className="w-full mt-2 px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">
                  Degree / Field of Study
                </label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  {DEGREE_PROGRAMS.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
                {degree === "Other Degree" && (
                  <input
                    type="text"
                    value={customDegree}
                    onChange={(e) => setCustomDegree(e.target.value)}
                    placeholder="Enter your degree name"
                    className="w-full mt-2 px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">
                  Current Academic Year
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value={1}>1st Year (Freshman)</option>
                  <option value={2}>2nd Year (Sophomore)</option>
                  <option value={3}>3rd Year (Junior / Placement Year)</option>
                  <option value={4}>4th Year (Senior / Finalist)</option>
                  <option value={5}>Postgraduate / Masters</option>
                </select>
              </div>

              <Button
                onClick={() => {
                  if (!fullName.trim()) {
                    setError("Please enter your full name.");
                    return;
                  }
                  setError(null);
                  setStep(2);
                }}
                className="w-full mt-4"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Next: Select Target Career Goal
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">
                  Target Career Role
                </label>
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
                <p className="text-[11px] text-muted mt-1">
                  Your Career Readiness Score, Digital Twin, and Roadmaps will calibrate to this goal.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-navy">
                    Weekly Study Hours Dedicated to Skill Upskilling
                  </label>
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
                  <span>15 hrs (Recommended)</span>
                  <span>40 hrs (Intensive)</span>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Next: Select Baseline Skills
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">
                  Select Technologies You Have Experience With
                </label>
                <p className="text-[11px] text-muted mb-3">
                  These will be immediately added as verified baseline evidence to your Digital Twin and calculate your initial readiness score.
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
                <Button
                  onClick={handleFinish}
                  isLoading={isLoading}
                  className="flex-1"
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  Create My Workspace & Dashboard
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
