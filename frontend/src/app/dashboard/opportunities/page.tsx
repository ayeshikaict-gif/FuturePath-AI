"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  MapPin,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  RotateCw,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function OpportunitiesPage() {
  const { showToast } = useToast();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sriLankaOnly, setSriLankaOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<"directory" | "tracker">("directory");
  const [trackerData, setTrackerData] = useState<any>(null);

  const handleSyncFeeds = async () => {
    setSyncing(true);
    try {
      const res: any = await api.opportunities.sync();
      showToast(res.message || "Opportunity feeds synchronized!", "success");
      await loadOpportunities();
    } catch (err: any) {
      showToast(err.message || "Failed to sync feeds", "error");
    } finally {
      setSyncing(false);
    }
  };

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const data = await api.opportunities.list({
        q: searchQuery,
        opp_type: selectedType,
        sri_lanka_only: sriLankaOnly || undefined,
      });
      setOpportunities(data);
    } catch (err) {
      console.error("Failed to load opportunities", err);
    } finally {
      setLoading(false);
    }
  };

  const loadTracker = async () => {
    try {
      const data = await api.opportunities.getMyTracker();
      setTrackerData(data);
    } catch (err) {
      console.error("Failed to load tracker", err);
    }
  };

  useEffect(() => {
    loadOpportunities();
    loadTracker();
  }, [selectedType, sriLankaOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOpportunities();
  };

  const handleToggleBookmark = async (id: number) => {
    try {
      const res: any = await api.opportunities.toggleBookmark(id);
      showToast(res.message || "Bookmark updated.", "info");
      await loadOpportunities();
      await loadTracker();
    } catch (err: any) {
      showToast(err.message || "Failed to toggle bookmark", "error");
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res: any = await api.opportunities.updateApplication(id, status);
      showToast(res.message || `Application status set to ${status}.`, "success");
      await loadOpportunities();
      await loadTracker();
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <span>Opportunity Intelligence Hub</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            Curated, verified student internships, hackathons, and scholarships with Sri Lanka & global tech focus.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncFeeds}
            isLoading={syncing}
            icon={<RotateCw className="w-3.5 h-3.5" />}
          >
            Sync Feeds
          </Button>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-border text-xs">
            <button
              onClick={() => setActiveTab("directory")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeTab === "directory" ? "bg-primary text-white" : "text-muted hover:text-navy"
              }`}
            >
              Directory ({opportunities.length})
            </button>
            <button
              onClick={() => setActiveTab("tracker")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeTab === "tracker" ? "bg-primary text-white" : "text-muted hover:text-navy"
              }`}
            >
              My Tracker ({trackerData?.applications_count || 0})
            </button>
          </div>
        </div>
      </div>

      {activeTab === "directory" ? (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl border border-border p-4 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
              <Search className="w-4 h-4 text-muted absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, company (WSO2, IFS, Sysco LABS), or skills..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-[#F8FAFC] text-navy focus:bg-white focus:border-primary focus:outline-none transition-colors"
              />
            </form>

            <div className="flex items-center gap-2 w-full md:w-auto text-xs overflow-x-auto pb-1 md:pb-0">
              {["All", "Internship", "Hackathon", "Scholarship"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedType === type
                      ? "bg-primary text-white font-semibold"
                      : "bg-[#F8FAFC] text-muted hover:text-navy border border-border"
                  }`}
                >
                  {type}
                </button>
              ))}

              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-navy whitespace-nowrap pl-2 border-l border-border">
                <input
                  type="checkbox"
                  checked={sriLankaOnly}
                  onChange={(e) => setSriLankaOnly(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary accent-primary"
                />
                <span>Sri Lanka Only</span>
              </label>
            </div>
          </div>

          {/* Opportunities Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-white rounded-xl border border-border" />
              ))}
            </div>
          ) : opportunities.length === 0 ? (
            <Card className="p-12 text-center text-muted">
              <p className="text-sm font-semibold text-navy">No matching opportunities found</p>
              <p className="text-xs text-muted mt-1">Try clearing filters or search terms.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {opportunities.map((opp) => (
                <Card key={opp.id} hover className="p-6 flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary">{opp.organization}</span>
                          {opp.is_sri_lanka && <Badge variant="secondary" size="sm">🇱🇰 Sri Lanka</Badge>}
                        </div>
                        <h3 className="text-base font-semibold text-navy mt-1 leading-snug">{opp.title}</h3>
                      </div>

                      <button
                        onClick={() => handleToggleBookmark(opp.id)}
                        className={`p-1.5 rounded-md border transition-colors ${
                          opp.is_bookmarked
                            ? "bg-primary-light border-[#CBDDFE] text-primary"
                            : "border-border text-muted hover:text-navy bg-white"
                        }`}
                        title={opp.is_bookmarked ? "Remove Bookmark" : "Save Bookmark"}
                      >
                        {opp.is_bookmarked ? <BookmarkCheck className="w-4 h-4 fill-primary" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Location & Deadline */}
                    <div className="flex items-center gap-4 text-xs text-muted mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {opp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-warning" /> Deadline: {opp.deadline}
                      </span>
                    </div>

                    <p className="text-xs text-navy leading-relaxed mb-4">{opp.description}</p>

                    {/* Eligibility */}
                    {opp.eligibility && (
                      <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-border text-[11px] text-muted mb-4">
                        <span className="font-semibold text-navy">Eligibility: </span>
                        <span>{opp.eligibility}</span>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {opp.tags?.map((t: string) => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F1F5F9] text-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-border flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <label className="text-muted">Status:</label>
                      <select
                        value={opp.application_status || "none"}
                        onChange={(e) => handleUpdateStatus(opp.id, e.target.value)}
                        className="px-2 py-1 rounded border border-border bg-white text-navy font-medium focus:border-primary focus:outline-none"
                      >
                        <option value="none">Not Applied</option>
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offered">Offered</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <a
                      href={opp.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover hover:underline"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Application Tracker Tab */
        <Card className="p-6">
          <CardHeader>
            <div>
              <CardTitle>Active Application Pipeline</CardTitle>
              <CardDescription>Track status across saved and submitted opportunities</CardDescription>
            </div>
          </CardHeader>

          {(() => {
            const applicationsList = Array.isArray(trackerData?.applications)
              ? trackerData.applications
              : Array.isArray(trackerData)
              ? trackerData
              : [];

            if (applicationsList.length === 0) {
              return (
                <div className="py-12 text-center text-xs text-muted">
                  <Briefcase className="w-8 h-8 text-muted mx-auto mb-2" />
                  <p>No active applications tracked yet.</p>
                  <p className="mt-1">Change any opportunity status to &quot;Applied&quot; to track your recruitment journey.</p>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {applicationsList.map((app: any) => (
                  <div key={app.application_id || app.id} className="p-4 rounded-lg border border-border bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-primary">{app.organization || app.company}</span>
                      <h4 className="text-sm font-semibold text-navy mt-0.5">{app.title}</h4>
                      <p className="text-[11px] text-muted mt-1">Deadline: {app.deadline}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          app.status === "offered"
                            ? "success"
                            : app.status === "interviewing"
                            ? "warning"
                            : app.status === "rejected"
                            ? "error"
                            : "primary"
                        }
                        size="md"
                        className="capitalize"
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </Card>
      )}
    </div>
  );
}
