import os
import uuid
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.config import settings
from app.models.models import User, CVDocument, CVAnalysis, CareerProfile, Skill, SkillEvidence
from app.services.cv_extractor import extract_text_from_file, extract_sections, extract_skills_from_text, generate_cv_feedback
from app.services.gap_analyzer import analyze_career_gap
from app.api.deps import get_current_user

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt"}

@router.post("/upload")
async def upload_cv(
    file: UploadFile = File(...),
    target_career_slug: str = Form("full-stack-developer"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    # 1. Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed: .pdf, .docx, .txt"
        )

    # 2. Check file size and create safe path
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_id = str(uuid.uuid4())
    safe_filename = f"{file_id}{ext}"
    saved_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    with open(saved_path, "wb") as f:
        f.write(contents)

    # 3. Extract text and sections
    raw_text = extract_text_from_file(saved_path, ext)
    sections = extract_sections(raw_text)
    extracted_skills = extract_skills_from_text(raw_text)

    # Save document record
    cv_doc = CVDocument(
        user_id=current_user.id,
        filename=file.filename,
        file_path=saved_path,
        file_type=ext.replace(".", ""),
        file_size=len(contents),
        raw_text=raw_text
    )
    db.add(cv_doc)
    db.commit()
    db.refresh(cv_doc)

    # 4. Fetch target career requirements for analysis
    career = db.query(CareerProfile).filter(CareerProfile.slug == target_career_slug).first()
    if not career:
        career = db.query(CareerProfile).first()
        target_career_slug = career.slug if career else "full-stack-developer"

    career_reqs = career.requirements if career else []
    strengths, missing_critical, feedback = generate_cv_feedback(
        extracted_skills, sections, target_career_slug, career_reqs
    )

    # Calculate match score based on CV skills
    temp_evidence = [{"skill_name": s, "evidence_type": "cv_extracted"} for s in extracted_skills]
    match_result = analyze_career_gap(career, temp_evidence) if career else {"match_score": 0.0}

    # Save analysis record
    analysis = CVAnalysis(
        cv_id=cv_doc.id,
        target_career_slug=target_career_slug,
        extracted_skills=extracted_skills,
        extracted_education=sections["education"][:5],
        extracted_experience=sections["experience"][:8],
        extracted_projects=sections["projects"][:8],
        match_score=match_result["match_score"],
        missing_critical_skills=missing_critical,
        strengths=strengths,
        improvement_feedback=feedback
    )
    db.add(analysis)

    # 5. Automatically create/update CV-extracted skill evidence for user's digital twin
    for s_name in extracted_skills:
        skill = db.query(Skill).filter(Skill.name == s_name).first()
        if not skill:
            skill = Skill(name=s_name, category="fundamentals")
            db.add(skill)
            db.commit()
            db.refresh(skill)

        # Check if user already has evidence for this skill
        existing_ev = db.query(SkillEvidence).filter(
            SkillEvidence.user_id == current_user.id,
            SkillEvidence.skill_id == skill.id
        ).first()

        if not existing_ev:
            ev = SkillEvidence(
                user_id=current_user.id,
                skill_id=skill.id,
                evidence_type="cv_extracted",
                proficiency_level="intermediate",
                source_title=f"Extracted from {file.filename}",
                verified=True,
                notes="Extracted and verified from CV document."
            )
            db.add(ev)

    db.commit()

    return {
        "message": "CV uploaded and analyzed successfully",
        "cv_id": cv_doc.id,
        "analysis_id": analysis.id,
        "extracted_skills": extracted_skills,
        "match_score": match_result["match_score"],
        "target_career": career.title if career else target_career_slug,
        "strengths": strengths,
        "missing_critical_skills": missing_critical,
        "improvement_feedback": feedback
    }

@router.get("/list")
def list_cvs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    cvs = db.query(CVDocument).filter(CVDocument.user_id == current_user.id).order_by(CVDocument.uploaded_at.desc()).all()
    results = []
    for doc in cvs:
        latest = doc.analyses[-1] if doc.analyses else None
        results.append({
            "id": doc.id,
            "filename": doc.filename,
            "file_type": doc.file_type,
            "file_size": doc.file_size,
            "uploaded_at": doc.uploaded_at.isoformat() if doc.uploaded_at else None,
            "latest_analysis": {
                "id": latest.id,
                "target_career_slug": latest.target_career_slug,
                "match_score": latest.match_score,
                "extracted_skills_count": len(latest.extracted_skills or []),
                "missing_skills_count": len(latest.missing_critical_skills or [])
            } if latest else None
        })
    return results

@router.get("/analyses/{analysis_id}")
def get_analysis_detail(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    analysis = db.query(CVAnalysis).join(CVDocument).filter(
        CVAnalysis.id == analysis_id,
        CVDocument.user_id == current_user.id
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis report not found."
        )

    return {
        "id": analysis.id,
        "target_career_slug": analysis.target_career_slug,
        "match_score": analysis.match_score,
        "extracted_skills": analysis.extracted_skills,
        "extracted_education": analysis.extracted_education,
        "extracted_experience": analysis.extracted_experience,
        "extracted_projects": analysis.extracted_projects,
        "missing_critical_skills": analysis.missing_critical_skills,
        "strengths": analysis.strengths,
        "improvement_feedback": analysis.improvement_feedback,
        "created_at": analysis.created_at.isoformat() if analysis.created_at else None
    }
