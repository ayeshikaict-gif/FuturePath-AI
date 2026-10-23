from typing import Any

# Verified, reputable resources for tech skills
CURATED_RESOURCES = {
    "Python": {
        "title": "Python Official Tutorial & Practical Core Concepts",
        "url": "https://docs.python.org/3/tutorial/"
    },
    "JavaScript": {
        "title": "MDN Web Docs: Modern JavaScript (ES6+)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
    },
    "TypeScript": {
        "title": "TypeScript Handbook for Practical Developers",
        "url": "https://www.typescriptlang.org/docs/handbook/intro.html"
    },
    "React": {
        "title": "React.dev: Quick Start & Component Thinking",
        "url": "https://react.dev/learn"
    },
    "Next.js": {
        "title": "Next.js Official Documentation & App Router Guide",
        "url": "https://nextjs.org/docs"
    },
    "FastAPI": {
        "title": "FastAPI Official Tutorial & API Architecture",
        "url": "https://fastapi.tiangolo.com/tutorial/"
    },
    "SQL": {
        "title": "PostgreSQL Tutorial: Relational Queries & Joins",
        "url": "https://www.postgresqltutorial.com/"
    },
    "PostgreSQL": {
        "title": "PostgreSQL Documentation: Schema, Indexing & Constraints",
        "url": "https://www.postgresql.org/docs/current/"
    },
    "Docker": {
        "title": "Docker Get Started & Containerization Fundamentals",
        "url": "https://docs.docker.com/get-started/"
    },
    "Git": {
        "title": "Pro Git Book (Free): Version Control & Branching Workflows",
        "url": "https://git-scm.com/book/en/v2"
    },
    "REST APIs": {
        "title": "REST API Architecture Best Practices (MDN)",
        "url": "https://developer.mozilla.org/en-US/docs/Glossary/REST"
    },
    "Tailwind CSS": {
        "title": "Tailwind CSS Utility-First Documentation",
        "url": "https://tailwindcss.com/docs"
    },
    "Machine Learning": {
        "title": "Scikit-Learn Getting Started & Supervised Learning",
        "url": "https://scikit-learn.org/stable/getting_started.html"
    },
    "Data Analysis": {
        "title": "Python Data Science Handbook: Pandas & NumPy",
        "url": "https://jakevdp.github.io/PythonDataScienceHandbook/"
    },
    "Data Structures & Algorithms": {
        "title": "Open Data Structures & Algorithms Implementation Guide",
        "url": "https://opendatastructures.org/"
    },
    "Cybersecurity Fundamentals": {
        "title": "OWASP Top 10 Web Application Security Risks",
        "url": "https://owasp.org/www-project-top-ten/"
    },
    "Testing & QA": {
        "title": "Software Testing Foundations & Test Automation Best Practices",
        "url": "https://martinfowler.com/articles/practical-test-pyramid.html"
    },
    "System Design": {
        "title": "System Design Primer: Scalability, Caching & Distributed Systems",
        "url": "https://github.com/donnemartin/system-design-primer"
    },
    "UI/UX Design": {
        "title": "Nielsen Norman Group: UX Design Principles & Usability Heuristics",
        "url": "https://www.nngroup.com/articles/ten-usability-heuristics/"
    },
    "Linux": {
        "title": "Linux Journey: Command Line, Permissions & System Administration",
        "url": "https://linuxjourney.com/"
    },
}

def generate_roadmap_plan(career_slug: str, career_title: str, missing_skills: list[dict[str, Any]], partial_skills: list[dict[str, Any]], weekly_hours: int = 10) -> dict[str, Any]:
    """
    Generates a structured, phased learning roadmap tailored to address the student's
    specific skill gaps within their committed weekly study time.
    """
    # Combine skills to learn, prioritizing missing required skills
    target_skills = []
    for s in missing_skills:
        target_skills.append((s["skill_name"], s.get("category", "fundamentals"), True))
    for s in partial_skills:
        target_skills.append((s["skill_name"], s.get("category", "frameworks"), False))

    if not target_skills:
        # If student already meets all requirements, suggest advanced project & mastery
        target_skills = [
            ("System Design", "fundamentals", True),
            ("Testing & QA", "fundamentals", True),
            ("Docker", "cloud_devops", False),
        ]

    # Split into 3 logical phases:
    # Phase 1: Core Fundamentals & Prerequisite Languages
    # Phase 2: Applied Tooling & Frameworks
    # Phase 3: Production Projects & Capstone Integration
    phase_1_tasks = []
    phase_2_tasks = []
    phase_3_tasks = []

    order_idx = 1
    for skill_name, category, is_missing in target_skills[:8]:
        res = CURATED_RESOURCES.get(skill_name, {
            "title": f"Official {skill_name} Developer Documentation",
            "url": f"https://devdocs.io/{skill_name.lower().replace(' ', '-')}"
        })
        
        # Categorize into phases
        if category in ["languages", "fundamentals"]:
            phase_1_tasks.append({
                "phase_number": 1,
                "phase_title": "Phase 1: Core Foundations & Language Prerequisites",
                "title": f"Master {skill_name} Core Concepts & Syntax",
                "description": f"Complete hands-on exercises in {skill_name}. Build two small standalone command-line or interactive modules.",
                "skill_name": skill_name,
                "estimated_hours": 12,
                "resource_title": res["title"],
                "resource_url": res["url"],
                "order_index": order_idx
            })
            order_idx += 1
        elif category in ["frameworks", "databases"]:
            phase_2_tasks.append({
                "phase_number": 2,
                "phase_title": "Phase 2: Applied Frameworks & Architectural Tooling",
                "title": f"Develop Practical Applications with {skill_name}",
                "description": f"Implement real business logic using {skill_name}. Connect to persistence and write unit tests.",
                "skill_name": skill_name,
                "estimated_hours": 16,
                "resource_title": res["title"],
                "resource_url": res["url"],
                "order_index": order_idx
            })
            order_idx += 1
        else:
            phase_3_tasks.append({
                "phase_number": 3,
                "phase_title": "Phase 3: Production Capstone & Portfolio Delivery",
                "title": f"Production Integration & Deployment with {skill_name}",
                "description": f"Integrate {skill_name} into an end-to-end portfolio project. Document architecture and publish on GitHub.",
                "skill_name": skill_name,
                "estimated_hours": 20,
                "resource_title": res["title"],
                "resource_url": res["url"],
                "order_index": order_idx
            })
            order_idx += 1

    # Guarantee each phase has at least 1 task
    if not phase_1_tasks:
        res = CURATED_RESOURCES["Git"]
        phase_1_tasks.append({
            "phase_number": 1,
            "phase_title": "Phase 1: Core Foundations & Language Prerequisites",
            "title": "Version Control & Branching Workflows with Git",
            "description": "Establish professional Git commit hygiene, semantic PRs, and collaborative branch management.",
            "skill_name": "Git",
            "estimated_hours": 8,
            "resource_title": res["title"],
            "resource_url": res["url"],
            "order_index": 1
        })

    if not phase_3_tasks:
        res = CURATED_RESOURCES["Testing & QA"]
        phase_3_tasks.append({
            "phase_number": 3,
            "phase_title": "Phase 3: Production Capstone & Portfolio Delivery",
            "title": "Comprehensive Automated Testing & Portfolio Capstone",
            "description": "Build and deploy a full-featured capstone application covering target role requirements with tests.",
            "skill_name": "Testing & QA",
            "estimated_hours": 24,
            "resource_title": res["title"],
            "resource_url": res["url"],
            "order_index": order_idx
        })

    all_tasks = phase_1_tasks + phase_2_tasks + phase_3_tasks
    # Re-index order
    for i, t in enumerate(all_tasks):
        t["order_index"] = i + 1

    return {
        "title": f"Target Roadmap: {career_title}",
        "career_slug": career_slug,
        "total_milestones": 3,
        "tasks": all_tasks
    }
