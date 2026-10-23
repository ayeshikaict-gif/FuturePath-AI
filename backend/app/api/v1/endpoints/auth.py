from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.models import User, StudentProfile, Skill, SkillEvidence, AuditEvent
from app.schemas.schemas import UserRegister, UserLogin, Token, UserResponse, ProfileUpdate, OnboardingSubmit
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)) -> Any:
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    user = User(
        email=user_in.email.lower(),
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role="student",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Automatically create associated student profile
    profile = StudentProfile(
        user_id=user.id,
        target_career_slug="full-stack-developer",
        onboarding_completed=False
    )
    db.add(profile)
    
    # Audit log
    audit = AuditEvent(user_id=user.id, event_type="register", details="New student registration")
    db.add(audit)
    db.commit()

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "onboarding_completed": False
        }
    }

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)) -> Any:
    user = db.query(User).filter(User.email == login_in.email.lower()).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive."
        )

    # Log audit event
    audit = AuditEvent(user_id=user.id, event_type="login", details="Successful login")
    db.add(audit)
    db.commit()

    token = create_access_token({"sub": str(user.id), "email": user.email})
    profile = user.profile

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "target_career_slug": profile.target_career_slug if profile else "full-stack-developer",
            "onboarding_completed": profile.onboarding_completed if profile else False
        }
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)) -> Any:
    profile = current_user.profile
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "profile": {
            "institution": profile.institution if profile else "",
            "degree": profile.degree if profile else "",
            "academic_year": profile.academic_year if profile else 1,
            "target_career_slug": profile.target_career_slug if profile else "full-stack-developer",
            "weekly_study_hours": profile.weekly_study_hours if profile else 10,
            "bio": profile.bio if profile else "",
            "github_url": profile.github_url if profile else "",
            "linkedin_url": profile.linkedin_url if profile else "",
            "portfolio_published": profile.portfolio_published if profile else False,
            "onboarding_completed": profile.onboarding_completed if profile else False,
        }
    }

@router.put("/profile")
def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    profile = current_user.profile
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    update_data = profile_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)

    return {"message": "Profile updated successfully", "profile": profile}

@router.post("/onboarding")
def complete_onboarding(
    onboarding_in: OnboardingSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    profile = current_user.profile
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    profile.institution = onboarding_in.institution
    profile.degree = onboarding_in.degree
    profile.academic_year = onboarding_in.academic_year
    profile.target_career_slug = onboarding_in.target_career_slug
    profile.weekly_study_hours = onboarding_in.weekly_study_hours
    profile.onboarding_completed = True

    # Seed self-reported skills from onboarding
    for skill_name in onboarding_in.existing_skills:
        skill = db.query(Skill).filter(Skill.name == skill_name).first()
        if not skill:
            skill = Skill(name=skill_name, category="fundamentals")
            db.add(skill)
            db.commit()
            db.refresh(skill)

        # Check existing evidence
        existing_ev = db.query(SkillEvidence).filter(
            SkillEvidence.user_id == current_user.id,
            SkillEvidence.skill_id == skill.id
        ).first()
        if not existing_ev:
            ev = SkillEvidence(
                user_id=current_user.id,
                skill_id=skill.id,
                evidence_type="self_reported",
                proficiency_level="intermediate",
                source_title="Onboarding Assessment",
                verified=False
            )
            db.add(ev)

    db.commit()
    return {"message": "Onboarding completed successfully"}

@router.delete("/account")
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    # Cascading delete of user
    db.delete(current_user)
    db.commit()
    return {"message": "Account and associated data deleted successfully."}
