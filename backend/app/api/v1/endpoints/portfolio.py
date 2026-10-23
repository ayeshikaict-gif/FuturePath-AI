from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import User, StudentProfile, SkillEvidence, CareerProfile, CVDocument
from app.services.gap_analyzer import analyze_career_gap
from app.api.deps import get_current_user

router = APIRouter()

@router.get("")
def get_my_portfolio(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    profile = current_user.profile
    evidence_records = db.query(SkillEvidence).filter(
        SkillEvidence.user_id == current_user.id
    ).all()

    # Find target career
    career_slug = profile.target_career_slug if profile else "full-stack-developer"
    career = db.query(CareerProfile).filter(CareerProfile.slug == career_slug).first()
    
    match_score = 0.0
    if career:
        match_res = analyze_career_gap(career, evidence_records)
        match_score = match_res["match_score"]

    # Gather verified skills
    verified_skills = []
    projects = []
    for ev in evidence_records:
        verified_skills.append({
            "name": ev.skill.name,
            "category": ev.skill.category,
            "proficiency": ev.proficiency_level,
            "evidence_type": ev.evidence_type,
            "source": ev.source_title,
            "verified": ev.verified
        })
        if ev.evidence_type == "project_evidence":
            projects.append({
                "title": ev.source_title,
                "skill": ev.skill.name,
                "url": ev.source_url,
                "notes": ev.notes
            })

    # Also pull projects extracted from latest CV if available
    latest_cv = db.query(CVDocument).filter(CVDocument.user_id == current_user.id).order_by(CVDocument.uploaded_at.desc()).first()
    cv_projects = []
    if latest_cv and latest_cv.analyses:
        cv_projects = latest_cv.analyses[-1].extracted_projects or []

    return {
        "full_name": current_user.full_name,
        "email": current_user.email,
        "institution": profile.institution if profile else "",
        "degree": profile.degree if profile else "",
        "academic_year": profile.academic_year if profile else 1,
        "bio": profile.bio if profile else "",
        "github_url": profile.github_url if profile else "",
        "linkedin_url": profile.linkedin_url if profile else "",
        "is_published": profile.portfolio_published if profile else False,
        "target_career_title": career.title if career else "Software Engineering",
        "readiness_score": match_score,
        "verified_skills": verified_skills,
        "projects": projects,
        "cv_projects": cv_projects
    }

@router.post("/publish")
def toggle_portfolio_published(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    profile = current_user.profile
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    profile.portfolio_published = not profile.portfolio_published
    db.commit()

    return {
        "is_published": profile.portfolio_published,
        "message": f"Portfolio is now {'public' if profile.portfolio_published else 'private'}."
    }

@router.get("/public/{user_id}")
def get_public_portfolio(
    user_id: int,
    db: Session = Depends(get_db)
) -> Any:
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user or not user.profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student portfolio not found.")

    profile = user.profile
    if not profile.portfolio_published:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This portfolio has not been published by the student."
        )

    evidence_records = db.query(SkillEvidence).filter(
        SkillEvidence.user_id == user.id,
        SkillEvidence.verified == True
    ).all()

    career_slug = profile.target_career_slug or "full-stack-developer"
    career = db.query(CareerProfile).filter(CareerProfile.slug == career_slug).first()

    match_score = 0.0
    if career:
        match_res = analyze_career_gap(career, evidence_records)
        match_score = match_res["match_score"]

    skills = [{"name": ev.skill.name, "category": ev.skill.category, "proficiency": ev.proficiency_level} for ev in evidence_records]
    projects = [
        {"title": ev.source_title, "skill": ev.skill.name, "url": ev.source_url, "notes": ev.notes}
        for ev in evidence_records if ev.evidence_type == "project_evidence"
    ]

    return {
        "full_name": user.full_name,
        "institution": profile.institution,
        "degree": profile.degree,
        "academic_year": profile.academic_year,
        "bio": profile.bio,
        "github_url": profile.github_url,
        "linkedin_url": profile.linkedin_url,
        "target_career_title": career.title if career else "Software Engineering",
        "readiness_score": match_score,
        "skills": skills,
        "projects": projects
    }
