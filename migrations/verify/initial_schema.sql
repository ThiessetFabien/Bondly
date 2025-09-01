-- Verify bondly:initial_schema on pg

BEGIN;

-- Vérification que toutes les tables existent
SELECT 1/COUNT(*) FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public';
SELECT 1/COUNT(*) FROM information_schema.tables WHERE table_name = 'partners' AND table_schema = 'public';
SELECT 1/COUNT(*) FROM information_schema.tables WHERE table_name = 'classifications' AND table_schema = 'public';
SELECT 1/COUNT(*) FROM information_schema.tables WHERE table_name = 'partner_classifications' AND table_schema = 'public';
SELECT 1/COUNT(*) FROM information_schema.tables WHERE table_name = 'partner_relations' AND table_schema = 'public';

-- Vérification que la fonction trigger existe
SELECT 1/COUNT(*) FROM information_schema.routines 
WHERE routine_name = 'update_updated_at' AND routine_schema = 'public';

-- Vérification que les index existent
SELECT 1/COUNT(*) FROM pg_indexes WHERE indexname = 'idx_partners_status';
SELECT 1/COUNT(*) FROM pg_indexes WHERE indexname = 'idx_partners_company';

-- Vérification que les classifications de base existent
SELECT 1/COUNT(*) FROM classifications WHERE name IN ('santé', 'juridique', 'affaires');

ROLLBACK;
