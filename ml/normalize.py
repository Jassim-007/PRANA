"""Normalize free-text species and symptom labels for matching."""

from __future__ import annotations

SPECIES_ALIASES = {
    "cattle": "cattle",
    "cow": "cattle",
    "cows": "cattle",
    "bovine": "cattle",
    "buffalo": "buffalo",
    "goat": "goat",
    "goats": "goat",
    "sheep": "sheep",
    "poultry": "poultry",
    "chicken": "poultry",
    "chickens": "poultry",
    "hen": "poultry",
    "hens": "poultry",
    "bird": "poultry",
    "birds": "poultry",
    "duck": "poultry",
    "ducks": "poultry",
}

SYMPTOM_ALIASES = {
    "mouth sores": "mouth_sores",
    "mouth lesions": "mouth_lesions",
    "excessive salivation": "excessive_salivation",
    "drooling": "excessive_salivation",
    "nasal discharge": "nasal_discharge",
    "respiratory distress": "respiratory_distress",
    "sudden death": "sudden_death",
    "reduced egg production": "reduced_egg_production",
    "drop in egg production": "reduced_egg_production",
    "skin nodules": "skin_nodules",
    "skin lumps": "skin_lumps",
    "swollen udder": "swollen_udder",
    "reduced milk": "reduced_milk",
    "abnormal milk": "abnormal_milk",
    "twisted neck": "twisted_neck",
    "ruffled feathers": "ruffled_feathers",
    "swollen lymph nodes": "swollen_lymph_nodes",
}


def normalize_species(species: str) -> str:
    key = (species or "").strip().lower().replace("-", "_").replace(" ", "_")
    return SPECIES_ALIASES.get(key, key)


def normalize_symptom(symptom: str) -> str:
    raw = (symptom or "").strip().lower()
    if raw in SYMPTOM_ALIASES:
        return SYMPTOM_ALIASES[raw]
    spaced = raw.replace("_", " ")
    if spaced in SYMPTOM_ALIASES:
        return SYMPTOM_ALIASES[spaced]
    return raw.replace(" ", "_").replace("-", "_")


def normalize_symptoms(symptoms: list[str] | None) -> list[str]:
    seen: list[str] = []
    for item in symptoms or []:
        value = normalize_symptom(item)
        if value and value not in seen:
            seen.append(value)
    return seen
