from typing import Any
from app.services.gap_analyzer import analyze_career_gap

SKILL_HOURS_ESTIMATE = {
    "languages": 20,
    "frameworks": 25,
    "databases": 20,
    "cloud_devops": 30,
    "fundamentals": 25,
    "soft_skills": 10
}

def simulate_skill_scenario(career_profile: Any, existing_evidence: list[Any], skills_to_add: list[str]) -> dict[str, Any]:
    """
    Simulates student career readiness improvement if target skills are acquired.
    """
    # 1. Baseline analysis
    baseline_result = analyze_career_gap(career_profile, existing_evidence)
    baseline_score = baseline_result["match_score"]

    # 2. Construct simulated evidence list
    # Convert existing evidence to dict representation
    simulated_evidence = []
    existing_skill_names = set()
    for ev in existing_evidence:
        skill_name = ev.skill.name if hasattr(ev, "skill") and ev.skill else ev.get("skill_name", "")
        if skill_name:
            existing_skill_names.add(skill_name)
            simulated_evidence.append({
                "skill_name": skill_name,
                "evidence_type": getattr(ev, "evidence_type", "self_reported"),
                "proficiency_level": getattr(ev, "proficiency_level", "intermediate"),
                "source_title": getattr(ev, "source_title", "Existing Record"),
                "verified": getattr(ev, "verified", False)
            })

    # Add simulated skills with "project_evidence" weight (1.0)
    newly_added = []
    total_estimated_hours = 0
    for s_name in skills_to_add:
        clean_s = s_name.strip()
        if clean_s and clean_s not in existing_skill_names:
            newly_added.append(clean_s)
            simulated_evidence.append({
                "skill_name": clean_s,
                "evidence_type": "project_evidence",
                "proficiency_level": "intermediate",
                "source_title": f"Simulated Learning: {clean_s} Capstone Project",
                "verified": True
            })
            total_estimated_hours += 25  # standard average 25 hours per technology

    # 3. Simulated analysis
    simulated_result = analyze_career_gap(career_profile, simulated_evidence)
    simulated_score = simulated_result["match_score"]
    score_delta = round(simulated_score - baseline_score, 1)

    # 4. Check newly covered skills that were previously missing
    previously_missing = {m["skill_name"] for m in baseline_result["missing_skills"]}
    newly_covered = [s for s in newly_added if s in previously_missing]
    remaining_gaps = [m["skill_name"] for m in simulated_result["missing_skills"]]

    explanation = (
        f"Acquiring {len(newly_added)} targeted skill(s) ({', '.join(newly_added)}) would increase your "
        f"'{career_profile.title}' readiness from {baseline_score}% to {simulated_score}% (+{score_delta}%). "
        f"This directly fulfills {len(newly_covered)} required competence area(s)."
    )

    return {
        "career_slug": career_profile.slug,
        "career_title": career_profile.title,
        "baseline_match_score": baseline_score,
        "simulated_match_score": simulated_score,
        "score_delta": score_delta,
        "newly_covered_skills": newly_covered,
        "remaining_gaps": remaining_gaps,
        "estimated_study_hours": total_estimated_hours,
        "explanation": explanation
    }
