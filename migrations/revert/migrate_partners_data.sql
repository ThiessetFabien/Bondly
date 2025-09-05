-- Revert bondly:migrate_partners_data from pg

BEGIN;

-- =============================================================================
-- REVERT MIGRATION DES DONNÉES
-- =============================================================================
-- Supprime toutes les données migrées
-- =============================================================================

-- Supprimer les données dans l'ordre inverse des dépendances
DELETE FROM partner_classifications;
DELETE FROM partner_relations;
DELETE FROM partners;
DELETE FROM classifications;

COMMIT;
