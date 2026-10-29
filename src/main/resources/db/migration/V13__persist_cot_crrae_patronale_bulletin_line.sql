-- ==============================================================================
-- V13 : PERSISTANCE DE LA CHARGE PATRONALE CRRAE (COT_CRRAE - 10%) DANS BULLETIN_LINE
-- Formule BPBF : (SAL_BASE + SUR_SALAIRE) * 0.10
-- Règle V3 : Zéro calcul volatile, persistance intégrale PostgreSQL -> BulletinLine
-- ==============================================================================

-- 1. Configuration et fiabilisation de l'élément de salaire COT_CRRAE
DO $$
DECLARE
    cat_pat_id BIGINT;
BEGIN
    SELECT id INTO cat_pat_id 
    FROM element_salary_category 
    WHERE code IN ('CAT_CHG_PATRONALES', 'CAT_COTIS_PATRONALES') 
       OR LOWER(name) LIKE '%charge%patronal%'
    ORDER BY id ASC LIMIT 1;

    IF cat_pat_id IS NULL THEN
        INSERT INTO element_salary_category (code, name, type)
        VALUES ('CAT_CHG_PATRONALES', 'Charges patronales', 'PATRONALE')
        RETURNING id INTO cat_pat_id;
    END IF;

    IF EXISTS (SELECT 1 FROM salary_element WHERE code = 'COT_CRRAE') THEN
        UPDATE salary_element
        SET name = 'Charges patronale CRRAE',
            salary_category_id = cat_pat_id,
            rate = 10.0000,
            method_calcul = 'FORMULE_COMPLEXE',
            formule = '(SAL_BASE + SUR_SALAIRE)*0,1',
            ordre = 30,
            statut = 'ACTIF',
            is_cotisable = FALSE,
            is_imposable = FALSE
        WHERE code = 'COT_CRRAE';
    ELSE
        INSERT INTO salary_element (code, name, salary_category_id, rate, is_cotisable, is_imposable, method_calcul, formule, ordre, statut)
        VALUES ('COT_CRRAE', 'Charges patronale CRRAE', cat_pat_id, 10.0000, FALSE, FALSE, 'FORMULE_COMPLEXE', '(SAL_BASE + SUR_SALAIRE)*0,1', 30, 'ACTIF');
    END IF;
END $$;

-- 2. Insertion de la ligne COT_CRRAE dans bulletin_line pour tous les bulletins ordinaires éligibles
INSERT INTO bulletin_line (bulletin_id, code, libelle, type_ligne, base_calcul, taux, montant, part_patronale, ordre)
SELECT 
    b.id,
    'COT_CRRAE',
    'Charges patronale CRRAE',
    'COTISATION_PATRONALE',
    ROUND(COALESCE(b.salaire_base, 0) + COALESCE(b.sur_salaire, 0), 2),
    10.00,
    0.00,
    ROUND((COALESCE(b.salaire_base, 0) + COALESCE(b.sur_salaire, 0)) * 0.10, 2),
    30
FROM bulletin b
LEFT JOIN session_paie sp ON b.session_paie_id = sp.id
WHERE (COALESCE(b.salaire_base, 0) + COALESCE(b.sur_salaire, 0)) > 0
  AND COALESCE(b.nature_session, sp.nature_session, '') NOT IN ('13EME_MOIS', '14EME_MOIS', 'EXTRAORDINAIRE')
  AND NOT EXISTS (
      SELECT 1 FROM bulletin_line bl 
      WHERE bl.bulletin_id = b.id 
        AND bl.code = 'COT_CRRAE'
  );

-- 3. Mise à jour des lignes COT_CRRAE déjà existantes pour garantir taux (10%), base et montant patronal
UPDATE bulletin_line bl
SET libelle = 'Charges patronale CRRAE',
    type_ligne = 'COTISATION_PATRONALE',
    base_calcul = ROUND(COALESCE(b.salaire_base, 0) + COALESCE(b.sur_salaire, 0), 2),
    taux = 10.00,
    montant = 0.00,
    part_patronale = ROUND((COALESCE(b.salaire_base, 0) + COALESCE(b.sur_salaire, 0)) * 0.10, 2),
    ordre = 30
FROM bulletin b
WHERE bl.bulletin_id = b.id
  AND bl.code = 'COT_CRRAE'
  AND (COALESCE(b.salaire_base, 0) + COALESCE(b.sur_salaire, 0)) > 0;

-- 4. Nettoyage de la part patronale résiduelle sur les lignes salariales CRRAE (RET-005, COTIS_CRRAE)
-- afin d'éviter tout doublon puisque la part patronale est désormais stockée sur COT_CRRAE
UPDATE bulletin_line
SET part_patronale = 0.00
WHERE (code = 'RET-005' OR code = 'COTIS_CRRAE' OR (code ILIKE '%CRRAE%' AND type_ligne != 'COTISATION_PATRONALE'))
  AND code != 'COT_CRRAE'
  AND part_patronale > 0;

-- 5. Nettoyage des anciennes lignes patronales obsolètes (ex: RET-006 avec 6%) pour ne pas fausser le cumul
UPDATE bulletin_line
SET part_patronale = 0.00
WHERE code = 'RET-006' 
  AND (libelle ILIKE '%CRRAE%' OR libelle ILIKE '%RCPNC%')
  AND part_patronale > 0;

-- 6. Recalcul et mise à jour de total_cotisations_patronales sur chaque bulletin
UPDATE bulletin b
SET total_cotisations_patronales = COALESCE((
    SELECT SUM(COALESCE(bl.part_patronale, 0))
    FROM bulletin_line bl
    WHERE bl.bulletin_id = b.id
), 0.00);

-- 7. Recalcul et mise à jour de total_cotisations_patronales et masse salariale sur session_paie
UPDATE session_paie sp
SET total_cotisations_patronales = COALESCE((
    SELECT SUM(COALESCE(b.total_cotisations_patronales, 0))
    FROM bulletin b
    WHERE b.session_paie_id = sp.id
), 0.00),
total_masse_salariale = COALESCE((
    SELECT SUM(COALESCE(b.salaire_brut, 0) + COALESCE(b.total_cotisations_patronales, 0))
    FROM bulletin b
    WHERE b.session_paie_id = sp.id
), 0.00);
