# FuturePath AI — Product Requirements Document (PRD)

## 1. Vision & Purpose
FuturePath AI is a dedicated platform designed for university students to eliminate the ambiguity between academic coursework and real-world technology career prerequisites. It delivers evidence-based student profile tracking, verifiable skill mapping, CV analysis against industry career paths, personalized study roadmaps, and lecture synthesis.

## 2. Core Personas
- **Undergraduate Student (Year 1-2)**: Looking to discover potential paths, understand what skills matter, and track progress early.
- **Pre-Graduating / Final Year Student (Year 3-4)**: Focusing on CV optimization, addressing specific role gaps, securing internships, and publishing a verifiable portfolio.
- **Academic Advisor / Career Center**: Reviewing aggregate student readiness and evidence-backed competencies.

## 3. Functional Requirements

### FR-1: Authentication & Onboarding
- Registration with email, full name, secure password.
- JWT session management with expiration handling.
- Multi-step onboarding to capture degree, academic year, target careers, initial skills, and weekly study hours.

### FR-2: Student Digital Twin
- Dynamic aggregated skill map categorizing technical, tools, databases, and soft skills.
- Multi-tier evidence verification model (Self-Reported < CV-Extracted < Project Evidence < Assessment Evidence).
- Skill detail drawer showing source evidence history and date logged.

### FR-3: Smart CV Analyzer
- Parsing of PDF and DOCX files.
- Heuristic NLP extraction of candidate skills, education, projects, and work experience.
- Target role comparison against 12 predefined industry profiles.
- Actionable feedback on missing keywords, bullet point strength, and formatting improvements.

### FR-4: Career Advisor & Skill Gap Analysis
- 12 comprehensive career profiles (Full-Stack, AI/ML, DevOps, Cybersecurity, Data Science, etc.).
- Transparent matching calculation: Required Skills vs Demonstrated Evidence.
- Visual breakdown of:
  - Strong Evidence Skills
  - Partial Evidence Skills
  - Missing Critical Skills
- One-click learning path generation from identified gaps.

### FR-5: Personalized Learning Roadmap
- Automated milestone and task generation tailored to weekly study availability.
- Curated resource links for each gap skill (documentation, tutorials, open-source projects).
- Real-time progress tracking (mark complete/incomplete, reschedule).

### FR-6: Lecture Intelligence Workspace
- Processing of transcripts and notes into structured summaries.
- Key concepts extraction with bullet points and actionable study takeaways.
- Generation of interactive study flashcards and multi-choice quizzes.

### FR-7: Opportunity Intelligence
- Searchable and filterable database of internships, scholarships, hackathons.
- Specific focus on Sri Lankan opportunities alongside global remote roles.
- Application tracking pipeline (Saved -> Applied -> Interviewing -> Offered).

### FR-8: Career Future Simulator
- Interactive "What-If" sandbox allowing students to simulate learning new technologies and observe direct impact on career readiness scores.

### FR-9: Professional Portfolio Builder
- Automatic generation of public-facing student profile highlighting verified skills, projects, and GitHub links.
- Privacy toggle with private-by-default behavior.

## 4. Non-Functional Requirements
- **Performance**: Sub-200ms API response time for typical CRUD queries.
- **Design Quality**: Light-first UI (#F7F8FA background, #2448A5 brand blue, #172033 primary navy text). WCAG 2.2 AA accessibility target.
- **Security**: OWASP compliant, bcrypt password hashing, file upload sanitization, SQL injection prevention via ORM.
- **Reliability**: Deterministic algorithms for career matching; zero fabricated AI hallucinations.
