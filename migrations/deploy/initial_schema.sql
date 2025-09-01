-- Deploy bondly:initial_schema to pg

BEGIN;

-- =============================================================================
-- SCHEMA POSTGRESQL MVP - BONDLY
-- =============================================================================
-- Version minimale pour MVP - seulement les champs nécessaires
-- =============================================================================

-- Extensions minimales
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABLES MVP
-- =============================================================================

-- Utilisateurs (minimal pour auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Partenaires (exactement comme vos données JSON)
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firstname VARCHAR(100) NOT NULL,              -- Comme JSON
    lastname VARCHAR(100) NOT NULL,               -- Comme JSON
    job VARCHAR(200),                             -- Comme JSON
    email VARCHAR(255),                           -- Comme JSON
    phone VARCHAR(50),                            -- Comme JSON
    company VARCHAR(200) NOT NULL,               -- Comme JSON
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- Comme JSON
    status VARCHAR(20) NOT NULL DEFAULT 'active'  -- Comme JSON
        CHECK (status IN ('active', 'archived', 'blacklisted')),
    comment TEXT,                                 -- Comme JSON (pas chiffré MVP)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Classifications (simple pour MVP)
CREATE TABLE classifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Liaison partners <-> classifications (simple)
CREATE TABLE partner_classifications (
    partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
    classification_name VARCHAR(100) NOT NULL, -- Direct, pas de FK pour MVP
    PRIMARY KEY (partner_id, classification_name)
);

-- Relations (simple pour MVP)
CREATE TABLE partner_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
    related_partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
    relation_type VARCHAR(50) DEFAULT 'collaboration',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT no_self_relation CHECK (partner_id != related_partner_id),
    UNIQUE(partner_id, related_partner_id)
);

-- =============================================================================
-- INDEX MINIMAUX POUR PERFORMANCE
-- =============================================================================

CREATE INDEX idx_partners_status ON partners(status);
CREATE INDEX idx_partners_company ON partners(company);

-- =============================================================================
-- TRIGGER SIMPLE POUR updated_at
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER partners_updated_at 
    BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- DONNÉES DE TEST (migration depuis JSON)
-- =============================================================================

-- Classifications depuis vos données
INSERT INTO classifications (name) VALUES 
    ('santé'), ('spécialiste'), ('juridique'), ('affaires'),
    ('comptabilité'), ('notariat'), ('médecine'), ('banque'), 
    ('finance'), ('assurance'), ('risque'), ('recrutement'), ('affacturage');

-- Admin utilisateur
INSERT INTO users (email, password_hash, first_name, last_name)
VALUES ('admin@bondly.fr', '$2b$12$dummy', 'Admin', 'Bondly');

COMMIT;
