-- =========================================================================
-- MIGRATION FLYWAY V2 : SUPPORT DU TYPE DE BULLETIN & SESSION DANS DEMANDE_BULLETIN
-- =========================================================================

-- 1. Ajout de la colonne type_bulletin
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS type_bulletin VARCHAR(100);

-- 2. Valeur par défaut pour les demandes existantes
UPDATE demande_bulletin SET type_bulletin = 'ORDINAIRE' WHERE type_bulletin IS NULL;

-- 3. Indexation pour les performances
CREATE INDEX IF NOT EXISTS idx_demande_bull_emp ON demande_bulletin(employee_id);
CREATE INDEX IF NOT EXISTS idx_demande_bull_statut ON demande_bulletin(statut);
