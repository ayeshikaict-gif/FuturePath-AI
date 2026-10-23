import re
from typing import Any
from app.services.cv_extractor import extract_skills_from_text

def process_lecture_content(title: str, content: str) -> dict[str, Any]:
    """
    Parses lecture transcript or notes into structured summary, key concepts,
    action items, matching skills, and interactive quizzes/flashcards.
    """
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", content) if len(s.strip()) > 15]
    paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
    
    # 1. Generate summary from the most informative sentences
    if len(sentences) >= 3:
        summary_sentences = sentences[:4]
        summary_text = " ".join(summary_sentences)
    else:
        summary_text = content[:500] + ("..." if len(content) > 500 else "")

    # 2. Extract key concepts
    key_concepts = []
    concept_patterns = [
        r"\b([A-Z][a-zA-Z0-9\s_-]+)\s+(?:is defined as|refers to|is a|means|represents)\s+([^.]+)",
        r"(?:the key principle of|core concept in)\s+([a-zA-Z0-9\s_-]+)\s+is\s+([^.]+)"
    ]
    
    for pat in concept_patterns:
        for match in re.finditer(pat, content, re.IGNORECASE):
            term = match.group(1).strip()
            desc = match.group(2).strip()
            if 3 < len(term) < 40 and len(desc) > 10:
                key_concepts.append({"title": term.title(), "description": desc[:250]})
                if len(key_concepts) >= 4:
                    break

    # If regex found fewer than 2, extract heuristic topical headings
    if len(key_concepts) < 2:
        words = re.findall(r"\b[A-Z][a-z]{3,}\b", content)
        freq: dict[str, int] = {}
        for w in words:
            if w.lower() not in ["the", "this", "that", "with", "from", "they", "will", "when"]:
                freq[w] = freq.get(w, 0) + 1
        sorted_words = sorted(freq.items(), key=lambda x: -x[1])
        for w, _ in sorted_words[:3]:
            key_concepts.append({
                "title": w,
                "description": f"Core topic discussed extensively during the session regarding {title}."
            })

    # 3. Action items (homework, readings, labs)
    action_items = []
    action_matches = re.findall(r"(?:remember to|make sure to|homework|assignment|review|next week|read chapter|practice|implement)\s+([^.]+)", content, re.IGNORECASE)
    for act in action_matches[:4]:
        clean_act = act.strip()
        if len(clean_act) > 10:
            action_items.append(clean_act.capitalize())
            
    if not action_items:
        action_items = [
            f"Review lecture slides and complete practice code for '{title}'.",
            "Synthesize personal notes into the active learning roadmap.",
            "Complete the self-assessment quiz below to reinforce retention."
        ]

    # 4. Relevant skills detected
    relevant_skills = extract_skills_from_text(content)
    if not relevant_skills:
        relevant_skills = ["Data Structures & Algorithms", "System Design"]

    # 5. Generate interactive quizzes & flashcards
    quiz_cards = []
    
    # Generate 2 flashcards
    for kc in key_concepts[:2]:
        quiz_cards.append({
            "card_type": "flashcard",
            "question": f"What is {kc['title']} in the context of this lecture?",
            "options": [],
            "correct_answer": kc['description'],
            "explanation": f"Key concept identified from the lecture notes on '{title}'."
        })

    # Generate 2 multiple choice quizzes
    for i, kc in enumerate(key_concepts[:2]):
        correct = kc['description']
        distractors = [
            "A legacy deprecated pattern that should not be used in modern systems.",
            "An unverified theoretical construct with no direct practical application.",
            "A syntax error caused by improper scoping in asynchronous functions."
        ]
        options = [correct] + distractors
        # Simple deterministic permutation
        if i % 2 == 1:
            options = [options[1], options[0], options[2], options[3]]
            
        quiz_cards.append({
            "card_type": "quiz",
            "question": f"Which statement best defines or characterizes '{kc['title']}'?",
            "options": options,
            "correct_answer": correct,
            "explanation": f"According to the lecture discussion, {kc['title']} {kc['description']}."
        })

    return {
        "summary_text": summary_text,
        "key_concepts": key_concepts,
        "action_items": action_items,
        "relevant_skills": relevant_skills,
        "quiz_cards": quiz_cards
    }
