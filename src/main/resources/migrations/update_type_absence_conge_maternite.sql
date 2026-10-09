-- Migration : Catégorisation Congés vs Absences & Règles Légales Congé de Maternité
-- Date : 2026-10-06
-- Auteur : Senior Full-Stack BPBF

-- 1. Ajout des colonnes de structure
ALTER TABLE type_absence_conge ADD COLUMN IF NOT EXISTS categorie VARCHAR(50) DEFAULT 'CONGE';
ALTER TABLE type_absence_conge ADD COLUMN IF NOT EXISTS sexe_requis VARCHAR(20) DEFAULT 'TOUS';

-- 2. Mise à jour des types officiels (Distinction Congés vs Absences / Permissions)
-- CONGÉS (Statutaires / Légaux)
UPDATE type_absence_conge 
SET categorie = 'CONGE', sexe_requis = 'TOUS', deductible_du_solde = true, duree_max_legale_jours = 30
WHERE code = 'CONGE_ANNUEL' OR name ILIKE '%annuel%';

UPDATE type_absence_conge 
SET categorie = 'CONGE', sexe_requis = 'FEMININ', deductible_du_solde = false, duree_max_legale_jours = 98
WHERE code = 'CONGE_MATERNITE' OR name ILIKE '%materni%';

UPDATE type_absence_conge 
SET categorie = 'CONGE', sexe_requis = 'MASCULIN', deductible_du_solde = false, duree_max_legale_jours = 3
WHERE code = 'CONGE_PATERNITE' OR name ILIKE '%paterni%';

UPDATE type_absence_conge 
SET categorie = 'CONGE', sexe_requis = 'TOUS', deductible_du_solde = false, duree_max_legale_jours = 180
WHERE code = 'CONGE_MALADIE' OR name ILIKE '%maladie%';

-- ABSENCES & PERMISSIONS EXCEPTIONNELLES (Convention collective bancaire & Code du Travail)
UPDATE type_absence_conge 
SET categorie = 'ABSENCE', sexe_requis = 'TOUS', deductible_du_solde = false, duree_max_legale_jours = 3
WHERE code = 'EVT_MARIAGE' OR name ILIKE '%mariage%';

UPDATE type_absence_conge 
SET categorie = 'ABSENCE', sexe_requis = 'TOUS', deductible_du_solde = false, duree_max_legale_jours = 5
WHERE code = 'EVT_DECES' OR name ILIKE '%décès%' OR name ILIKE '%deces%';

UPDATE type_absence_conge 
SET categorie = 'ABSENCE', sexe_requis = 'TOUS', deductible_du_solde = false, duree_max_legale_jours = 3
WHERE code = 'EVT_NAISSANCE' OR name ILIKE '%naissance%';

UPDATE type_absence_conge 
SET categorie = 'ABSENCE', sexe_requis = 'TOUS', deductible_du_solde = false, duree_max_legale_jours = 2
WHERE code = 'ABS_AUTORISEE' OR name ILIKE '%autoris%';
