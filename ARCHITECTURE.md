# FuturePath AI — System Architecture Document

## 1. System Overview
FuturePath AI is a career intelligence and personalized learning platform for higher education students. The application bridges academic learning and industrial employment requirements by providing transparent, evidence-based skill evaluation, CV gap analysis, lecture intelligence, and personalized learning roadmaps.

## 2. High-Level Architecture
The system follows a clean modular monolith architecture composed of two primary tiers:
- **Client Tier (Frontend)**: Next.js 15+ App Router application written in TypeScript with Tailwind CSS and Lucide icons.
- **Service Tier (Backend)**: Python FastAPI application handling business logic, document extraction, algorithm evaluations, and relational persistence.

```
                    +------------------------------------+
                    |        Client Layer (Next.js)      |
                    |  - Responsive Public Landing       |
                    |  - Authenticated Dashboard Shell   |
                    |  - Client State & Form Validation  |
                    +-----------------+------------------+
                                      |
                           HTTPS REST / JSON API
                                      |
                    +-----------------v------------------+
                    |        Backend Layer (FastAPI)     |
                    |  - JWT Authentication & RBAC       |
                    |  - CV Extraction Engine (NLP/Docx) |
                    |  - Career Skill Gap Matching Engine|
                    |  - Roadmap Scheduling Generator    |
                    |  - Lecture Workspace Processor     |
                    +-----------------+------------------+
                                      |
                      SQLAlchemy ORM (Async & Sync)
                                      |
                    +-----------------v------------------+
                    |        Data Layer (SQL / File)     |
                    |  - SQLite (Local Dev Zero-Setup)   |
                    |  - PostgreSQL (Production-Ready)   |
                    |  - Secure Document File Storage    |
                    +------------------------------------+
```

## 3. Technology Stack

### 3.1 Frontend
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (Strict Mode enabled)
- **Styling**: Tailwind CSS with custom design tokens matching product specification:
  - Background: `#F7F8FA`
  - Cards & Surfaces: `#FFFFFF`
  - Text Primary: `#172033`
  - Text Secondary: `#64748B`
  - Primary Brand: `#2448A5`
  - Secondary Accent: `#4776D0`
  - Border: `#E5E9F0`
- **Iconography**: Lucide React
- **Data Visualization**: Recharts for skill gap radar and progress metrics.

### 3.2 Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM & Migrations**: SQLAlchemy 2.0+ & Alembic
- **Validation**: Pydantic v2
- **Document Processing**: `pypdf`, `python-docx` for document parsing; heuristic NLP tokenizers for skill extraction
- **Authentication**: OAuth2 Password Flow with JWT (`python-jose`) and `passlib[bcrypt]`

### 3.3 Storage
- **Primary Database**: Dual engine support — SQLite for frictionless local developer experience, PostgreSQL with connection pooling for staging/production.
- **Uploads**: Local sandboxed storage (`backend/uploads/`) with hashed filenames and path traversal protections.
