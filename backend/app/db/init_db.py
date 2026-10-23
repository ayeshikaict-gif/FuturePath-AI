import sys
from datetime import datetime
from app.db.database import Base, engine, SessionLocal
from app.core.security import get_password_hash
from app.models.models import (
    User, StudentProfile, Skill, CareerProfile, CareerRequirement,
    Opportunity, SkillEvidence, LearningRoadmap, RoadmapTask
)

CAREER_DATA = [
    {
        "slug": "full-stack-developer",
        "title": "Full-Stack Developer",
        "description": "Designs and builds end-to-end web applications, encompassing intuitive frontend interfaces, scalable backend APIs, database persistence, and cloud deployment.",
        "market_demand": "Very High",
        "average_starting_salary": "LKR 150,000 - 250,000 / mo",
        "icon_name": "Layers",
        "requirements": [
            ("TypeScript", "required", "intermediate", 3.0),
            ("React", "required", "intermediate", 3.0),
            ("Node.js", "required", "intermediate", 3.0),
            ("PostgreSQL", "required", "intermediate", 3.0),
            ("REST APIs", "required", "intermediate", 3.0),
            ("Git", "required", "intermediate", 2.5),
            ("Docker", "preferred", "beginner", 2.0),
            ("Next.js", "preferred", "intermediate", 2.0),
            ("Tailwind CSS", "preferred", "intermediate", 1.5),
            ("Testing & QA", "preferred", "intermediate", 2.0),
            ("CI/CD", "bonus", "beginner", 1.0),
        ]
    },
    {
        "slug": "frontend-developer",
        "title": "Frontend Developer",
        "description": "Specializes in building responsive, high-performance, accessible, and user-centric web applications using modern component frameworks and CSS architectures.",
        "market_demand": "High",
        "average_starting_salary": "LKR 130,000 - 220,000 / mo",
        "icon_name": "Layout",
        "requirements": [
            ("JavaScript", "required", "advanced", 3.0),
            ("TypeScript", "required", "intermediate", 3.0),
            ("React", "required", "intermediate", 3.0),
            ("HTML5", "required", "advanced", 3.0),
            ("CSS3", "required", "advanced", 3.0),
            ("Tailwind CSS", "required", "intermediate", 2.5),
            ("Next.js", "preferred", "intermediate", 2.0),
            ("Git", "required", "intermediate", 2.0),
            ("UI/UX Design", "preferred", "beginner", 1.5),
            ("Testing & QA", "preferred", "beginner", 1.5),
        ]
    },
    {
        "slug": "backend-developer",
        "title": "Backend Developer",
        "description": "Architects server-side logic, database schemas, secure authentication mechanisms, microservices, and high-throughput data processing pipelines.",
        "market_demand": "Very High",
        "average_starting_salary": "LKR 160,000 - 260,000 / mo",
        "icon_name": "Server",
        "requirements": [
            ("Python", "required", "intermediate", 3.0),
            ("FastAPI", "required", "intermediate", 3.0),
            ("SQL", "required", "advanced", 3.0),
            ("PostgreSQL", "required", "intermediate", 3.0),
            ("REST APIs", "required", "advanced", 3.0),
            ("Docker", "required", "intermediate", 2.5),
            ("Git", "required", "intermediate", 2.0),
            ("Redis", "preferred", "beginner", 2.0),
            ("System Design", "preferred", "intermediate", 2.0),
            ("Cybersecurity Fundamentals", "preferred", "beginner", 1.5),
        ]
    },
    {
        "slug": "ai-ml-engineer",
        "title": "AI/ML Engineer",
        "description": "Researches, constructs, fine-tunes, and deploys predictive machine learning models, neural networks, and modern LLM application workflows.",
        "market_demand": "Very High",
        "average_starting_salary": "LKR 180,000 - 300,000 / mo",
        "icon_name": "Brain",
        "requirements": [
            ("Python", "required", "advanced", 3.0),
            ("Machine Learning", "required", "intermediate", 3.0),
            ("Deep Learning", "required", "intermediate", 3.0),
            ("Data Analysis", "required", "advanced", 3.0),
            ("Data Structures & Algorithms", "required", "intermediate", 2.5),
            ("SQL", "preferred", "intermediate", 2.0),
            ("FastAPI", "preferred", "intermediate", 2.0),
            ("Docker", "preferred", "beginner", 1.5),
            ("Git", "required", "intermediate", 2.0),
        ]
    },
    {
        "slug": "data-analyst",
        "title": "Data Analyst",
        "description": "Translates complex datasets into actionable business intelligence, dashboards, cohort analyses, and statistical summaries for executive decision-making.",
        "market_demand": "High",
        "average_starting_salary": "LKR 120,000 - 200,000 / mo",
        "icon_name": "BarChart3",
        "requirements": [
            ("SQL", "required", "advanced", 3.0),
            ("Data Analysis", "required", "advanced", 3.0),
            ("Python", "required", "intermediate", 3.0),
            ("PostgreSQL", "preferred", "intermediate", 2.0),
            ("Git", "preferred", "beginner", 1.5),
        ]
    },
    {
        "slug": "data-scientist",
        "title": "Data Scientist",
        "description": "Applies statistical modeling, hypothesis testing, machine learning algorithms, and big data techniques to uncover hidden patterns and predict future outcomes.",
        "market_demand": "Very High",
        "average_starting_salary": "LKR 170,000 - 280,000 / mo",
        "icon_name": "TrendingUp",
        "requirements": [
            ("Python", "required", "advanced", 3.0),
            ("Machine Learning", "required", "intermediate", 3.0),
            ("Data Analysis", "required", "advanced", 3.0),
            ("SQL", "required", "advanced", 3.0),
            ("Data Structures & Algorithms", "preferred", "intermediate", 2.0),
            ("Deep Learning", "preferred", "beginner", 2.0),
        ]
    },
    {
        "slug": "devops-engineer",
        "title": "DevOps Engineer",
        "description": "Automates software delivery, builds resilient CI/CD pipelines, oversees infrastructure-as-code, and guarantees high availability and monitoring.",
        "market_demand": "Very High",
        "average_starting_salary": "LKR 170,000 - 290,000 / mo",
        "icon_name": "Cpu",
        "requirements": [
            ("Linux", "required", "advanced", 3.0),
            ("Docker", "required", "advanced", 3.0),
            ("Kubernetes", "required", "intermediate", 3.0),
            ("CI/CD", "required", "advanced", 3.0),
            ("Git", "required", "advanced", 2.5),
            ("AWS", "required", "intermediate", 2.5),
            ("Python", "preferred", "intermediate", 2.0),
            ("Cybersecurity Fundamentals", "preferred", "beginner", 1.5),
        ]
    },
    {
        "slug": "cloud-engineer",
        "title": "Cloud Engineer",
        "description": "Designs, implements, and secures enterprise cloud infrastructures across AWS, Azure, and GCP, optimizing cost, networking, and scalability.",
        "market_demand": "High",
        "average_starting_salary": "LKR 160,000 - 270,000 / mo",
        "icon_name": "Cloud",
        "requirements": [
            ("AWS", "required", "intermediate", 3.0),
            ("Linux", "required", "intermediate", 3.0),
            ("Docker", "required", "intermediate", 2.5),
            ("Git", "required", "intermediate", 2.0),
            ("CI/CD", "preferred", "beginner", 2.0),
            ("Cybersecurity Fundamentals", "preferred", "intermediate", 2.0),
            ("Python", "preferred", "beginner", 1.5),
        ]
    },
    {
        "slug": "cybersecurity-analyst",
        "title": "Cybersecurity Analyst",
        "description": "Safeguards information assets and networks against threats, monitors security incidents, conducts vulnerability assessments, and enforces compliance.",
        "market_demand": "Very High",
        "average_starting_salary": "LKR 150,000 - 260,000 / mo",
        "icon_name": "ShieldAlert",
        "requirements": [
            ("Cybersecurity Fundamentals", "required", "advanced", 3.0),
            ("Linux", "required", "advanced", 3.0),
            ("Python", "preferred", "intermediate", 2.0),
            ("SQL", "preferred", "intermediate", 2.0),
            ("Git", "preferred", "beginner", 1.5),
        ]
    },
    {
        "slug": "software-engineer",
        "title": "Software Engineer",
        "description": "Develops robust, maintainable, scalable software solutions applying core computer science fundamentals, design patterns, and clean engineering practices.",
        "market_demand": "Very High",
        "average_starting_salary": "LKR 160,000 - 270,000 / mo",
        "icon_name": "Code2",
        "requirements": [
            ("Data Structures & Algorithms", "required", "advanced", 3.0),
            ("Python", "required", "intermediate", 3.0),
            ("SQL", "required", "intermediate", 2.5),
            ("Git", "required", "intermediate", 2.5),
            ("Testing & QA", "required", "intermediate", 2.5),
            ("System Design", "preferred", "intermediate", 2.0),
            ("Docker", "preferred", "beginner", 1.5),
        ]
    },
    {
        "slug": "qa-engineer",
        "title": "QA Automation Engineer",
        "description": "Formulates test strategies, authors automated integration and regression suites, and integrates continuous quality gates across the delivery pipeline.",
        "market_demand": "Moderate",
        "average_starting_salary": "LKR 130,000 - 210,000 / mo",
        "icon_name": "CheckCircle2",
        "requirements": [
            ("Testing & QA", "required", "advanced", 3.0),
            ("Python", "required", "intermediate", 3.0),
            ("JavaScript", "preferred", "intermediate", 2.5),
            ("Git", "required", "intermediate", 2.0),
            ("CI/CD", "preferred", "beginner", 2.0),
            ("SQL", "preferred", "beginner", 1.5),
        ]
    },
    {
        "slug": "ui-ux-designer",
        "title": "UI/UX Designer",
        "description": "Conducts user research, designs wireframes, interactive prototypes, and scalable design systems to create intuitive digital experiences.",
        "market_demand": "High",
        "average_starting_salary": "LKR 120,000 - 200,000 / mo",
        "icon_name": "Palette",
        "requirements": [
            ("UI/UX Design", "required", "advanced", 3.0),
            ("HTML5", "preferred", "intermediate", 2.0),
            ("CSS3", "preferred", "intermediate", 2.0),
            ("Tailwind CSS", "bonus", "beginner", 1.0),
        ]
    }
]

OPPORTUNITIES_DATA = [
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

def init_db():
    print("Creating database schema...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Skills and Careers
        skills_cache: dict[str, Skill] = {}
        for c_data in CAREER_DATA:
            for skill_name, _, _, _ in c_data["requirements"]:
                if skill_name not in skills_cache:
                    existing_skill = db.query(Skill).filter(Skill.name == skill_name).first()
                    if not existing_skill:
                        category = "fundamentals"
                        if skill_name in ["Python", "JavaScript", "TypeScript", "HTML5", "CSS3", "SQL"]:
                            category = "languages"
                        elif skill_name in ["React", "Next.js", "FastAPI", "Node.js", "Tailwind CSS"]:
                            category = "frameworks"
                        elif skill_name in ["PostgreSQL", "Redis", "MongoDB"]:
                            category = "databases"
                        elif skill_name in ["Docker", "Kubernetes", "Linux", "AWS", "CI/CD"]:
                            category = "cloud_devops"
                        elif skill_name in ["UI/UX Design"]:
                            category = "soft_skills"
                            
                        new_skill = Skill(name=skill_name, category=category, description=f"Technical capability in {skill_name}")
                        db.add(new_skill)
                        db.commit()
                        db.refresh(new_skill)
                        skills_cache[skill_name] = new_skill
                    else:
                        skills_cache[skill_name] = existing_skill

        # 2. Seed Career Profiles and Requirements
        for c_data in CAREER_DATA:
            existing_career = db.query(CareerProfile).filter(CareerProfile.slug == c_data["slug"]).first()
            if not existing_career:
                career = CareerProfile(
                    slug=c_data["slug"],
                    title=c_data["title"],
                    description=c_data["description"],
                    market_demand=c_data["market_demand"],
                    average_starting_salary=c_data["average_starting_salary"],
                    icon_name=c_data["icon_name"]
                )
                db.add(career)
                db.commit()
                db.refresh(career)

                for skill_name, importance, min_level, weight in c_data["requirements"]:
                    skill_obj = skills_cache[skill_name]
                    req = CareerRequirement(
                        career_id=career.id,
                        skill_id=skill_obj.id,
                        importance=importance,
                        minimum_level=min_level,
                        weight=weight
                    )
                    db.add(req)
                db.commit()

        # 3. Seed Verified Opportunities
        for opp in OPPORTUNITIES_DATA:
            existing_opp = db.query(Opportunity).filter(Opportunity.title == opp["title"]).first()
            if not existing_opp:
                db_opp = Opportunity(
                    title=opp["title"],
                    organization=opp["organization"],
                    opportunity_type=opp["opportunity_type"],
                    location=opp["location"],
                    is_sri_lanka=opp["is_sri_lanka"],
                    deadline=opp["deadline"],
                    url=opp["url"],
                    eligibility=opp["eligibility"],
                    description=opp["description"],
                    tags=opp["tags"],
                    last_verified=opp["last_verified"]
                )
                db.add(db_opp)
        db.commit()

        # 4. Seed Demo Student Account for instant testing
        demo_user = db.query(User).filter(User.email == "student@futurepath.edu").first()
        if not demo_user:
            demo_user = User(
                email="student@futurepath.edu",
                hashed_password=get_password_hash("FuturePath2026!"),
                full_name="Kavindu Perera",
                role="student",
                is_active=True
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

            profile = StudentProfile(
                user_id=demo_user.id,
                institution="University of Colombo School of Computing",
                degree="B.Sc. (Hons) in Software Engineering",
                academic_year=3,
                target_career_slug="full-stack-developer",
                weekly_study_hours=12,
                bio="Passionate 3rd-year undergraduate specializing in full-stack web applications, distributed systems, and modern cloud technologies.",
                github_url="https://github.com/kavindu-perera-demo",
                linkedin_url="https://linkedin.com/in/kavindu-perera-demo",
                portfolio_published=True,
                onboarding_completed=True
            )
            db.add(profile)
            db.commit()

            # Add verified seed evidence for demo student
            ev1 = SkillEvidence(
                user_id=demo_user.id,
                skill_id=skills_cache["React"].id,
                evidence_type="project_evidence",
                proficiency_level="intermediate",
                source_title="Campus Academic Event Portal (GitHub)",
                source_url="https://github.com/demo/campus-portal",
                verified=True,
                verified_at=datetime.utcnow(),
                notes="Developed reusable responsive dashboard components using React and Tailwind."
            )
            ev2 = SkillEvidence(
                user_id=demo_user.id,
                skill_id=skills_cache["TypeScript"].id,
                evidence_type="cv_extracted",
                proficiency_level="intermediate",
                source_title="Extracted from CV v2",
                verified=True,
                notes="Built typed REST client modules."
            )
            ev3 = SkillEvidence(
                user_id=demo_user.id,
                skill_id=skills_cache["PostgreSQL"].id,
                evidence_type="project_evidence",
                proficiency_level="intermediate",
                source_title="Database Systems Lab Project",
                verified=True,
                notes="Designed normalized 3NF schemas with indexes and triggers."
            )
            ev4 = SkillEvidence(
                user_id=demo_user.id,
                skill_id=skills_cache["Git"].id,
                evidence_type="project_evidence",
                proficiency_level="advanced",
                source_title="Open Source Contributions",
                verified=True,
                notes="Frequent PR reviews, git rebase workflows."
            )
            db.add_all([ev1, ev2, ev3, ev4])
            db.commit()

            # Seed a default active roadmap for demo student
            roadmap = LearningRoadmap(
                user_id=demo_user.id,
                career_slug="full-stack-developer",
                title="Target Roadmap: Full-Stack Developer",
                total_milestones=3,
                completed_milestones=1,
                is_active=True
            )
            db.add(roadmap)
            db.commit()
            db.refresh(roadmap)

            t1 = RoadmapTask(
                roadmap_id=roadmap.id,
                phase_number=1,
                phase_title="Phase 1: Core Foundations & Language Prerequisites",
                title="Master TypeScript Core Concepts & Advanced Types",
                description="Study discriminated unions, generics, and strict null checking.",
                skill_name="TypeScript",
                estimated_hours=12,
                resource_url="https://www.typescriptlang.org/docs/handbook/intro.html",
                resource_title="TypeScript Official Handbook",
                is_completed=True,
                completed_at=datetime.utcnow(),
                order_index=1
            )
            t2 = RoadmapTask(
                roadmap_id=roadmap.id,
                phase_number=2,
                phase_title="Phase 2: Applied Frameworks & Architectural Tooling",
                title="Develop Scalable REST APIs with Node.js & Express",
                description="Build authenticated CRUD endpoints with rate limiting and JWT cookies.",
                skill_name="Node.js",
                estimated_hours=16,
                resource_url="https://developer.mozilla.org/en-US/docs/Glossary/REST",
                resource_title="REST API Best Practices (MDN)",
                is_completed=False,
                order_index=2
            )
            t3 = RoadmapTask(
                roadmap_id=roadmap.id,
                phase_number=3,
                phase_title="Phase 3: Production Capstone & Portfolio Delivery",
                title="Dockerize Application & Establish GitHub Actions CI/CD",
                description="Write multi-stage Dockerfiles and continuous test automation pipeline.",
                skill_name="Docker",
                estimated_hours=20,
                resource_url="https://docs.docker.com/get-started/",
                resource_title="Docker Fundamentals",
                is_completed=False,
                order_index=3
            )
            db.add_all([t1, t2, t3])
            db.commit()

        print("Database initialized and seeded successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
