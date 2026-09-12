# PRANA — API Contract

## 1. Overview

PRANA is a livestock health surveillance and early-warning platform.

All frontend modules communicate with the backend through REST APIs.

The frontend must NOT directly access the database.

Architecture:

Frontend
    ↓
FastAPI Backend
    ↓
PostgreSQL / Supabase

AI, risk analysis and geospatial analysis are accessed through the backend.

---

# 2. Base URL

Development:

http://localhost:8000

All API endpoints begin with:

/api

Example:

http://localhost:8000/api/health-events

---

# 3. Common Rules

## Response Format

Successful responses should return JSON.

Errors should return:

{
  "detail": "Human-readable error message"
}

## IDs

Use UUID/string identifiers.

## Timestamps

Use ISO 8601 format.

Example:

2026-09-12T14:30:00Z

## Risk Levels

LOW
MODERATE
HIGH
CRITICAL

## Supported Species

cattle
buffalo
goat
sheep
poultry

---

# 4. HEALTH EVENTS

Health Events are the central data object in PRANA.

A Health Event may originate from:

- farmer
- field_worker
- vet

---

## POST /api/health-events

Create a new health event.

### Request

{
  "source": "farmer",
  "farm_id": "F001",
  "species": "cattle",
  "event_type": "illness",
  "symptoms": [
    "fever",
    "mouth_lesions",
    "lameness"
  ],
  "affected_count": 8,
  "death_count": 1,
  "duration_days": 2,
  "latitude": 10.123,
  "longitude": 76.456,
  "notes": "Animals are not eating properly"
}

### Required Fields

source
farm_id
species
event_type

### Optional Fields

symptoms
affected_count
death_count
duration_days
latitude
longitude
notes

### Response

{
  "id": "HE001",
  "status": "created",
  "message": "Health event created successfully"
}

---

# 5. GET HEALTH EVENTS

## GET /api/health-events

Return health events.

Optional filters:

- species
- source
- event_type
- risk_level
- status
- district

Example:

GET /api/health-events?species=cattle

### Response

{
  "events": [
    {
      "id": "HE001",
      "farm_id": "F001",
      "source": "farmer",
      "species": "cattle",
      "event_type": "illness",
      "affected_count": 8,
      "death_count": 1,
      "created_at": "2026-09-12T14:30:00Z"
    }
  ]
}

---

# 6. GET SINGLE HEALTH EVENT

## GET /api/health-events/{id}

Example:

GET /api/health-events/HE001

### Response

{
  "id": "HE001",
  "farm_id": "F001",
  "source": "farmer",
  "species": "cattle",
  "event_type": "illness",
  "symptoms": [
    "fever",
    "mouth_lesions",
    "lameness"
  ],
  "affected_count": 8,
  "death_count": 1,
  "duration_days": 2,
  "latitude": 10.123,
  "longitude": 76.456,
  "notes": "Animals are not eating properly",
  "status": "open",
  "created_at": "2026-09-12T14:30:00Z"
}

---

# 7. FARMS

## GET /api/farms

Return farms.

### Response

{
  "farms": [
    {
      "id": "F001",
      "name": "Green Valley Farm",
      "village": "Village A",
      "block": "Block 1",
      "district": "District X",
      "latitude": 10.123,
      "longitude": 76.456,
      "species": "cattle",
      "animal_count": 24
    }
  ]
}

---

# 8. GET SINGLE FARM

## GET /api/farms/{id}

Return details of one farm.

---

# 9. FARM HEALTH EVENTS

## GET /api/farms/{id}/health-events

Return all health events associated with a farm.

---

# 10. AI ANALYSIS

## POST /api/ai/analyze

Analyze a health event.

The AI pipeline may include:

LLM symptom extraction
→ disease prediction
→ risk analysis
→ zoonotic flag

The AI output is decision support.

It is NOT a confirmed veterinary diagnosis.

### Request

{
  "species": "cattle",
  "symptoms": [
    "fever",
    "mouth_lesions",
    "lameness"
  ],
  "affected_count": 8,
  "death_count": 1,
  "duration_days": 2
}

### Response

{
  "prediction": {
    "disease": "FMD",
    "confidence": 0.82
  },
  "risk": {
    "score": 87,
    "level": "CRITICAL"
  },
  "zoonotic": {
    "flag": false
  },
  "explanation": [
    "Mouth lesions reported",
    "Lameness reported",
    "Multiple animals affected"
  ]
}

---

# 11. CLUSTERS

## GET /api/clusters

Return detected geographic health-event clusters.

### Response

{
  "clusters": [
    {
      "id": "CL001",
      "disease": "FMD",
      "latitude": 10.125,
      "longitude": 76.459,
      "radius_km": 3.2,
      "event_count": 5,
      "affected_count": 27,
      "risk_level": "CRITICAL"
    }
  ]
}

---

# 12. ALERTS

## GET /api/alerts

Return active alerts.

### Response

{
  "alerts": [
    {
      "id": "A001",
      "type": "potential_outbreak",
      "severity": "critical",
      "title": "Potential FMD Cluster",
      "message": "Multiple similar health events detected nearby.",
      "status": "active",
      "created_at": "2026-09-12T14:30:00Z"
    }
  ]
}

---

# 13. DASHBOARD

## GET /api/dashboard

Return summary statistics for the veterinary dashboard.

### Response

{
  "summary": {
    "total_farms": 120,
    "active_events": 18,
    "critical_events": 4,
    "high_risk_events": 11,
    "active_clusters": 3,
    "active_alerts": 5
  }
}

---

# 14. DASHBOARD TRENDS

## GET /api/dashboard/trends

Return health-event trends.

### Response

{
  "trends": [
    {
      "date": "2026-09-08",
      "event_count": 4
    },
    {
      "date": "2026-09-09",
      "event_count": 7
    }
  ]
}

---

# 15. FIELD WORKERS

## GET /api/field-workers

Return field veterinary workers.

### Response

{
  "field_workers": [
    {
      "id": "FW001",
      "name": "Field Worker 1",
      "region": "Region A",
      "assigned_area": "Block 1",
      "status": "available"
    }
  ]
}

---

# 16. FIELD WORKER FARMS

## GET /api/field-workers/{id}/farms

Return farms assigned to a field worker.

---

# 17. VETERINARY FEEDBACK

## POST /api/health-events/{id}/feedback

Record veterinary review of a health event.

### Request

{
  "vet_id": "V001",
  "decision": "needs_followup",
  "notes": "Similar symptoms observed in nearby animals.",
  "action_taken": "Isolation advised and field investigation requested."
}

### Allowed Decisions

confirmed
rejected
needs_followup

### Response

{
  "status": "recorded",
  "message": "Veterinary feedback recorded successfully"
}

---

# 18. HEALTH CHECK

## GET /health

Used to verify that the backend is running.

### Response

{
  "status": "ok",
  "service": "PRANA API"
}

---

# 19. API FLOW

Typical health-event flow:

Farmer / Field Worker
        ↓
POST /api/health-events
        ↓
Health Event stored
        ↓
AI analysis
        ↓
Risk calculation
        ↓
Geospatial analysis
        ↓
Cluster detection
        ↓
Alert generation
        ↓
Vet Dashboard
        ↓
Field investigation
        ↓
Veterinary feedback

---

# 20. IMPORTANT TEAM RULE

All developers MUST follow this API contract.

Do NOT independently change:

- field names
- endpoint names
- species values
- event types
- risk levels
- response structures

If a change is necessary, discuss it with the integration lead before changing the contract.