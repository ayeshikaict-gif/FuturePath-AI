from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import User, Lecture, LectureSummary, QuizCard
from app.schemas.schemas import LectureUpload
from app.services.lecture_processor import process_lecture_content
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/upload")
def upload_lecture(
    lecture_in: LectureUpload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    if len(lecture_in.raw_content.strip()) < 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lecture content is too short. Please provide at least 50 characters of notes or transcript."
        )

    # 1. Process lecture
    processed = process_lecture_content(lecture_in.title, lecture_in.raw_content)

    # 2. Persist lecture record
    lecture = Lecture(
        user_id=current_user.id,
        title=lecture_in.title,
        subject=lecture_in.subject,
        raw_content=lecture_in.raw_content
    )
    db.add(lecture)
    db.commit()
    db.refresh(lecture)

    # 3. Persist summary
    summary = LectureSummary(
        lecture_id=lecture.id,
        summary_text=processed["summary_text"],
        key_concepts=processed["key_concepts"],
        action_items=processed["action_items"],
        relevant_skills=processed["relevant_skills"]
    )
    db.add(summary)

    # 4. Persist quiz and flashcard items
    for qc in processed["quiz_cards"]:
        card = QuizCard(
            lecture_id=lecture.id,
            card_type=qc["card_type"],
            question=qc["question"],
            options=qc["options"],
            correct_answer=qc["correct_answer"],
            explanation=qc["explanation"]
        )
        db.add(card)

    db.commit()

    return {
        "message": "Lecture processed successfully",
        "lecture_id": lecture.id,
        "summary": processed["summary_text"],
        "key_concepts_count": len(processed["key_concepts"]),
        "quiz_cards_count": len(processed["quiz_cards"])
    }

@router.get("")
def list_lectures(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    lectures = db.query(Lecture).filter(
        Lecture.user_id == current_user.id
    ).order_by(Lecture.created_at.desc()).all()

    results = []
    for lec in lectures:
        results.append({
            "id": lec.id,
            "title": lec.title,
            "subject": lec.subject,
            "created_at": lec.created_at.isoformat() if lec.created_at else None,
            "has_summary": lec.summary is not None,
            "quiz_count": len(lec.quiz_cards)
        })
    return results

@router.get("/{lecture_id}")
def get_lecture_details(
    lecture_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    lecture = db.query(Lecture).filter(
        Lecture.id == lecture_id,
        Lecture.user_id == current_user.id
    ).first()

    if not lecture:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lecture not found."
        )

    summary_out = None
    if lecture.summary:
        summary_out = {
            "id": lecture.summary.id,
            "summary_text": lecture.summary.summary_text,
            "key_concepts": lecture.summary.key_concepts,
            "action_items": lecture.summary.action_items,
            "relevant_skills": lecture.summary.relevant_skills
        }

    quiz_out = []
    for q in lecture.quiz_cards:
        quiz_out.append({
            "id": q.id,
            "card_type": q.card_type,
            "question": q.question,
            "options": q.options,
            "correct_answer": q.correct_answer,
            "explanation": q.explanation
        })

    return {
        "id": lecture.id,
        "title": lecture.title,
        "subject": lecture.subject,
        "raw_content": lecture.raw_content,
        "created_at": lecture.created_at.isoformat() if lecture.created_at else None,
        "summary": summary_out,
        "quiz_cards": quiz_out
    }
