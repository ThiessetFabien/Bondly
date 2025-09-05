-- Verify bondly:migrate_partners_data on pg

BEGIN;

-- =============================================================================
-- VERIFICATION DE LA MIGRATION DES DONNÉES
-- =============================================================================
-- Vérifie que les données ont été correctement migrées
-- =============================================================================

-- Vérifier que les classifications existent
SELECT 1/COUNT(*) FROM classifications WHERE name IN ('santé', 'juridique', 'comptabilité');

-- Vérifier que les tables sont prêtes pour les données
SELECT 1 FROM partners LIMIT 0;
SELECT 1 FROM partner_classifications LIMIT 0;

-- Note: Cette vérification ne vérifie que les structures et classifications de base
-- Les données JSON spécifiques sont vérifiées par le script Node.js

ROLLBACK;
