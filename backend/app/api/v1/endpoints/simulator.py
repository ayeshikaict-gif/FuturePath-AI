from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import User, CareerProfile, SkillEvidence
from app.schemas.schemas import SimulatorRequest, SimulatorResponse
from app.services.scenario_engine import simulate_skill_scenario
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/evaluate", response_model=SimulatorResponse)
def run_simulation(
    sim_in: SimulatorRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    career = db.query(CareerProfile).filter(CareerProfile.slug == sim_in.target_career_slug).first()
    if not career:
        career = db.query(CareerProfile).first()
        if not career:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No career profile found.")

    evidence_records = db.query(SkillEvidence).filter(
        SkillEvidence.user_id == current_user.id
    ).all()

    result = simulate_skill_scenario(career, evidence_records, sim_in.skills_to_add)
    return result
