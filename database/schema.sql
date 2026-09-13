-- ============================================================
-- PRANA
-- Livestock Health Surveillance & Early-Warning Platform
-- PostgreSQL Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- 1. FARMS
-- ============================================================

CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,
    owner_name VARCHAR(150),

    village VARCHAR(150),
    block VARCHAR(150),
    district VARCHAR(150),

    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,

    species VARCHAR(50) NOT NULL,
    animal_count INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT farms_species_check
        CHECK (
            species IN (
                'cattle',
                'buffalo',
                'goat',
                'sheep',
                'poultry'
            )
        )
);


-- ============================================================
-- 2. FIELD WORKERS
-- ============================================================

CREATE TABLE IF NOT EXISTS field_workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),

    region VARCHAR(150),
    assigned_area VARCHAR(150),

    status VARCHAR(30) DEFAULT 'available',

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT field_workers_status_check
        CHECK (
            status IN (
                'available',
                'busy',
                'inactive'
            )
        )
);


-- ============================================================
-- 3. FIELD WORKER ASSIGNMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS field_worker_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    field_worker_id UUID NOT NULL
        REFERENCES field_workers(id)
        ON DELETE CASCADE,

    farm_id UUID NOT NULL
        REFERENCES farms(id)
        ON DELETE CASCADE,

    assigned_at TIMESTAMPTZ DEFAULT NOW(),

    status VARCHAR(30) DEFAULT 'active',

    CONSTRAINT assignment_status_check
        CHECK (
            status IN (
                'active',
                'completed'
            )
        )
);


-- ============================================================
-- 4. HEALTH EVENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS health_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    farm_id UUID NOT NULL
        REFERENCES farms(id)
        ON DELETE CASCADE,

    source VARCHAR(30) NOT NULL,

    species VARCHAR(50) NOT NULL,

    event_type VARCHAR(50) NOT NULL,

    symptoms JSONB DEFAULT '[]'::jsonb,

    affected_count INTEGER DEFAULT 0,

    death_count INTEGER DEFAULT 0,

    duration_days INTEGER,

    notes TEXT,

    -- Optional field photo captured by farmer/field worker, stored as a
    -- base64 data URL. Additive column: nullable, no impact on existing
    -- rows or on any query that doesn't reference it.
    photo_base64 TEXT,

    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,

    status VARCHAR(30) DEFAULT 'open',

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT health_event_source_check
        CHECK (
            source IN (
                'farmer',
                'field_worker',
                'vet'
            )
        ),

    CONSTRAINT health_event_species_check
        CHECK (
            species IN (
                'cattle',
                'buffalo',
                'goat',
                'sheep',
                'poultry'
            )
        ),

    CONSTRAINT health_event_type_check
        CHECK (
            event_type IN (
                'illness',
                'death',
                'recovery',
                'production_drop',
                'vaccination',
                'treatment',
                'animal_movement',
                'new_animal',
                'unusual_observation'
            )
        ),

    CONSTRAINT health_event_status_check
        CHECK (
            status IN (
                'open',
                'under_review',
                'resolved'
            )
        ),

    CONSTRAINT health_event_counts_check
        CHECK (
            affected_count >= 0
            AND death_count >= 0
        )
);


-- ============================================================
-- 5. AI PREDICTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    health_event_id UUID NOT NULL
        REFERENCES health_events(id)
        ON DELETE CASCADE,

    disease VARCHAR(150),

    confidence DOUBLE PRECISION,

    risk_score INTEGER,

    risk_level VARCHAR(30),

    zoonotic_flag BOOLEAN DEFAULT FALSE,

    explanation JSONB DEFAULT '[]'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT ai_confidence_check
        CHECK (
            confidence IS NULL
            OR (
                confidence >= 0
                AND confidence <= 1
            )
        ),

    CONSTRAINT ai_risk_score_check
        CHECK (
            risk_score IS NULL
            OR (
                risk_score >= 0
                AND risk_score <= 100
            )
        ),

    CONSTRAINT ai_risk_level_check
        CHECK (
            risk_level IS NULL
            OR risk_level IN (
                'LOW',
                'MODERATE',
                'HIGH',
                'CRITICAL'
            )
        )
);


-- ============================================================
-- 6. CLUSTERS
-- ============================================================

CREATE TABLE IF NOT EXISTS clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    disease VARCHAR(150),

    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,

    radius_km DOUBLE PRECISION DEFAULT 0,

    event_count INTEGER DEFAULT 0,

    affected_count INTEGER DEFAULT 0,

    risk_level VARCHAR(30),

    detected_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT cluster_risk_level_check
        CHECK (
            risk_level IS NULL
            OR risk_level IN (
                'LOW',
                'MODERATE',
                'HIGH',
                'CRITICAL'
            )
        )
);


-- ============================================================
-- 7. CLUSTER EVENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS cluster_events (
    cluster_id UUID NOT NULL
        REFERENCES clusters(id)
        ON DELETE CASCADE,

    health_event_id UUID NOT NULL
        REFERENCES health_events(id)
        ON DELETE CASCADE,

    PRIMARY KEY (
        cluster_id,
        health_event_id
    )
);


-- ============================================================
-- 8. ALERTS
-- ============================================================

CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    cluster_id UUID
        REFERENCES clusters(id)
        ON DELETE SET NULL,

    type VARCHAR(50) NOT NULL,

    severity VARCHAR(30) NOT NULL,

    title VARCHAR(200) NOT NULL,

    message TEXT,

    status VARCHAR(30) DEFAULT 'active',

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT alert_status_check
        CHECK (
            status IN (
                'active',
                'acknowledged',
                'resolved'
            )
        )
);


-- ============================================================
-- 9. VETERINARY FEEDBACK
-- ============================================================

CREATE TABLE IF NOT EXISTS vet_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    health_event_id UUID NOT NULL
        REFERENCES health_events(id)
        ON DELETE CASCADE,

    vet_id VARCHAR(100) NOT NULL,

    decision VARCHAR(30) NOT NULL,

    notes TEXT,

    action_taken TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT vet_decision_check
        CHECK (
            decision IN (
                'confirmed',
                'rejected',
                'needs_followup'
            )
        )
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_health_events_farm
    ON health_events(farm_id);

CREATE INDEX IF NOT EXISTS idx_health_events_species
    ON health_events(species);

CREATE INDEX IF NOT EXISTS idx_health_events_source
    ON health_events(source);

CREATE INDEX IF NOT EXISTS idx_health_events_created_at
    ON health_events(created_at);

CREATE INDEX IF NOT EXISTS idx_health_events_location
    ON health_events(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_ai_predictions_event
    ON ai_predictions(health_event_id);

CREATE INDEX IF NOT EXISTS idx_clusters_location
    ON clusters(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_alerts_status
    ON alerts(status);

CREATE INDEX IF NOT EXISTS idx_feedback_event
    ON vet_feedback(health_event_id);