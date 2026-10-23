# FuturePath AI — AI & Algorithmic Design Specification

## 1. Design Philosophy: Explainable Intelligence over Opaque Hallucinations
A central pillar of FuturePath AI is deterministic, verifiable intelligence. In education and career guidance, generating fictitious recommendations or arbitrary confidence percentages ("98.4% fit") damages student trust. FuturePath AI uses explainable algorithmic models with structured evaluation rules, transparent weighting, and verifiable educational resources.

## 2. Core Intelligent Components

### 2.1 CV Text & Skill Extraction Engine
1. **Document Ingestion**:
   - `pypdf` extracts text streams across all pages while preserving line-breaks.
   - `python-docx` iterates through document paragraphs and tables.
2. **Heuristic Section Segmentation**:
   - Uses regex boundary detection for standard CV headings: `Education`, `Experience`, `Work History`, `Projects`, `Skills`, `Certifications`.
3. **Skill Entity Matching**:
   - Normalizes text and matches against FuturePath's verified technical taxonomy containing 200+ technology keywords, aliases, and variations (e.g., `React.js` -> `React`, `Postgres` -> `PostgreSQL`, `k8s` -> `Kubernetes`).
4. **Contextual Evidence Weighting**:
   - Skills found in project/experience descriptions are classified as having higher practical validity than standalone comma-separated skill lists.

### 2.2 Career Skill Gap Evaluation Algorithm
The career readiness score is calculated deterministically:

$$\text{Readiness Score} = \frac{\sum_{i \in \text{Skills}} w_i \cdot \text{EvidenceScore}_i}{\sum_{i \in \text{Skills}} w_i \cdot \text{MaxScore}} \times 100$$

Where:
- $w_i \in [1.0, 3.0]$ is the requirement weight (`required` = 3.0, `preferred` = 2.0, `bonus` = 1.0).
- $\text{EvidenceScore}_i$:
  - `Assessment Evidence` / `Project Evidence`: 1.0 (Full evidence)
  - `CV Extracted`: 0.75 (Documented evidence)
  - `Course Completed`: 0.60 (Educational evidence)
  - `Self Reported`: 0.35 (Unverified claim)
  - `Missing`: 0.00

### 2.3 Personalized Roadmap Generation
Given:
- Target career profile requirements
- Student's current skill gaps ordered by weight $\times (1 - \text{EvidenceScore})$
- Available weekly study hours $H_{\text{weekly}}$

The scheduler groups skills into 3 distinct logical phases:
- **Phase 1: Core Fundamentals** (High-priority missing prerequisites)
- **Phase 2: Applied Tooling & Frameworks** (Practical development technologies)
- **Phase 3: Advanced Architecture & Production Projects** (Portfolio-level capstones)

Estimated task hours are mapped based on skill complexity (e.g., HTML/CSS: 15h, Docker: 25h, Distributed Systems: 40h). Task schedules are generated realistically based on $H_{\text{weekly}}$.

### 2.4 Lecture Summarization & Quiz Generation Engine
- **Heuristic Summarizer**: Identifies high-density informational paragraphs, sentences containing causal/definitional phrasing ("is defined as", "the key principle", "crucial for").
- **Concept Extraction**: Isolates key noun phrases and technical keywords mentioned with high frequency.
- **Quiz & Flashcard Generator**: Synthesizes conceptual questions and answers directly from extracted concept definitions to reinforce active recall.
