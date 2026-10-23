from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import (
    User, StudentProfile, SkillEvidence, CareerProfile,
    LearningRoadmap, RoadmapTask, OpportunityBookmark, Lecture
)
from app.services.gap_analyzer import analyze_career_gap
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    profile = current_user.profile
    career_slug = profile.target_career_slug if profile else "full-stack-developer"
    career = db.query(CareerProfile).filter(CareerProfile.slug == career_slug).first()
    if not career:
        career = db.query(CareerProfile).first()

    # 1. Evidence and Gap Analysis
    evidence_records = db.query(SkillEvidence).filter(
        SkillEvidence.user_id == current_user.id
    ).all()

    gap_data = analyze_career_gap(career, evidence_records) if career else {
        "match_score": 0.0,
        "strong_evidence_skills": [],
        "partial_evidence_skills": [],
        "missing_skills": []
    }

    # 2. Roadmap progress
    active_roadmap = db.query(LearningRoadmap).filter(
        LearningRoadmap.user_id == current_user.id,
        LearningRoadmap.is_active == True
    ).order_by(LearningRoadmap.updated_at.desc()).first()

    tasks = []
    completed_tasks = 0
    total_tasks = 0
    upcoming_tasks = []

    if active_roadmap:
        tasks = db.query(RoadmapTask).filter(RoadmapTask.roadmap_id == active_roadmap.id).order_by(RoadmapTask.order_index).all()
        total_tasks = len(tasks)
        completed_tasks = sum(1 for t in tasks if t.is_completed)
        pending = [t for t in tasks if not t.is_completed]
        upcoming_tasks = [
            {
                "id": t.id,
                "title": t.title,
                "skill_name": t.skill_name,
                "estimated_hours": t.estimated_hours,
                "phase_title": t.phase_title,
                "resource_url": t.resource_url,
                "resource_title": t.resource_title
            } for t in pending[:3]
        ]

    roadmap_progress_pct = round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0.0

    # 3. Bookmarked opportunities
    bookmarks = db.query(OpportunityBookmark).filter(
        OpportunityBookmark.user_id == current_user.id
    ).all()

    saved_opps = [
        {
            "id": b.opportunity.id,
            "title": b.opportunity.title,
            "organization": b.opportunity.organization,
            "deadline": b.opportunity.deadline,
            "location": b.opportunity.location,
            "opportunity_type": b.opportunity.opportunity_type,
            "url": b.opportunity.url
        } for b in bookmarks[:4]
    ]

    # 4. Lecture count
    lecture_count = db.query(Lecture).filter(Lecture.user_id == current_user.id).count()

    # 5. Deterministic next action recommendation
    if not profile or not profile.onboarding_completed:
        next_action = {
            "title": "Complete Your Student Onboarding",
            "description": "Specify your university, degree, and weekly study hours to personalize recommendations.",
            "link": "/dashboard/settings",
            "action_label": "Finish Onboarding"
        }
    elif not current_user.cv_documents:
        next_action = {
            "title": "Upload Your CV for Intelligent Extraction",
            "description": "Extract your verified projects and experience to automatically map against your career goals.",
            "link": "/dashboard/cv-analyzer",
            "action_label": "Upload CV"
        }
    elif gap_data["missing_skills"]:
        top_missing = gap_data["missing_skills"][0]["skill_name"]
        next_action = {
            "title": f"Bridge Priority Skill Gap: {top_missing}",
            "description": f"Targeting '{top_missing}' will provide the greatest score increase toward {career.title}.",
            "link": "/dashboard/roadmap",
            "action_label": "View Learning Tasks"
        }
    else:
        next_action = {
            "title": "Publish Your Professional Portfolio",
            "description": "Share your verified competencies and project demonstrations with prospective recruiters.",
            "link": "/dashboard/portfolio",
            "action_label": "Manage Portfolio"
        }

    return {
        "student_name": current_user.full_name,
        "target_career": {
            "slug": career.slug if career else "full-stack-developer",
            "title": career.title if career else "Software Engineering",
            "readiness_score": gap_data["match_score"],
            "readiness_level": gap_data.get("readiness_level", "Developing Readiness")
        },
        "skills_summary": {
            "total_skills": len(evidence_records),
            "strong_evidence_count": len(gap_data.get("strong_evidence_skills", [])),
            "partial_evidence_count": len(gap_data.get("partial_evidence_skills", [])),
            "missing_skills_count": len(gap_data.get("missing_skills", []))
        },
        "roadmap_summary": {
            "has_roadmap": active_roadmap is not None,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "progress_percentage": roadmap_progress_pct,
            "upcoming_tasks": upcoming_tasks
        },
        "opportunities_summary": {
            "saved_count": len(bookmarks),
            "saved_opportunities": saved_opps
        },
        "lectures_summary": {
            "total_processed": lecture_count
        },
        "recommended_action": next_action
    }
