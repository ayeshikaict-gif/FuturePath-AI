# FuturePath AI

> **Discover Your Potential. Build Your Skills. Shape Your Future.**

FuturePath AI is an AI-powered student career intelligence and personalized learning platform engineered for university students. It bridges higher education coursework with industry technology benchmarks through verifiable skill mapping, explainable CV gap analysis, structured learning roadmaps, and lecture synthesis.

---

## Key Features

1. **Clean, Professional EdTech Design**: Light-first design language (`#F7F8FA` canvas, `#FFFFFF` crisp cards, `#172033` deep navy text, `#2448A5` primary brand blue, `#E5E9F0` subtle borders) built with Tailwind CSS, Inter typography, and Lucide icons.
2. **Student Digital Twin**: Evidence-backed skill profile categorizing technical, framework, database, and soft skills with verification tiers (Self-Reported, CV-Extracted, Project-Linked, Assessment-Verified).
3. **Smart CV Analyzer**: Secure PDF/DOCX/TXT upload, heuristic extraction of education, experience, projects, and skills, role-specific gap scoring, and downloadable feedback reports.
4. **Career Advisor & Skill Gap Analysis**: 12 structured career profiles (Full-Stack, AI/ML, Cloud, DevOps, Cybersecurity, Data Science, etc.) with transparent requirement weights, matching percentage, and missing skill breakdowns.
5. **Personalized Learning Roadmap**: Algorithmic milestone scheduler that converts identified gaps and weekly study availability into actionable learning tasks with curated resources and progress tracking.
6. **Lecture Intelligence Workspace**: Transcript and notes processor generating summaries, key concept breakdowns, action items, and interactive active-recall quizzes and flashcards.
7. **Opportunity Intelligence Hub**: Searchable directory for internships, scholarships, and hackathons with dedicated Sri Lankan and global tech opportunities, plus full application tracking pipeline.
8. **Career Future Simulator**: Scenario planning sandbox to preview the exact career readiness impact of acquiring targeted technologies (e.g., "What if I learn TypeScript, Docker, and AWS?").
9. **Professional Portfolio Builder**: Auto-generated student portfolio from verified projects, skills, and academic history with private-by-default controls and public sharing at `/p/[username]`.

---

## Tech Stack

- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript (Strict Mode), Tailwind CSS, Lucide React, Recharts.
- **Backend**: FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, uvicorn.
- **Database**: Dual engine (Zero-setup SQLite for local dev, PostgreSQL for production).
- **Processing**: `pypdf`, `python-docx`, deterministic NLP heuristics.

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+ and pip

### Quick Start

1. **Start the Backend**:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate   # On Windows
   # source venv/bin/activate # On Unix/macOS
   pip install -r requirements.txt
   python -m app.db.init_db
   uvicorn app.main:app --reload --port 8000
   ```
   Open `http://localhost:8000/docs` to explore the interactive API documentation.

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:3000` to access FuturePath AI.

---

## Documentation
- [System Architecture](ARCHITECTURE.md)
- [Product Requirements](REQUIREMENTS.md)
- [Database Design](DATABASE_DESIGN.md)
- [API Documentation](API_DOCUMENTATION.md)
- [AI & Algorithmic Design](AI_DESIGN.md)
- [Security & Privacy](SECURITY.md)
- [Verification & Testing](TESTING.md)
- [Deployment Guide](DEPLOYMENT.md)
