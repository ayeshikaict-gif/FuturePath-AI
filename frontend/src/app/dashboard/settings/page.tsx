"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  User,
  ShieldAlert,
  Save,
  Trash2,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const router = useRouter();
  const { user, refreshUser, logout } = useAuth();
  const { showToast } = useToast();

  const [institution, setInstitution] = useState(user?.profile?.institution || "");
  const [degree, setDegree] = useState(user?.profile?.degree || "");
  const [academicYear, setAcademicYear] = useState(user?.profile?.academic_year || 1);
  const [weeklyHours, setWeeklyHours] = useState(user?.profile?.weekly_study_hours || 10);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.auth.updateProfile({
        institution,
        degree,
        academic_year: academicYear,
        weekly_study_hours: weeklyHours,
      });
      await refreshUser();
      showToast("Academic profile settings updated successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you absolutely sure you want to permanently delete your account and all associated CV documents, roadmaps, and evidence records? This action cannot be undone."
      )
    )
      return;

    setDeleting(true);
    try {
      await api.auth.deleteAccount();
      logout();
    } catch (err) {
      console.error("Failed to delete account", err);
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-navy flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <span>Account & Privacy Settings</span>
        </h1>
        <p className="text-xs text-muted mt-1">
          Manage your student credentials, study preferences, and data privacy controls.
        </p>
      </div>

      {/* Academic Profile Preferences */}
      <Card className="p-6">
        <CardHeader>
          <div>
            <CardTitle>Academic Profile & Study Capacity</CardTitle>
            <CardDescription>Directly influences roadmap task schedules and career recommendations</CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-navy mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={user?.full_name || ""}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-[#F8FAFC] text-muted cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-navy mb-1">University Email Address</label>
              <input
                type="text"
                disabled
                value={user?.email || ""}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-[#F8FAFC] text-muted cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-navy mb-1">Educational Institution</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. University of Colombo"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-navy mb-1">Degree Program</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.Sc. in Computer Science"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-navy mb-1">Academic Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:outline-none"
              >
                <option value={1}>1st Year Undergraduate</option>
                <option value={2}>2nd Year Undergraduate</option>
                <option value={3}>3rd Year (Pre-Finalist)</option>
                <option value={4}>4th Year (Graduating Finalist)</option>
                <option value={5}>Postgraduate / Master&apos;s</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-navy">Weekly Study Hours Available</label>
                <span className="text-xs font-bold text-primary">{weeklyHours} hrs/week</span>
              </div>
              <input
                type="range"
                min={4}
                max={40}
                step={2}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer mt-1"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" isLoading={saving} size="sm" icon={<Save className="w-3.5 h-3.5" />}>
              Save Academic Settings
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger Zone: Account Deletion */}
      <Card className="p-6 border-error/30 bg-[#FDF8F8]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-error flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Danger Zone — Data Erasure</span>
            </h3>
            <p className="text-xs text-muted mt-1 max-w-xl leading-relaxed">
              In accordance with data privacy rights, permanently remove your account along with all parsed CVs,
              lecture summaries, roadmaps, and evidence records from our database.
            </p>
          </div>

          <Button variant="danger" size="sm" onClick={handleDeleteAccount} isLoading={deleting} icon={<Trash2 className="w-3.5 h-3.5" />}>
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
