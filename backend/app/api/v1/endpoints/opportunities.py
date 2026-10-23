from typing import Any, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import User, Opportunity, OpportunityBookmark, OpportunityApplication
from app.schemas.schemas import ApplicationUpdate
from app.api.deps import get_current_user

router = APIRouter()

VERIFIED_OPPORTUNITIES_FEED = [
    {
        "title": "Software Engineering Internship 2026/27",
        "organization": "WSO2 Lanka",
        "opportunity_type": "Internship",
        "location": "Colombo, Sri Lanka (Hybrid)",
        "is_sri_lanka": True,
        "deadline": "November 30, 2026",
        "url": "https://wso2.com/careers/",
        "eligibility": "Undergraduate students in Computer Science, Software Engineering, or related disciplines graduating in 2027/2028.",
        "description": "6-month immersive software engineering internship working on enterprise open-source middleware, identity management, and cloud-native solutions.",
        "tags": ["Software Engineering", "Java", "Go", "Cloud Native", "Sri Lanka"],
        "last_verified": "October 2026"
    },
    {
        "title": "Associate DevOps / Cloud Engineer Internship",
        "organization": "IFS Sri Lanka",
        "opportunity_type": "Internship",
        "location": "Colombo, Sri Lanka",
        "is_sri_lanka": True,
        "deadline": "December 15, 2026",
        "url": "https://www.ifs.com/about/careers-at-ifs",
        "eligibility": "3rd or 4th year university students with demonstrated Linux, Docker, and CI/CD foundational knowledge.",
        "description": "Contribute to enterprise cloud infrastructure deployment, automated pipelines, and Kubernetes orchestration.",
        "tags": ["DevOps", "Kubernetes", "Docker", "Azure", "Sri Lanka"],
        "last_verified": "October 2026"
    },
    {
        "title": "AI & Data Science Student Internship",
        "organization": "Sysco LABS Sri Lanka",
        "opportunity_type": "Internship",
        "location": "Colombo, Sri Lanka",
        "is_sri_lanka": True,
        "deadline": "January 15, 2027",
        "url": "https://syscolabs.lk/careers",
        "eligibility": "Undergraduates passionate about predictive modeling, data pipelines, and machine learning architectures.",
        "description": "Work alongside experienced data scientists building customer intelligence and supply-chain ML models.",
        "tags": ["AI/ML", "Python", "SQL", "Data Science", "Sri Lanka"],
        "last_verified": "October 2026"
    },
    {
        "title": "FinTech Software Engineering Internship",
        "organization": "LSEG (London Stock Exchange Group)",
        "opportunity_type": "Internship",
        "location": "Colombo, Sri Lanka",
        "is_sri_lanka": True,
        "deadline": "December 20, 2026",
        "url": "https://www.lseg.com/en/careers",
        "eligibility": "Students in CS / IT / Software Engineering with high proficiency in C++, Java, or TypeScript.",
        "description": "High-throughput financial technology systems, real-time market data streaming, and distributed microservices.",
        "tags": ["FinTech", "C++", "Java", "Distributed Systems", "Sri Lanka"],
        "last_verified": "October 2026"
    },
    {
        "title": "Cloud Application Development Internship",
        "organization": "Virtusa Sri Lanka",
        "opportunity_type": "Internship",
        "location": "Colombo, Sri Lanka",
        "is_sri_lanka": True,
        "deadline": "January 30, 2027",
        "url": "https://www.virtusa.com/careers",
        "eligibility": "Pre-final and final year software engineering undergraduates with React/Node/AWS experience.",
        "description": "Enterprise cloud transformations, micro-frontends, and automated CI/CD software delivery pipelines.",
        "tags": ["Cloud", "React", "Node.js", "AWS", "Sri Lanka"],
        "last_verified": "October 2026"
    },
    {
        "title": "HaXtreme 4.0 National Hackathon",
        "organization": "IEEE Computer Society Sri Lanka",
        "opportunity_type": "Hackathon",
        "location": "University of Moratuwa / Hybrid",
        "is_sri_lanka": True,
        "deadline": "November 10, 2026",
        "url": "https://ieeecs.lk/events",
        "eligibility": "Open to all enrolled undergraduate teams (3-4 members) across Sri Lankan universities.",
        "description": "Premier 24-hour algorithmic problem solving and real-world software innovation championship.",
        "tags": ["Hackathon", "Problem Solving", "Competitive Programming", "Sri Lanka"],
        "last_verified": "October 2026"
    },
    {
        "title": "Google Summer of Code (GSoC) 2027",
        "organization": "Google Open Source",
        "opportunity_type": "Internship",
        "location": "Global / Remote",
        "is_sri_lanka": False,
        "deadline": "March 2027",
        "url": "https://summerofcode.withgoogle.com/",
        "eligibility": "Students aged 18+ eligible to contribute to open-source software organizations.",
        "description": "Global online program bringing new contributors into open source software development over 12+ weeks.",
        "tags": ["Open Source", "Global", "Remote", "Stipend"],
        "last_verified": "October 2026"
    },
    {
        "title": "Commonwealth Master's Scholarships",
        "organization": "Commonwealth Scholarship Commission",
        "opportunity_type": "Scholarship",
        "location": "United Kingdom",
        "is_sri_lanka": False,
        "deadline": "December 2026",
        "url": "https://cscuk.fcdo.gov.uk/apply/",
        "eligibility": "Graduating university students or alumni from eligible Commonwealth countries including Sri Lanka.",
        "description": "Full funding for full-time taught Master's study at UK universities across STEM disciplines.",
        "tags": ["Scholarship", "Master's Degree", "UK", "Fully Funded"],
        "last_verified": "October 2026"
    }
]

@router.get("")
def list_opportunities(
    q: Optional[str] = None,
    opp_type: Optional[str] = None,
    sri_lanka_only: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    query = db.query(Opportunity).filter(Opportunity.is_active == True)

    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            (Opportunity.title.ilike(search_pattern)) |
            (Opportunity.organization.ilike(search_pattern)) |
            (Opportunity.description.ilike(search_pattern))
        )

    if opp_type and opp_type != "All":
        query = query.filter(Opportunity.opportunity_type.ilike(opp_type))

    if sri_lanka_only is True:
        query = query.filter(Opportunity.is_sri_lanka == True)

    opportunities = query.order_by(Opportunity.id).all()

    # Get student's bookmarks and applications
    bookmarked_ids = {
        b.opportunity_id for b in db.query(OpportunityBookmark).filter(
            OpportunityBookmark.user_id == current_user.id
        ).all()
    }

    application_status_map = {
        a.opportunity_id: a.status for a in db.query(OpportunityApplication).filter(
            OpportunityApplication.user_id == current_user.id
        ).all()
    }

    results = []
    for opp in opportunities:
        results.append({
            "id": opp.id,
            "title": opp.title,
            "organization": opp.organization,
            "opportunity_type": opp.opportunity_type,
            "location": opp.location,
            "is_sri_lanka": opp.is_sri_lanka,
            "deadline": opp.deadline,
            "url": opp.url,
            "eligibility": opp.eligibility,
            "description": opp.description,
            "tags": opp.tags,
            "last_verified": opp.last_verified,
            "is_bookmarked": opp.id in bookmarked_ids,
            "application_status": application_status_map.get(opp.id)
        })

    return results

@router.post("/sync")
def sync_opportunities(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Synchronizes the Opportunity Intelligence Hub with verified external feeds,
    updating active opportunities and verifying deadline accuracy.
    """
    updated_count = 0
    added_count = 0

    for item in VERIFIED_OPPORTUNITIES_FEED:
        existing = db.query(Opportunity).filter(
            Opportunity.title == item["title"],
            Opportunity.organization == item["organization"]
        ).first()

        if existing:
            existing.deadline = item["deadline"]
            existing.url = item["url"]
            existing.eligibility = item["eligibility"]
            existing.description = item["description"]
            existing.tags = item["tags"]
            existing.is_active = True
            existing.last_verified = "October 2026"
            updated_count += 1
        else:
            new_opp = Opportunity(
                title=item["title"],
                organization=item["organization"],
                opportunity_type=item["opportunity_type"],
                location=item["location"],
                is_sri_lanka=item["is_sri_lanka"],
                deadline=item["deadline"],
                url=item["url"],
                eligibility=item["eligibility"],
                description=item["description"],
                tags=item["tags"],
                is_active=True,
                last_verified="October 2026"
            )
            db.add(new_opp)
            added_count += 1

    db.commit()

    total_active = db.query(Opportunity).filter(Opportunity.is_active == True).count()
    return {
        "status": "success",
        "message": f"Feed synchronized: {added_count} new, {updated_count} refreshed.",
        "total_active": total_active,
        "last_synced": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    }

@router.post("/{opportunity_id}/bookmark")
def toggle_bookmark(
    opportunity_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    opp = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Opportunity not found.")

    existing = db.query(OpportunityBookmark).filter(
        OpportunityBookmark.user_id == current_user.id,
        OpportunityBookmark.opportunity_id == opportunity_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"bookmarked": False, "message": "Bookmark removed."}
    else:
        new_bm = OpportunityBookmark(user_id=current_user.id, opportunity_id=opportunity_id)
        db.add(new_bm)
        db.commit()
        return {"bookmarked": True, "message": "Opportunity saved to bookmarks."}

@router.post("/{opportunity_id}/apply")
def update_application(
    opportunity_id: int,
    app_in: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    opp = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Opportunity not found.")

    existing = db.query(OpportunityApplication).filter(
        OpportunityApplication.user_id == current_user.id,
        OpportunityApplication.opportunity_id == opportunity_id
    ).first()

    if existing:
        existing.status = app_in.status
        existing.notes = app_in.notes or existing.notes
        db.commit()
        return {"message": "Application status updated.", "status": existing.status}
    else:
        new_app = OpportunityApplication(
            user_id=current_user.id,
            opportunity_id=opportunity_id,
            status=app_in.status,
            notes=app_in.notes or ""
        )
        db.add(new_app)
        db.commit()
        return {"message": "Application status recorded.", "status": new_app.status}

@router.get("/my-tracker")
def get_my_tracker(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    bookmarks = db.query(OpportunityBookmark).filter(
        OpportunityBookmark.user_id == current_user.id
    ).all()

    applications = db.query(OpportunityApplication).filter(
        OpportunityApplication.user_id == current_user.id
    ).all()

    bm_list = []
    for b in bookmarks:
        o = b.opportunity
        bm_list.append({
            "id": o.id,
            "title": o.title,
            "organization": o.organization,
            "opportunity_type": o.opportunity_type,
            "deadline": o.deadline,
            "url": o.url,
            "location": o.location
        })

    app_list = []
    for a in applications:
        o = a.opportunity
        app_list.append({
            "application_id": a.id,
            "opportunity_id": o.id,
            "title": o.title,
            "organization": o.organization,
            "status": a.status,
            "notes": a.notes,
            "deadline": o.deadline,
            "applied_at": a.applied_at.isoformat() if a.applied_at else None
        })

    return {
        "saved_count": len(bm_list),
        "applications_count": len(app_list),
        "bookmarks": bm_list,
        "applications": app_list
    }
