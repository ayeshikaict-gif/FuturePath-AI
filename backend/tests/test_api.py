import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_auth_login_demo():
    # Login with pre-seeded demo user
    response = client.post("/api/v1/auth/login", json={
        "email": "student@futurepath.edu",
        "password": "FuturePath2026!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "student@futurepath.edu"

def test_auth_login_invalid():
    response = client.post("/api/v1/auth/login", json={
        "email": "student@futurepath.edu",
        "password": "WrongPassword123!"
    })
    assert response.status_code == 401

def test_career_profiles_api():
    response = client.get("/api/v1/career-advisor/profiles")
    assert response.status_code == 200
    profiles = response.json()
    assert len(profiles) >= 10
    slugs = [p["slug"] for p in profiles]
    assert "full-stack-developer" in slugs
    assert "ai-ml-engineer" in slugs

def test_authenticated_student_flow():
    # 1. Login
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "student@futurepath.edu",
        "password": "FuturePath2026!"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Me
    me_resp = client.get("/api/v1/auth/me", headers=headers)
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "student@futurepath.edu"

    # 3. Get Digital Twin
    dt_resp = client.get("/api/v1/digital-twin", headers=headers)
    assert dt_resp.status_code == 200
    dt_data = dt_resp.json()
    assert dt_data["total_skills"] > 0
    assert "categories" in dt_data

    # 4. Career Match
    match_resp = client.get("/api/v1/career-advisor/match/full-stack-developer", headers=headers)
    assert match_resp.status_code == 200
    match_data = match_resp.json()
    assert "match_score" in match_data
    assert match_data["match_score"] > 0

    # 5. Dashboard Summary
    dash_resp = client.get("/api/v1/dashboard/summary", headers=headers)
    assert dash_resp.status_code == 200
    dash_data = dash_resp.json()
    assert dash_data["student_name"] == "Kavindu Perera"
    assert "target_career" in dash_data
    assert "roadmap_summary" in dash_data

    # 6. Opportunities
    opp_resp = client.get("/api/v1/opportunities", headers=headers)
    assert opp_resp.status_code == 200
    opps = opp_resp.json()
    assert len(opps) >= 4

    # 7. Add Skill Evidence
    add_ev_resp = client.post("/api/v1/digital-twin/evidence", json={
        "skill_name": "Docker",
        "evidence_type": "project_evidence",
        "proficiency_level": "intermediate",
        "source_title": "Dockerized Microservice Deployment",
        "notes": "Configured multi-stage build container"
    }, headers=headers)
    assert add_ev_resp.status_code == 200
    assert "evidence_id" in add_ev_resp.json()

    # 8. Career Future Simulator
    sim_resp = client.post("/api/v1/simulator/evaluate", json={
        "target_career_slug": "full-stack-developer",
        "skills_to_add": ["AWS", "Next.js"]
    }, headers=headers)
    assert sim_resp.status_code == 200
    sim_data = sim_resp.json()
    assert sim_data["simulated_match_score"] >= sim_data["baseline_match_score"]

    # 9. Lecture Upload & Quiz Generation
    lec_resp = client.post("/api/v1/lectures/upload", json={
        "title": "Modern Cloud Architecture with AWS",
        "subject": "Distributed Systems",
        "raw_content": (
            "Serverless architecture refers to an execution model where the cloud provider dynamically manages the allocation of machine resources. "
            "AWS Lambda is a serverless event-driven compute service that lets you run code for virtually any type of application. "
            "Make sure to read the AWS Well-Architected Framework documentation and configure API Gateway endpoints."
        )
    }, headers=headers)
    assert lec_resp.status_code == 200
    assert lec_resp.json()["quiz_cards_count"] > 0
