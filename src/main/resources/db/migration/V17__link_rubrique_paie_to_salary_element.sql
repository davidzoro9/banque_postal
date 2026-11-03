-- ============================================================================
-- V17 : Liaison dynamique des rubriques de paie aux éléments de salaire paramétrés
--       Lecture automatique du libellé de la rubrique depuis le nom de l'élément
-- ============================================================================

-- 1. Ajout de la colonne salary_element_id dans rubrique_paie
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS salary_element_id BIGINT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_rubrique_salary_element'
    ) THEN
        ALTER TABLE rubrique_paie ADD CONSTRAINT fk_rubrique_salary_element 
        FOREIGN KEY (salary_element_id) REFERENCES salary_element(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 2. Index pour accélérer les requêtes de jointure
CREATE INDEX IF NOT EXISTS idx_rubrique_paie_salary_element ON rubrique_paie(salary_element_id);

-- 3. Synchronisation automatique des libellés et liaison aux éléments de salaire

-- A. Correspondance exacte sur code
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE LOWER(rp.code_rubrique) = LOWER(se.code)
  AND se.name IS NOT NULL AND se.name <> '';

-- B. Correspondance sur code_correspondant
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE se.code_correspondant IS NOT NULL 
  AND LOWER(rp.code_rubrique) = LOWER(se.code_correspondant)
  AND se.name IS NOT NULL AND se.name <> '';

-- C. Correspondances sémantiques officielles BPBF
-- 1. Salaire de base
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE rp.code_rubrique = 'SALAIRE_BASE'
  AND (LOWER(se.code) IN ('sal_base', 'salaire_base', 'sal_mensuel') OR LOWER(se.code_correspondant) = 'salaire_base')
  AND se.name IS NOT NULL AND se.name <> '';

-- 2. Sur-salaire
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE rp.code_rubrique = 'SUR_SALAIRE'
  AND (LOWER(se.code) IN ('sur_salaire', 'sursalaire') OR LOWER(se.code_correspondant) = 'sur_salaire')
  AND se.name IS NOT NULL AND se.name <> '';

-- 3. CNSS salariale
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE rp.code_rubrique = 'CNSS'
  AND LOWER(se.code) IN ('cotis_cnss', 'cnss', 'cot_cnss')
  AND se.name IS NOT NULL AND se.name <> '';

-- 4. CRRAE salariale
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE rp.code_rubrique = 'CRRAE'
  AND LOWER(se.code) IN ('cotis_crrae', 'crrae', 'cot_crrae_agent')
  AND se.name IS NOT NULL AND se.name <> '';

-- 5. IUTS
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE rp.code_rubrique = 'IUTS'
  AND LOWER(se.code) IN ('ret_iuts', 'iuts')
  AND se.name IS NOT NULL AND se.name <> '';

-- 6. FSP
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE rp.code_rubrique = 'FSP'
  AND LOWER(se.code) IN ('ret_fsp', 'fsp')
  AND se.name IS NOT NULL AND se.name <> '';

-- 7. Heures supplémentaires
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE rp.code_rubrique = 'HEURES_SUPP'
  AND LOWER(se.code) IN ('heure_sup', 'heures_supp', 'heures_sup')
  AND se.name IS NOT NULL AND se.name <> '';

-- 8. Congés payés
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE rp.code_rubrique = 'CONGES_PAYES'
  AND LOWER(se.code) IN ('conge_paye', 'conges_payes', 'iccp')
  AND se.name IS NOT NULL AND se.name <> '';

-- 9. Cotisations patronales CNSS
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE rp.code_rubrique = 'COTISATIONS_PATRONALES'
  AND LOWER(se.code) IN ('cot_pat_cnss', 'chg_pat_cnss')
  AND se.name IS NOT NULL AND se.name <> '';

-- 10. Cotisations patronales CRRAE
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE rp.code_rubrique = 'CRRAE_PATRONALE'
  AND LOWER(se.code) IN ('cot_crrae', 'chg_pat_crrae')
  AND se.name IS NOT NULL AND se.name <> '';

-- 11. Net à payer
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE rp.code_rubrique = 'NET_A_PAYER'
  AND LOWER(se.code) IN ('net_a_payer', 'salaire_net')
  AND se.name IS NOT NULL AND se.name <> '';

-- 12. Précomptes
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE rp.code_rubrique = 'PRECOMPTES'
  AND LOWER(se.code) IN ('pret_equip', 'precompte', 'precomptes')
  AND se.name IS NOT NULL AND se.name <> '';

-- 13. Acomptes
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE rp.code_rubrique = 'ACOMPTES'
  AND LOWER(se.code) IN ('avance_sal', 'acompte', 'acomptes')
  AND se.name IS NOT NULL AND se.name <> '';

-- 14. Trop-perçus
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE rp.code_rubrique = 'TROP_PERCUS'
  AND LOWER(se.code) IN ('ret_trop_percu', 'ret_trop_percu_sal', 'trop_percu', 'trop_percus')
  AND se.name IS NOT NULL AND se.name <> '';

-- 15. Rappels
UPDATE rubrique_paie rp
SET salary_element_id = se.id,
    libelle = se.name
FROM salary_element se
WHERE rp.code_rubrique = 'RAPPELS'
  AND LOWER(se.code) IN ('rappel_salaire', 'rappel', 'rappels', 'avoir')
  AND se.name IS NOT NULL AND se.name <> '';

