# FuturePath AI — Phased Implementation Plan

## Phase 1: Project Inspection & Foundations (Completed)
- [x] Inspect existing workspace (empty folder identified).
- [x] Verify toolchain: Node.js v24.12.0, npm 11.6.2, Python 3.13.9.
- [x] Formulate architecture, database schema, API contracts, AI design, security, testing, and deployment plans.
- [x] Create project documentation: README, PRD, Architecture, Database Design, API docs, Testing, Security, Deployment guides.

## Phase 2: Design System & Frontend Application Shell
- [ ] Configure Next.js TypeScript App Router frontend in `frontend/`.
- [ ] Establish design tokens (light-first `#F7F8FA`, navy typography `#172033`, brand blue `#2448A5`, accent `#4776D0`, border `#E5E9F0`).
- [ ] Build public landing page with product preview, feature breakdowns, evidence-based skill section, FAQs, CTA.
- [ ] Build responsive authenticated application shell with collapsible sidebar, breadcrumbs, profile menu, and mobile navigation drawer.

## Phase 3: Backend Core, Database & Authentication
- [ ] Setup FastAPI backend in `backend/` with SQLAlchemy 2.0 and Pydantic v2.
- [ ] Implement database models: User, StudentProfile, CareerProfile, CareerRequirement, Skill, SkillEvidence, CVDocument, CVAnalysis, LearningRoadmap, RoadmapTask, Lecture, LectureSummary, QuizCard, Opportunity, OpportunityBookmark, OpportunityApplication, AuditEvent.
- [ ] Implement database seeder with 12 industry career profiles, 50+ normalized skills, and verified Sri Lankan & international opportunities.
- [ ] Build authentication API: Register, Login, JWT verification, Current User, Profile updates, and Account deletion.

## Phase 4: Student Digital Twin & Interactive Dashboard
- [ ] Build Digital Twin API & Frontend: interactive skill graph, categories, evidence records with validation tiers (self-reported, cv-extracted, project, assessment).
- [ ] Connect Overview Dashboard with real calculations: career readiness %, roadmap progress %, skills count, upcoming tasks, saved opportunities.

## Phase 5: Smart CV Analyzer & Career Advisor
- [ ] Implement secure document parser (PDF, DOCX, TXT) and heuristic skill extraction engine.
- [ ] Build Career Advisor matching engine calculating transparent requirement weights vs student evidence.
- [ ] Create CV Analyzer UI with upload dropzone, extracted data review, target role gap comparison, and downloadable analysis report.

## Phase 6: Personalized Learning Roadmap
- [ ] Implement intelligent milestone and task generator based on target career skill gaps and weekly study hours.
- [ ] Build interactive Roadmap UI: phase milestones, task status toggles, reordering, resource links.
- [ ] Wire real task completions directly to dashboard progress metrics.

## Phase 7: Lecture Intelligence Workspace
- [ ] Build lecture processor: transcript text ingestion, structured summary, key concept extraction, action items.
- [ ] Implement interactive Quiz & Flashcard generator with flip animation and answer reveals.

## Phase 8: Opportunity Intelligence & Career Future Simulator
- [ ] Build searchable Opportunity directory with filters (Internship, Scholarship, Hackathon, Sri Lanka / Global), bookmarking, and application tracking.
- [ ] Build Career Future Simulator: interactive scenario planning calculating projected skill coverage increases.

## Phase 9: Professional Portfolio Builder
- [ ] Implement portfolio generator aggregating verified student projects, skills, education, and links.
- [ ] Build public portfolio route `/p/[username]` with privacy-first toggle.

## Phase 10: Verification, Testing & Refinement
- [ ] Write and run comprehensive automated test suite in `backend/tests/`.
- [ ] Verify complete student journey end-to-end.
- [ ] Finalize production-ready documentation and clean configuration.
