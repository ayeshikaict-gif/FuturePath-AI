from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

# ----------------- Auth Schemas -----------------
class UserRegister(BaseModel):
    email: str = Field(..., pattern=EMAIL_REGEX)
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)

class UserLogin(BaseModel):
    email: str = Field(..., pattern=EMAIL_REGEX)
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict[str, Any]

class ProfileUpdate(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    academic_year: Optional[int] = None
    target_career_slug: Optional[str] = None
    weekly_study_hours: Optional[int] = None
    bio: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_published: Optional[bool] = None
    onboarding_completed: Optional[bool] = None

class OnboardingSubmit(BaseModel):
    institution: str
    degree: str
    academic_year: int
    target_career_slug: str
    weekly_study_hours: int = 10
    existing_skills: list[str] = []

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    profile: Optional[dict[str, Any]] = None
    created_at: datetime

# ----------------- Skill & Evidence Schemas -----------------
class SkillBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category: str
    description: str

class SkillEvidenceCreate(BaseModel):
    skill_name: str
    evidence_type: str = "self_reported"
    proficiency_level: str = "intermediate"
    source_title: str
    source_url: Optional[str] = ""
    notes: Optional[str] = ""

class SkillEvidenceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    skill_id: int
    skill_name: str
    category: str
    evidence_type: str
    proficiency_level: str
    source_title: str
    source_url: str
    verified: bool
    verified_at: Optional[datetime]
    notes: str
    created_at: datetime

# ----------------- Career Advisor Schemas -----------------
class CareerRequirementOut(BaseModel):
    skill_id: int
    skill_name: str
    category: str
    importance: str
    minimum_level: str
    weight: float

class CareerProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    description: str
    market_demand: str
    average_starting_salary: str
    icon_name: str
    requirements: list[CareerRequirementOut] = []

class CareerMatchResult(BaseModel):
    career_slug: str
    career_title: str
    match_score: float
    total_required_skills: int
    demonstrated_skills_count: int
    strong_evidence_skills: list[dict[str, Any]]
    partial_evidence_skills: list[dict[str, Any]]
    missing_skills: list[dict[str, Any]]
    readiness_level: str
    explanation: str

# ----------------- CV Schemas -----------------
class CVAnalysisOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    target_career_slug: str
    match_score: float
    extracted_skills: list[str]
    extracted_education: list[str]
    extracted_experience: list[str]
    extracted_projects: list[str]
    missing_critical_skills: list[str]
    strengths: list[str]
    improvement_feedback: list[str]
    created_at: datetime

class CVDocumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    filename: str
    file_size: int
    uploaded_at: datetime
    latest_analysis: Optional[CVAnalysisOut] = None

# ----------------- Roadmap Schemas -----------------
class RoadmapTaskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    phase_number: int
    phase_title: str
    title: str
    description: str
    skill_name: str
    estimated_hours: int
    resource_url: str
    resource_title: str
    is_completed: bool
    completed_at: Optional[datetime] = None
    order_index: int

class LearningRoadmapOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    career_slug: str
    title: str
    total_milestones: int
    completed_milestones: int
    is_active: bool
    tasks: list[RoadmapTaskOut] = []
    progress_percentage: float = 0.0

class TaskToggleUpdate(BaseModel):
    is_completed: bool

# ----------------- Lecture Schemas -----------------
class LectureUpload(BaseModel):
    title: str
    subject: str = ""
    raw_content: str

class QuizCardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    card_type: str
    question: str
    options: list[str]
    correct_answer: str
    explanation: str

class LectureSummaryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    summary_text: str
    key_concepts: list[dict[str, str]]
    action_items: list[str]
    relevant_skills: list[str]

class LectureOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    subject: str
    created_at: datetime
    summary: Optional[LectureSummaryOut] = None
    quiz_cards: list[QuizCardOut] = []

# ----------------- Opportunity Schemas -----------------
class OpportunityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    organization: str
    opportunity_type: str
    location: str
    is_sri_lanka: bool
    deadline: str
    url: str
    eligibility: str
    description: str
    tags: list[str]
    is_active: bool
    last_verified: str
    is_bookmarked: bool = False
    application_status: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: str = "applied"
    notes: Optional[str] = ""

# ----------------- Simulator Schemas -----------------
class SimulatorRequest(BaseModel):
    target_career_slug: str
    skills_to_add: list[str]

class SimulatorResponse(BaseModel):
    career_slug: str
    career_title: str
    baseline_match_score: float
    simulated_match_score: float
    score_delta: float
    newly_covered_skills: list[str]
    remaining_gaps: list[str]
    estimated_study_hours: int
    explanation: str

# ----------------- Portfolio Schemas -----------------
class PortfolioOut(BaseModel):
    full_name: str
    institution: str
    degree: str
    academic_year: int
    bio: str
    github_url: str
    linkedin_url: str
    is_published: bool
    target_career_title: str
    readiness_score: float
    verified_skills: list[dict[str, Any]]
    projects: list[dict[str, Any]]
