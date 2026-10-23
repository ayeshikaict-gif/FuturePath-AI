"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Cpu,
  Map,
  BookOpen,
  Briefcase,
  Sparkles,
  ChevronDown,
  Lock,
  Layers,
  GraduationCap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary-light selection:text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light border border-[#D5E4FF] text-xs font-semibold text-primary mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Career Intelligence for University Students</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Build Skills That Move Your Career Forward.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Eliminate guesswork from your university studies. Understand market expectations, benchmark your CV
            against verified industry career requirements, and follow personalized learning roadmaps backed by real
            evidence.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Explore Demo Account
              </Button>
            </Link>
          </div>

          {/* Genuine Realistic Product Dashboard Preview */}
          <div className="mt-14 max-w-5xl mx-auto rounded-xl border border-border shadow-dropdown bg-surface overflow-hidden text-left">
            {/* Window title bar */}
            <div className="bg-[#F8FAFC] border-b border-border px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#CBD5E1]" />
                <div className="w-3 h-3 rounded-full bg-[#CBD5E1]" />
                <div className="w-3 h-3 rounded-full bg-[#CBD5E1]" />
                <span className="text-xs text-muted font-mono ml-2">futurepath-dashboard.preview</span>
              </div>
              <Badge variant="primary">Target: Full-Stack Developer</Badge>
            </div>

            {/* Dashboard Mockup Grid */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#FAFAFC]">
              {/* Card 1: Readiness Score */}
              <div className="bg-white rounded-lg border border-border p-5 shadow-subtle">
                <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">Career Readiness</span>
                  <Badge variant="success">Moderate Fit</Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-navy">72%</span>
                  <span className="text-xs text-muted">coverage for Full-Stack</span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "72%" }} />
                </div>
                <p className="text-xs text-muted mt-3">
                  10 of 14 core requirements demonstrated with project or CV evidence.
                </p>
              </div>

              {/* Card 2: Skill Gaps */}
              <div className="bg-white rounded-lg border border-border p-5 shadow-subtle">
                <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">Identified Skill Gaps</span>
                  <Badge variant="warning">3 Gaps</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-navy">Docker & Containers</span>
                    <Badge variant="warning" size="sm">Required</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-navy">Next.js App Router</span>
                    <Badge variant="secondary" size="sm">Preferred</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-navy">CI/CD Automation</span>
                    <Badge variant="neutral" size="sm">Bonus</Badge>
                  </div>
                </div>
              </div>

              {/* Card 3: Next Action */}
              <div className="bg-white rounded-lg border border-border p-5 shadow-subtle">
                <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">Roadmap Progress</span>
                  <Badge variant="primary">Phase 2 Active</Badge>
                </div>
                <p className="text-xs font-medium text-navy">Develop REST APIs with Node.js & Express</p>
                <p className="text-[11px] text-muted mt-1">Estimated effort: 16 hours</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-success font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 1 Phase Completed
                  </span>
                  <span className="text-xs text-primary font-semibold">View Tasks &rarr;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="how-it-works" className="py-20 border-b border-border bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest">How It Works</h2>
            <p className="mt-2 text-3xl font-bold text-navy tracking-tight">
              A Structured, Transparent Path to Career Readiness
            </p>
            <p className="mt-4 text-sm text-muted">
              Move beyond generic advice with deterministic skill gap matching built for university students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-border p-6 shadow-subtle">
              <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary font-bold text-base mb-4">
                01
              </div>
              <h3 className="text-base font-semibold text-navy">Define Goals & Upload Academic CV</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Connect your degree, university background, and upload your CV (PDF or DOCX). Our parser identifies
                demonstrated technologies without manual entry.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-border p-6 shadow-subtle">
              <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary font-bold text-base mb-4">
                02
              </div>
              <h3 className="text-base font-semibold text-navy">Inspect Transparent Skill Gaps</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Benchmark your skills against 12 standardized technology roles (Full-Stack, AI/ML, Cloud, DevOps). See
                exactly which prerequisites are missing and why.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-border p-6 shadow-subtle">
              <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary font-bold text-base mb-4">
                03
              </div>
              <h3 className="text-base font-semibold text-navy">Execute Evidence-Backed Roadmaps</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Follow an algorithmic 3-phase study plan tailored to your weekly study hours. Complete milestone tasks
                and verify evidence through GitHub capstone projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Platform Capabilities</h2>
            <p className="mt-2 text-3xl font-bold text-navy tracking-tight">
              A Complete Intelligence Suite for Higher Education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card hover className="flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-navy">Student Digital Twin</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  A dynamic, multi-tier evidence profile tracking demonstrated competencies across languages,
                  frameworks, databases, and cloud engineering.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center gap-1.5 text-xs text-primary font-medium">
                <span>Multi-tier verification</span> &rarr;
              </div>
            </Card>

            <Card hover className="flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-navy">Smart CV Analyzer</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Extracts education, experience, and skills from PDF/DOCX files. Evaluates your bullet points for
                  quantifiable metrics and highlights missing keywords.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center gap-1.5 text-xs text-primary font-medium">
                <span>Role-specific feedback</span> &rarr;
              </div>
            </Card>

            <Card hover className="flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary mb-4">
                  <Map className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-navy">Personalized Roadmap</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Converts identified gap skills into a structured schedule with curated resources, estimated hours,
                  and milestone completion tracking.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center gap-1.5 text-xs text-primary font-medium">
                <span>Paced to your study hours</span> &rarr;
              </div>
            </Card>

            <Card hover className="flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-navy">Lecture Intelligence</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Transforms lecture transcripts and slides into structured takeaways, key concepts, action items, and
                  interactive recall quizzes and flashcards.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center gap-1.5 text-xs text-primary font-medium">
                <span>Active recall testing</span> &rarr;
              </div>
            </Card>

            <Card hover className="flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary mb-4">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-navy">Opportunity Intelligence</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Curated directory of student internships, hackathons, and scholarships with specific focus on Sri
                  Lanka tech companies and global remote programs.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center gap-1.5 text-xs text-primary font-medium">
                <span>Application tracking pipeline</span> &rarr;
              </div>
            </Card>

            <Card hover className="flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-navy">Career Future Simulator</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Simulate the exact score impact of learning new technologies before investing study time (e.g. "What
                  if I learn TypeScript, Docker, and AWS?").
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center gap-1.5 text-xs text-primary font-medium">
                <span>Predictive coverage deltas</span> &rarr;
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Evidence-Based Skill Hierarchy Section */}
      <section id="evidence" className="py-20 border-b border-border bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Verifiable Competency</h2>
            <p className="mt-2 text-3xl font-bold text-navy tracking-tight">
              Evidence-Based Skill Evaluation
            </p>
            <p className="mt-4 text-sm text-muted">
              We never treat a skill mentioned on a CV as proof of mastery. FuturePath AI distinguishes between claims
              and verified capability.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-border p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-success-light text-success flex items-center justify-center flex-shrink-0 font-bold text-xs">
                1.0
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-navy">Project & Assessment Evidence</h4>
                  <Badge variant="success">Highest Weight</Badge>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Demonstrated through open-source GitHub repositories, university lab submissions, or verified coding
                  assessments.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-border p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center flex-shrink-0 font-bold text-xs">
                0.75
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-navy">CV-Extracted Records</h4>
                  <Badge variant="primary">Documented</Badge>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Identified within formal work experience, internships, or academic degrees with contextual bullet
                  points.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-border p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#FEF7EA] text-warning flex items-center justify-center flex-shrink-0 font-bold text-xs">
                0.60
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-navy">Completed Coursework</h4>
                  <Badge variant="warning">Educational</Badge>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Verified university course modules or structured online curriculum completions.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-border p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#F1F5F9] text-muted flex items-center justify-center flex-shrink-0 font-bold text-xs">
                0.35
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-navy">Self-Reported Baseline</h4>
                  <Badge variant="neutral">Unverified Claim</Badge>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Initial student self-assessment logged during onboarding, earmarked for subsequent project
                  verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="py-16 border-b border-border bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-navy">Privacy and Data Protection First</h2>
          <p className="mt-3 text-sm text-muted max-w-xl mx-auto leading-relaxed">
            Your uploaded CVs, lecture notes, and academic records remain strictly private. Portfolios are private by
            default and shared only when you publish them. We do not sell or expose student data to third parties.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" /> OWASP Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" /> Private-by-Default
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" /> One-Click Data Deletion
            </span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 border-b border-border bg-[#F7F8FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Common Questions</h2>
            <p className="mt-2 text-3xl font-bold text-navy">Frequently Asked Questions</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-border p-5">
              <h4 className="text-sm font-semibold text-navy">How does FuturePath calculate career readiness scores?</h4>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Scores are calculated through a transparent, weighted formula matching your verified evidence against
                real industry requirements. Required skills carry greater weight than optional tools, and practical
                project evidence scores higher than self-reported claims.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-5">
              <h4 className="text-sm font-semibold text-navy">Does FuturePath guarantee job offers or interviews?</h4>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                No. We provide transparent skill gap intelligence and study roadmaps to help you build competitive,
                verifiable abilities. Hiring decisions depend on company evaluation, and we never make false employment
                guarantees.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-5">
              <h4 className="text-sm font-semibold text-navy">What opportunities are featured on the platform?</h4>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                We curate verified student internships, hackathons, and scholarships from established Sri Lankan
                employers (e.g., WSO2, IFS, Sysco LABS) alongside global student programs (such as Google Summer of
                Code and Commonwealth Scholarships).
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-5">
              <h4 className="text-sm font-semibold text-navy">Can I delete my uploaded CV and account at any time?</h4>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Yes. Under Account Settings, you can trigger a permanent cascading delete that purges all your uploaded
                documents, transcripts, roadmaps, and profile data from our database.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strong CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to Take Control of Your Career Path?
          </h2>
          <p className="mt-4 text-base text-primary-light max-w-xl mx-auto">
            Join thousands of university students building verified technical skills and discovering opportunities.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-[#F1F5F9] border-none shadow-md">
                Create Student Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 border border-white/20">
                Sign In With Demo Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-12 text-xs text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            <span className="font-bold text-navy text-sm">FuturePath AI</span>
            <span className="text-muted text-xs">&copy; 2026 FuturePath AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/#features" className="hover:text-navy transition-colors">Features</Link>
            <Link href="/#how-it-works" className="hover:text-navy transition-colors">How It Works</Link>
            <Link href="/#evidence" className="hover:text-navy transition-colors">Skill Hierarchy</Link>
            <Link href="/#faq" className="hover:text-navy transition-colors">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
