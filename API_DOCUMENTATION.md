# FuturePath AI — REST API Documentation

Base URL: `/api/v1`

## 1. Authentication & User Profile
- `POST /api/v1/auth/register`: Register new student account (`email`, `password`, `full_name`).
- `POST /api/v1/auth/login`: Authenticate and obtain JWT bearer token.
- `GET /api/v1/auth/me`: Retrieve current authenticated student profile.
- `PUT /api/v1/auth/profile`: Update university, degree, study hours, links, and onboarding state.
- `DELETE /api/v1/auth/account`: Delete student account and all associated data.

## 2. Digital Twin & Skills
- `GET /api/v1/digital-twin`: Get aggregated student skills, evidence counts, category distributions, and readiness indicators.
- `GET /api/v1/digital-twin/skills`: List all normalized skills.
- `POST /api/v1/digital-twin/evidence`: Add new skill evidence (`skill_name`, `evidence_type`, `proficiency_level`, `source_title`, `source_url`, `notes`).
- `DELETE /api/v1/digital-twin/evidence/{evidence_id}`: Remove a recorded evidence item.

## 3. Career Advisor & Skill Gap
- `GET /api/v1/career-advisor/profiles`: List all 12 supported career profiles with demand and overview.
- `GET /api/v1/career-advisor/profiles/{slug}`: Get specific career profile and required skills with weights.
- `GET /api/v1/career-advisor/match/{slug}`: Perform explainable skill gap analysis between student's evidence and target role requirements.
- `POST /api/v1/career-advisor/set-goal`: Set active career goal for current student.

## 4. Smart CV Analyzer
- `POST /api/v1/cv/upload`: Securely upload and parse CV document (PDF, DOCX, TXT).
- `GET /api/v1/cv/list`: List student's uploaded CV documents.
- `POST /api/v1/cv/analyze`: Run role-specific evaluation of parsed CV against selected career profile.
- `GET /api/v1/cv/analyses/{id}`: Retrieve detailed analysis results with recommendations.

## 5. Learning Roadmap
- `POST /api/v1/roadmap/generate`: Algorithmic generation of phased milestones from target career skill gaps.
- `GET /api/v1/roadmap/active`: Retrieve current student's active roadmap with tasks.
- `PATCH /api/v1/roadmap/tasks/{task_id}`: Toggle task completion status (`is_completed`).
- `PUT /api/v1/roadmap/tasks/{task_id}`: Update task details or schedule order.

## 6. Lecture Intelligence
- `POST /api/v1/lectures/upload`: Submit lecture notes or transcript text.
- `GET /api/v1/lectures`: List processed lectures.
- `GET /api/v1/lectures/{id}`: Get structured lecture summary, key concepts, action items, and quiz cards.

## 7. Opportunity Intelligence
- `GET /api/v1/opportunities`: Search and filter opportunities (by type, location, tags, query).
- `POST /api/v1/opportunities/{id}/bookmark`: Bookmark or unbookmark an opportunity.
- `POST /api/v1/opportunities/{id}/apply`: Record and update application status (Applied, Interviewing, Offered).
- `GET /api/v1/opportunities/my-tracker`: Get student's bookmarked and active applications.

## 8. Career Future Simulator
- `POST /api/v1/simulator/evaluate`: Evaluate simulated additions of 1 to 5 skills against target career profiles and compute delta coverage.

## 9. Portfolio Builder & Public Showcase
- `GET /api/v1/portfolio`: Retrieve compiled portfolio data.
- `PUT /api/v1/portfolio`: Update portfolio settings, custom bio, featured projects.
- `POST /api/v1/portfolio/publish`: Toggle public portfolio publication status.
- `GET /api/v1/portfolio/public/{username}`: Public read-only endpoint for external viewers/employers.

## 10. Dashboard Overview
- `GET /api/v1/dashboard/summary`: High-level aggregated statistics (verified skills, roadmap progress, goal match percentage, upcoming tasks, saved opportunities).
