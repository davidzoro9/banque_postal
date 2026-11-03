-- ============================================================================
-- V18 : Catégories parentes officielles RAPPEL, TROP PERCU, PRECOMPTES
--       Réattribution des éléments de salaire et harmonisation
-- ============================================================================

-- 1. Catégorie RAPPEL (Gain)
INSERT INTO element_salary_category (code, name, type)
VALUES ('CAT_RAPPEL', 'RAPPEL', 'GAIN')
ON CONFLICT (code) DO UPDATE
SET name = 'RAPPEL', type = 'GAIN';

UPDATE element_salary_category
SET name = 'RAPPEL', type = 'GAIN'
WHERE code = 'CAT_AVOIR';

-- 2. Catégorie TROP PERCU (Retenue)
INSERT INTO element_salary_category (code, name, type)
VALUES ('CAT_TROP_PERCU', 'TROP PERCU', 'RETENUE')
ON CONFLICT (code) DO UPDATE
SET name = 'TROP PERCU', type = 'RETENUE';

-- 3. Catégorie PRECOMPTES (Retenue)
INSERT INTO element_salary_category (code, name, type)
VALUES ('CAT_PRECOMPTE', 'PRECOMPTES', 'RETENUE')
ON CONFLICT (code) DO UPDATE
SET name = 'PRECOMPTES', type = 'RETENUE';

UPDATE element_salary_category
SET name = 'PRECOMPTES', type = 'RETENUE'
WHERE code = 'CAT_AVANCE';

-- 4. Éléments de salaire pour la catégorie RAPPEL
INSERT INTO salary_element (code, name, salary_category_id, method_calcul, formule, is_cotisable, is_imposable, ordre, statut)
SELECT 'RAPPEL_SALAIRE', 'RAPPEL SALAIRE DE BASE', (SELECT id FROM element_salary_category WHERE code = 'CAT_RAPPEL' OR name = 'RAPPEL' LIMIT 1), 'MONTANT_FIXE', '0', true, true, 5, 'ACTIF'
WHERE NOT EXISTS (SELECT 1 FROM salary_element WHERE code = 'RAPPEL_SALAIRE');

INSERT INTO salary_element (code, name, salary_category_id, method_calcul, formule, is_cotisable, is_imposable, ordre, statut)
SELECT 'RAPPEL_SURSALAIRE', 'RAPPEL SURSALAIRE', (SELECT id FROM element_salary_category WHERE code = 'CAT_RAPPEL' OR name = 'RAPPEL' LIMIT 1), 'MONTANT_FIXE', '0', true, true, 6, 'ACTIF'
WHERE NOT EXISTS (SELECT 1 FROM salary_element WHERE code = 'RAPPEL_SURSALAIRE');

INSERT INTO salary_element (code, name, salary_category_id, method_calcul, formule, is_cotisable, is_imposable, ordre, statut)
SELECT 'RAPPEL_INDEMNITE', 'RAPPEL INDEMNITÉS', (SELECT id FROM element_salary_category WHERE code = 'CAT_RAPPEL' OR name = 'RAPPEL' LIMIT 1), 'MONTANT_FIXE', '0', true, true, 7, 'ACTIF'
WHERE NOT EXISTS (SELECT 1 FROM salary_element WHERE code = 'RAPPEL_INDEMNITE');

INSERT INTO salary_element (code, name, salary_category_id, method_calcul, formule, is_cotisable, is_imposable, ordre, statut)
SELECT 'RAPPEL_PRIME', 'RAPPEL PRIMES', (SELECT id FROM element_salary_category WHERE code = 'CAT_RAPPEL' OR name = 'RAPPEL' LIMIT 1), 'MONTANT_FIXE', '0', true, true, 8, 'ACTIF'
WHERE NOT EXISTS (SELECT 1 FROM salary_element WHERE code = 'RAPPEL_PRIME');

INSERT INTO salary_element (code, name, salary_category_id, method_calcul, formule, is_cotisable, is_imposable, ordre, statut)
SELECT 'RAPPEL_DIVERS', 'RAPPEL RÉGULARISATION DIVERSE', (SELECT id FROM element_salary_category WHERE code = 'CAT_RAPPEL' OR name = 'RAPPEL' LIMIT 1), 'MONTANT_FIXE', '0', true, true, 9, 'ACTIF'
WHERE NOT EXISTS (SELECT 1 FROM salary_element WHERE code = 'RAPPEL_DIVERS');

UPDATE salary_element
SET salary_category_id = (SELECT id FROM element_salary_category WHERE code = 'CAT_RAPPEL' OR name = 'RAPPEL' LIMIT 1)
WHERE code ILIKE '%RAPPEL%' OR name ILIKE '%RAPPEL%';

-- 5. Éléments de salaire pour la catégorie TROP PERCU
INSERT INTO salary_element (code, name, salary_category_id, method_calcul, formule, is_cotisable, is_imposable, ordre, statut)
SELECT 'RET_TROP_PERCU_SAL', 'TROP-PERÇU SUR SALAIRE DE BASE', (SELECT id FROM element_salary_category WHERE code = 'CAT_TROP_PERCU' OR name = 'TROP PERCU' LIMIT 1), 'MONTANT_FIXE', '0', false, false, 34, 'ACTIF'
WHERE NOT EXISTS (SELECT 1 FROM salary_element WHERE code = 'RET_TROP_PERCU_SAL');

INSERT INTO salary_element (code, name, salary_category_id, method_calcul, formule, is_cotisable, is_imposable, ordre, statut)
SELECT 'RET_TROP_PERCU_PRIME', 'TROP-PERÇU SUR PRIMES & INDEMNITÉS', (SELECT id FROM element_salary_category WHERE code = 'CAT_TROP_PERCU' OR name = 'TROP PERCU' LIMIT 1), 'MONTANT_FIXE', '0', false, false, 35, 'ACTIF'
WHERE NOT EXISTS (SELECT 1 FROM salary_element WHERE code = 'RET_TROP_PERCU_PRIME');

INSERT INTO salary_element (code, name, salary_category_id, method_calcul, formule, is_cotisable, is_imposable, ordre, statut)
SELECT 'RET_TROP_PERCU', 'TROP-PERÇU & RÉGULARISATION DIVERSE', (SELECT id FROM element_salary_category WHERE code = 'CAT_TROP_PERCU' OR name = 'TROP PERCU' LIMIT 1), 'MONTANT_FIXE', '0', false, false, 36, 'ACTIF'
WHERE NOT EXISTS (SELECT 1 FROM salary_element WHERE code = 'RET_TROP_PERCU');

UPDATE salary_element
SET salary_category_id = (SELECT id FROM element_salary_category WHERE code = 'CAT_TROP_PERCU' OR name = 'TROP PERCU' LIMIT 1)
WHERE code ILIKE '%TROP_PERCU%' OR name ILIKE '%TROP-PERÇU%' OR name ILIKE '%TROP PERCU%';

-- 6. Éléments de salaire pour la catégorie PRECOMPTES
INSERT INTO salary_element (code, name, salary_category_id, method_calcul, formule, is_cotisable, is_imposable, ordre, statut)
SELECT 'PRET_SCOLAIRE', 'PRÊT SCOLARITÉ', (SELECT id FROM element_salary_category WHERE code = 'CAT_PRECOMPTE' OR name = 'PRECOMPTES' LIMIT 1), 'MONTANT_FIXE', '0', false, false, 25, 'ACTIF'
WHERE NOT EXISTS (SELECT 1 FROM salary_element WHERE code = 'PRET_SCOLAIRE');

UPDATE salary_element
SET salary_category_id = (SELECT id FROM element_salary_category WHERE code = 'CAT_PRECOMPTE' OR name = 'PRECOMPTES' LIMIT 1)
WHERE code IN ('PRET_EQUIP', 'AVANCE_SAL', 'PRET_SCOLAIRE', 'PRET_VEHICULE', 'RET_MUTUELLE', 'RET_ASSURANCE', 'SAISIE_ARRET', 'RET_VIVRES', 'RET_DIVERS')
   OR code ILIKE 'PRET_%'
   OR code ILIKE 'AVANCE_%'
   OR name ILIKE 'Prêt %'
   OR name ILIKE 'Avance %'
   OR name ILIKE '%scolarité%'
   OR name ILIKE '%scolaire%';

