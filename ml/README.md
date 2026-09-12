# PRANA ML (P5)

Livestock disease **early-warning / decision-support** helpers.

This output is **not** a confirmed veterinary diagnosis. Do not quote a
fabricated accuracy (for example “98%”).

## What this module does

| Input | Output |
|---|---|
| species, symptoms, affected count, death count, duration | possible disease, confidence, risk 0–100, risk level, zoonotic flag, explanation |

Zoonotic review flags: Avian Influenza, Brucellosis, Anthrax.

## Baseline: transparent rules (default)

No suitable labelled field dataset is in this repository, so the **demo
path is the rule engine** in `ml/rules.py`.

That engine keeps the original prototype patterns (cattle/buffalo FMD,
goat/sheep PPR, poultry Avian Influenza) and adds additional SIH example
syndromes (LSD, Brucellosis, Mastitis, BRD, Anthrax, Contagious Ecthyma,
Newcastle Disease, IBD).

A named disease is suggested only when **at least two** profile symptoms
overlap. Confidence is a bounded heuristic (cap 0.90), not a calibrated
probability.

## Risk

`ml/risk.py` combines:

- affected count
- death count
- rule/model confidence
- symptom count
- duration (optional)
- zoonotic flag

Levels: LOW < 35 ≤ MODERATE < 60 ≤ HIGH < 80 ≤ CRITICAL.

## Optional Random Forest

`ml/train_synthetic.py` can fit a scikit-learn Random Forest on **synthetic
rows labelled by the same rules**. That is a convenience model, not
epidemiological evidence.

It is **off** unless `PRANA_USE_RF=1` and `ml/artifacts/baseline_rf.joblib`
exist. Default demo remains rules.

## Geospatial clustering

`ml/cluster.py` runs DBSCAN on event coordinates with Haversine distance
(`eps` in km, converted to radians for sklearn). Intended for a rolling
window of recent events. A cluster is a **potential spatial grouping**,
not a confirmed outbreak.

Backend `GET /api/clusters` is owned by P4; this module only returns
cluster dicts for the backend/integration to persist.

## Backend adapter

`backend/app/services/ai_service.py` calls `ml.analyze.analyze_health_event`
so `/api/ai/analyze` keeps the documented response shape.

`duration_days` is optional on the request (already in the API contract).

## Assumptions

- Symptom tokens are English snake_case (or simple aliases).
- Species are cattle, buffalo, goat, sheep, poultry (plus a few aliases).
- No laboratory confirmation, vaccination history, or age/breed features.
- Clustering ignores time windows unless the caller pre-filters events.
- Risk and confidence are for MVP triage ranking only.

## Run

From the repository root:

```text
python -m pytest ml/tests backend/tests -q
python -m ml.demo
```
