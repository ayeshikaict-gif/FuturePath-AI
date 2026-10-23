from datetime import datetime
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import User, LearningRoadmap, RoadmapTask, CareerProfile, SkillEvidence
from app.services.gap_analyzer import analyze_career_gap
from app.services.roadmap_generator import generate_roadmap_plan
from app.schemas.schemas import TaskToggleUpdate
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/active")
def get_active_roadmap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    roadmap = db.query(LearningRoadmap).filter(
        LearningRoadmap.user_id == current_user.id,
        LearningRoadmap.is_active == True
    ).order_by(LearningRoadmap.updated_at.desc()).first()

    if not roadmap:
        return {"active": False, "message": "No active roadmap found. Please generate one."}

    tasks = db.query(RoadmapTask).filter(
        RoadmapTask.roadmap_id == roadmap.id
    ).order_by(RoadmapTask.order_index).all()

    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.is_completed)
    progress_pct = round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0.0

    tasks_out = []
    for t in tasks:
        tasks_out.append({
            "id": t.id,
            "phase_number": t.phase_number,
            "phase_title": t.phase_title,
            "title": t.title,
            "description": t.description,
            "skill_name": t.skill_name,
            "estimated_hours": t.estimated_hours,
            "resource_url": t.resource_url,
            "resource_title": t.resource_title,
            "is_completed": t.is_completed,
            "completed_at": t.completed_at.isoformat() if t.completed_at else None,
            "order_index": t.order_index
        })

    return {
        "active": True,
        "id": roadmap.id,
        "career_slug": roadmap.career_slug,
        "title": roadmap.title,
        "total_milestones": roadmap.total_milestones,
        "completed_milestones": roadmap.completed_milestones,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "progress_percentage": progress_pct,
        "tasks": tasks_out
    }

@router.post("/generate")
def generate_roadmap(
    career_slug: str = "full-stack-developer",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    # 1. Fetch career and student evidence
    career = db.query(CareerProfile).filter(CareerProfile.slug == career_slug).first()
    if not career:
        career = db.query(CareerProfile).first()
        career_slug = career.slug if career else "full-stack-developer"

    evidence_records = db.query(SkillEvidence).filter(
        SkillEvidence.user_id == current_user.id
    ).all()

    gap_analysis = analyze_career_gap(career, evidence_records)
    missing = gap_analysis["missing_skills"]
    partial = gap_analysis["partial_evidence_skills"]

    weekly_hours = 10
    if current_user.profile and current_user.profile.weekly_study_hours:
        weekly_hours = current_user.profile.weekly_study_hours

    plan = generate_roadmap_plan(career_slug, career.title, missing, partial, weekly_hours)

    # 2. Deactivate previous active roadmaps
    db.query(LearningRoadmap).filter(
        LearningRoadmap.user_id == current_user.id
    ).update({"is_active": False})

    # 3. Create new roadmap
    new_roadmap = LearningRoadmap(
        user_id=current_user.id,
        career_slug=career_slug,
        title=plan["title"],
        total_milestones=plan["total_milestones"],
        completed_milestones=0,
        is_active=True
    )
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)

    # 4. Insert tasks
    for t_data in plan["tasks"]:
        task = RoadmapTask(
            roadmap_id=new_roadmap.id,
            phase_number=t_data["phase_number"],
            phase_title=t_data["phase_title"],
            title=t_data["title"],
            description=t_data["description"],
            skill_name=t_data["skill_name"],
            estimated_hours=t_data["estimated_hours"],
            resource_url=t_data["resource_url"],
            resource_title=t_data["resource_title"],
            is_completed=False,
            order_index=t_data["order_index"]
        )
        db.add(task)
    db.commit()

    return {"message": "New learning roadmap generated successfully", "roadmap_id": new_roadmap.id}

@router.patch("/tasks/{task_id}")
def toggle_task(
    task_id: int,
    toggle_in: TaskToggleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    task = db.query(RoadmapTask).join(LearningRoadmap).filter(
        RoadmapTask.id == task_id,
        LearningRoadmap.user_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or not owned by current student."
        )

    task.is_completed = toggle_in.is_completed
    task.completed_at = datetime.utcnow() if toggle_in.is_completed else None
    
    # Recalculate completed milestones
    roadmap = task.roadmap
    roadmap_tasks = db.query(RoadmapTask).filter(RoadmapTask.roadmap_id == roadmap.id).all()
    # If all tasks in a phase are complete, that phase/milestone is complete
    phases = {}
    for t in roadmap_tasks:
        if t.phase_number not in phases:
            phases[t.phase_number] = []
        phases[t.phase_number].append(t.is_completed)
        
    completed_milestones = sum(1 for p_num, completions in phases.items() if all(completions))
    roadmap.completed_milestones = completed_milestones
    roadmap.updated_at = datetime.utcnow()

    db.commit()

    return {
        "message": f"Task marked {'completed' if task.is_completed else 'pending'}",
        "task_id": task.id,
        "is_completed": task.is_completed,
        "completed_milestones": completed_milestones
    }
