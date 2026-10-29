-- ==============================================================================
-- V14 : SUPPRESSION DU DOUBLON CNSS (RET-002), DÉDIATION DES CHARGES PATRONALES
-- ET SYNCHRONISATION DYNAMIQUE DE TOUS LES ÉLÉMENTS DE SALAIRE DEPUIS SALARY_ELEMENT
-- Règle V3 : Zéro calcul volatile, intégrité et persistance PostgreSQL
-- ==============================================================================

-- 1. Nettoyage du doublon CNSS inutile dans bulletin_line (ex: RET-002 sans montant)
DELETE FROM bulletin_line 
WHERE code = 'RET-002' 
  AND (montant IS NULL OR montant = 0);

-- Désactiver RET-002 dans la table retenue pour empêcher toute réinjection
UPDATE retenue 
SET actif = FALSE 
WHERE code = 'RET-002';

-- 2. Création / Mise à jour de la ligne DÉDIÉE Charges Patronales CNSS (CHG_PAT_CNSS)
-- Chaque bulletin ayant cotisé à la CNSS dispose de sa ligne patronale distincte de 16%
DO $$
DECLARE
    active_cnss_pat_name VARCHAR(255);
    active_cnss_pat_code VARCHAR(50);
BEGIN
    SELECT code, name INTO active_cnss_pat_code, active_cnss_pat_name
    FROM salary_element 
    WHERE code IN ('CHG_PAT_CNSS', 'COT_PAT_CNSS') AND statut = 'ACTIF'
    ORDER BY CASE WHEN code = 'CHG_PAT_CNSS' THEN 1 ELSE 2 END ASC, id DESC LIMIT 1;

    IF active_cnss_pat_name IS NULL OR active_cnss_pat_name = '' THEN
        active_cnss_pat_name := 'Charges patronales CNSS';
        active_cnss_pat_code := 'CHG_PAT_CNSS';
    END IF;

    -- A. Mettre à jour les lignes patronales CNSS existantes
    UPDATE bulletin_line
    SET code = active_cnss_pat_code,
        libelle = active_cnss_pat_name,
        type_ligne = 'COTISATION_PATRONALE',
        montant = 0.00
    WHERE type_ligne = 'COTISATION_PATRONALE'
      AND (code IN ('CHG_PAT_CNSS', 'COT_PAT_CNSS') OR libelle ILIKE '%charges patronales cnss%');

    -- B. Insérer la ligne patronale CNSS pour les bulletins qui n'en ont pas encore
    INSERT INTO bulletin_line (
        bulletin_id, code, libelle, type_ligne, base_calcul, taux, montant, part_patronale, ordre
    )
    SELECT 
        b.id,
        active_cnss_pat_code,
        active_cnss_pat_name,
        'COTISATION_PATRONALE',
        ROUND(LEAST(COALESCE(b.salaire_brut, 0), 800000.00), 2),
        16.00,
        0.00,
        ROUND(LEAST(COALESCE(b.salaire_brut, 0), 800000.00) * 0.16, 2),
        26
    FROM bulletin b
    WHERE b.cotisation_cnss > 0
      AND NOT EXISTS (
          SELECT 1 FROM bulletin_line bl 
          WHERE bl.bulletin_id = b.id 
            AND bl.type_ligne = 'COTISATION_PATRONALE' 
            AND (bl.code IN ('CHG_PAT_CNSS', 'COT_PAT_CNSS') OR bl.libelle ILIKE '%cnss%')
      );
END $$;

-- 3. Remise à zéro de part_patronale sur la ligne salariale CNSS (RET-001 / COTIS_CNSS)
-- pour éviter tout doublon avec la ligne patronale dédiée CHG_PAT_CNSS
DO $$
DECLARE
    active_cnss_sal_name VARCHAR(255);
    active_cnss_sal_code VARCHAR(50);
BEGIN
    SELECT code, name INTO active_cnss_sal_code, active_cnss_sal_name
    FROM salary_element 
    WHERE code IN ('COTIS_CNSS', 'RET-001') AND statut = 'ACTIF'
    ORDER BY CASE WHEN code = 'COTIS_CNSS' THEN 1 ELSE 2 END ASC, id DESC LIMIT 1;

    IF active_cnss_sal_name IS NOT NULL AND active_cnss_sal_name != '' THEN
        UPDATE bulletin_line
        SET libelle = active_cnss_sal_name,
            code = COALESCE(active_cnss_sal_code, code),
            part_patronale = 0.00
        WHERE type_ligne = 'RETENUE_SOCIALE'
          AND (code IN ('COTIS_CNSS', 'RET-001') OR libelle ILIKE '%cotisation cnss%');
    ELSE
        UPDATE bulletin_line
        SET part_patronale = 0.00
        WHERE type_ligne = 'RETENUE_SOCIALE'
          AND (code IN ('COTIS_CNSS', 'RET-001') OR libelle ILIKE '%cotisation cnss%');
    END IF;
END $$;

-- 4. Synchronisation dynamique du libellé CRRAE patronal (CHG_PAT_CRRAE ou COT_CRRAE)
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
          AND (code IN ('COT_CRRAE', 'CHG_PAT_CRRAE') OR libelle ILIKE '%crrae%');
    END IF;
END $$;

-- 5. Synchronisation dynamique du libellé Salaire de Base depuis salary_element
DO $$
DECLARE
    active_sal_base_name VARCHAR(255);
    active_sal_base_code VARCHAR(50);
BEGIN
    SELECT code, name INTO active_sal_base_code, active_sal_base_name 
    FROM salary_element 
    WHERE code IN ('SAL_BASE', 'SAL_MENSUEL') AND statut = 'ACTIF' 
    ORDER BY CASE WHEN code = 'SAL_BASE' THEN 1 ELSE 2 END ASC, id DESC LIMIT 1;

    IF active_sal_base_name IS NOT NULL AND active_sal_base_name != '' THEN
        UPDATE bulletin_line 
        SET libelle = active_sal_base_name,
            code = COALESCE(active_sal_base_code, code)
        WHERE type_ligne = 'GAIN' 
          AND (code IN ('SAL_BASE', 'SAL_MENSUEL') OR libelle ILIKE '%salaire de base%' OR libelle ILIKE '%salaire mensuel%');
    END IF;
END $$;

-- 6. Synchronisation dynamique du libellé Sur-salaire depuis salary_element
DO $$
DECLARE
    active_sursal_name VARCHAR(255);
    active_sursal_code VARCHAR(50);
BEGIN
    SELECT code, name INTO active_sursal_code, active_sursal_name 
    FROM salary_element 
    WHERE code IN ('SUR_SALAIRE', 'SURSALAIRE') AND statut = 'ACTIF' 
    ORDER BY id DESC LIMIT 1;

    IF active_sursal_name IS NOT NULL AND active_sursal_name != '' THEN
        UPDATE bulletin_line 
        SET libelle = active_sursal_name,
            code = COALESCE(active_sursal_code, code)
        WHERE type_ligne = 'GAIN' 
          AND (code IN ('SUR_SALAIRE', 'SURSALAIRE') OR libelle ILIKE '%sur-salaire%' OR libelle ILIKE '%sursalaire%');
    END IF;
END $$;

-- 6.bis Nettoyage de tout résidu de suffixe de prorata (- XX/30 j ou - XX/30) dans les lignes de bulletin
UPDATE bulletin_line
SET libelle = regexp_replace(libelle, ' - [0-9]+(/[0-9]+)? j?$', '')
WHERE libelle ~ ' - [0-9]+(/[0-9]+)? j?$';

-- 7. Recalcul propre et synchronisation des totaux patronaux réels
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
