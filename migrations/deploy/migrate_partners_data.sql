-- Deploy bondly:migrate_partners_data to pg

BEGIN;

-- =============================================================================
-- MIGRATION DES DONNÉES JSON VERS POSTGRESQL
-- =============================================================================
-- Cette migration importe les données depuis src/data/partners.json
-- et src/data/metadata.json vers les tables PostgreSQL
-- =============================================================================

-- Nettoyer les données existantes
DELETE FROM partner_classifications;
DELETE FROM partner_relations;
DELETE FROM partners;
DELETE FROM classifications;

-- Insérer les classifications prédéfinies
INSERT INTO classifications (name) VALUES 
    ('santé'), ('spécialiste'), ('juridique'), ('affaires'), ('comptabilité'), 
    ('notariat'), ('médecine'), ('banque'), ('finance'), ('assurance'), 
    ('risque'), ('recrutement'), ('affacturage'), ('legal'), ('expertise'),
    ('audit'), ('conseil'), ('gestion'), ('patrimoine'), ('immobilier'),
    ('droit social'), ('droit commercial'), ('fiscalité'), ('paie'),
    ('formation'), ('digital'), ('marketing'), ('communication');

-- Note: Les données JSON spécifiques seront insérées via le script Node.js
-- car PostgreSQL ne peut pas lire directement les fichiers JSON du projet.
-- 
-- Pour migrer les données, exécutez après le déploiement :
-- node scripts/migrate-json-to-postgres-api.mjs

COMMIT;
