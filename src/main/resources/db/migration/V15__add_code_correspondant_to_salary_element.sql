-- ==============================================================================
-- V15 : AJOUT DU CHAMP CODE_CORRESPONDANT (GESTION ADMIN)
-- ET FORÇAGE CASSE : CODES EN MINUSCULES, NOMS EN MAJUSCULES
-- Règle V3 : Intégrité des données, cohérence Full-Stack PostgreSQL -> Spring -> Angular
-- ==============================================================================

-- 1. Ajout de la colonne code_correspondant dans salary_element
ALTER TABLE salary_element ADD COLUMN IF NOT EXISTS code_correspondant VARCHAR(100);

-- 2. Forcer tous les codes de salary_element en minuscules
UPDATE salary_element
SET code = LOWER(TRIM(code));

-- 3. Forcer tous les noms de salary_element en majuscules
UPDATE salary_element
SET name = UPPER(TRIM(name));

-- 4. Initialisation des codes correspondants Gestion Admin (noms exacts des colonnes table information_salariale)
UPDATE salary_element
SET code_correspondant = CASE
    WHEN LOWER(code) IN ('sal_base', 'sal_mensuel', 'salaire_base', 'salbase') THEN 'salaire_base'
    WHEN LOWER(code) IN ('sursalaire', 'sur_salaire') THEN 'sur_salaire'
    WHEN LOWER(code) LIKE '%logement%' OR LOWER(code) LIKE '%log%' THEN 'ind-log'
    WHEN LOWER(code) LIKE '%transport%' OR LOWER(code) LIKE '%trp%' THEN 'ind-trp'
    WHEN LOWER(code) LIKE '%fonction%' OR LOWER(code) LIKE '%fonc%' THEN 'ind-fonc'
    WHEN LOWER(code) LIKE '%caisse%' THEN 'ind-caisse'
    WHEN LOWER(code) LIKE '%suj%' THEN 'ind-suj'
    ELSE LOWER(code)
END
WHERE code_correspondant IS NULL OR code_correspondant IN ('sal_base', 'sursalaire');

-- 5. Harmonisation des méthodes de calcul vers MONTANT_FIXE ou FORMULE_COMPLEXE
UPDATE salary_element
SET method_calcul = CASE
    WHEN UPPER(method_calcul) IN ('FORMULE', 'FORMULE_COMPLEXE', 'POURCENTAGE') THEN 'FORMULE_COMPLEXE'
    ELSE 'MONTANT_FIXE'
END
WHERE method_calcul IS NOT NULL;

-- 6. Correction dans bulletin_line : réaffecter les lignes de salaire de base qui auraient été étiquetées RET_TROP_PERCU_SAL
UPDATE bulletin_line
SET code = 'sal_base', libelle = 'SALAIRE DE BASE'
WHERE code = 'RET_TROP_PERCU_SAL' AND type_ligne = 'GAIN' AND montant > 0;

