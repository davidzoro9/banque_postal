-- ==============================================================================
-- FLYWAY MIGRATION V9 : PLAN COMPTABLE SYSCOHADA RÉVISÉ, 11 JOURS FÉRIÉS LÉGAUX
-- ET DÉCOMPTE DES CONGÉS PAR TYPE DE JOUR (OUVRÉ, OUVRABLE, CALENDAIRE)
-- ==============================================================================

-- 1. Évolution de type_absence_conge pour supporter le type de décompte par jour
ALTER TABLE type_absence_conge ADD COLUMN IF NOT EXISTS type_jour VARCHAR(50) DEFAULT 'OUVRABLE';
ALTER TABLE parametrage_conge ADD COLUMN IF NOT EXISTS quota_permissions_annuel INT DEFAULT 10;

-- Définir les types de jours par défaut selon la réglementation et le code du travail :
-- OUVRE : Lundi à Vendredi (exclut Samedi et Dimanche)
-- OUVRABLE : Lundi à Samedi (exclut Dimanche)
-- CALENDAIRE : Tous les jours civils (ex: maternité 14 semaines consécutives, maladie)
UPDATE type_absence_conge SET type_jour = 'OUVRABLE' WHERE code IN ('CONGE_ANNUEL', 'EVT_MARIAGE', 'EVT_DECES', 'EVT_NAISSANCE') OR type_jour IS NULL;
UPDATE type_absence_conge SET type_jour = 'CALENDAIRE' WHERE code IN ('CONGE_MATERNITE', 'CONGE_MALADIE');
UPDATE type_absence_conge SET type_jour = 'OUVRE' WHERE code IN ('ABS_AUTORISEE', 'PERMISSION');

-- Suppression définitive du congé de paternité de la liste des congés
DELETE FROM type_absence_conge WHERE code = 'CONGE_PATERNITE' OR UPPER(name) LIKE '%PATERNIT%';

-- S'assurer de la contrainte unique sur code dans type_absence_conge
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_type_absence_conge_code'
    ) THEN
        DELETE FROM type_absence_conge a USING type_absence_conge b 
        WHERE a.id < b.id AND a.code = b.code;
        
        ALTER TABLE type_absence_conge ADD CONSTRAINT uk_type_absence_conge_code UNIQUE (code);
    END IF;
END $$;

-- Insertion ou mise à jour sécurisée du type générique PERMISSION
DELETE FROM type_absence_conge WHERE code = 'PERMISSION';
INSERT INTO type_absence_conge (code, name, description, deductible_du_solde, duree_max_legale_jours, categorie, sexe_requis, type_jour, actif, remunere)
VALUES ('PERMISSION', 'Permission d''absence exceptionnelle', 'Permission d''absence accordée sur motif', FALSE, 10, 'PERMISSION', 'TOUS', 'OUVRABLE', TRUE, TRUE);

-- 2. Nettoyage et mise à jour de la liste des jours fériés légaux : EXACTEMENT 11 JOURS au Burkina Faso
-- Selon la loi portant institution des fêtes légales et chômées (7 fêtes fixes et 4 fêtes mobiles) :
-- Fixes : 1er Janvier, 8 Mars, 1er Mai, 15 Mai (Coutumes et Traditions), 15 Août, 11 Décembre, 25 Décembre
-- Mobiles : Ascension, Aïd el-Fitr (Ramadan), Aïd el-Kébir (Tabaski), Mouloud (Maoulid)
-- Suppression des anciens jours non chômés (01-03, 08-05, 10-31, 11-01, Lundi de Pâques, Lundi de Pentecôte)

DELETE FROM jour_ferie 
WHERE date LIKE '%-01-03' 
   OR date LIKE '%-08-05' 
   OR date LIKE '%-10-31' 
   OR date LIKE '%-11-01' 
   OR UPPER(libelle) LIKE '%PÂQUES%' 
   OR UPPER(libelle) LIKE '%PAQUES%' 
   OR UPPER(libelle) LIKE '%PENTECÔTE%' 
   OR UPPER(libelle) LIKE '%PENTECOTE%'
   OR UPPER(libelle) LIKE '%SOULÈVEMENT%'
   OR UPPER(libelle) LIKE '%SOULEVEMENT%'
   OR UPPER(libelle) LIKE '%MARTYRS%'
   OR UPPER(libelle) LIKE '%TOUSSAINT%'
   OR UPPER(libelle) LIKE '%INDÉPENDANCE%'
   OR UPPER(libelle) LIKE '%INDEPENDANCE%';

-- S'assurer de la contrainte unique sur date dans jour_ferie
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_jour_ferie_date'
    ) THEN
        DELETE FROM jour_ferie a USING jour_ferie b 
        WHERE a.id < b.id AND a.date = b.date;
        
        ALTER TABLE jour_ferie ADD CONSTRAINT uk_jour_ferie_date UNIQUE (date);
    END IF;
END $$;

-- Normalisation des types de jours fériés : STRICTEMENT 'FIXE' et 'VARIABLE'
UPDATE jour_ferie SET type = 'VARIABLE' WHERE UPPER(type) IN ('VARIABLE', 'MOBILE', 'RELIGIEUX', 'EXCEPTIONNEL');
UPDATE jour_ferie SET type = 'FIXE' WHERE type IS NULL OR UPPER(type) NOT IN ('VARIABLE');

-- Insertion des 11 jours fériés légaux officiels pour 2025 (Exactement 11 jours : 7 FIXES, 4 VARIABLES)
INSERT INTO jour_ferie (date, libelle, type, chome_paye, description) VALUES
('2025-01-01', 'Jour de l''An', 'FIXE', TRUE, 'Fête du Nouvel An'),
('2025-03-08', 'Journée Internationale des Droits de la Femme', 'FIXE', TRUE, '8 Mars'),
('2025-03-31', 'Aïd el-Fitr (Ramadan)', 'VARIABLE', TRUE, 'Fête musulmane'),
('2025-05-01', 'Fête du Travail', 'FIXE', TRUE, '1er Mai'),
('2025-05-15', 'Journée des Coutumes et Traditions', 'FIXE', TRUE, 'Fête des traditions et coutumes burkinabè'),
('2025-05-29', 'Ascension', 'VARIABLE', TRUE, 'Fête chrétienne'),
('2025-06-07', 'Aïd el-Kébir (Tabaski)', 'VARIABLE', TRUE, 'Fête musulmane'),
('2025-08-15', 'Assomption', 'FIXE', TRUE, 'Fête chrétienne'),
('2025-09-05', 'Mouloud (Maoulid)', 'VARIABLE', TRUE, 'Naissance du Prophète Mahomet'),
('2025-12-11', 'Fête Nationale', 'FIXE', TRUE, 'Proclamation de la République'),
('2025-12-25', 'Noël', 'FIXE', TRUE, 'Fête de la Nativité')
ON CONFLICT (date) DO UPDATE 
SET libelle = EXCLUDED.libelle, type = EXCLUDED.type, chome_paye = EXCLUDED.chome_paye, description = EXCLUDED.description;

-- Insertion des 11 jours fériés légaux officiels pour 2026 (Exactement 11 jours : 7 FIXES, 4 VARIABLES)
INSERT INTO jour_ferie (date, libelle, type, chome_paye, description) VALUES
('2026-01-01', 'Jour de l''An', 'FIXE', TRUE, 'Fête du Nouvel An'),
('2026-03-08', 'Journée Internationale des Droits de la Femme', 'FIXE', TRUE, '8 Mars'),
('2026-03-20', 'Aïd el-Fitr (Ramadan)', 'VARIABLE', TRUE, 'Fête musulmane'),
('2026-05-01', 'Fête du Travail', 'FIXE', TRUE, '1er Mai'),
('2026-05-14', 'Ascension', 'VARIABLE', TRUE, 'Fête chrétienne'),
('2026-05-15', 'Journée des Coutumes et Traditions', 'FIXE', TRUE, 'Fête des traditions et coutumes burkinabè'),
('2026-05-27', 'Aïd el-Kébir (Tabaski)', 'VARIABLE', TRUE, 'Fête musulmane'),
('2026-08-15', 'Assomption', 'FIXE', TRUE, 'Fête chrétienne'),
('2026-08-26', 'Mouloud (Maoulid)', 'VARIABLE', TRUE, 'Naissance du Prophète Mahomet'),
('2026-12-11', 'Fête Nationale', 'FIXE', TRUE, 'Proclamation de la République'),
('2026-12-25', 'Noël', 'FIXE', TRUE, 'Fête de la Nativité')
ON CONFLICT (date) DO UPDATE 
SET libelle = EXCLUDED.libelle, type = EXCLUDED.type, chome_paye = EXCLUDED.chome_paye, description = EXCLUDED.description;

-- Insertion des 11 jours fériés légaux officiels pour 2027 (Exactement 11 jours : 7 FIXES, 4 VARIABLES)
INSERT INTO jour_ferie (date, libelle, type, chome_paye, description) VALUES
('2027-01-01', 'Jour de l''An', 'FIXE', TRUE, 'Fête du Nouvel An'),
('2027-03-08', 'Journée Internationale des Droits de la Femme', 'FIXE', TRUE, '8 Mars'),
('2027-03-10', 'Aïd el-Fitr (Ramadan)', 'VARIABLE', TRUE, 'Fête musulmane'),
('2027-05-01', 'Fête du Travail', 'FIXE', TRUE, '1er Mai'),
('2027-05-06', 'Ascension', 'VARIABLE', TRUE, 'Fête chrétienne'),
('2027-05-15', 'Journée des Coutumes et Traditions', 'FIXE', TRUE, 'Fête des traditions et coutumes burkinabè'),
('2027-05-17', 'Aïd el-Kébir (Tabaski)', 'VARIABLE', TRUE, 'Fête musulmane'),
('2027-08-15', 'Assomption', 'FIXE', TRUE, 'Fête chrétienne'),
('2027-08-16', 'Mouloud (Maoulid)', 'VARIABLE', TRUE, 'Naissance du Prophète Mahomet'),
('2027-12-11', 'Fête Nationale', 'FIXE', TRUE, 'Proclamation de la République'),
('2027-12-25', 'Noël', 'FIXE', TRUE, 'Fête de la Nativité')
ON CONFLICT (date) DO UPDATE 
SET libelle = EXCLUDED.libelle, type = EXCLUDED.type, chome_paye = EXCLUDED.chome_paye, description = EXCLUDED.description;

-- 3. Mise en conformité avec le PLAN COMPTABLE SYSCOHADA RÉVISÉ (OHADA)
-- Classe 66 : Charges de personnel (6611 salaires, 6612 primes, 6613 congés, 6615 rappels, 6618 indemnités, 6641 CNSS, 6642 CRRAE)
-- Classe 64 : Impôts et taxes (6413 TPA)
-- Classe 42 : Personnel (4211 Net à payer, 4220 Précomptes/prêts, 4251 Acomptes, 4281 Provisions congés, 4287 Trop-perçus)
-- Classe 43 : Organismes sociaux (4311 CNSS, 4312 CRRAE)
-- Classe 44 : État et collectivités (4471 IUTS, 4472 FSP, 4473 TPA dette)

UPDATE rubrique_paie SET numero_compte_defaut = '661100', libelle = 'Salaires de base du personnel national', sens_suggere = 'DEBIT', classe_suggeree = 'CLASSE_6' WHERE code_rubrique = 'SALAIRE_BASE';
UPDATE rubrique_paie SET numero_compte_defaut = '661200', libelle = 'Sur-salaires du personnel', sens_suggere = 'DEBIT', classe_suggeree = 'CLASSE_6' WHERE code_rubrique = 'SUR_SALAIRE';
UPDATE rubrique_paie SET numero_compte_defaut = '661200', libelle = 'Primes & Gratifications', sens_suggere = 'DEBIT', classe_suggeree = 'CLASSE_6' WHERE code_rubrique = 'PRIMES';
UPDATE rubrique_paie SET numero_compte_defaut = '661800', libelle = 'Indemnités & Avantages divers', sens_suggere = 'DEBIT', classe_suggeree = 'CLASSE_6' WHERE code_rubrique = 'INDEMNITES';
UPDATE rubrique_paie SET numero_compte_defaut = '661500', libelle = 'Rappels sur salaires antérieurs (Avoirs)', sens_suggere = 'DEBIT', classe_suggeree = 'CLASSE_6' WHERE code_rubrique = 'RAPPELS';
UPDATE rubrique_paie SET numero_compte_defaut = '661800', libelle = 'Heures supplémentaires', sens_suggere = 'DEBIT', classe_suggeree = 'CLASSE_6' WHERE code_rubrique = 'HEURES_SUPP';
UPDATE rubrique_paie SET numero_compte_defaut = '661300', libelle = 'Indemnités de congés payés', sens_suggere = 'DEBIT', classe_suggeree = 'CLASSE_6' WHERE code_rubrique = 'CONGES_PAYES';
UPDATE rubrique_paie SET numero_compte_defaut = '664100', libelle = 'Cotisations patronales CNSS', sens_suggere = 'DEBIT', classe_suggeree = 'CLASSE_6' WHERE code_rubrique = 'COTISATIONS_PATRONALES';
UPDATE rubrique_paie SET numero_compte_defaut = '664200', libelle = 'Cotisations patronales régimes complémentaires (CRRAE)', sens_suggere = 'DEBIT', classe_suggeree = 'CLASSE_6' WHERE code_rubrique = 'CRRAE_PATRONALE';
UPDATE rubrique_paie SET numero_compte_defaut = '641300', libelle = 'Taxe Patronale d''Apprentissage (TPA - Charge)', sens_suggere = 'DEBIT', classe_suggeree = 'CLASSE_6' WHERE code_rubrique = 'TPA';
UPDATE rubrique_paie SET numero_compte_defaut = '421100', libelle = 'Personnel - Rémunérations nettes dues (Virements)', sens_suggere = 'CREDIT', classe_suggeree = 'CLASSE_4' WHERE code_rubrique = 'NET_A_PAYER';
UPDATE rubrique_paie SET numero_compte_defaut = '425100', libelle = 'Personnel - Avances et acomptes consentis', sens_suggere = 'CREDIT', classe_suggeree = 'CLASSE_4' WHERE code_rubrique = 'ACOMPTES';
UPDATE rubrique_paie SET numero_compte_defaut = '422000', libelle = 'Personnel - Prêts et précomptes apurés', sens_suggere = 'CREDIT', classe_suggeree = 'CLASSE_4' WHERE code_rubrique = 'PRECOMPTES';
UPDATE rubrique_paie SET numero_compte_defaut = '428700', libelle = 'Personnel - Trop-perçus à récupérer', sens_suggere = 'CREDIT', classe_suggeree = 'CLASSE_4' WHERE code_rubrique = 'TROP_PERCUS';
UPDATE rubrique_paie SET numero_compte_defaut = '431100', libelle = 'Sécurité Sociale (CNSS salariale & patronale)', sens_suggere = 'CREDIT', classe_suggeree = 'CLASSE_4' WHERE code_rubrique = 'CNSS';
UPDATE rubrique_paie SET numero_compte_defaut = '431200', libelle = 'Organismes de Prévoyance (CRRAE globale)', sens_suggere = 'CREDIT', classe_suggeree = 'CLASSE_4' WHERE code_rubrique = 'CRRAE';
UPDATE rubrique_paie SET numero_compte_defaut = '447100', libelle = 'État - Impôt Unique sur Traitements et Salaires (IUTS)', sens_suggere = 'CREDIT', classe_suggeree = 'CLASSE_4' WHERE code_rubrique = 'IUTS';
UPDATE rubrique_paie SET numero_compte_defaut = '447200', libelle = 'État - Fonds de Soutien Patriotique (FSP 1%)', sens_suggere = 'CREDIT', classe_suggeree = 'CLASSE_4' WHERE code_rubrique = 'FSP';
UPDATE rubrique_paie SET numero_compte_defaut = '447300', libelle = 'État - Taxe Patronale d''Apprentissage à reverser (TPA)', sens_suggere = 'CREDIT', classe_suggeree = 'CLASSE_4' WHERE code_rubrique = 'TPA_DETTE';
UPDATE rubrique_paie SET numero_compte_defaut = '428100', libelle = 'Personnel - Dettes provisionnées pour congés payés', sens_suggere = 'CREDIT', classe_suggeree = 'CLASSE_4' WHERE code_rubrique = 'PROVISION_CONGES';
UPDATE rubrique_paie SET numero_compte_defaut = '428200', libelle = 'Personnel - Autres régularisations et arrondis', sens_suggere = 'CREDIT', classe_suggeree = 'CLASSE_4' WHERE code_rubrique = 'ARRONDI_CREDIT';
UPDATE rubrique_paie SET numero_compte_defaut = '661900', libelle = 'Charges de personnel - Écarts d''arrondis sur salaires', sens_suggere = 'DEBIT', classe_suggeree = 'CLASSE_6' WHERE code_rubrique = 'ARRONDI_DEBIT';
UPDATE rubrique_paie SET numero_compte_defaut = '668000', libelle = 'Autres charges de personnel', sens_suggere = 'DEBIT', classe_suggeree = 'CLASSE_6' WHERE code_rubrique = 'AUTRE';

-- Contrainte unique sur numero_compte dans compte_comptable
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_compte_comptable_num'
    ) THEN
        DELETE FROM compte_comptable a USING compte_comptable b 
        WHERE a.id < b.id AND a.numero_compte = b.numero_compte;
        
        ALTER TABLE compte_comptable ADD CONSTRAINT uk_compte_comptable_num UNIQUE (numero_compte);
    END IF;
END $$;

-- Insertion ou mise à jour du plan de comptes SYSCOHADA Révisé
INSERT INTO compte_comptable (numero_compte, libelle, classe_compte, sens_par_defaut, type_rubrique_associee, code_journal, description, actif)
VALUES
    ('661100', 'Salaires de base du personnel national', 'CLASSE_6', 'DEBIT', 'SALAIRE_BASE', 'OD_PAIE', 'Traitements et salaires fixes indiciaires du personnel', TRUE),
    ('661200', 'Primes et gratifications du personnel', 'CLASSE_6', 'DEBIT', 'PRIMES', 'OD_PAIE', 'Primes d''ancienneté, de rendement, de bilan et sur-salaires', TRUE),
    ('661300', 'Indemnités de congés payés', 'CLASSE_6', 'DEBIT', 'CONGES_PAYES', 'OD_PAIE', 'Charges sur indemnités de congés payés', TRUE),
    ('661500', 'Rappels sur salaires antérieurs (Avoirs accordés)', 'CLASSE_6', 'DEBIT', 'RAPPELS', 'OD_PAIE', 'Rappels sur salaires antérieurs et régularisations positives', TRUE),
    ('661800', 'Autres indemnités et avantages du personnel', 'CLASSE_6', 'DEBIT', 'INDEMNITES', 'OD_PAIE', 'Indemnités de logement, transport, fonction, caisse, sujétion et heures supp', TRUE),
    ('661900', 'Charges de personnel - Écarts d''arrondis sur salaires', 'CLASSE_6', 'DEBIT', 'ARRONDI_DEBIT', 'OD_PAIE', 'Écarts d''arrondis débiteurs sur calcul de paie', TRUE),
    ('664100', 'Charges sociales sur rémunérations du personnel (CNSS 16%)', 'CLASSE_6', 'DEBIT', 'COTISATIONS_PATRONALES', 'OD_PAIE', 'Charges patronales de sécurité sociale CNSS (Prestations fam., Risques pro, Retraite)', TRUE),
    ('664200', 'Charges patronales régimes complémentaires (CRRAE 10%)', 'CLASSE_6', 'DEBIT', 'CRRAE_PATRONALE', 'OD_PAIE', 'Charges patronales de retraite complémentaire CRRAE (RCPNC/RRPC)', TRUE),
    ('641300', 'Taxe Patronale d''Apprentissage (TPA - Charge)', 'CLASSE_6', 'DEBIT', 'TPA', 'OD_PAIE', 'Taxe Patronale d''Apprentissage (TPA - 3% / 4%)', TRUE),
    ('668000', 'Autres charges de personnel', 'CLASSE_6', 'DEBIT', 'AUTRE', 'OD_PAIE', 'Autres charges de personnel et imputations exceptionnelles', TRUE),
    ('421100', 'Personnel - Rémunérations nettes dues (Virements)', 'CLASSE_4', 'CREDIT', 'NET_A_PAYER', 'OD_PAIE', 'Salaires nets à virer sur comptes bancaires des agents', TRUE),
    ('422000', 'Personnel - Prêts et précomptes apurés', 'CLASSE_4', 'CREDIT', 'PRECOMPTES', 'OD_PAIE', 'Retenues mensuelles sur prêts bancaires et précomptes', TRUE),
    ('425100', 'Personnel - Avances et acomptes consentis', 'CLASSE_4', 'CREDIT', 'ACOMPTES', 'OD_PAIE', 'Acomptes sur salaires consentis en cours de mois', TRUE),
    ('428100', 'Personnel - Dettes provisionnées pour congés payés', 'CLASSE_4', 'CREDIT', 'PROVISION_CONGES', 'OD_PAIE', 'Provisions pour congés à payer de fin d''exercice', TRUE),
    ('428200', 'Personnel - Autres régularisations et arrondis', 'CLASSE_4', 'CREDIT', 'ARRONDI_CREDIT', 'OD_PAIE', 'Arrondis et ajustements créditeurs sur paie', TRUE),
    ('428700', 'Personnel - Trop-perçus à régulariser', 'CLASSE_4', 'CREDIT', 'TROP_PERCUS', 'OD_PAIE', 'Régularisations et récupérations de trop-perçus', TRUE),
    ('431100', 'Sécurité Sociale (CNSS salariale 5.5% + patronale 16%)', 'CLASSE_4', 'CREDIT', 'CNSS', 'OD_PAIE', 'Cotisations CNSS part salariale (5.5%) et patronale (16%) à reverser', TRUE),
    ('431200', 'Organismes de Prévoyance (CRRAE 6% + 10%)', 'CLASSE_4', 'CREDIT', 'CRRAE', 'OD_PAIE', 'Cotisations de prévoyance CRRAE salariale et patronale à reverser', TRUE),
    ('447100', 'État - Impôt Unique sur Traitements et Salaires (IUTS)', 'CLASSE_4', 'CREDIT', 'IUTS', 'OD_PAIE', 'Retenues à la source IUTS selon barème progressif officiel à reverser à la DGI', TRUE),
    ('447200', 'État - Fonds de Soutien Patriotique (FSP 1%)', 'CLASSE_4', 'CREDIT', 'FSP', 'OD_PAIE', 'Prélèvement obligatoire FSP sur rémunérations à reverser au Trésor', TRUE),
    ('447300', 'État - Taxe Patronale d''Apprentissage à reverser (TPA)', 'CLASSE_4', 'CREDIT', 'TPA_DETTE', 'OD_PAIE', 'Dette envers l''État au titre de la TPA à reverser', TRUE)
ON CONFLICT (numero_compte) DO UPDATE 
SET libelle = EXCLUDED.libelle,
    classe_compte = EXCLUDED.classe_compte,
    sens_par_defaut = EXCLUDED.sens_par_defaut,
    type_rubrique_associee = EXCLUDED.type_rubrique_associee,
    code_journal = EXCLUDED.code_journal,
    description = EXCLUDED.description,
    actif = EXCLUDED.actif;
