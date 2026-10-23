"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  ShieldCheck,
  ExternalLink,
  Github,
  Linkedin,
  Lock,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function PublicPortfolioPage() {
  const params = useParams();
  const userId = params?.userId ? Number(params.userId) : null;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPublic() {
      if (!userId) return;
      try {
        const res = await api.portfolio.getPublic(userId);
        setData(res);
      } catch (err: any) {
        setError(err.message || "This portfolio is private or does not exist.");
      } finally {
        setLoading(false);
      }
    }
    loadPublic();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-error-light text-error flex items-center justify-center mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-navy">Private Portfolio</h1>
        <p className="text-xs text-muted max-w-sm mt-1 mb-6">
          This student portfolio has not been published or has been set to private by its owner.
        </p>
        <Link href="/">
          <Button size="sm">Go to FuturePath AI Homepage</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
              <Compass className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-navy">FuturePath AI</span>
          </Link>
          <Badge variant="success" size="sm">
            <ShieldCheck className="w-3.5 h-3.5 text-success" /> Verified Student Profile
          </Badge>
        </div>

        {/* Profile Card */}
        <Card className="p-8 shadow-card bg-surface">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-border gap-4">
            <div>
              <h1 className="text-3xl font-bold text-navy">{data.full_name}</h1>
              <p className="text-sm font-medium text-primary mt-1">
                {data.degree} • {data.institution}
              </p>
              <p className="text-xs text-muted mt-0.5">Year {data.academic_year} Undergraduate</p>
              {data.bio && <p className="text-xs text-navy mt-4 leading-relaxed max-w-xl">{data.bio}</p>}
            </div>

            <div className="flex items-center gap-2 self-start">
              {data.github_url && (
                <a
                  href={data.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-lg border border-border text-navy hover:bg-[#F8FAFC] transition-colors"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {data.linkedin_url && (
                <a
                  href={data.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-lg border border-border text-navy hover:bg-[#F8FAFC] transition-colors"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4 text-[#0077B5]" />
                </a>
              )}
            </div>
          </div>

          {/* Specialization Target */}
          <div className="py-5 border-b border-border flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Target Specialization</span>
              <p className="text-sm font-bold text-navy mt-0.5">{data.target_career_title}</p>
            </div>
            <Badge variant="primary" size="md">
              {Math.round(data.readiness_score || 0)}% Industrial Readiness Rating
            </Badge>
          </div>

          {/* Verified Skills */}
          <div className="py-6 border-b border-border">
            <h2 className="text-xs font-bold text-navy uppercase tracking-wider mb-3">
              Verified Technical Skills ({data.skills?.length || 0})
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills?.map((s: any, i: number) => (
                <Badge key={i} variant="secondary" size="md" className="py-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  <span className="font-semibold text-navy">{s.name}</span>
                  <span className="text-[10px] text-muted">({s.proficiency})</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Practical Projects */}
          <div className="pt-6">
            <h2 className="text-xs font-bold text-navy uppercase tracking-wider mb-4">
              Demonstrated Projects & Repositories
            </h2>
            {data.projects?.length === 0 ? (
              <p className="text-xs text-muted">No projects publicly listed.</p>
            ) : (
              <div className="space-y-3">
                {data.projects?.map((proj: any, i: number) => (
                  <div key={i} className="p-4 rounded-lg border border-border bg-[#F8FAFC]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-navy">{proj.title}</h3>
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                        >
                          <span>View Code</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <Badge variant="primary" size="sm" className="mt-1">
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
  );
}
