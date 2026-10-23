from app.services.cv_extractor import extract_skills_from_text, extract_sections
from app.services.roadmap_generator import generate_roadmap_plan
from app.services.lecture_processor import process_lecture_content
from app.services.scenario_engine import simulate_skill_scenario

def test_extract_skills_from_text():
    sample_cv = """
    Software Engineer with experience in Python, FastAPI, and PostgreSQL.
    Built frontends with React and TypeScript. Familiar with Docker and Git workflows.
    """
    skills = extract_skills_from_text(sample_cv)
    assert "Python" in skills
    assert "FastAPI" in skills
    assert "PostgreSQL" in skills
    assert "React" in skills
    assert "TypeScript" in skills
    assert "Docker" in skills
    assert "Git" in skills

def test_extract_sections():
    sample_cv = """
    EDUCATION
    University of Colombo, B.Sc. in Computer Science
    
    EXPERIENCE
    Intern at Tech Lanka building microservices
    
    PROJECTS
    Campus Management System in React and Node
    
    SKILLS
    Python, SQL, Linux
    """
    sections = extract_sections(sample_cv)
    assert len(sections["education"]) > 0
    assert len(sections["experience"]) > 0
    assert len(sections["projects"]) > 0

def test_roadmap_generator():
    missing = [
        {"skill_name": "Docker", "category": "cloud_devops"},
        {"skill_name": "Next.js", "category": "frameworks"}
    ]
    partial = [
        {"skill_name": "TypeScript", "category": "languages"}
    ]
    plan = generate_roadmap_plan("full-stack-developer", "Full-Stack Developer", missing, partial, weekly_hours=12)
    assert plan["total_milestones"] == 3
    assert len(plan["tasks"]) >= 3
    # Verify phases
    phase_numbers = {t["phase_number"] for t in plan["tasks"]}
    assert 1 in phase_numbers

def test_lecture_processor():
    content = """
    Relational Database Systems and Indexing Strategies.
    A B-Tree index is defined as a self-balancing tree data structure that maintains sorted data.
    Indexes drastically improve query retrieval performance by avoiding sequential full table scans.
    Remember to complete the SQL laboratory exercise on index optimization before next week.
    Make sure to review B-Tree traversal algorithms in chapter 4.
    """
    result = process_lecture_content("Database Systems Lecture 4", content)
    assert "summary_text" in result
    assert len(result["key_concepts"]) > 0
    assert len(result["action_items"]) > 0
    assert len(result["quiz_cards"]) >= 2
