-- ==============================================================================
-- V11 : PERSISTANCE PHYSIQUE DES CHARGES PATRONALES ET DE LA TPA (3%)
-- ET HARMONISATION OFFICIELLE BPBF (PCB SFD/UMOA & MODÈLES DES ÉTATS)
-- Règle V3 : Zéro donnée volatile, persistance intégrale PostgreSQL -> BulletinLine
-- ==============================================================================

-- 1. S'assurer que la colonne part_patronale existe sur bulletin_line
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bulletin_line' AND column_name = 'part_patronale'
    ) THEN
        ALTER TABLE bulletin_line ADD COLUMN part_patronale NUMERIC(19, 2) DEFAULT 0.00;
    END IF;
END $$;

-- 2. S'assurer que total_cotisations_patronales existe sur bulletin et session_paie
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bulletin' AND column_name = 'total_cotisations_patronales'
    ) THEN
        ALTER TABLE bulletin ADD COLUMN total_cotisations_patronales NUMERIC(19, 2) DEFAULT 0.00;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'session_paie' AND column_name = 'total_cotisations_patronales'
    ) THEN
        ALTER TABLE session_paie ADD COLUMN total_cotisations_patronales NUMERIC(19, 2) DEFAULT 0.00;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'session_paie' AND column_name = 'total_masse_salariale'
    ) THEN
        ALTER TABLE session_paie ADD COLUMN total_masse_salariale NUMERIC(19, 2) DEFAULT 0.00;
    END IF;
END $$;

-- 3. Rétro-remplissage et fiabilisation de la part patronale CNSS (16% plafonné à 800 000 FCFA) sur les lignes existantes
UPDATE bulletin_line bl
SET base_calcul = LEAST(COALESCE(bl.base_calcul, b.salaire_brut, 0), 800000.00),
    part_patronale = ROUND(LEAST(COALESCE(bl.base_calcul, b.salaire_brut, 0), 800000.00) * 0.16, 2),
    taux = COALESCE(bl.taux, 5.50)
FROM bulletin b
WHERE bl.bulletin_id = b.id
  AND (bl.code ILIKE '%CNSS%' OR bl.libelle ILIKE '%CNSS%')
  AND (bl.part_patronale IS NULL OR bl.part_patronale = 0);

-- 4. Rétro-remplissage et fiabilisation de la part patronale CRRAE / RCPNC (6%) sur les lignes existantes
UPDATE bulletin_line bl
SET base_calcul = COALESCE(bl.base_calcul, b.salaire_brut, 0),
    part_patronale = ROUND(COALESCE(bl.base_calcul, b.salaire_brut, 0) * 0.06, 2),
    taux = COALESCE(bl.taux, 6.00)
FROM bulletin b
WHERE bl.bulletin_id = b.id
  AND (bl.code ILIKE '%CRRAE%' OR bl.libelle ILIKE '%CRRAE%')
  AND (bl.part_patronale IS NULL OR bl.part_patronale = 0);

-- 5. Harmonisation et normalisation de la retenue Fonds de Solidarité (FSP)
UPDATE bulletin_line bl
SET code = 'FSP',
    taux = COALESCE(bl.taux, 1.00),
    base_calcul = CASE 
        WHEN bl.base_calcul IS NULL OR bl.base_calcul = 0 THEN ROUND(COALESCE(bl.montant, 0) * 100.00, 2)
        ELSE bl.base_calcul 
    END,
    libelle = 'RETENUE FONDS DE SOLIDARITE'
FROM bulletin b
WHERE bl.bulletin_id = b.id
  AND (bl.code ILIKE '%FSP%' OR bl.code ILIKE '%SOLIDAR%' OR bl.libelle ILIKE '%SOLIDAR%' OR bl.libelle ILIKE '%FSP%');

-- 6. Insertion de la ligne TPA (Taxe Patronale d'Apprentissage 3% sur Salaire Brut) pour tous les bulletins existants
INSERT INTO bulletin_line (bulletin_id, code, libelle, type_ligne, base_calcul, taux, montant, part_patronale, ordre)
SELECT 
    b.id,
    'TPA_PAT',
    'TAXE PATRONALE D''APPRENTISSAGE (TPA 3%)',
    'COTISATION_PATRONALE',
    b.salaire_brut,
    3.00,
    0.00,
    ROUND(b.salaire_brut * 0.03, 2),
    99
FROM bulletin b
WHERE b.salaire_brut > 0
  AND NOT EXISTS (
      SELECT 1 FROM bulletin_line bl 
      WHERE bl.bulletin_id = b.id 
        AND (bl.code ILIKE '%TPA%' OR bl.libelle ILIKE '%TPA%' OR bl.libelle ILIKE '%APPRENTISSAGE%')
  );

-- 7. Mise à jour de total_cotisations_patronales sur chaque bulletin
UPDATE bulletin b
SET total_cotisations_patronales = COALESCE((
    SELECT SUM(COALESCE(bl.part_patronale, 0))
    FROM bulletin_line bl
    WHERE bl.bulletin_id = b.id
), 0);

-- 8. Mise à jour des totaux de cotisations patronales et masse salariale sur session_paie
UPDATE session_paie s
SET total_cotisations_patronales = COALESCE((
    SELECT SUM(COALESCE(b.total_cotisations_patronales, 0))
    FROM bulletin b
    WHERE b.session_paie_id = s.id
), 0),
total_masse_salariale = COALESCE(s.total_brut, 0) + COALESCE((
    SELECT SUM(COALESCE(b.total_cotisations_patronales, 0))
    FROM bulletin b
    WHERE b.session_paie_id = s.id
), 0);

-- 9. Mise à niveau de la contrainte unique sur compte_comptable
-- Dans le Plan Comptable Bancaire BPBF, le compte 6420000001 est partagé entre CNSS et TPA
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_compte_comptable_num'
    ) THEN
        ALTER TABLE compte_comptable DROP CONSTRAINT uk_compte_comptable_num;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_compte_rubrique'
    ) THEN
        ALTER TABLE compte_comptable ADD CONSTRAINT uk_compte_rubrique UNIQUE (numero_compte, type_rubrique_associee);
    END IF;
END $$;

-- 10. Insertion des comptes BPBF Plan Comptable Bancaire (PCB SFD/UMOA à 10 chiffres)
INSERT INTO compte_comptable (numero_compte, libelle, classe_compte, sens_par_defaut, type_rubrique_associee, code_journal, description, actif)
VALUES
    ('6420000004', 'CHARGE PATRONALE CRRAE/RCPNC', 'CLASSE_6', 'DEBIT', 'CRRAE_PATRONALE', 'OD_PAIE', 'Charge patronale retraite complémentaire CRRAE/RCPNC', TRUE),
    ('6410000001', 'SALAIRE PERSONNEL NATIONAL', 'CLASSE_6', 'DEBIT', 'SALAIRE_BASE', 'OD_PAIE', 'Traitements et salaires fixes indiciaires du personnel national BPBF', TRUE),
    ('6410000010', 'PRIMES ET GRATIFICATIONS', 'CLASSE_6', 'DEBIT', 'PRIMES', 'OD_PAIE', 'Primes d''ancienneté, de rendement et gratifications annuelles', TRUE),
    ('6411000005', 'INDEMNITES DE LOGEMENT', 'CLASSE_6', 'DEBIT', 'INDEMNITE_LOGEMENT', 'OD_PAIE', 'Indemnités conventionnelles de logement', TRUE),
    ('6411000006', 'INDEMNITES DIVERSES', 'CLASSE_6', 'DEBIT', 'INDEMNITES', 'OD_PAIE', 'Indemnités de transport, fonction, caisse et sujétion', TRUE),
    ('6420000001', 'CHARGE PATRONALE CNSS', 'CLASSE_6', 'DEBIT', 'COTISATIONS_PATRONALES', 'OD_PAIE', 'Cotisations patronales sécurité sociale CNSS (16%)', TRUE),
    ('6420000001', 'TPA / SALAIRES BURKINABE', 'CLASSE_6', 'DEBIT', 'TPA', 'OD_PAIE', 'Taxe patronale d''apprentissage sur salaires burkinabè (3%)', TRUE),
    ('6420000002', 'TPA / SALAIRES (ETRANGERS)', 'CLASSE_6', 'DEBIT', 'TPA_ETRANGER', 'OD_PAIE', 'Taxe patronale d''apprentissage sur salaires expatriés (4%)', TRUE),
    ('3522040004', 'Retenue Fonds Pat.', 'CLASSE_4', 'CREDIT', 'FSP', 'OD_PAIE', 'Retenue Fonds de Soutien Patriotique à reverser', TRUE),
    ('3522040003', 'RETENUE CAR PLAN', 'CLASSE_4', 'CREDIT', 'CRRAE', 'OD_PAIE', 'Cotisations de retraite complémentaire CRRAE à reverser', TRUE),
    ('3522000015', 'TPA A REVERSER', 'CLASSE_4', 'CREDIT', 'TPA_DETTE', 'OD_PAIE', 'Dette fiscale envers le Trésor au titre de la TPA à reverser', TRUE),
    ('3522020001', 'CNSS A REVERSER', 'CLASSE_4', 'CREDIT', 'CNSS', 'OD_PAIE', 'Cotisations globales de sécurité sociale dues à la CNSS', TRUE),
    ('3522020002', 'CAISSE RETRAITE FACULTATIVE', 'CLASSE_4', 'CREDIT', 'RETRAITE_FACULTATIVE', 'OD_PAIE', 'Cotisations d''assurance retraite facultative', TRUE),
    ('3522000016', 'IUTS', 'CLASSE_4', 'CREDIT', 'IUTS', 'OD_PAIE', 'Retenues IUTS dues à l''administration fiscale DGI', TRUE),
    ('3522040001', 'REMUNERATIONS DUES', 'CLASSE_4', 'CREDIT', 'NET_A_PAYER', 'OD_PAIE', 'Salaires nets à virer sur comptes bancaires des collaborateurs', TRUE)
ON CONFLICT (numero_compte, type_rubrique_associee) DO UPDATE
SET libelle = EXCLUDED.libelle,
    classe_compte = EXCLUDED.classe_compte,
    sens_par_defaut = EXCLUDED.sens_par_defaut,
    code_journal = EXCLUDED.code_journal,
    description = EXCLUDED.description,
    actif = EXCLUDED.actif;

-- 11. Harmonisation des ordres et visibilité des 8 états du PDF + Solde de Tout Compte
UPDATE etat_synthese_config SET actif = FALSE;

UPDATE etat_synthese_config SET ordre = 1, actif = TRUE, libelle = 'Récapitulatif Global de la Paie' WHERE code = 'RECAPITULATIF_GLOBAL';
UPDATE etat_synthese_config SET ordre = 2, actif = TRUE, libelle = 'État de Virement des Salaires' WHERE code = 'ETAT_BANQUE';
UPDATE etat_synthese_config SET ordre = 3, actif = TRUE, libelle = 'Registre de Paie' WHERE code = 'LIVRE_PAIE';
UPDATE etat_synthese_config SET ordre = 4, actif = TRUE, libelle = 'État Nominatif Mensuel de Déclaration des Cotisations RRPC' WHERE code = 'ETAT_CRRAE_RRPC';
UPDATE etat_synthese_config SET ordre = 5, actif = TRUE, libelle = 'État Nominatif Mensuel de Déclaration des Cotisations RCPNC' WHERE code = 'ETAT_CRRAE_RCPNC';
UPDATE etat_synthese_config SET ordre = 6, actif = TRUE, libelle = 'État Nominatif Mensuel de Déclaration des Cotisations FAAM' WHERE code = 'ETAT_CRRAE_FAAM';
UPDATE etat_synthese_config SET ordre = 7, actif = TRUE, libelle = 'État des Retenues IUTS' WHERE code = 'ETAT_IUTS';
UPDATE etat_synthese_config SET ordre = 8, actif = TRUE, libelle = 'État des Retenues - Retenue Fonds de Solidarité' WHERE code = 'ETAT_FSP';

INSERT INTO etat_synthese_config (code, libelle, categorie, description, icon, ordre, actif, is_system)
SELECT 'ETAT_STC', 'État du Solde de Tout Compte', 'Indemnités de Rupture', 'Récapitulatif officiel des indemnités de rupture de contrat : indemnité compensatrice de congés acquis, indemnité de licenciement ou retraite, préavis et solde des créances.', 'gavel', 9, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM etat_synthese_config WHERE code = 'ETAT_STC');

UPDATE etat_synthese_config SET ordre = 9, actif = TRUE, libelle = 'État du Solde de Tout Compte' WHERE code = 'ETAT_STC';

-- 12. Harmonisation des signataires officiels de la Banque selon Modeles des états.pdf
UPDATE signataire_config 
SET titre_signataire1 = 'Directeur Administratif et Moyens Généraux',
    nom_signataire1 = 'Ahadi Ismaël YONLI',
    titre_signataire2 = 'Directeur Général /PI',
    nom_signataire2 = 'Inoussa SANOUIDI'
WHERE code = 'ETAT_SYNTHESE_SIGNATAIRES';
