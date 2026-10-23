from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    digital_twin,
    career_advisor,
    cv_analyzer,
    roadmap,
    lectures,
    opportunities,
    simulator,
    portfolio,
    dashboard
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Profile"])
api_router.include_router(digital_twin.router, prefix="/digital-twin", tags=["Student Digital Twin"])
api_router.include_router(career_advisor.router, prefix="/career-advisor", tags=["Career Advisor & Skill Gap"])
api_router.include_router(cv_analyzer.router, prefix="/cv", tags=["Smart CV Analyzer"])
api_router.include_router(roadmap.router, prefix="/roadmap", tags=["Learning Roadmap"])
api_router.include_router(lectures.router, prefix="/lectures", tags=["Lecture Intelligence"])
api_router.include_router(opportunities.router, prefix="/opportunities", tags=["Opportunity Intelligence"])
api_router.include_router(simulator.router, prefix="/simulator", tags=["Career Future Simulator"])
api_router.include_router(portfolio.router, prefix="/portfolio", tags=["Professional Portfolio Builder"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Student Dashboard"])
