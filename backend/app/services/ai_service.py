def analyze_health_event(
    species: str,
    symptoms: list[str],
    affected_count: int,
    death_count: int,
):
    symptoms_lower = [s.lower() for s in symptoms]

    disease = "Unknown"
    confidence = 0.30
    explanation = []

    # CATTLE / BUFFALO
    if species in ["cattle", "buffalo"]:

        fmd_symptoms = {
            "mouth_lesions",
            "mouth_sores",
            "lameness",
            "fever",
            "excessive_salivation",
        }

        matches = len(set(symptoms_lower) & fmd_symptoms)

        if matches >= 2:
            disease = "FMD"
            confidence = min(0.60 + matches * 0.08, 0.90)

            if "mouth_lesions" in symptoms_lower:
                explanation.append("Mouth lesions reported")

            if "lameness" in symptoms_lower:
                explanation.append("Lameness reported")

            if affected_count >= 5:
                explanation.append("Multiple animals affected")

    # GOAT / SHEEP
    elif species in ["goat", "sheep"]:

        ppr_symptoms = {
            "fever",
            "nasal_discharge",
            "mouth_sores",
            "diarrhea",
            "cough",
        }

        matches = len(set(symptoms_lower) & ppr_symptoms)

        if matches >= 2:
            disease = "PPR"
            confidence = min(0.60 + matches * 0.07, 0.90)

            explanation.append(
                f"{matches} symptoms associated with PPR reported"
            )

    # POULTRY
    elif species == "poultry":

        ai_symptoms = {
            "respiratory_distress",
            "cough",
            "sudden_death",
            "reduced_egg_production",
        }

        matches = len(set(symptoms_lower) & ai_symptoms)

        if matches >= 2:
            disease = "Avian Influenza"
            confidence = min(0.60 + matches * 0.08, 0.90)

            explanation.append(
                "Multiple poultry respiratory/systemic symptoms reported"
            )

    # RISK SCORE
    risk_score = 20

    risk_score += min(affected_count * 5, 30)
    risk_score += min(death_count * 15, 30)

    if confidence >= 0.75:
        risk_score += 15
    elif confidence >= 0.60:
        risk_score += 10

    risk_score = min(risk_score, 100)

    if risk_score >= 80:
        risk_level = "CRITICAL"
    elif risk_score >= 60:
        risk_level = "HIGH"
    elif risk_score >= 35:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"

    # ZOONOTIC REVIEW FLAG
    zoonotic_diseases = {
        "Avian Influenza",
        "Brucellosis",
        "Anthrax",
    }

    zoonotic_flag = disease in zoonotic_diseases

    if not explanation:
        explanation.append(
            "Symptoms do not strongly match a supported disease pattern"
        )

    return {
        "prediction": {
            "disease": disease,
            "confidence": round(confidence, 2),
        },
        "risk": {
            "score": risk_score,
            "level": risk_level,
        },
        "zoonotic": {
            "flag": zoonotic_flag,
        },
        "explanation": explanation,
    }