"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Share2,
  ExternalLink,
  ShieldCheck,
  Globe,
  Lock,
  Github,
  Linkedin,
  CheckCircle2,
  Edit3,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function PortfolioBuilderPage() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [togglingPublish, setTogglingPublish] = useState(false);
  const [copied, setCopied] = useState(false);

  // Edit fields
  const [bio, setBio] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const loadPortfolio = async () => {
    try {
      const data = await api.portfolio.get();
      setPortfolio(data);
      setBio(data.bio || "");
      setGithubUrl(data.github_url || "");
      setLinkedinUrl(data.linkedin_url || "");
    } catch (err) {
      console.error("Failed to load portfolio", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const handleTogglePublish = async () => {
    setTogglingPublish(true);
    try {
      const res: any = await api.portfolio.togglePublish();
      showToast(res.message || "Portfolio status updated.", "success");
      await loadPortfolio();
      await refreshUser();
    } catch (err: any) {
      showToast(err.message || "Failed to toggle publish status", "error");
    } finally {
      setTogglingPublish(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.auth.updateProfile({
        bio,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
      });
      await loadPortfolio();
      await refreshUser();
      showToast("Portfolio profile information saved successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const publicUrl = typeof window !== "undefined" && user ? `${window.location.origin}/p/${user.id}` : "";

  const handleCopyLink = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      showToast("Public portfolio link copied to clipboard!", "info");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-white rounded-xl border border-border" />
        <div className="h-96 bg-white rounded-xl border border-border" />
      </div>
    );
  }

  const isPublished = portfolio?.is_published;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-navy flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              <span>Professional Portfolio Builder</span>
            </h1>
            <Badge variant={isPublished ? "success" : "neutral"} size="md">
              {isPublished ? (
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-success" /> Publicly Visible
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-muted" /> Private by Default
                </span>
              )}
            </Badge>
          </div>
          <p className="text-xs text-muted mt-1">
            Recruiter-ready showcase compiled from your verified competencies and capstone projects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isPublished && (
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              {copied ? "Link Copied!" : "Copy Share Link"}
            </Button>
          )}
          <Button
            size="sm"
            variant={isPublished ? "outline" : "primary"}
            onClick={handleTogglePublish}
            isLoading={togglingPublish}
          >
            {isPublished ? "Unpublish (Make Private)" : "Publish Portfolio"}
          </Button>
          {isPublished && user && (
            <Link href={`/p/${user.id}`} target="_blank">
              <Button size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                View Live Page
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings & Info Editor (1 col) */}
        <Card className="p-6">
          <CardHeader>
            <div>
              <CardTitle>Portfolio Profile Settings</CardTitle>
              <CardDescription>Customize your public introduction and professional profiles</CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-navy mb-1">Student Bio / Summary</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Passionate undergraduate software engineer focusing on backend architectures and cloud technologies..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-white text-navy focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-navy mb-1">GitHub Profile URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/your-username"
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-white text-navy focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-navy mb-1">LinkedIn Profile URL</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/your-username"
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-white text-navy focus:border-primary focus:outline-none"
              />
            </div>

            <Button type="submit" isLoading={savingProfile} className="w-full" size="sm">
              Save Profile Info
            </Button>
          </form>
        </Card>

        {/* Live Preview of Compiled Portfolio (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 border-2 border-border/80 shadow-card bg-surface">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-border gap-4">
              <div>
                <h2 className="text-2xl font-bold text-navy">{portfolio?.full_name}</h2>
                <p className="text-sm font-medium text-primary mt-0.5">
                  {portfolio?.degree} • {portfolio?.institution}
                </p>
                <p className="text-xs text-muted mt-1">Year {portfolio?.academic_year} Undergraduate</p>
                {portfolio?.bio && <p className="text-xs text-navy mt-3 leading-relaxed max-w-xl">{portfolio.bio}</p>}
              </div>

              {/* Social links */}
              <div className="flex items-center gap-2 self-start">
                {portfolio?.github_url && (
                  <a
                    href={portfolio.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg border border-border text-navy hover:bg-[#F8FAFC] transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {portfolio?.linkedin_url && (
                  <a
                    href={portfolio.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg border border-border text-navy hover:bg-[#F8FAFC] transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 text-[#0077B5]" />
                  </a>
                )}
              </div>
            </div>

            {/* Target Track & Readiness Badge */}
            <div className="py-5 border-b border-border flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Target Specialization</span>
                <p className="text-sm font-bold text-navy mt-0.5">{portfolio?.target_career_title}</p>
              </div>
              <Badge variant="primary" size="md">
                {Math.round(portfolio?.readiness_score || 0)}% Industrial Readiness Score
              </Badge>
            </div>

            {/* Verified Skills */}
            <div className="py-6 border-b border-border">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-3">
                Verified Skill Competencies ({portfolio?.verified_skills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {portfolio?.verified_skills?.map((skill: any, i: number) => (
                  <Badge key={i} variant="secondary" size="md" className="py-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-success" />
                    <span className="font-semibold text-navy">{skill.name}</span>
                    <span className="text-[10px] text-muted">({skill.proficiency})</span>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Practical Project Demonstrations */}
            <div className="pt-6">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-4">
                Practical Demonstrations & Project Evidence
              </h3>

              {portfolio?.projects?.length === 0 ? (
                <p className="text-xs text-muted">
                  No projects logged yet. Add projects via My Digital Twin to display verified evidence here.
                </p>
              ) : (
                <div className="space-y-3">
                  {portfolio?.projects?.map((proj: any, i: number) => (
                    <div key={i} className="p-4 rounded-lg border border-border bg-[#F8FAFC]">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-navy">{proj.title}</h4>
                        {proj.url && (
                          <a
                            href={proj.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                          >
                            <span>Repository</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <Badge variant="primary" size="sm" className="mt-1.5">
                        {proj.skill}
                      </Badge>
                      {proj.notes && <p className="text-xs text-muted mt-2 leading-relaxed">{proj.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
