-- =============================================================================
-- V4__sync_bpbf_salary_grid_and_test_employees.sql
-- Synchronisation intégrale de la Grille Salariale Conventionnelle BPBF (225 cellules)
-- et Réalignement des 100 Collaborateurs de Test (EMP-1001 à EMP-1100)
-- Banque Postale du Burkina Faso
-- =============================================================================

BEGIN;

-- 1. Consolidation des 3 Groupes hiérarchiques dans la table grade
INSERT INTO grade (code, libelle, description, actif)
VALUES
  ('GROUPE I', 'GROUPE I', 'Agents et Employés (Catégories 1 à 7)', true),
  ('GROUPE II', 'GROUPE II', 'Classes I à IV (Agents de Maîtrise et Cadres moyens)', true),
  ('GROUPE III', 'GROUPE III', 'Classes V à VIII (Cadres et Cadres Supérieurs)', true)
ON CONFLICT DO NOTHING;

UPDATE grade SET libelle = 'GROUPE I', description = 'Agents et Employés (Catégories 1 à 7)' WHERE UPPER(TRIM(code)) = 'GROUPE I';
UPDATE grade SET libelle = 'GROUPE II', description = 'Classes I à IV (Agents de Maîtrise et Cadres moyens)' WHERE UPPER(TRIM(code)) = 'GROUPE II';
UPDATE grade SET libelle = 'GROUPE III', description = 'Classes V à VIII (Cadres et Cadres Supérieurs)' WHERE UPPER(TRIM(code)) = 'GROUPE III';

-- 2. Consolidation des 15 Catégories conventionnelles dans la table categorie

INSERT INTO categorie (code, libelle, description, taux_abattement, actif)
SELECT '1', '1ère Catégorie (Agents d''exécution)', 'GROUPE I : BPBF', 25, true
WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE UPPER(TRIM(code)) = '1');

UPDATE categorie
SET libelle = '1ère Catégorie (Agents d''exécution)',
    description = 'GROUPE I : BPBF',
    taux_abattement = 25,
    actif = true
WHERE UPPER(TRIM(code)) = '1';

INSERT INTO categorie (code, libelle, description, taux_abattement, actif)
SELECT '2', '2ème Catégorie (Agents d''exécution)', 'GROUPE I : BPBF', 25, true
WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE UPPER(TRIM(code)) = '2');

UPDATE categorie
SET libelle = '2ème Catégorie (Agents d''exécution)',
    description = 'GROUPE I : BPBF',
    taux_abattement = 25,
    actif = true
WHERE UPPER(TRIM(code)) = '2';

INSERT INTO categorie (code, libelle, description, taux_abattement, actif)
SELECT '3', '3ème Catégorie (Employés)', 'GROUPE I : BPBF', 25, true
WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE UPPER(TRIM(code)) = '3');

UPDATE categorie
SET libelle = '3ème Catégorie (Employés)',
    description = 'GROUPE I : BPBF',
    taux_abattement = 25,
    actif = true
WHERE UPPER(TRIM(code)) = '3';

INSERT INTO categorie (code, libelle, description, taux_abattement, actif)
SELECT '4', '4ème Catégorie (Employés qualifiés)', 'GROUPE I : BPBF', 25, true
WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE UPPER(TRIM(code)) = '4');

UPDATE categorie
SET libelle = '4ème Catégorie (Employés qualifiés)',
    description = 'GROUPE I : BPBF',
    taux_abattement = 25,
    actif = true
WHERE UPPER(TRIM(code)) = '4';

INSERT INTO categorie (code, libelle, description, taux_abattement, actif)
SELECT '5', '5ème Catégorie (Employés qualifiés)', 'GROUPE I : BPBF', 25, true
WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE UPPER(TRIM(code)) = '5');

UPDATE categorie
SET libelle = '5ème Catégorie (Employés qualifiés)',
    description = 'GROUPE I : BPBF',
    taux_abattement = 25,
    actif = true
WHERE UPPER(TRIM(code)) = '5';

INSERT INTO categorie (code, libelle, description, taux_abattement, actif)
SELECT '6', '6ème Catégorie (Employés très qualifiés)', 'GROUPE I : BPBF', 25, true
WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE UPPER(TRIM(code)) = '6');

UPDATE categorie
SET libelle = '6ème Catégorie (Employés très qualifiés)',
    description = 'GROUPE I : BPBF',
    taux_abattement = 25,
    actif = true
WHERE UPPER(TRIM(code)) = '6';

INSERT INTO categorie (code, libelle, description, taux_abattement, actif)
SELECT '7', '7ème Catégorie (Employés très qualifiés)', 'GROUPE I : BPBF', 25, true
WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE UPPER(TRIM(code)) = '7');

UPDATE categorie
SET libelle = '7ème Catégorie (Employés très qualifiés)',
    description = 'GROUPE I : BPBF',
    taux_abattement = 25,
    actif = true
WHERE UPPER(TRIM(code)) = '7';

INSERT INTO categorie (code, libelle, description, taux_abattement, actif)
SELECT 'I', 'Classe I (Agents de Maîtrise)', 'GROUPE II : BPBF', 25, true
WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE UPPER(TRIM(code)) = 'I');

UPDATE categorie
SET libelle = 'Classe I (Agents de Maîtrise)',
    description = 'GROUPE II : BPBF',
    taux_abattement = 25,
    actif = true
WHERE UPPER(TRIM(code)) = 'I';

INSERT INTO categorie (code, libelle, description, taux_abattement, actif)
SELECT 'II', 'Classe II (Maîtrise & Cadres Moyens)', 'GROUPE II : BPBF', 20, true
WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE UPPER(TRIM(code)) = 'II');

UPDATE categorie
SET libelle = 'Classe II (Maîtrise & Cadres Moyens)',
    description = 'GROUPE II : BPBF',
    taux_abattement = 20,
    actif = true
WHERE UPPER(TRIM(code)) = 'II';

INSERT INTO categorie (code, libelle, description, taux_abattement, actif)
SELECT 'III', 'Classe III (Maîtrise & Cadres Moyens)', 'GROUPE II : BPBF', 20, true
WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE UPPER(TRIM(code)) = 'III');

UPDATE categorie
SET libelle = 'Classe III (Maîtrise & Cadres Moyens)',
    description = 'GROUPE II : BPBF',
    taux_abattement = 20,
    actif = true
WHERE UPPER(TRIM(code)) = 'III';

INSERT INTO categorie (code, libelle, description, taux_abattement, actif)
SELECT 'IV', 'Classe IV (Cadres Moyens confirmés)', 'GROUPE II : BPBF', 20, true
WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE UPPER(TRIM(code)) = 'IV');

UPDATE categorie
SET libelle = 'Classe IV (Cadres Moyens confirmés)',
    description = 'GROUPE II : BPBF',
    taux_abattement = 20,
    actif = true
WHERE UPPER(TRIM(code)) = 'IV';

INSERT INTO categorie (code, libelle, description, taux_abattement, actif)
SELECT 'V', 'Classe V (Cadres)', 'GROUPE III : BPBF', 20, true
WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE UPPER(TRIM(code)) = 'V');

UPDATE categorie
SET libelle = 'Classe V (Cadres)',
    description = 'GROUPE III : BPBF',
    taux_abattement = 20,
    actif = true
WHERE UPPER(TRIM(code)) = 'V';

INSERT INTO categorie (code, libelle, description, taux_abattement, actif)
SELECT 'VI', 'Classe VI (Cadres Supérieurs)', 'GROUPE III : BPBF', 20, true
WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE UPPER(TRIM(code)) = 'VI');

UPDATE categorie
SET libelle = 'Classe VI (Cadres Supérieurs)',
    description = 'GROUPE III : BPBF',
    taux_abattement = 20,
    actif = true
WHERE UPPER(TRIM(code)) = 'VI';

INSERT INTO categorie (code, libelle, description, taux_abattement, actif)
SELECT 'VII', 'Classe VII (Cadres Supérieurs)', 'GROUPE III : BPBF', 20, true
WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE UPPER(TRIM(code)) = 'VII');

UPDATE categorie
SET libelle = 'Classe VII (Cadres Supérieurs)',
    description = 'GROUPE III : BPBF',
    taux_abattement = 20,
    actif = true
WHERE UPPER(TRIM(code)) = 'VII';

INSERT INTO categorie (code, libelle, description, taux_abattement, actif)
SELECT 'VIII', 'Classe VIII (Cadres Dirigeants)', 'GROUPE III : BPBF', 20, true
WHERE NOT EXISTS (SELECT 1 FROM categorie WHERE UPPER(TRIM(code)) = 'VIII');

UPDATE categorie
SET libelle = 'Classe VIII (Cadres Dirigeants)',
    description = 'GROUPE III : BPBF',
    taux_abattement = 20,
    actif = true
WHERE UPPER(TRIM(code)) = 'VIII';

-- 3. Consolidation des 15 Échelons (E01 à E15) dans la table echelon

INSERT INTO echelon (code, libelle, description, actif)
SELECT 'ECH-01', 'E01', 'Échelon bancaire 1', true
WHERE NOT EXISTS (SELECT 1 FROM echelon WHERE UPPER(TRIM(libelle)) = 'E01' OR UPPER(TRIM(code)) = 'ECH-01' OR UPPER(TRIM(code)) = 'ECH-1');

UPDATE echelon
SET libelle = 'E01', description = 'Échelon bancaire 1', actif = true
WHERE UPPER(TRIM(libelle)) = 'E01' OR UPPER(TRIM(code)) = 'ECH-01' OR UPPER(TRIM(code)) = 'ECH-1';

INSERT INTO echelon (code, libelle, description, actif)
SELECT 'ECH-02', 'E02', 'Échelon bancaire 2', true
WHERE NOT EXISTS (SELECT 1 FROM echelon WHERE UPPER(TRIM(libelle)) = 'E02' OR UPPER(TRIM(code)) = 'ECH-02' OR UPPER(TRIM(code)) = 'ECH-2');

UPDATE echelon
SET libelle = 'E02', description = 'Échelon bancaire 2', actif = true
WHERE UPPER(TRIM(libelle)) = 'E02' OR UPPER(TRIM(code)) = 'ECH-02' OR UPPER(TRIM(code)) = 'ECH-2';

INSERT INTO echelon (code, libelle, description, actif)
SELECT 'ECH-03', 'E03', 'Échelon bancaire 3', true
WHERE NOT EXISTS (SELECT 1 FROM echelon WHERE UPPER(TRIM(libelle)) = 'E03' OR UPPER(TRIM(code)) = 'ECH-03' OR UPPER(TRIM(code)) = 'ECH-3');

UPDATE echelon
SET libelle = 'E03', description = 'Échelon bancaire 3', actif = true
WHERE UPPER(TRIM(libelle)) = 'E03' OR UPPER(TRIM(code)) = 'ECH-03' OR UPPER(TRIM(code)) = 'ECH-3';

INSERT INTO echelon (code, libelle, description, actif)
SELECT 'ECH-04', 'E04', 'Échelon bancaire 4', true
WHERE NOT EXISTS (SELECT 1 FROM echelon WHERE UPPER(TRIM(libelle)) = 'E04' OR UPPER(TRIM(code)) = 'ECH-04' OR UPPER(TRIM(code)) = 'ECH-4');

UPDATE echelon
SET libelle = 'E04', description = 'Échelon bancaire 4', actif = true
WHERE UPPER(TRIM(libelle)) = 'E04' OR UPPER(TRIM(code)) = 'ECH-04' OR UPPER(TRIM(code)) = 'ECH-4';

INSERT INTO echelon (code, libelle, description, actif)
SELECT 'ECH-05', 'E05', 'Échelon bancaire 5', true
WHERE NOT EXISTS (SELECT 1 FROM echelon WHERE UPPER(TRIM(libelle)) = 'E05' OR UPPER(TRIM(code)) = 'ECH-05' OR UPPER(TRIM(code)) = 'ECH-5');

UPDATE echelon
SET libelle = 'E05', description = 'Échelon bancaire 5', actif = true
WHERE UPPER(TRIM(libelle)) = 'E05' OR UPPER(TRIM(code)) = 'ECH-05' OR UPPER(TRIM(code)) = 'ECH-5';

INSERT INTO echelon (code, libelle, description, actif)
SELECT 'ECH-06', 'E06', 'Échelon bancaire 6', true
WHERE NOT EXISTS (SELECT 1 FROM echelon WHERE UPPER(TRIM(libelle)) = 'E06' OR UPPER(TRIM(code)) = 'ECH-06' OR UPPER(TRIM(code)) = 'ECH-6');

UPDATE echelon
SET libelle = 'E06', description = 'Échelon bancaire 6', actif = true
WHERE UPPER(TRIM(libelle)) = 'E06' OR UPPER(TRIM(code)) = 'ECH-06' OR UPPER(TRIM(code)) = 'ECH-6';

INSERT INTO echelon (code, libelle, description, actif)
SELECT 'ECH-07', 'E07', 'Échelon bancaire 7', true
WHERE NOT EXISTS (SELECT 1 FROM echelon WHERE UPPER(TRIM(libelle)) = 'E07' OR UPPER(TRIM(code)) = 'ECH-07' OR UPPER(TRIM(code)) = 'ECH-7');

UPDATE echelon
SET libelle = 'E07', description = 'Échelon bancaire 7', actif = true
WHERE UPPER(TRIM(libelle)) = 'E07' OR UPPER(TRIM(code)) = 'ECH-07' OR UPPER(TRIM(code)) = 'ECH-7';

INSERT INTO echelon (code, libelle, description, actif)
SELECT 'ECH-08', 'E08', 'Échelon bancaire 8', true
WHERE NOT EXISTS (SELECT 1 FROM echelon WHERE UPPER(TRIM(libelle)) = 'E08' OR UPPER(TRIM(code)) = 'ECH-08' OR UPPER(TRIM(code)) = 'ECH-8');

UPDATE echelon
SET libelle = 'E08', description = 'Échelon bancaire 8', actif = true
WHERE UPPER(TRIM(libelle)) = 'E08' OR UPPER(TRIM(code)) = 'ECH-08' OR UPPER(TRIM(code)) = 'ECH-8';

INSERT INTO echelon (code, libelle, description, actif)
SELECT 'ECH-09', 'E09', 'Échelon bancaire 9', true
WHERE NOT EXISTS (SELECT 1 FROM echelon WHERE UPPER(TRIM(libelle)) = 'E09' OR UPPER(TRIM(code)) = 'ECH-09' OR UPPER(TRIM(code)) = 'ECH-9');

UPDATE echelon
SET libelle = 'E09', description = 'Échelon bancaire 9', actif = true
WHERE UPPER(TRIM(libelle)) = 'E09' OR UPPER(TRIM(code)) = 'ECH-09' OR UPPER(TRIM(code)) = 'ECH-9';

INSERT INTO echelon (code, libelle, description, actif)
SELECT 'ECH-10', 'E10', 'Échelon bancaire 10', true
WHERE NOT EXISTS (SELECT 1 FROM echelon WHERE UPPER(TRIM(libelle)) = 'E10' OR UPPER(TRIM(code)) = 'ECH-10' OR UPPER(TRIM(code)) = 'ECH-10');

UPDATE echelon
SET libelle = 'E10', description = 'Échelon bancaire 10', actif = true
WHERE UPPER(TRIM(libelle)) = 'E10' OR UPPER(TRIM(code)) = 'ECH-10' OR UPPER(TRIM(code)) = 'ECH-10';

INSERT INTO echelon (code, libelle, description, actif)
SELECT 'ECH-11', 'E11', 'Échelon bancaire 11', true
WHERE NOT EXISTS (SELECT 1 FROM echelon WHERE UPPER(TRIM(libelle)) = 'E11' OR UPPER(TRIM(code)) = 'ECH-11' OR UPPER(TRIM(code)) = 'ECH-11');

UPDATE echelon
SET libelle = 'E11', description = 'Échelon bancaire 11', actif = true
WHERE UPPER(TRIM(libelle)) = 'E11' OR UPPER(TRIM(code)) = 'ECH-11' OR UPPER(TRIM(code)) = 'ECH-11';

INSERT INTO echelon (code, libelle, description, actif)
SELECT 'ECH-12', 'E12', 'Échelon bancaire 12', true
WHERE NOT EXISTS (SELECT 1 FROM echelon WHERE UPPER(TRIM(libelle)) = 'E12' OR UPPER(TRIM(code)) = 'ECH-12' OR UPPER(TRIM(code)) = 'ECH-12');

UPDATE echelon
SET libelle = 'E12', description = 'Échelon bancaire 12', actif = true
WHERE UPPER(TRIM(libelle)) = 'E12' OR UPPER(TRIM(code)) = 'ECH-12' OR UPPER(TRIM(code)) = 'ECH-12';

INSERT INTO echelon (code, libelle, description, actif)
SELECT 'ECH-13', 'E13', 'Échelon bancaire 13', true
WHERE NOT EXISTS (SELECT 1 FROM echelon WHERE UPPER(TRIM(libelle)) = 'E13' OR UPPER(TRIM(code)) = 'ECH-13' OR UPPER(TRIM(code)) = 'ECH-13');

UPDATE echelon
SET libelle = 'E13', description = 'Échelon bancaire 13', actif = true
WHERE UPPER(TRIM(libelle)) = 'E13' OR UPPER(TRIM(code)) = 'ECH-13' OR UPPER(TRIM(code)) = 'ECH-13';

INSERT INTO echelon (code, libelle, description, actif)
SELECT 'ECH-14', 'E14', 'Échelon bancaire 14', true
WHERE NOT EXISTS (SELECT 1 FROM echelon WHERE UPPER(TRIM(libelle)) = 'E14' OR UPPER(TRIM(code)) = 'ECH-14' OR UPPER(TRIM(code)) = 'ECH-14');

UPDATE echelon
SET libelle = 'E14', description = 'Échelon bancaire 14', actif = true
WHERE UPPER(TRIM(libelle)) = 'E14' OR UPPER(TRIM(code)) = 'ECH-14' OR UPPER(TRIM(code)) = 'ECH-14';

INSERT INTO echelon (code, libelle, description, actif)
SELECT 'ECH-15', 'E15', 'Échelon bancaire 15', true
WHERE NOT EXISTS (SELECT 1 FROM echelon WHERE UPPER(TRIM(libelle)) = 'E15' OR UPPER(TRIM(code)) = 'ECH-15' OR UPPER(TRIM(code)) = 'ECH-15');

UPDATE echelon
SET libelle = 'E15', description = 'Échelon bancaire 15', actif = true
WHERE UPPER(TRIM(libelle)) = 'E15' OR UPPER(TRIM(code)) = 'ECH-15' OR UPPER(TRIM(code)) = 'ECH-15';

-- 4. Insertion / Mise à jour des 225 cellules de la Grille Salariale Conventionnelle BPBF

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 95945.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 95945.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 105540.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 105540.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 116093.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 116093.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 127703.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 127703.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 140473.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 140473.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 154520.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 154520.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 169972.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 169972.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 186970.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 186970.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 205667.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 205667.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 226233.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 226233.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 248857.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 248857.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 273742.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 273742.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 301117.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 301117.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 331228.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 331228.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 364351.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 364351.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 104474.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 104474.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 114921.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 114921.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 126414.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 126414.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 139055.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 139055.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 152960.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 152960.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 168256.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 168256.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 185082.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 185082.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 203590.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 203590.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 223949.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 223949.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 246344.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 246344.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 270979.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 270979.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 298077.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 298077.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 327884.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 327884.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 360673.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 360673.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 396740.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 396740.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 107135.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 107135.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 117849.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 117849.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 129633.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 129633.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 142597.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 142597.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 156856.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 156856.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 172542.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 172542.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 189796.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 189796.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 208776.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 208776.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 229653.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 229653.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 252619.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 252619.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 277881.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 277881.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 305669.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 305669.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 336236.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 336236.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 369859.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 369859.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 406845.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 406845.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 115558.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 115558.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 127114.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 127114.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 139825.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 139825.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 153808.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 153808.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 169188.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 169188.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 186107.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 186107.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 204718.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 204718.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 225190.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 225190.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 247709.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 247709.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 272480.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 272480.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 299728.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 299728.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 329700.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 329700.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 362671.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 362671.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 398938.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 398938.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 438831.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 438831.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 128831.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 128831.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 141714.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 141714.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 155886.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 155886.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 171474.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 171474.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 188621.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 188621.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 207484.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 207484.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 228232.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 228232.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 251055.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 251055.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 276161.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 276161.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 303777.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 303777.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 334154.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 334154.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 367570.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 367570.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 404327.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 404327.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 444760.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 444760.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 489236.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 489236.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 157940.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 157940.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 173734.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 173734.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 191107.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 191107.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 210218.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 210218.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 231240.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 231240.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 254364.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 254364.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 279800.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 279800.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 307780.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 307780.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 338558.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 338558.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 372414.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 372414.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 409656.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 409656.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 450621.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 450621.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 495683.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 495683.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 545252.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 545252.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 599777.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 599777.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 176441.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 176441.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 194085.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 194085.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 213494.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 213494.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 234843.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 234843.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 258327.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 258327.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 284160.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 284160.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 312576.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 312576.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 343834.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 343834.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 378217.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 378217.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 416039.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 416039.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 457643.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 457643.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 503407.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 503407.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 553747.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 553747.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 609122.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 609122.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 670034.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 670034.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = '7'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE I';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 173090.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 173090.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 190399.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 190399.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 209439.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 209439.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 230383.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 230383.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 253421.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 253421.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 278763.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 278763.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 306639.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 306639.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 337303.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 337303.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 371034.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 371034.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 408137.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 408137.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 448951.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 448951.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 493846.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 493846.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 543231.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 543231.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 597554.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 597554.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 657309.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 657309.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 203834.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 203834.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 224217.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 224217.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 246639.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 246639.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 271303.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 271303.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 298433.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 298433.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 328277.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 328277.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 361104.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 361104.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 397215.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 397215.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 436936.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 436936.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 480630.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 480630.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 528693.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 528693.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 581562.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 581562.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 639718.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 639718.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 703690.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 703690.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 774059.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 774059.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 278697.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 278697.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 306567.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 306567.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 337223.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 337223.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 370946.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 370946.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 408040.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 408040.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 448844.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 448844.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 493729.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 493729.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 543102.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 543102.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 597412.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 597412.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 657153.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 657153.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 722868.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 722868.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 795155.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 795155.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 874671.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 874671.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 962138.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 962138.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1058351.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1058351.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 405758.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 405758.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 446334.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 446334.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 490967.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 490967.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 540064.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 540064.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 594070.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 594070.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 653477.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 653477.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 718825.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 718825.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 790708.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 790708.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 869778.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 869778.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 956756.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 956756.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1052432.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1052432.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1157675.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1157675.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1273442.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1273442.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1400787.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1400787.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1540865.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1540865.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE II';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 581390.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 581390.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 639529.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 639529.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 703482.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 703482.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 773830.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 773830.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 851213.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 851213.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 936334.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 936334.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1029968.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1029968.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1132965.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1132965.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1246261.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1246261.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1370887.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1370887.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1507976.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1507976.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1658774.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1658774.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1824651.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1824651.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 2007116.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 2007116.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 2207828.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 2207828.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 599438.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 599438.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 659382.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 659382.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 725320.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 725320.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 797852.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 797852.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 877637.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 877637.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 965401.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 965401.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1061941.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1061941.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1168135.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1168135.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1284949.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1284949.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1413443.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1413443.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1554788.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1554788.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1710267.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1710267.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1881293.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1881293.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 2069423.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 2069423.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 2276365.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 2276365.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 631454.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 631454.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 694599.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 694599.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 764059.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 764059.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 840465.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 840465.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 924512.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 924512.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1016963.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1016963.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1118659.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1118659.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1230525.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1230525.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1353578.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1353578.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1488936.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1488936.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1637829.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1637829.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1801612.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1801612.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1981773.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1981773.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 2179950.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 2179950.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 2397946.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 2397946.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 710386.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 710386.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E01' OR UPPER(TRIM(e.code)) = 'ECH-01' OR UPPER(TRIM(e.code)) = 'ECH-1')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 781425.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 781425.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E02' OR UPPER(TRIM(e.code)) = 'ECH-02' OR UPPER(TRIM(e.code)) = 'ECH-2')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 859567.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 859567.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E03' OR UPPER(TRIM(e.code)) = 'ECH-03' OR UPPER(TRIM(e.code)) = 'ECH-3')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 945524.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 945524.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E04' OR UPPER(TRIM(e.code)) = 'ECH-04' OR UPPER(TRIM(e.code)) = 'ECH-4')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1040076.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1040076.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E05' OR UPPER(TRIM(e.code)) = 'ECH-05' OR UPPER(TRIM(e.code)) = 'ECH-5')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1144084.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1144084.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E06' OR UPPER(TRIM(e.code)) = 'ECH-06' OR UPPER(TRIM(e.code)) = 'ECH-6')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1258492.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1258492.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E07' OR UPPER(TRIM(e.code)) = 'ECH-07' OR UPPER(TRIM(e.code)) = 'ECH-7')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1384341.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1384341.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E08' OR UPPER(TRIM(e.code)) = 'ECH-08' OR UPPER(TRIM(e.code)) = 'ECH-8')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1522775.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1522775.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E09' OR UPPER(TRIM(e.code)) = 'ECH-09' OR UPPER(TRIM(e.code)) = 'ECH-9')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1675053.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1675053.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E10' OR UPPER(TRIM(e.code)) = 'ECH-10' OR UPPER(TRIM(e.code)) = 'ECH-10')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 1842558.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 1842558.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E11' OR UPPER(TRIM(e.code)) = 'ECH-11' OR UPPER(TRIM(e.code)) = 'ECH-11')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 2026814.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 2026814.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E12' OR UPPER(TRIM(e.code)) = 'ECH-12' OR UPPER(TRIM(e.code)) = 'ECH-12')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 2229496.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 2229496.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E13' OR UPPER(TRIM(e.code)) = 'ECH-13' OR UPPER(TRIM(e.code)) = 'ECH-13')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 2452445.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 2452445.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E14' OR UPPER(TRIM(e.code)) = 'ECH-14' OR UPPER(TRIM(e.code)) = 'ECH-14')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

INSERT INTO grille_salariale (categorie_id, echelon_id, grade_id, salaire_base)
SELECT c.id, e.id, g.id, 2697690.00
FROM categorie c, echelon e, grade g
WHERE UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND NOT EXISTS (
    SELECT 1 FROM grille_salariale gs
    WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  );

UPDATE grille_salariale gs
SET salaire_base = 2697690.00
FROM categorie c, echelon e, grade g
WHERE gs.categorie_id = c.id AND gs.echelon_id = e.id AND gs.grade_id = g.id
  AND UPPER(TRIM(c.code)) = 'VIII'
  AND (UPPER(TRIM(e.libelle)) = 'E15' OR UPPER(TRIM(e.code)) = 'ECH-15' OR UPPER(TRIM(e.code)) = 'ECH-15')
  AND UPPER(TRIM(g.code)) = 'GROUPE III';

-- 5. Harmonisation et Réalignement des 100 Agents de Test (EMP-1001 à EMP-1100)
-- Chaque collaborateur reçoit une classification BPBF cohérente selon sa fonction/emploi

-- Agent EMP-1001 -> CL7E05 (GROUPE III, Cat VII, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL7E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1001'
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1001';

-- Agent EMP-1002 -> CL4E04 (GROUPE II, Cat IV, Ech 4)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL4E04',
  categorie_pro = c.libelle,
  echelon = 'E04'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1002'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'IV'
  AND (UPPER(TRIM(ech.libelle)) = 'E04' OR UPPER(TRIM(ech.code)) = 'ECH-04' OR UPPER(TRIM(ech.code)) = 'ECH-4')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1002';

-- Agent EMP-1003 -> CL5E04 (GROUPE III, Cat V, Ech 4)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL5E04',
  categorie_pro = c.libelle,
  echelon = 'E04'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1003'
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND UPPER(TRIM(c.code)) = 'V'
  AND (UPPER(TRIM(ech.libelle)) = 'E04' OR UPPER(TRIM(ech.code)) = 'ECH-04' OR UPPER(TRIM(ech.code)) = 'ECH-4')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1003';

-- Agent EMP-1004 -> CL6E05 (GROUPE III, Cat VI, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL6E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1004'
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND UPPER(TRIM(c.code)) = 'VI'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1004';

-- Agent EMP-1005 -> CL7E06 (GROUPE III, Cat VII, Ech 6)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL7E06',
  categorie_pro = c.libelle,
  echelon = 'E06'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1005'
  AND UPPER(TRIM(g.code)) = 'GROUPE III'
  AND UPPER(TRIM(c.code)) = 'VII'
  AND (UPPER(TRIM(ech.libelle)) = 'E06' OR UPPER(TRIM(ech.code)) = 'ECH-06' OR UPPER(TRIM(ech.code)) = 'ECH-6')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1005';

-- Agent EMP-1006 -> CL1E07 (GROUPE II, Cat I, Ech 7)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL1E07',
  categorie_pro = c.libelle,
  echelon = 'E07'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1006'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(ech.libelle)) = 'E07' OR UPPER(TRIM(ech.code)) = 'ECH-07' OR UPPER(TRIM(ech.code)) = 'ECH-7')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1006';

-- Agent EMP-1007 -> C5E03 (GROUPE I, Cat 5, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1007'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1007';

-- Agent EMP-1008 -> CL3E01 (GROUPE II, Cat III, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1008'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1008';

-- Agent EMP-1009 -> CL2E03 (GROUPE II, Cat II, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1009'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1009';

-- Agent EMP-1010 -> C2E01 (GROUPE I, Cat 2, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C2E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1010'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1010';

-- Agent EMP-1011 -> C5E02 (GROUPE I, Cat 5, Ech 2)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E02',
  categorie_pro = c.libelle,
  echelon = 'E02'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1011'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E02' OR UPPER(TRIM(ech.code)) = 'ECH-02' OR UPPER(TRIM(ech.code)) = 'ECH-2')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1011';

-- Agent EMP-1012 -> CL3E05 (GROUPE II, Cat III, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1012'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1012';

-- Agent EMP-1013 -> C3E04 (GROUPE I, Cat 3, Ech 4)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E04',
  categorie_pro = c.libelle,
  echelon = 'E04'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1013'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E04' OR UPPER(TRIM(ech.code)) = 'ECH-04' OR UPPER(TRIM(ech.code)) = 'ECH-4')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1013';

-- Agent EMP-1014 -> C6E03 (GROUPE I, Cat 6, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C6E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1014'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1014';

-- Agent EMP-1015 -> CL2E02 (GROUPE II, Cat II, Ech 2)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E02',
  categorie_pro = c.libelle,
  echelon = 'E02'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1015'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E02' OR UPPER(TRIM(ech.code)) = 'ECH-02' OR UPPER(TRIM(ech.code)) = 'ECH-2')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1015';

-- Agent EMP-1016 -> CL3E01 (GROUPE II, Cat III, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1016'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1016';

-- Agent EMP-1017 -> C3E03 (GROUPE I, Cat 3, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1017'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1017';

-- Agent EMP-1018 -> CL1E05 (GROUPE II, Cat I, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL1E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1018'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1018';

-- Agent EMP-1019 -> C5E05 (GROUPE I, Cat 5, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1019'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1019';

-- Agent EMP-1020 -> C3E01 (GROUPE I, Cat 3, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1020'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1020';

-- Agent EMP-1021 -> CL2E01 (GROUPE II, Cat II, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1021'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1021';

-- Agent EMP-1022 -> C6E05 (GROUPE I, Cat 6, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C6E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1022'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1022';

-- Agent EMP-1023 -> C5E04 (GROUPE I, Cat 5, Ech 4)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E04',
  categorie_pro = c.libelle,
  echelon = 'E04'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1023'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E04' OR UPPER(TRIM(ech.code)) = 'ECH-04' OR UPPER(TRIM(ech.code)) = 'ECH-4')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1023';

-- Agent EMP-1024 -> CL3E01 (GROUPE II, Cat III, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1024'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1024';

-- Agent EMP-1025 -> C3E01 (GROUPE I, Cat 3, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1025'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1025';

-- Agent EMP-1026 -> C6E03 (GROUPE I, Cat 6, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C6E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1026'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1026';

-- Agent EMP-1027 -> CL2E07 (GROUPE II, Cat II, Ech 7)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E07',
  categorie_pro = c.libelle,
  echelon = 'E07'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1027'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E07' OR UPPER(TRIM(ech.code)) = 'ECH-07' OR UPPER(TRIM(ech.code)) = 'ECH-7')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1027';

-- Agent EMP-1028 -> CL3E05 (GROUPE II, Cat III, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1028'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1028';

-- Agent EMP-1029 -> C3E05 (GROUPE I, Cat 3, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1029'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1029';

-- Agent EMP-1030 -> C4E01 (GROUPE I, Cat 4, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C4E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1030'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1030';

-- Agent EMP-1031 -> C5E02 (GROUPE I, Cat 5, Ech 2)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E02',
  categorie_pro = c.libelle,
  echelon = 'E02'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1031'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E02' OR UPPER(TRIM(ech.code)) = 'ECH-02' OR UPPER(TRIM(ech.code)) = 'ECH-2')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1031';

-- Agent EMP-1032 -> CL3E01 (GROUPE II, Cat III, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1032'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1032';

-- Agent EMP-1033 -> CL2E06 (GROUPE II, Cat II, Ech 6)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E06',
  categorie_pro = c.libelle,
  echelon = 'E06'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1033'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E06' OR UPPER(TRIM(ech.code)) = 'ECH-06' OR UPPER(TRIM(ech.code)) = 'ECH-6')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1033';

-- Agent EMP-1034 -> C6E05 (GROUPE I, Cat 6, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C6E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1034'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1034';

-- Agent EMP-1035 -> C5E01 (GROUPE I, Cat 5, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1035'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1035';

-- Agent EMP-1036 -> CL3E05 (GROUPE II, Cat III, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1036'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1036';

-- Agent EMP-1037 -> C3E03 (GROUPE I, Cat 3, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1037'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1037';

-- Agent EMP-1038 -> C6E03 (GROUPE I, Cat 6, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C6E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1038'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1038';

-- Agent EMP-1039 -> CL2E05 (GROUPE II, Cat II, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1039'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1039';

-- Agent EMP-1040 -> C1E01 (GROUPE I, Cat 1, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C1E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1040'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1040';

-- Agent EMP-1041 -> C3E02 (GROUPE I, Cat 3, Ech 2)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E02',
  categorie_pro = c.libelle,
  echelon = 'E02'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1041'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E02' OR UPPER(TRIM(ech.code)) = 'ECH-02' OR UPPER(TRIM(ech.code)) = 'ECH-2')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1041';

-- Agent EMP-1042 -> CL1E01 (GROUPE II, Cat I, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL1E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1042'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1042';

-- Agent EMP-1043 -> C5E04 (GROUPE I, Cat 5, Ech 4)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E04',
  categorie_pro = c.libelle,
  echelon = 'E04'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1043'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E04' OR UPPER(TRIM(ech.code)) = 'ECH-04' OR UPPER(TRIM(ech.code)) = 'ECH-4')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1043';

-- Agent EMP-1044 -> CL3E05 (GROUPE II, Cat III, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1044'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1044';

-- Agent EMP-1045 -> CL2E04 (GROUPE II, Cat II, Ech 4)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E04',
  categorie_pro = c.libelle,
  echelon = 'E04'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1045'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E04' OR UPPER(TRIM(ech.code)) = 'ECH-04' OR UPPER(TRIM(ech.code)) = 'ECH-4')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1045';

-- Agent EMP-1046 -> C6E05 (GROUPE I, Cat 6, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C6E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1046'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1046';

-- Agent EMP-1047 -> C5E03 (GROUPE I, Cat 5, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1047'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1047';

-- Agent EMP-1048 -> CL3E01 (GROUPE II, Cat III, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1048'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1048';

-- Agent EMP-1049 -> C3E05 (GROUPE I, Cat 3, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1049'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1049';

-- Agent EMP-1050 -> C2E01 (GROUPE I, Cat 2, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C2E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1050'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1050';

-- Agent EMP-1051 -> CL2E03 (GROUPE II, Cat II, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1051'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1051';

-- Agent EMP-1052 -> CL3E05 (GROUPE II, Cat III, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1052'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1052';

-- Agent EMP-1053 -> C3E04 (GROUPE I, Cat 3, Ech 4)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E04',
  categorie_pro = c.libelle,
  echelon = 'E04'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1053'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E04' OR UPPER(TRIM(ech.code)) = 'ECH-04' OR UPPER(TRIM(ech.code)) = 'ECH-4')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1053';

-- Agent EMP-1054 -> CL1E06 (GROUPE II, Cat I, Ech 6)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL1E06',
  categorie_pro = c.libelle,
  echelon = 'E06'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1054'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(ech.libelle)) = 'E06' OR UPPER(TRIM(ech.code)) = 'ECH-06' OR UPPER(TRIM(ech.code)) = 'ECH-6')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1054';

-- Agent EMP-1055 -> C5E01 (GROUPE I, Cat 5, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1055'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1055';

-- Agent EMP-1056 -> CL3E01 (GROUPE II, Cat III, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1056'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1056';

-- Agent EMP-1057 -> CL2E02 (GROUPE II, Cat II, Ech 2)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E02',
  categorie_pro = c.libelle,
  echelon = 'E02'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1057'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E02' OR UPPER(TRIM(ech.code)) = 'ECH-02' OR UPPER(TRIM(ech.code)) = 'ECH-2')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1057';

-- Agent EMP-1058 -> C6E05 (GROUPE I, Cat 6, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C6E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1058'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1058';

-- Agent EMP-1059 -> C5E05 (GROUPE I, Cat 5, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1059'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1059';

-- Agent EMP-1060 -> C3E01 (GROUPE I, Cat 3, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1060'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1060';

-- Agent EMP-1061 -> C3E02 (GROUPE I, Cat 3, Ech 2)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E02',
  categorie_pro = c.libelle,
  echelon = 'E02'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1061'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E02' OR UPPER(TRIM(ech.code)) = 'ECH-02' OR UPPER(TRIM(ech.code)) = 'ECH-2')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1061';

-- Agent EMP-1062 -> C6E03 (GROUPE I, Cat 6, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C6E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1062'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1062';

-- Agent EMP-1063 -> CL2E01 (GROUPE II, Cat II, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1063'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1063';

-- Agent EMP-1064 -> CL3E01 (GROUPE II, Cat III, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1064'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1064';

-- Agent EMP-1065 -> C3E01 (GROUPE I, Cat 3, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1065'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1065';

-- Agent EMP-1066 -> CL1E04 (GROUPE II, Cat I, Ech 4)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL1E04',
  categorie_pro = c.libelle,
  echelon = 'E04'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1066'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(ech.libelle)) = 'E04' OR UPPER(TRIM(ech.code)) = 'ECH-04' OR UPPER(TRIM(ech.code)) = 'ECH-4')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1066';

-- Agent EMP-1067 -> C5E03 (GROUPE I, Cat 5, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1067'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1067';

-- Agent EMP-1068 -> CL3E05 (GROUPE II, Cat III, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1068'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1068';

-- Agent EMP-1069 -> CL2E07 (GROUPE II, Cat II, Ech 7)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E07',
  categorie_pro = c.libelle,
  echelon = 'E07'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1069'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E07' OR UPPER(TRIM(ech.code)) = 'ECH-07' OR UPPER(TRIM(ech.code)) = 'ECH-7')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1069';

-- Agent EMP-1070 -> C4E01 (GROUPE I, Cat 4, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C4E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1070'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '4'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1070';

-- Agent EMP-1071 -> C5E02 (GROUPE I, Cat 5, Ech 2)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E02',
  categorie_pro = c.libelle,
  echelon = 'E02'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1071'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E02' OR UPPER(TRIM(ech.code)) = 'ECH-02' OR UPPER(TRIM(ech.code)) = 'ECH-2')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1071';

-- Agent EMP-1072 -> CL3E01 (GROUPE II, Cat III, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1072'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1072';

-- Agent EMP-1073 -> C3E04 (GROUPE I, Cat 3, Ech 4)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E04',
  categorie_pro = c.libelle,
  echelon = 'E04'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1073'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E04' OR UPPER(TRIM(ech.code)) = 'ECH-04' OR UPPER(TRIM(ech.code)) = 'ECH-4')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1073';

-- Agent EMP-1074 -> C6E03 (GROUPE I, Cat 6, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C6E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1074'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1074';

-- Agent EMP-1075 -> CL2E06 (GROUPE II, Cat II, Ech 6)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E06',
  categorie_pro = c.libelle,
  echelon = 'E06'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1075'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E06' OR UPPER(TRIM(ech.code)) = 'ECH-06' OR UPPER(TRIM(ech.code)) = 'ECH-6')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1075';

-- Agent EMP-1076 -> CL3E05 (GROUPE II, Cat III, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1076'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1076';

-- Agent EMP-1077 -> C3E03 (GROUPE I, Cat 3, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1077'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1077';

-- Agent EMP-1078 -> CL1E02 (GROUPE II, Cat I, Ech 2)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL1E02',
  categorie_pro = c.libelle,
  echelon = 'E02'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1078'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'I'
  AND (UPPER(TRIM(ech.libelle)) = 'E02' OR UPPER(TRIM(ech.code)) = 'ECH-02' OR UPPER(TRIM(ech.code)) = 'ECH-2')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1078';

-- Agent EMP-1079 -> C5E05 (GROUPE I, Cat 5, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1079'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1079';

-- Agent EMP-1080 -> C1E01 (GROUPE I, Cat 1, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C1E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1080'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '1'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1080';

-- Agent EMP-1081 -> CL2E05 (GROUPE II, Cat II, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1081'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1081';

-- Agent EMP-1082 -> C6E05 (GROUPE I, Cat 6, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C6E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1082'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1082';

-- Agent EMP-1083 -> C5E04 (GROUPE I, Cat 5, Ech 4)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E04',
  categorie_pro = c.libelle,
  echelon = 'E04'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1083'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E04' OR UPPER(TRIM(ech.code)) = 'ECH-04' OR UPPER(TRIM(ech.code)) = 'ECH-4')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1083';

-- Agent EMP-1084 -> CL3E05 (GROUPE II, Cat III, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1084'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1084';

-- Agent EMP-1085 -> C3E01 (GROUPE I, Cat 3, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1085'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1085';

-- Agent EMP-1086 -> C6E03 (GROUPE I, Cat 6, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C6E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1086'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1086';

-- Agent EMP-1087 -> CL2E04 (GROUPE II, Cat II, Ech 4)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E04',
  categorie_pro = c.libelle,
  echelon = 'E04'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1087'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E04' OR UPPER(TRIM(ech.code)) = 'ECH-04' OR UPPER(TRIM(ech.code)) = 'ECH-4')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1087';

-- Agent EMP-1088 -> CL3E01 (GROUPE II, Cat III, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1088'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1088';

-- Agent EMP-1089 -> C3E05 (GROUPE I, Cat 3, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1089'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1089';

-- Agent EMP-1090 -> C2E01 (GROUPE I, Cat 2, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C2E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1090'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '2'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1090';

-- Agent EMP-1091 -> C5E02 (GROUPE I, Cat 5, Ech 2)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E02',
  categorie_pro = c.libelle,
  echelon = 'E02'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1091'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E02' OR UPPER(TRIM(ech.code)) = 'ECH-02' OR UPPER(TRIM(ech.code)) = 'ECH-2')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1091';

-- Agent EMP-1092 -> CL3E05 (GROUPE II, Cat III, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1092'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1092';

-- Agent EMP-1093 -> CL2E03 (GROUPE II, Cat II, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1093'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1093';

-- Agent EMP-1094 -> C6E05 (GROUPE I, Cat 6, Ech 5)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C6E05',
  categorie_pro = c.libelle,
  echelon = 'E05'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1094'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(ech.libelle)) = 'E05' OR UPPER(TRIM(ech.code)) = 'ECH-05' OR UPPER(TRIM(ech.code)) = 'ECH-5')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1094';

-- Agent EMP-1095 -> C5E01 (GROUPE I, Cat 5, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C5E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1095'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '5'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1095';

-- Agent EMP-1096 -> CL3E01 (GROUPE II, Cat III, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1096'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'III'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1096';

-- Agent EMP-1097 -> C3E03 (GROUPE I, Cat 3, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1097'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1097';

-- Agent EMP-1098 -> C6E03 (GROUPE I, Cat 6, Ech 3)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C6E03',
  categorie_pro = c.libelle,
  echelon = 'E03'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1098'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '6'
  AND (UPPER(TRIM(ech.libelle)) = 'E03' OR UPPER(TRIM(ech.code)) = 'ECH-03' OR UPPER(TRIM(ech.code)) = 'ECH-3')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1098';

-- Agent EMP-1099 -> CL2E02 (GROUPE II, Cat II, Ech 2)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'CL2E02',
  categorie_pro = c.libelle,
  echelon = 'E02'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1099'
  AND UPPER(TRIM(g.code)) = 'GROUPE II'
  AND UPPER(TRIM(c.code)) = 'II'
  AND (UPPER(TRIM(ech.libelle)) = 'E02' OR UPPER(TRIM(ech.code)) = 'ECH-02' OR UPPER(TRIM(ech.code)) = 'ECH-2')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1099';

-- Agent EMP-1100 -> C3E01 (GROUPE I, Cat 3, Ech 1)
UPDATE employee e
SET
  grade_id = g.id,
  categorie_id = c.id,
  echelon_id = ech.id,
  grille_salariale_id = gs.id,
  grade = 'C3E01',
  categorie_pro = c.libelle,
  echelon = 'E01'
FROM
  grade g,
  categorie c,
  echelon ech,
  grille_salariale gs
WHERE e.matricule = 'EMP-1100'
  AND UPPER(TRIM(g.code)) = 'GROUPE I'
  AND UPPER(TRIM(c.code)) = '3'
  AND (UPPER(TRIM(ech.libelle)) = 'E01' OR UPPER(TRIM(ech.code)) = 'ECH-01' OR UPPER(TRIM(ech.code)) = 'ECH-1')
  AND gs.grade_id = g.id AND gs.categorie_id = c.id AND gs.echelon_id = ech.id;

-- Mise à jour du salaire de base dans information_salariale
UPDATE information_salariale inf
SET salaire_base = gs.salaire_base
FROM employee e
JOIN grille_salariale gs ON gs.id = e.grille_salariale_id
WHERE inf.employee_id = e.id AND e.matricule = 'EMP-1100';

COMMIT;
