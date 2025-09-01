-- Revert bondly:initial_schema from pg

BEGIN;

-- Suppression des tables dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS partner_relations CASCADE;
DROP TABLE IF EXISTS partner_classifications CASCADE;
DROP TABLE IF EXISTS classifications CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Suppression de la fonction trigger
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;

-- Note: on ne supprime pas l'extension uuid-ossp car elle pourrait être utilisée ailleurs

COMMIT;
