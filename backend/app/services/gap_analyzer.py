from typing import Any

EVIDENCE_WEIGHTS = {
    "project_evidence": 1.0,
    "assessment_evidence": 1.0,
    "cv_extracted": 0.75,
    "course_completed": 0.60,
    "self_reported": 0.35,
}

IMPORTANCE_MULTIPLIERS = {
    "required": 3.0,
    "preferred": 2.0,
    "bonus": 1.0,
}

def analyze_career_gap(career_profile: Any, student_evidence_list: list[Any]) -> dict[str, Any]:
    """
    Computes deterministic, explainable career readiness matching based on
    industry requirements and student evidence.
    """
    # Map student evidence by skill name (taking the highest-tier evidence if multiple exist)
    student_skills_map: dict[str, dict[str, Any]] = {}
    for ev in student_evidence_list:
        skill_name = ev.skill.name if hasattr(ev, "skill") and ev.skill else ev.get("skill_name", "")
        ev_type = getattr(ev, "evidence_type", ev.get("evidence_type", "self_reported") if isinstance(ev, dict) else "self_reported")
        ev_level = getattr(ev, "proficiency_level", ev.get("proficiency_level", "intermediate") if isinstance(ev, dict) else "intermediate")
        source = getattr(ev, "source_title", ev.get("source_title", "") if isinstance(ev, dict) else "")
        verified = getattr(ev, "verified", ev.get("verified", False) if isinstance(ev, dict) else False)
        
        weight = EVIDENCE_WEIGHTS.get(ev_type, 0.35)
        if skill_name:
            if skill_name not in student_skills_map or weight > student_skills_map[skill_name]["weight"]:
                student_skills_map[skill_name] = {
                    "skill_name": skill_name,
                    "evidence_type": ev_type,
                    "proficiency_level": ev_level,
                    "source": source,
                    "verified": verified,
                    "weight": weight
                }

    total_weighted_points = 0.0
    total_max_points = 0.0
    strong_evidence = []
    partial_evidence = []
    missing_skills = []

    for req in career_profile.requirements:
        req_name = req.skill.name if hasattr(req, "skill") and req.skill else req.get("skill_name", "")
        category = req.skill.category if hasattr(req, "skill") and req.skill else req.get("category", "General")
        importance = getattr(req, "importance", "required")
        req_weight = IMPORTANCE_MULTIPLIERS.get(importance, 2.0)
        
        total_max_points += (req_weight * 1.0)
        
        if req_name in student_skills_map:
            evidence_info = student_skills_map[req_name]
            score_factor = evidence_info["weight"]
            total_weighted_points += (req_weight * score_factor)
            
            item = {
                "skill_name": req_name,
                "category": category,
                "importance": importance,
                "evidence_type": evidence_info["evidence_type"],
                "proficiency_level": evidence_info["proficiency_level"],
                "source": evidence_info["source"],
                "verified": evidence_info["verified"]
            }
            if score_factor >= 0.75:
                strong_evidence.append(item)
            else:
                partial_evidence.append(item)
        else:
            missing_skills.append({
                "skill_name": req_name,
                "category": category,
                "importance": importance,
                "minimum_level": getattr(req, "minimum_level", "intermediate"),
                "weight": req_weight
            })

    # Sort missing skills: required first, then preferred, then bonus
    missing_skills.sort(key=lambda x: -x["weight"])

    match_score = round((total_weighted_points / total_max_points * 100), 1) if total_max_points > 0 else 0.0

    if match_score >= 80:
        readiness_level = "High Readiness"
        explanation = f"You possess strong verified evidence for {len(strong_evidence)} required skills. You are well-positioned for internships and entry-level positions in this role."
    elif match_score >= 50:
        readiness_level = "Moderate Readiness"
        explanation = f"You meet the baseline fundamentals for this role, with {len(missing_skills)} gap areas to bridge. Completing a targeted project or roadmap will significantly boost readiness."
    else:
        readiness_level = "Developing Readiness"
        explanation = f"You are in the foundational stage for this career track. Focus on core requirements ({', '.join([s['skill_name'] for s in missing_skills[:3]])}) to build strong practical evidence."

    return {
        "career_slug": career_profile.slug,
        "career_title": career_profile.title,
        "match_score": match_score,
        "total_required_skills": len(career_profile.requirements),
        "demonstrated_skills_count": len(strong_evidence) + len(partial_evidence),
        "strong_evidence_skills": strong_evidence,
        "partial_evidence_skills": partial_evidence,
        "missing_skills": missing_skills,
        "readiness_level": readiness_level,
        "explanation": explanation
    }
