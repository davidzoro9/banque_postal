-- =========================================================================
-- MIGRATION FLYWAY V3 : GARANTIR LES LIENS ET INDEXES POUR DEMANDE_BULLETIN
-- ET OPTIMISATION DES REQUETES DE RETENUES SALARIALES
-- =========================================================================

-- 1. Colonnes bulletin_id et session_id sur demande_bulletin
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS bulletin_id BIGINT;
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS session_id BIGINT;

-- 2. Index de recherche rapide pour les bulletins et sessions associés
CREATE INDEX IF NOT EXISTS idx_demande_bull_bulletin ON demande_bulletin(bulletin_id);
CREATE INDEX IF NOT EXISTS idx_demande_bull_session ON demande_bulletin(session_id);

-- 3. Index de performance sur les retenues salariales pour éviter les verrous lors des calculs concurrents
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'information_salariale_retenue') THEN
        CREATE INDEX IF NOT EXISTS idx_info_sal_ret_info_id ON information_salariale_retenue(information_salariale_id);
        CREATE INDEX IF NOT EXISTS idx_info_sal_ret_ret_id ON information_salariale_retenue(retenue_id);
    END IF;
END $$;
