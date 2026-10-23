"use client";

import React, { useState, useEffect } from "react";
import {
  Map,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function RoadmapPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [togglingTaskId, setTogglingTaskId] = useState<number | null>(null);

  const loadRoadmap = async () => {
    try {
      const data = await api.roadmap.getActive();
      setRoadmap(data);
    } catch (err) {
      console.error("Failed to load active roadmap", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const handleToggleTask = async (taskId: number, currentCompleted: boolean) => {
    setTogglingTaskId(taskId);
    try {
      const res: any = await api.roadmap.toggleTask(taskId, !currentCompleted);
      showToast(res.message || "Task updated successfully", "success");
      await loadRoadmap();
    } catch (err: any) {
      showToast(err.message || "Failed to toggle task", "error");
    } finally {
      setTogglingTaskId(null);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const targetSlug = user?.profile?.target_career_slug || "full-stack-developer";
      await api.roadmap.generate(targetSlug);
      showToast("Personalized learning roadmap regenerated!", "success");
      await loadRoadmap();
    } catch (err: any) {
      showToast(err.message || "Failed to regenerate roadmap", "error");
    } finally {
      setRegenerating(false);
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

  const tasks = roadmap?.tasks || [];
  // Group tasks by phase
  const phases = [1, 2, 3].map((pNum) => {
    const phaseTasks = tasks.filter((t: any) => t.phase_number === pNum);
    const title = phaseTasks.length > 0 ? phaseTasks[0].phase_title : `Phase ${pNum}`;
    const completedCount = phaseTasks.filter((t: any) => t.is_completed).length;
    return {
      phaseNumber: pNum,
      phaseTitle: title,
      tasks: phaseTasks,
      total: phaseTasks.length,
      completed: completedCount,
      isDone: phaseTasks.length > 0 && completedCount === phaseTasks.length,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-navy flex items-center gap-2">
              <Map className="w-5 h-5 text-primary" />
              <span>{roadmap?.title || "Personalized Learning Roadmap"}</span>
            </h1>
            <Badge variant="primary">Paced to {user?.profile?.weekly_study_hours || 10} hrs/week</Badge>
          </div>
          <p className="text-xs text-muted mt-1">
            Deterministic milestones generated from your verified skill gaps and target career requirements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            isLoading={regenerating}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Regenerate Plan
          </Button>
        </div>
      </div>

      {/* Progress Metric Bar */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Overall Roadmap Progress</span>
            <div className="text-lg font-bold text-navy mt-0.5">
              {roadmap?.completed_tasks || 0} of {roadmap?.total_tasks || 0} Tasks Completed (
              {Math.round(roadmap?.progress_percentage || 0)}%)
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="md">
              {roadmap?.completed_milestones || 0} / {roadmap?.total_milestones || 3} Milestones Mastered
            </Badge>
          </div>
        </div>

        <div className="w-full bg-[#E2E8F0] h-3 rounded-full overflow-hidden">
          <div
            className="bg-success h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(roadmap?.progress_percentage || 0, 100)}%` }}
          />
        </div>
      </Card>

      {/* 3 Structured Phases */}
      <div className="space-y-6">
        {phases.map((phase) => (
          <Card key={phase.phaseNumber} className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border mb-4 gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    phase.isDone
                      ? "bg-success text-white"
                      : "bg-primary-light text-primary border border-[#CBDDFE]"
                  }`}
                >
                  {phase.isDone ? <CheckCircle2 className="w-4 h-4" /> : phase.phaseNumber}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-navy">{phase.phaseTitle}</h3>
                  <span className="text-[11px] text-muted">
                    {phase.completed} of {phase.total} tasks completed
                  </span>
                </div>
              </div>

              {phase.isDone ? (
                <Badge variant="success">Milestone Completed</Badge>
              ) : (
                <Badge variant="neutral">In Progress</Badge>
              )}
            </div>

            {/* Phase Tasks List */}
            <div className="space-y-3">
              {phase.tasks.map((task: any) => (
                <div
                  key={task.id}
                  className={`flex items-start justify-between p-4 rounded-lg border transition-all ${
                    task.is_completed
                      ? "bg-[#F8FAFC] border-border opacity-85"
                      : "bg-white border-[#E2E8F0] shadow-subtle hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                    <button
                      onClick={() => handleToggleTask(task.id, task.is_completed)}
                      disabled={togglingTaskId === task.id}
                      className="mt-0.5 text-muted hover:text-primary transition-colors flex-shrink-0"
                      title={task.is_completed ? "Mark incomplete" : "Mark complete"}
                    >
                      {task.is_completed ? (
                        <CheckCircle2 className="w-5 h-5 text-success fill-success/10" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#94A3B8]" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-semibold text-navy ${
                            task.is_completed ? "line-through text-muted" : ""
                          }`}
                        >
                          {task.title}
                        </span>
                        <Badge variant="secondary" size="sm">
                          {task.skill_name}
                        </Badge>
                        <span className="text-[11px] text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {task.estimated_hours} hrs
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-1 leading-relaxed">{task.description}</p>
                    </div>
                  </div>

                  {task.resource_url && (
                    <a
                      href={task.resource_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline whitespace-nowrap flex-shrink-0 mt-0.5"
                    >
                      <span>Documentation</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
