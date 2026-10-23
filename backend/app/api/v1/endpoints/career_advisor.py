from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import User, CareerProfile, SkillEvidence, StudentProfile
from app.services.gap_analyzer import analyze_career_gap
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/profiles")
def get_career_profiles(db: Session = Depends(get_db)) -> Any:
    careers = db.query(CareerProfile).all()
    results = []
    for c in careers:
        reqs = []
        for r in c.requirements:
            reqs.append({
                "skill_id": r.skill.id,
                "skill_name": r.skill.name,
                "category": r.skill.category,
                "importance": r.importance,
                "minimum_level": r.minimum_level,
                "weight": r.weight
            })
        results.append({
            "id": c.id,
            "slug": c.slug,
            "title": c.title,
            "description": c.description,
            "market_demand": c.market_demand,
            "average_starting_salary": c.average_starting_salary,
            "icon_name": c.icon_name,
            "requirements": reqs
        })
    return results

@router.get("/profiles/{slug}")
def get_career_profile(slug: str, db: Session = Depends(get_db)) -> Any:
    career = db.query(CareerProfile).filter(CareerProfile.slug == slug).first()
    if not career:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Career profile '{slug}' not found."
        )

    reqs = []
    for r in career.requirements:
        reqs.append({
            "skill_id": r.skill.id,
            "skill_name": r.skill.name,
            "category": r.skill.category,
            "importance": r.importance,
            "minimum_level": r.minimum_level,
            "weight": r.weight
        })

    return {
        "id": career.id,
        "slug": career.slug,
        "title": career.title,
        "description": career.description,
        "market_demand": career.market_demand,
        "average_starting_salary": career.average_starting_salary,
        "icon_name": career.icon_name,
        "requirements": reqs
    }

@router.get("/match/{slug}")
def match_career_gap(
    slug: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    career = db.query(CareerProfile).filter(CareerProfile.slug == slug).first()
    if not career:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Career profile '{slug}' not found."
        )

    evidence_records = db.query(SkillEvidence).filter(
        SkillEvidence.user_id == current_user.id
    ).all()

    return analyze_career_gap(career, evidence_records)

@router.post("/set-goal")
def set_career_goal(
    goal_data: dict[str, str],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    target_slug = goal_data.get("career_slug")
    career = db.query(CareerProfile).filter(CareerProfile.slug == target_slug).first()
    if not career:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Career profile '{target_slug}' not found."
        )

    profile = current_user.profile
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    profile.target_career_slug = target_slug
    db.commit()

    return {"message": f"Career goal updated to {career.title}", "target_career_slug": target_slug}
