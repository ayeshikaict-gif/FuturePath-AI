# FuturePath AI — Verification & Testing Strategy

## 1. Testing Philosophy
Every claim of functionality in FuturePath AI must be backed by executed tests. We do not simulate or fake test passes.

## 2. Test Pyramid
- **Unit Tests**:
  - Algorithmic gap calculation logic (`test_gap_analyzer.py`)
  - Skill taxonomy normalization and extraction (`test_cv_extractor.py`)
  - Roadmap scheduling mathematics (`test_roadmap_generator.py`)
  - Password hashing and token validation (`test_security.py`)
- **API Integration Tests**:
  - Authentication lifecycle: Register -> Login -> Me -> Update Profile (`test_auth_api.py`)
  - Digital Twin skill and evidence mutations (`test_digital_twin_api.py`)
  - Career gap matching endpoints (`test_career_advisor_api.py`)
  - CV upload, analysis, and report generation (`test_cv_api.py`)
  - Roadmap task toggles and progress recalculation (`test_roadmap_api.py`)
  - Opportunity filtering, bookmarking, and application tracking (`test_opportunities_api.py`)
  - Portfolio privacy controls (`test_portfolio_api.py`)
- **End-to-End User Journeys**:
  - Verified multi-step journey: Student registers -> completes onboarding -> uploads CV -> inspects skill gaps against "Full-Stack Developer" -> generates roadmap -> completes milestone task -> confirms dashboard update -> bookmarks Sri Lanka tech internship.

## 3. Running Backend Tests
```bash
cd backend
python -m pytest tests/ -v
```
