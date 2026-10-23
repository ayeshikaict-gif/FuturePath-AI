"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Upload,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ListChecks,
  RotateCcw,
  Layers,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function LecturesPage() {
  const { showToast } = useToast();
  const [lectures, setLectures] = useState<any[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [rawContent, setRawContent] = useState("");
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Flashcard flip states
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  // Quiz selection states: questionId -> selectedOptionIndex
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const handleLoadSampleNotes = () => {
    setTitle("Distributed Database Sharding & Replication");
    setSubject("CS3042 Advanced Database Systems");
    setRawContent(
      "Database sharding is defined as a horizontal partitioning architecture that separates very large databases into smaller, faster, more easily managed parts called data shards. " +
      "Replication refers to the automated synchronization of database replicas across multiple server nodes to ensure high availability and disaster recovery. " +
      "Consistent hashing is a crucial algorithmic technique used in distributed systems to distribute hash keys among nodes evenly with minimal data migration when servers join or leave. " +
      "Remember to complete the hands-on laboratory assignment on PostgreSQL replica failover before next Friday. " +
      "Make sure to read chapter 7 on the CAP theorem and distributed consensus algorithms."
    );
    showToast("Sample lecture notes loaded! Click 'Process & Generate Quizzes'", "info");
  };

  const loadLectures = async () => {
    try {
      const list = await api.lectures.list();
      setLectures(list);
      if (list.length > 0 && !selectedLecture) {
        const detail = await api.lectures.getDetail(list[0].id);
        setSelectedLecture(detail);
      }
    } catch (err) {
      console.error("Failed to load lectures", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLectures();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rawContent) return;

    setProcessing(true);
    try {
      const res = await api.lectures.upload({
        title,
        subject,
        raw_content: rawContent,
      });
      // Fetch the full detail
      const detail = await api.lectures.getDetail(res.lecture_id);
      setSelectedLecture(detail);
      setTitle("");
      setSubject("");
      setRawContent("");
      showToast("Lecture processed into summary, concepts, and quizzes!", "success");
      await loadLectures();
    } catch (err: any) {
      showToast(err.message || "Failed to process lecture content.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleSelectLecture = async (id: number) => {
    try {
      const detail = await api.lectures.getDetail(id);
      setSelectedLecture(detail);
      setFlippedCards({});
      setQuizAnswers({});
    } catch (err) {
      console.error("Failed to select lecture", err);
    }
  };

  const toggleFlashcard = (cardId: number) => {
    setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleQuizSelect = (cardId: number, optionIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [cardId]: optionIdx }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-navy flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span>Lecture Intelligence Workspace</span>
        </h1>
        <p className="text-xs text-muted mt-1">
          Convert university lecture transcripts and study notes into synthesized takeaways, key concepts, and active recall quizzes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload & History (1 col) */}
        <div className="space-y-6">
          {/* Upload Notes Form */}
          <Card className="p-5">
            <CardHeader>
              <div>
                <CardTitle>Synthesize Lecture Notes</CardTitle>
                <CardDescription>Paste raw transcript or class slides</CardDescription>
              </div>
            </CardHeader>

            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-navy mb-1">Lecture Topic / Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Database Transactions"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-navy mb-1">Subject / Module (Optional)</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. CS3042 - Advanced Database Systems"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-navy mb-1">Transcript or Lecture Notes Text</label>
                <textarea
                  rows={5}
                  required
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  placeholder="Paste lecture transcript, speech-to-text text, or notebook content..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleLoadSampleNotes} className="flex-1">
                  Load Sample
                </Button>
                <Button type="submit" isLoading={processing} className="flex-1" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                  Process
                </Button>
              </div>
            </form>
          </Card>

          {/* Past Lectures List */}
          <Card className="p-5">
            <CardHeader>
              <div>
                <CardTitle>Processed Lectures</CardTitle>
                <CardDescription>{lectures.length} saved sessions</CardDescription>
              </div>
            </CardHeader>

            {loading ? (
              <div className="h-28 bg-[#F8FAFC] rounded-lg animate-pulse" />
            ) : lectures.length === 0 ? (
              <p className="text-xs text-muted py-4 text-center">No lectures processed yet.</p>
            ) : (
              <div className="space-y-2">
                {lectures.map((lec) => {
                  const isSelected = selectedLecture?.id === lec.id;
                  return (
                    <div
                      key={lec.id}
                      onClick={() => handleSelectLecture(lec.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary-light text-primary font-semibold"
                          : "border-border bg-[#F8FAFC] text-navy hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate font-semibold">{lec.title}</span>
                        <Badge variant={isSelected ? "primary" : "neutral"} size="sm">
                          {lec.quiz_count} items
                        </Badge>
                      </div>
                      {lec.subject && <p className="text-[11px] text-muted mt-0.5">{lec.subject}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Intelligence Workspace: Summary, Concepts, Quizzes (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedLecture ? (
            <>
              {/* Summary Card */}
              <Card className="p-6">
                <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                  <div>
                    <h2 className="text-base font-bold text-navy">{selectedLecture.title}</h2>
                    <span className="text-xs text-muted">{selectedLecture.subject || "Lecture Summary"}</span>
                  </div>
                  <Badge variant="primary">AI Synthesis</Badge>
                </div>

                <div className="text-xs text-navy leading-relaxed bg-[#F8FAFC] p-4 rounded-lg border border-border">
                  <p>{selectedLecture.summary?.summary_text}</p>
                </div>

                {/* Key Concepts List */}
                <div className="mt-5">
                  <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-3">Extracted Core Concepts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedLecture.summary?.key_concepts?.map((c: any, i: number) => (
                      <div key={i} className="p-3 rounded-lg border border-border bg-white shadow-subtle">
                        <span className="text-xs font-bold text-primary">{c.title}</span>
                        <p className="text-[11px] text-muted mt-1 leading-normal">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Items */}
                {selectedLecture.summary?.action_items?.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-border">
                    <h3 className="text-xs font-bold text-navy uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ListChecks className="w-4 h-4 text-success" />
                      <span>Takeaways & Action Items</span>
                    </h3>
                    <ul className="space-y-1.5 text-xs text-muted">
                      {selectedLecture.summary.action_items.map((act: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-success font-bold">•</span>
                          <span className="text-navy">{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>

              {/* Active Recall: Flashcards & Quizzes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Active Recall Flashcards & Self-Assessments</span>
                  </h2>
                  <span className="text-xs text-muted">Generated from lecture concepts</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedLecture.quiz_cards?.map((card: any) => {
                    const isFlipped = flippedCards[card.id];
                    const isQuiz = card.card_type === "quiz";
                    const selectedIdx = quizAnswers[card.id];

                    if (isQuiz) {
                      return (
                        <Card key={card.id} className="p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between pb-2 border-b border-border mb-3">
                              <span className="text-[11px] font-bold text-primary uppercase">Multiple Choice Quiz</span>
                              <HelpCircle className="w-4 h-4 text-muted" />
                            </div>
                            <p className="text-xs font-semibold text-navy mb-3">{card.question}</p>

                            <div className="space-y-1.5 text-xs">
                              {card.options?.map((opt: string, idx: number) => {
                                const isSelected = selectedIdx === idx;
                                const isCorrect = opt === card.correct_answer;
                                let btnStyle = "border-border bg-white text-navy hover:bg-[#F8FAFC]";

                                if (selectedIdx !== undefined) {
                                  if (isCorrect) {
                                    btnStyle = "border-success bg-success-light text-success font-semibold";
                                  } else if (isSelected && !isCorrect) {
                                    btnStyle = "border-error bg-error-light text-error";
                                  }
                                }

                                return (
                                  <button
                                    key={idx}
                                    onClick={() => handleQuizSelect(card.id, idx)}
                                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${btnStyle}`}
                                  >
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {selectedIdx !== undefined && (
                            <div className="mt-3 pt-2 border-t border-border text-[11px] text-muted">
                              {card.explanation}
                            </div>
                          )}
                        </Card>
                      );
                    }

                    // Flashcard Card
                    return (
                      <Card
                        key={card.id}
                        onClick={() => toggleFlashcard(card.id)}
                        className="p-5 cursor-pointer hover:border-primary/50 transition-all flex flex-col justify-between min-h-[160px] bg-gradient-to-br from-white to-[#F8FAFC]"
                      >
                        <div>
                          <div className="flex items-center justify-between pb-2 border-b border-border mb-3">
                            <span className="text-[11px] font-bold text-muted uppercase">Concept Flashcard</span>
                            <span className="text-[11px] text-primary font-medium">Click to {isFlipped ? "flip back" : "reveal answer"}</span>
                          </div>
                          {!isFlipped ? (
                            <p className="text-xs font-semibold text-navy leading-relaxed">{card.question}</p>
                          ) : (
                            <div className="text-xs text-primary leading-relaxed animate-in fade-in">
                              <p className="font-semibold text-navy mb-1">Definition / Answer:</p>
                              <p>{card.correct_answer}</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 pt-2 border-t border-border text-[11px] text-muted flex items-center justify-between">
                          <span>{card.explanation}</span>
                          <RotateCcw className="w-3 h-3 text-muted" />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <Card className="p-12 text-center text-muted">
              <BookOpen className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="text-sm font-semibold text-navy">No lecture selected</p>
              <p className="text-xs text-muted mt-1">Paste lecture content on the left to start intelligence processing.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
