"""Transparent rule-based disease matching for the SIH MVP.

This expands the working prototype in backend/app/services/ai_service.py.
It does not confirm a veterinary diagnosis.
"""

from __future__ import annotations

from dataclasses import dataclass

from ml.normalize import normalize_species, normalize_symptoms

ZOONOTIC_DISEASES = {
    "Avian Influenza",
    "Brucellosis",
    "Anthrax",
}

DISCLAIMER = (
    "Decision support only - not a confirmed veterinary diagnosis."
)


@dataclass(frozen=True)
class DiseaseProfile:
    name: str
    species: frozenset[str]
    symptoms: frozenset[str]
    core_symptoms: frozenset[str]
    notes: tuple[str, ...] = ()


# Prototype-first profiles (FMD / PPR / Avian Influenza) plus additional
# SIH examples. Core symptoms break ties so fever+lameness does not
# randomly flip between look-alike syndromes.
PROFILES: tuple[DiseaseProfile, ...] = (
    DiseaseProfile(
        name="FMD",
        species=frozenset({"cattle", "buffalo", "goat", "sheep"}),
        symptoms=frozenset(
            {
                "mouth_lesions",
                "mouth_sores",
                "lameness",
                "fever",
                "excessive_salivation",
                "vesicles",
                "drooling",
            }
        ),
        core_symptoms=frozenset(
            {
                "mouth_lesions",
                "mouth_sores",
                "excessive_salivation",
                "vesicles",
            }
        ),
        notes=("Highly contagious vesicular disease pattern.",),
    ),
    DiseaseProfile(
        name="LSD",
        species=frozenset({"cattle", "buffalo"}),
        symptoms=frozenset(
            {
                "skin_nodules",
                "skin_lumps",
                "fever",
                "reduced_milk",
                "lameness",
                "swollen_lymph_nodes",
            }
        ),
        core_symptoms=frozenset({"skin_nodules", "skin_lumps"}),
        notes=("Lumpy skin disease pattern in cattle/buffalo.",),
    ),
    DiseaseProfile(
        name="Brucellosis",
        species=frozenset({"cattle", "buffalo", "goat", "sheep"}),
        symptoms=frozenset(
            {
                "abortion",
                "retained_placenta",
                "fever",
                "reduced_milk",
                "infertility",
                "swollen_joints",
            }
        ),
        core_symptoms=frozenset({"abortion", "retained_placenta"}),
        notes=("Reproductive syndrome; zoonotic review flag if matched.",),
    ),
    DiseaseProfile(
        name="Mastitis",
        species=frozenset({"cattle", "buffalo"}),
        symptoms=frozenset(
            {
                "swollen_udder",
                "reduced_milk",
                "abnormal_milk",
                "fever",
                "hot_udder",
            }
        ),
        core_symptoms=frozenset({"swollen_udder", "abnormal_milk", "hot_udder"}),
    ),
    DiseaseProfile(
        name="Bovine Respiratory Disease",
        species=frozenset({"cattle", "buffalo"}),
        symptoms=frozenset(
            {
                "cough",
                "nasal_discharge",
                "fever",
                "respiratory_distress",
                "depression",
            }
        ),
        core_symptoms=frozenset({"cough", "nasal_discharge", "respiratory_distress"}),
    ),
    DiseaseProfile(
        name="Anthrax",
        species=frozenset({"cattle", "buffalo", "goat", "sheep"}),
        symptoms=frozenset(
            {
                "sudden_death",
                "bleeding",
                "bloody_discharge",
                "fever",
                "swelling",
                "unclotted_blood",
            }
        ),
        core_symptoms=frozenset(
            {"sudden_death", "bleeding", "bloody_discharge", "unclotted_blood"}
        ),
        notes=("Zoonotic review flag if matched.",),
    ),
    DiseaseProfile(
        name="PPR",
        species=frozenset({"goat", "sheep"}),
        symptoms=frozenset(
            {
                "fever",
                "nasal_discharge",
                "mouth_sores",
                "diarrhea",
                "cough",
                "ocular_discharge",
            }
        ),
        core_symptoms=frozenset({"nasal_discharge", "diarrhea", "mouth_sores"}),
        notes=("Peste des petits ruminants pattern.",),
    ),
    DiseaseProfile(
        name="Contagious Ecthyma",
        species=frozenset({"goat", "sheep"}),
        symptoms=frozenset(
            {
                "mouth_sores",
                "scabs",
                "lips_lesions",
                "crusts",
                "oral_papules",
            }
        ),
        core_symptoms=frozenset({"scabs", "lips_lesions", "crusts", "oral_papules"}),
    ),
    DiseaseProfile(
        name="Avian Influenza",
        species=frozenset({"poultry"}),
        symptoms=frozenset(
            {
                "respiratory_distress",
                "cough",
                "sudden_death",
                "reduced_egg_production",
                "swelling_head",
                "cyanosis",
            }
        ),
        core_symptoms=frozenset(
            {"sudden_death", "respiratory_distress", "cyanosis", "swelling_head"}
        ),
        notes=("Zoonotic review flag if matched.",),
    ),
    DiseaseProfile(
        name="Newcastle Disease",
        species=frozenset({"poultry"}),
        symptoms=frozenset(
            {
                "respiratory_distress",
                "diarrhea",
                "twisted_neck",
                "reduced_egg_production",
                "cough",
                "nervous_signs",
            }
        ),
        core_symptoms=frozenset({"twisted_neck", "nervous_signs", "diarrhea"}),
    ),
    DiseaseProfile(
        name="Infectious Bursal Disease",
        species=frozenset({"poultry"}),
        symptoms=frozenset(
            {
                "depression",
                "diarrhea",
                "ruffled_feathers",
                "sudden_death",
                "prostration",
            }
        ),
        core_symptoms=frozenset({"ruffled_feathers", "prostration", "depression"}),
    ),
)

MIN_MATCHES = 2


def _score_profile(profile: DiseaseProfile, symptom_set: set[str]) -> tuple[float, int, int]:
    matched = profile.symptoms & symptom_set
    matches = len(matched)
    core_matches = len(profile.core_symptoms & symptom_set)
    # Prefer more overlap, then distinctive (core) signs.
    score = matches + 0.5 * core_matches
    return score, matches, core_matches


def match_disease(
    species: str,
    symptoms: list[str],
) -> dict:
    species_n = normalize_species(species)
    symptoms_n = normalize_symptoms(symptoms)
    symptom_set = set(symptoms_n)

    ranked: list[tuple[float, int, int, DiseaseProfile, set[str]]] = []
    for profile in PROFILES:
        if species_n not in profile.species:
            continue
        score, matches, core_matches = _score_profile(profile, symptom_set)
        if matches < MIN_MATCHES:
            continue
        ranked.append((score, matches, core_matches, profile, profile.symptoms & symptom_set))

    ranked.sort(key=lambda row: (row[0], row[2], row[1]), reverse=True)

    explanation: list[str] = []

    if not ranked:
        explanation.append(
            "Symptoms do not strongly match a supported disease pattern"
        )
        explanation.append(DISCLAIMER)
        return {
            "disease": "Unknown",
            "confidence": 0.30,
            "explanation": explanation,
            "method": "rules",
            "matched_symptoms": [],
            "alternatives": [],
        }

    _score, matches, core_matches, winner, matched_syms = ranked[0]

    # Prototype-style confidence: bounded, not clinically calibrated.
    confidence = min(0.60 + matches * 0.08 + core_matches * 0.02, 0.90)

    for label in sorted(matched_syms):
        explanation.append(f"{label.replace('_', ' ').capitalize()} reported")

    if core_matches:
        explanation.append(
            f"{core_matches} distinctive sign(s) aligned with the {winner.name} pattern"
        )

    alternatives = []
    for row in ranked[1:3]:
        alt_score, alt_matches, alt_core, alt_profile, _matched = row
        # Skip look-alikes that only share generic signs such as fever.
        if alt_matches >= MIN_MATCHES and alt_core >= 1:
            alternatives.append(alt_profile.name)
            explanation.append(
                f"Also consider {alt_profile.name} as a differential (rule overlap only)"
            )

    explanation.append(DISCLAIMER)

    return {
        "disease": winner.name,
        "confidence": round(confidence, 2),
        "explanation": explanation,
        "method": "rules",
        "matched_symptoms": sorted(matched_syms),
        "alternatives": alternatives,
    }
