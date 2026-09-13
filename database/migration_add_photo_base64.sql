-- Additive migration: adds optional photo storage to health_events.
-- Safe to run on an existing database — does not touch any existing
-- column, constraint, or row. Run this once if your database was
-- created before this column existed in schema.sql.

ALTER TABLE health_events
    ADD COLUMN IF NOT EXISTS photo_base64 TEXT;
