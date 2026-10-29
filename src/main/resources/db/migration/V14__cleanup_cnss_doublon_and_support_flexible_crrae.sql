-- ==============================================================================
-- V14 : SUPPRESSION DU DOUBLON CNSS (RET-002) ET FLEXIBILITÉ CHARGES PATRONALES
-- Règle V3 : Zéro calcul volatile, intégrité et persistance PostgreSQL
-- ==============================================================================

-- 1. Nettoyage du doublon CNSS dans bulletin_line
-- La part patronale (16% plafonnée) est conservée sur la ligne unique RET-001 / COTIS_CNSS
-- Suppression des lignes doublons RET-002 qui créaient une 2ème cotisation CNSS inutile
DELETE FROM bulletin_line 
WHERE code = 'RET-002' 
  AND (montant IS NULL OR montant = 0);

-- 2. Garantir la part patronale CNSS sur la ligne unique RET-001 / COTIS_CNSS
UPDATE bulletin_line bl
SET part_patronale = ROUND(LEAST(COALESCE(bl.base_calcul, b.salaire_brut, 0), 800000.00) * 0.16, 2)
FROM bulletin b
WHERE bl.bulletin_id = b.id
  AND (bl.code IN ('RET-001', 'COTIS_CNSS') OR bl.libelle ILIKE '%CNSS%')
  AND bl.type_ligne = 'RETENUE_SOCIALE'
  AND (bl.part_patronale IS NULL OR bl.part_patronale = 0);

-- Désactiver RET-002 dans retenue pour empêcher toute réinjection future de la ligne doublon
UPDATE retenue 
SET actif = FALSE 
WHERE code = 'RET-002';

-- 3. Synchronisation souple du libellé CRRAE patronal avec le nom de l'élément actif (CHG_PAT_CRRAE ou COT_CRRAE)
DO $$
DECLARE
    active_crrae_name VARCHAR(255);
    active_crrae_code VARCHAR(50);
BEGIN
    SELECT code, name INTO active_crrae_code, active_crrae_name 
    FROM salary_element 
    WHERE code IN ('CHG_PAT_CRRAE', 'COT_CRRAE') AND statut = 'ACTIF' 
    ORDER BY CASE WHEN code = 'CHG_PAT_CRRAE' THEN 1 ELSE 2 END ASC, id DESC LIMIT 1;

    IF active_crrae_name IS NOT NULL AND active_crrae_name != '' THEN
        UPDATE bulletin_line 
        SET libelle = active_crrae_name,
            code = COALESCE(active_crrae_code, code)
        WHERE type_ligne = 'COTISATION_PATRONALE' 
          AND (code IN ('COT_CRRAE', 'CHG_PAT_CRRAE') OR libelle ILIKE '%CRRAE%');
    END IF;
END $$;

-- 4. Recalcul propre et synchronisation des totaux patronaux réels
UPDATE bulletin b
SET total_cotisations_patronales = (
    SELECT COALESCE(SUM(part_patronale), 0)
    FROM bulletin_line bl
    WHERE bl.bulletin_id = b.id
);

UPDATE session_paie sp
SET total_cotisations_patronales = (
    SELECT COALESCE(SUM(total_cotisations_patronales), 0)
    FROM bulletin b
    WHERE b.session_paie_id = sp.id
);
