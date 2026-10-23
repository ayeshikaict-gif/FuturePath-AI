"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  Download,
  Calendar,
  Sparkles,
  Info,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function CVAnalyzerPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [cvHistory, setCvHistory] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetCareer, setTargetCareer] = useState("full-stack-developer");
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const handleUseSampleCV = () => {
    const sampleText = `KAVINDU PERERA
Colombo, Sri Lanka | student@futurepath.edu | github.com/kavindu-perera-demo

EDUCATION
University of Colombo School of Computing
B.Sc. (Hons) in Software Engineering, Expected Dec 2027
Relevant Coursework: Data Structures & Algorithms, Database Systems, Web Architecture

TECHNICAL SKILLS
Languages: Python, TypeScript, JavaScript, SQL, HTML5, CSS3
Frameworks & Libraries: React, Node.js, Next.js, FastAPI, Tailwind CSS
Databases & Cloud: PostgreSQL, MongoDB, Redis, Docker, Git, REST APIs, Linux

WORK & INTERNSHIP EXPERIENCE
Software Development Intern — Tech Ventures Lanka (June 2026 - Present)
- Developed and maintained responsive frontend components using React and TypeScript for client portal.
- Implemented backend REST endpoints in Python FastAPI connected to PostgreSQL database.
- Optimized database query indexes reducing response latency by 35% across 20+ endpoints.

ACADEMIC & PORTFOLIO PROJECTS
Campus Event Management Platform | React, Node.js, PostgreSQL, Docker
- Built collaborative university event discovery portal supporting 500+ active student users.
- Automated deployment containerization with Docker and integrated GitHub Actions CI/CD pipeline.
`;
    const blob = new Blob([sampleText], { type: "text/plain" });
    const file = new File([blob], "Kavindu_Perera_Resume.txt", { type: "text/plain" });
    setSelectedFile(file);
    showToast("Loaded sample student CV: Kavindu_Perera_Resume.txt", "info");
  };

  const loadHistory = async () => {
    try {
      const list = await api.cv.list();
      setCvHistory(list);
    } catch (err) {
      console.error("Failed to load CV history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (user?.profile?.target_career_slug) {
      setTargetCareer(user.profile.target_career_slug);
    }
    loadHistory();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadAndAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("target_career_slug", targetCareer);

    try {
      const result = await api.cv.upload(formData);
      setAnalysisResult(result);
      setSelectedFile(null);
      showToast("CV parsed and analyzed successfully!", "success");
      await loadHistory();
    } catch (err: any) {
      showToast(err.message || "Failed to analyze CV document.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleLoadPastAnalysis = async (analysisId: number) => {
    try {
      const detail = await api.cv.getAnalysis(analysisId);
      setAnalysisResult(detail);
    } catch (err) {
      console.error("Failed to load past analysis", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-navy flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <span>Smart CV Analyzer & Career Benchmark</span>
        </h1>
        <p className="text-xs text-muted mt-1">
          Secure document parsing (PDF/DOCX) with heuristic skill identification and role-specific gap feedback.
        </p>
      </div>

      {/* Upload Zone & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form (2 cols) */}
        <Card className="lg:col-span-2 p-6">
          <CardHeader>
            <div>
              <CardTitle>Upload Student CV</CardTitle>
              <CardDescription>Supported formats: PDF, DOCX, TXT (Maximum file size: 10MB)</CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleUploadAndAnalyze} className="space-y-4">
            {/* File Dropzone */}
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors relative">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center pointer-events-none">
                <UploadCloud className="w-10 h-10 text-primary mb-3" />
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-semibold text-navy">{selectedFile.name}</p>
                    <p className="text-xs text-muted mt-0.5">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-navy">Click to browse or drag and drop your CV</p>
                    <p className="text-xs text-muted mt-1">Strictly private • Processed in-memory without third-party tracking</p>
                  </div>
                )}
              </div>
            </div>

            {/* Target Role Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs">
                <label className="font-semibold text-navy whitespace-nowrap">Benchmark Against:</label>
                <select
                  value={targetCareer}
                  onChange={(e) => setTargetCareer(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-white text-navy focus:border-primary focus:outline-none"
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

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleUseSampleCV}>
                  Try Sample CV
                </Button>
                <Button type="submit" disabled={!selectedFile} isLoading={uploading} size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                  Extract & Benchmark CV
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Upload History (1 col) */}
        <Card className="p-6">
          <CardHeader>
            <div>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>Previous analyses</CardDescription>
            </div>
          </CardHeader>

          {loadingHistory ? (
            <div className="h-28 bg-[#F8FAFC] rounded-lg animate-pulse" />
          ) : cvHistory.length === 0 ? (
            <p className="text-xs text-muted py-6 text-center">No CVs uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {cvHistory.map((doc: any) => (
                <div
                  key={doc.id}
                  onClick={() => doc.latest_analysis && handleLoadPastAnalysis(doc.latest_analysis.id)}
                  className="p-3 rounded-lg border border-border bg-[#F8FAFC] hover:border-primary/40 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-navy truncate max-w-[150px]">{doc.filename}</span>
                    {doc.latest_analysis && (
                      <Badge variant="primary" size="sm">
                        {Math.round(doc.latest_analysis.match_score)}% Fit
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-muted">
                    <span>{doc.file_type.toUpperCase()} • {(doc.file_size / 1024).toFixed(0)} KB</span>
                    <span>View report &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Active Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6 pt-2">
          {/* Top Score Banner */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Analysis Report</span>
              <h2 className="text-lg font-bold text-navy mt-1">
                Target Role Benchmark: {analysisResult.target_career || analysisResult.target_career_slug}
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Identified {analysisResult.extracted_skills?.length || 0} technical skills from CV text.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-muted">Calculated Match</span>
                <div className="text-2xl font-bold text-navy">{Math.round(analysisResult.match_score || 0)}%</div>
              </div>
              <Badge variant={analysisResult.match_score >= 70 ? "success" : "warning"} size="md">
                {analysisResult.match_score >= 70 ? "High Match" : "Moderate Gap"}
              </Badge>
            </div>
          </div>

          {/* Extracted Skills Ribbon */}
          <Card className="p-6">
            <CardHeader>
              <div>
                <CardTitle>Extracted Technical Skills</CardTitle>
                <CardDescription>Automatically mapped into your Digital Twin profile as CV evidence</CardDescription>
              </div>
            </CardHeader>
            <div className="flex flex-wrap gap-2">
              {analysisResult.extracted_skills?.map((skill: string) => (
                <Badge key={skill} variant="secondary" size="md">
                  <CheckCircle2 className="w-3 h-3 text-success" />
                  <span>{skill}</span>
                </Badge>
              ))}
            </div>
          </Card>

          {/* Feedback & Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="p-5">
              <div className="flex items-center gap-2 pb-3 border-b border-border mb-3">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Identified CV Strengths</h3>
              </div>
              <ul className="space-y-2 text-xs text-muted">
                {analysisResult.strengths?.map((str: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-success mt-0.5">•</span>
                    <span className="text-navy">{str}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Missing Critical Skills */}
            <Card className="p-5">
              <div className="flex items-center gap-2 pb-3 border-b border-border mb-3">
                <XCircle className="w-4 h-4 text-error" />
                <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Missing Target Prerequisites</h3>
              </div>
              {analysisResult.missing_critical_skills?.length === 0 ? (
                <p className="text-xs text-success">All required role prerequisites detected on your CV!</p>
              ) : (
                <ul className="space-y-2 text-xs text-muted">
                  {analysisResult.missing_critical_skills?.map((skill: string, i: number) => (
                    <li key={i} className="flex items-center justify-between p-2 rounded bg-[#FDF2F2] border border-[#FAD3D3]">
                      <span className="font-semibold text-error">{skill}</span>
                      <span className="text-[11px] text-muted">Prerequisite</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Actionable Improvements */}
            <Card className="md:col-span-2 p-5">
              <div className="flex items-center gap-2 pb-3 border-b border-border mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Actionable Improvement Suggestions</h3>
              </div>
              <div className="space-y-2.5">
                {analysisResult.improvement_feedback?.map((fb: string, i: number) => (
                  <div key={i} className="p-3 rounded-lg border border-border bg-[#F8FAFC] flex items-start gap-2.5 text-xs text-navy">
                    <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{fb}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
