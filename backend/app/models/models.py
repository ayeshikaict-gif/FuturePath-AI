from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, Enum as SQLEnum, JSON
)
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="student")
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    verification_code = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    skill_evidence = relationship("SkillEvidence", back_populates="user", cascade="all, delete-orphan")
    cv_documents = relationship("CVDocument", back_populates="user", cascade="all, delete-orphan")
    roadmaps = relationship("LearningRoadmap", back_populates="user", cascade="all, delete-orphan")
    lectures = relationship("Lecture", back_populates="user", cascade="all, delete-orphan")
    bookmarks = relationship("OpportunityBookmark", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("OpportunityApplication", back_populates="user", cascade="all, delete-orphan")
    audit_events = relationship("AuditEvent", back_populates="user", cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    institution = Column(String, default="")
    degree = Column(String, default="")
    academic_year = Column(Integer, default=1)
    target_career_slug = Column(String, default="full-stack-developer")
    weekly_study_hours = Column(Integer, default=10)
    bio = Column(Text, default="")
    github_url = Column(String, default="")
    linkedin_url = Column(String, default="")
    portfolio_published = Column(Boolean, default=False)
    onboarding_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=False)  # languages, frameworks, databases, cloud_devops, fundamentals, soft_skills
    description = Column(Text, default="")

    evidence_records = relationship("SkillEvidence", back_populates="skill")
    career_requirements = relationship("CareerRequirement", back_populates="skill")


class SkillEvidence(Base):
    __tablename__ = "skill_evidence"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    evidence_type = Column(String, nullable=False)  # self_reported, cv_extracted, project_evidence, assessment_evidence, course_completed
    proficiency_level = Column(String, default="intermediate")  # beginner, intermediate, advanced, expert
    source_title = Column(String, nullable=False)
    source_url = Column(String, default="")
    verified = Column(Boolean, default=False)
    verified_at = Column(DateTime, nullable=True)
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="skill_evidence")
    skill = relationship("Skill", back_populates="evidence_records")


class CareerProfile(Base):
    __tablename__ = "career_profiles"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    market_demand = Column(String, default="High")  # Moderate, High, Very High
    average_starting_salary = Column(String, default="")
    icon_name = Column(String, default="Briefcase")

    requirements = relationship("CareerRequirement", back_populates="career", cascade="all, delete-orphan")


class CareerRequirement(Base):
    __tablename__ = "career_requirements"

    id = Column(Integer, primary_key=True, index=True)
    career_id = Column(Integer, ForeignKey("career_profiles.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    importance = Column(String, default="required")  # required, preferred, bonus
    minimum_level = Column(String, default="intermediate")  # beginner, intermediate, advanced
    weight = Column(Float, default=2.0)

    career = relationship("CareerProfile", back_populates="requirements")
    skill = relationship("Skill", back_populates="career_requirements")


class CVDocument(Base):
    __tablename__ = "cv_documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    raw_text = Column(Text, default="")
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cv_documents")
    analyses = relationship("CVAnalysis", back_populates="cv", cascade="all, delete-orphan")


class CVAnalysis(Base):
    __tablename__ = "cv_analyses"

    id = Column(Integer, primary_key=True, index=True)
    cv_id = Column(Integer, ForeignKey("cv_documents.id", ondelete="CASCADE"), nullable=False)
    target_career_slug = Column(String, nullable=False)
    extracted_skills = Column(JSON, default=list)  # list of skill names
    extracted_education = Column(JSON, default=list)
    extracted_experience = Column(JSON, default=list)
    extracted_projects = Column(JSON, default=list)
    match_score = Column(Float, default=0.0)
    missing_critical_skills = Column(JSON, default=list)
    strengths = Column(JSON, default=list)
    improvement_feedback = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    cv = relationship("CVDocument", back_populates="analyses")


class LearningRoadmap(Base):
    __tablename__ = "learning_roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    career_slug = Column(String, nullable=False)
    title = Column(String, nullable=False)
    total_milestones = Column(Integer, default=3)
    completed_milestones = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="roadmaps")
    tasks = relationship("RoadmapTask", back_populates="roadmap", cascade="all, delete-orphan", order_by="RoadmapTask.order_index")


class RoadmapTask(Base):
    __tablename__ = "roadmap_tasks"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("learning_roadmaps.id", ondelete="CASCADE"), nullable=False)
    phase_number = Column(Integer, default=1)
    phase_title = Column(String, default="")
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    skill_name = Column(String, nullable=False)
    estimated_hours = Column(Integer, default=10)
    resource_url = Column(String, default="")
    resource_title = Column(String, default="")
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    order_index = Column(Integer, default=0)

    roadmap = relationship("LearningRoadmap", back_populates="tasks")


class Lecture(Base):
    __tablename__ = "lectures"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    subject = Column(String, default="")
    raw_content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="lectures")
    summary = relationship("LectureSummary", back_populates="lecture", uselist=False, cascade="all, delete-orphan")
    quiz_cards = relationship("QuizCard", back_populates="lecture", cascade="all, delete-orphan")


class LectureSummary(Base):
    __tablename__ = "lecture_summaries"

    id = Column(Integer, primary_key=True, index=True)
    lecture_id = Column(Integer, ForeignKey("lectures.id", ondelete="CASCADE"), unique=True, nullable=False)
    summary_text = Column(Text, nullable=False)
    key_concepts = Column(JSON, default=list)  # list of {title, description}
    action_items = Column(JSON, default=list)  # list of strings
    relevant_skills = Column(JSON, default=list)  # list of matching skill names

    lecture = relationship("Lecture", back_populates="summary")


class QuizCard(Base):
    __tablename__ = "quiz_cards"

    id = Column(Integer, primary_key=True, index=True)
    lecture_id = Column(Integer, ForeignKey("lectures.id", ondelete="CASCADE"), nullable=False)
    card_type = Column(String, default="quiz")  # quiz, flashcard
    question = Column(Text, nullable=False)
    options = Column(JSON, default=list)  # 4 options for quiz
    correct_answer = Column(String, nullable=False)
    explanation = Column(Text, default="")

    lecture = relationship("Lecture", back_populates="quiz_cards")


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    opportunity_type = Column(String, nullable=False)  # Internship, Scholarship, Hackathon, Research, Workshop
    location = Column(String, default="Sri Lanka")  # Sri Lanka, Remote, Global
    is_sri_lanka = Column(Boolean, default=True)
    deadline = Column(String, nullable=False)
    url = Column(String, nullable=False)
    eligibility = Column(Text, default="")
    description = Column(Text, default="")
    tags = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    last_verified = Column(String, default="October 2026")
    created_at = Column(DateTime, default=datetime.utcnow)

    bookmarks = relationship("OpportunityBookmark", back_populates="opportunity", cascade="all, delete-orphan")
    applications = relationship("OpportunityApplication", back_populates="opportunity", cascade="all, delete-orphan")


class OpportunityBookmark(Base):
    __tablename__ = "opportunity_bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="bookmarks")
    opportunity = relationship("Opportunity", back_populates="bookmarks")


class OpportunityApplication(Base):
    __tablename__ = "opportunity_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, default="applied")  # applied, interviewing, offered, rejected
    notes = Column(Text, default="")
    applied_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="applications")
    opportunity = relationship("Opportunity", back_populates="applications")


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    event_type = Column(String, nullable=False)  # login, logout, cv_upload, roadmap_create, profile_update
    ip_address = Column(String, default="")
    details = Column(Text, default="")
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="audit_events")
