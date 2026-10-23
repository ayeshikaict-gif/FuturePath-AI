"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  Plus,
  ShieldCheck,
  ExternalLink,
  Trash2,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function DigitalTwinPage() {
  const { showToast } = useToast();
  const [digitalTwin, setDigitalTwin] = useState<any>(null);
  const [allTaxonomySkills, setAllTaxonomySkills] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Add Evidence Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newEvidenceType, setNewEvidenceType] = useState("project_evidence");
  const [newProficiency, setNewProficiency] = useState("intermediate");
  const [newSourceTitle, setNewSourceTitle] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [dt, skills] = await Promise.all([
        api.digitalTwin.get(),
        api.digitalTwin.getSkills(),
      ]);
      setDigitalTwin(dt);
      setAllTaxonomySkills(skills);
    } catch (err) {
      console.error("Failed to load digital twin", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName || !newSourceTitle) return;

    setSubmitting(true);
    try {
      await api.digitalTwin.addEvidence({
        skill_name: newSkillName,
        evidence_type: newEvidenceType,
        proficiency_level: newProficiency,
        source_title: newSourceTitle,
        source_url: newSourceUrl,
        notes: newNotes,
      });
      showToast(`Added evidence for "${newSkillName}"`, "success");
      setIsModalOpen(false);
      // Reset form
      setNewSkillName("");
      setNewSourceTitle("");
      setNewSourceUrl("");
      setNewNotes("");
      await loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to add evidence", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvidence = async (id: number) => {
    if (!confirm("Are you sure you want to remove this skill evidence record?")) return;
    try {
      await api.digitalTwin.deleteEvidence(id);
      showToast("Evidence record removed.", "info");
      await loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to delete evidence", "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-white rounded-xl border border-border" />
        <div className="h-64 bg-white rounded-xl border border-border" />
      </div>
    );
  }

  const allRecords = digitalTwin?.all_records || [];
  const filteredRecords =
    selectedCategory === "all"
      ? allRecords
      : allRecords.filter((r: any) => r.category === selectedCategory);

  const getEvidenceBadge = (type: string) => {
    switch (type) {
      case "project_evidence":
        return <Badge variant="success">Project Evidence</Badge>;
      case "assessment_evidence":
        return <Badge variant="success">Assessment Verified</Badge>;
      case "cv_extracted":
        return <Badge variant="primary">CV Extracted</Badge>;
      case "course_completed":
        return <Badge variant="warning">Course Completed</Badge>;
      default:
        return <Badge variant="neutral">Self-Reported</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <span>My Student Digital Twin</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            Dynamic, evidence-backed inventory of your demonstrated technical competencies.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} size="sm" icon={<Plus className="w-4 h-4" />}>
          Add Skill Evidence
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Skills Logged</span>
          <div className="text-2xl font-bold text-navy mt-1">{digitalTwin?.total_skills || 0}</div>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">Verified Records</span>
          <div className="text-2xl font-bold text-success mt-1">{digitalTwin?.verified_evidence_count || 0}</div>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">Project Evidence</span>
          <div className="text-2xl font-bold text-primary mt-1">
            {digitalTwin?.evidence_type_breakdown?.project_evidence || 0}
          </div>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">CV Extracted</span>
          <div className="text-2xl font-bold text-navy mt-1">
            {digitalTwin?.evidence_type_breakdown?.cv_extracted || 0}
          </div>
        </Card>
      </div>

      {/* Category Tabs / Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: "all", label: "All Skills" },
          { key: "languages", label: "Languages" },
          { key: "frameworks", label: "Frameworks & Libraries" },
          { key: "databases", label: "Databases" },
          { key: "cloud_devops", label: "Cloud & DevOps" },
          { key: "fundamentals", label: "Core Fundamentals" },
          { key: "soft_skills", label: "Professional Skills" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedCategory(tab.key)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === tab.key
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-muted hover:text-navy border border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Evidence Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-border text-muted font-semibold">
              <tr>
                <th className="px-5 py-3">Skill & Category</th>
                <th className="px-5 py-3">Evidence Tier</th>
                <th className="px-5 py-3">Source & Verification</th>
                <th className="px-5 py-3">Proficiency</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    No skills found for this category. Click &quot;Add Skill Evidence&quot; to log your first record.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record: any) => (
                  <tr key={record.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-navy">{record.skill_name}</div>
                      <span className="text-[11px] text-muted capitalize">{record.category.replace("_", " ")}</span>
                    </td>
                    <td className="px-5 py-3.5">{getEvidenceBadge(record.evidence_type)}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-navy flex items-center gap-1.5">
                        <span>{record.source_title}</span>
                        {record.source_url && (
                          <a
                            href={record.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {record.notes && <p className="text-[11px] text-muted mt-0.5 line-clamp-1">{record.notes}</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="secondary" size="sm" className="capitalize">
                        {record.proficiency_level}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteEvidence(record.id)}
                        className="p-1 text-muted hover:text-error rounded transition-colors"
                        title="Delete evidence record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Skill Evidence Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record New Skill Evidence"
        description="Link demonstrable evidence such as GitHub repositories, course certificates, or university lab projects."
      >
        <form onSubmit={handleAddEvidence} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-navy mb-1">Skill Name</label>
            <input
              type="text"
              required
              list="skills-list"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. Docker, TypeScript, PostgreSQL"
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <datalist id="skills-list">
              {allTaxonomySkills.map((s) => (
                <option key={s.id} value={s.name} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-navy mb-1">Evidence Type</label>
              <select
                value={newEvidenceType}
                onChange={(e) => setNewEvidenceType(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="project_evidence">Project Evidence (1.0 weight)</option>
                <option value="assessment_evidence">Assessment Evidence (1.0 weight)</option>
                <option value="course_completed">Course Completed (0.60 weight)</option>
                <option value="self_reported">Self Reported (0.35 weight)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-navy mb-1">Proficiency Level</label>
              <select
                value={newProficiency}
                onChange={(e) => setNewProficiency(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-navy mb-1">Source Title / Evidence Name</label>
            <input
              type="text"
              required
              value={newSourceTitle}
              onChange={(e) => setNewSourceTitle(e.target.value)}
              placeholder="e.g. Distributed Cache Implementation (GitHub)"
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-navy mb-1">Source URL (Optional)</label>
            <input
              type="url"
              value={newSourceUrl}
              onChange={(e) => setNewSourceUrl(e.target.value)}
              placeholder="https://github.com/username/project"
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-navy mb-1">Practical Description / Notes</label>
            <textarea
              rows={3}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Describe what you built, architectural decisions, or performance improvements..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Save Evidence Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
