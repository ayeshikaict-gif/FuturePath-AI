from datetime import datetime
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import User, Skill, SkillEvidence, AuditEvent
from app.schemas.schemas import SkillEvidenceCreate, SkillEvidenceResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.get("")
def get_digital_twin(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    evidence_records = db.query(SkillEvidence).filter(
        SkillEvidence.user_id == current_user.id
    ).all()

    # Group evidence by category
    categories: dict[str, list[dict[str, Any]]] = {
        "languages": [],
        "frameworks": [],
        "databases": [],
        "cloud_devops": [],
        "fundamentals": [],
        "soft_skills": []
    }

    # Track evidence type breakdown
    evidence_counts = {
        "self_reported": 0,
        "cv_extracted": 0,
        "project_evidence": 0,
        "assessment_evidence": 0,
        "course_completed": 0
    }

    unique_skills = set()
    verified_skills_count = 0

    items_out = []
    for ev in evidence_records:
        skill = ev.skill
        unique_skills.add(skill.name)
        if ev.verified or ev.evidence_type in ["project_evidence", "assessment_evidence", "cv_extracted"]:
            verified_skills_count += 1
            
        ev_type = ev.evidence_type
        if ev_type in evidence_counts:
            evidence_counts[ev_type] += 1
            
        item = {
            "id": ev.id,
            "skill_id": skill.id,
            "skill_name": skill.name,
            "category": skill.category,
            "evidence_type": ev.evidence_type,
            "proficiency_level": ev.proficiency_level,
            "source_title": ev.source_title,
            "source_url": ev.source_url,
            "verified": ev.verified,
            "notes": ev.notes,
            "created_at": ev.created_at.isoformat() if ev.created_at else None
        }
        items_out.append(item)
        
        cat = skill.category if skill.category in categories else "fundamentals"
        categories[cat].append(item)

    return {
        "total_skills": len(unique_skills),
        "verified_evidence_count": verified_skills_count,
        "evidence_type_breakdown": evidence_counts,
        "categories": categories,
        "all_records": items_out
    }

@router.get("/skills")
def list_all_skills(db: Session = Depends(get_db)) -> Any:
    skills = db.query(Skill).order_by(Skill.name).all()
    return [{"id": s.id, "name": s.name, "category": s.category, "description": s.description} for s in skills]

@router.post("/evidence")
def add_skill_evidence(
    ev_in: SkillEvidenceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    # Find or create skill
    skill = db.query(Skill).filter(Skill.name == ev_in.skill_name.strip()).first()
    if not skill:
        skill = Skill(name=ev_in.skill_name.strip(), category="fundamentals")
        db.add(skill)
        db.commit()
        db.refresh(skill)

    evidence = SkillEvidence(
        user_id=current_user.id,
        skill_id=skill.id,
        evidence_type=ev_in.evidence_type,
        proficiency_level=ev_in.proficiency_level,
        source_title=ev_in.source_title,
        source_url=ev_in.source_url or "",
        verified=True if ev_in.evidence_type in ["project_evidence", "assessment_evidence"] else False,
        verified_at=datetime.utcnow() if ev_in.evidence_type in ["project_evidence", "assessment_evidence"] else None,
        notes=ev_in.notes or ""
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)

    return {
        "message": "Skill evidence added successfully",
        "evidence_id": evidence.id
    }

@router.delete("/evidence/{evidence_id}")
def delete_skill_evidence(
    evidence_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    evidence = db.query(SkillEvidence).filter(
        SkillEvidence.id == evidence_id,
        SkillEvidence.user_id == current_user.id
    ).first()

    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence record not found or not owned by current student."
        )

    db.delete(evidence)
    db.commit()
    return {"message": "Evidence record removed successfully."}
