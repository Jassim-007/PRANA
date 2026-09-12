# PRANA — Database Design

## 1. Overview

PRANA uses PostgreSQL as the primary relational database.

The database stores livestock farms, health events, AI analysis, geographic clusters, alerts, field-worker assignments and veterinary feedback.

The central entity is the `health_events` table.

The overall flow is:

Farm
↓
Health Event
↓
AI Prediction
↓
Geospatial Cluster
↓
Alert
↓
Veterinary / Field Action
↓
Feedback

---

# 2. Tables

PRANA MVP contains the following tables:

1. farms
2. field_workers
3. field_worker_assignments
4. health_events
5. ai_predictions
6. clusters
7. cluster_events
8. alerts
9. vet_feedback

---

# 3. FARMS

Table:

`farms`

Stores registered livestock farms.

### Fields

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | VARCHAR | Farm name |
| owner_name | VARCHAR | Farm owner |
| village | VARCHAR | Village |
| block | VARCHAR | Administrative block |
| district | VARCHAR | District |
| latitude | DOUBLE | GPS latitude |
| longitude | DOUBLE | GPS longitude |
| species | VARCHAR | Main livestock species |
| animal_count | INTEGER | Approximate number of animals |
| created_at | TIMESTAMP | Creation time |

---

# 4. FIELD WORKERS

Table:

`field_workers`

Stores field veterinary workers.

### Fields

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | VARCHAR | Worker name |
| phone | VARCHAR | Contact number |
| region | VARCHAR | Assigned region |
| assigned_area | VARCHAR | Assigned geographical area |
| status | VARCHAR | available / busy / inactive |

---

# 5. FIELD WORKER ASSIGNMENTS

Table:

`field_worker_assignments`

Connects field workers to farms.

This allows one field worker to handle multiple farms and allows assignments to change over time.

### Fields

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| field_worker_id | UUID | Field worker |
| farm_id | UUID | Assigned farm |
| assigned_at | TIMESTAMP | Assignment time |
| status | VARCHAR | active / completed |

---

# 6. HEALTH EVENTS

Table:

`health_events`

This is the central table in PRANA.

A Health Event represents an observation or occurrence related to livestock health.

Health Events can originate from:

- farmer
- field worker
- veterinary officer

### Fields

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| farm_id | UUID | Related farm |
| source | VARCHAR | farmer / field_worker / vet |
| species | VARCHAR | Livestock species |
| event_type | VARCHAR | Type of health event |
| symptoms | JSONB | Structured symptoms |
| affected_count | INTEGER | Number affected |
| death_count | INTEGER | Number of deaths |
| duration_days | INTEGER | Duration |
| notes | TEXT | Additional observations |
| latitude | DOUBLE | Event latitude |
| longitude | DOUBLE | Event longitude |
| status | VARCHAR | open / under_review / resolved |
| created_at | TIMESTAMP | Event creation time |

### Supported species

- cattle
- buffalo
- goat
- sheep
- poultry

### Event types

- illness
- death
- recovery
- production_drop
- vaccination
- treatment
- animal_movement
- new_animal
- unusual_observation

---

# 7. AI PREDICTIONS

Table:

`ai_predictions`

Stores AI analysis associated with a Health Event.

The AI result is decision support and must not be treated as a confirmed veterinary diagnosis.

### Fields

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| health_event_id | UUID | Related Health Event |
| disease | VARCHAR | Possible disease |
| confidence | DOUBLE | Model confidence |
| risk_score | INTEGER | 0–100 |
| risk_level | VARCHAR | LOW / MODERATE / HIGH / CRITICAL |
| zoonotic_flag | BOOLEAN | Potential public-health relevance |
| explanation | JSONB | Explanation factors |
| created_at | TIMESTAMP | Analysis time |

---

# 8. CLUSTERS

Table:

`clusters`

Stores geographic clusters detected by the geospatial analysis system.

A cluster represents a group of geographically close, potentially related Health Events.

### Fields

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| disease | VARCHAR | Associated possible disease |
| latitude | DOUBLE | Cluster center |
| longitude | DOUBLE | Cluster center |
| radius_km | DOUBLE | Approximate cluster radius |
| event_count | INTEGER | Number of events |
| affected_count | INTEGER | Total affected animals |
| risk_level | VARCHAR | Cluster risk |
| detected_at | TIMESTAMP | Detection time |

---

# 9. CLUSTER EVENTS

Table:

`cluster_events`

Connects Health Events to geographic clusters.

This is a many-to-many relationship.

A Health Event may belong to a cluster, and a cluster contains multiple Health Events.

### Fields

| Field | Type | Description |
|---|---|---|
| cluster_id | UUID | Cluster |
| health_event_id | UUID | Health Event |

Primary key:

`cluster_id + health_event_id`

---

# 10. ALERTS

Table:

`alerts`

Stores alerts generated from clusters or high-risk health events.

### Fields

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| cluster_id | UUID | Related cluster |
| type | VARCHAR | Alert type |
| severity | VARCHAR | Alert severity |
| title | VARCHAR | Alert title |
| message | TEXT | Alert description |
| status | VARCHAR | active / acknowledged / resolved |
| created_at | TIMESTAMP | Creation time |

---

# 11. VETERINARY FEEDBACK

Table:

`vet_feedback`

Stores veterinary review and field-action information.

### Fields

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| health_event_id | UUID | Related Health Event |
| vet_id | VARCHAR | Veterinary officer identifier |
| decision | VARCHAR | confirmed / rejected / needs_followup |
| notes | TEXT | Veterinary observations |
| action_taken | TEXT | Action taken |
| created_at | TIMESTAMP | Feedback time |

---

# 12. RELATIONSHIPS

## Farm → Health Events

One farm can have many Health Events.

```text
farms 1 ──────── * health_events