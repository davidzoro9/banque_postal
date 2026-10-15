-- ==============================================================================
-- FLYWAY MIGRATION V7 : PARAMÉTRAGE COMPTABLE SYSCOHADA DE PAIE DYNAMIQUE
-- Zéro hardcode : classes, sens, journaux et rubriques de paie
-- ==============================================================================

-- 1. Table des classes comptables
CREATE TABLE IF NOT EXISTS param_classe_comptable (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    numero VARCHAR(20),
    nom VARCHAR(150),
    libelle VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    ordre INT DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE
);
ALTER TABLE param_classe_comptable ADD COLUMN IF NOT EXISTS numero VARCHAR(20);
ALTER TABLE param_classe_comptable ADD COLUMN IF NOT EXISTS nom VARCHAR(150);

-- 2. Table des sens d'écriture comptable
CREATE TABLE IF NOT EXISTS param_sens_ecriture (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    ordre INT DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE
);

-- 3. Table des journaux comptables
CREATE TABLE IF NOT EXISTS param_journal_comptable (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    type_journal VARCHAR(50) DEFAULT 'OD',
    description VARCHAR(255),
    ordre INT DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE
);

-- 4. Évolution de la table rubrique_paie
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS sens_suggere VARCHAR(20);
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS classe_suggeree VARCHAR(50);
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS numero_compte_defaut VARCHAR(30);
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS description VARCHAR(255);
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS ordre INT DEFAULT 0;

-- S'assurer de la contrainte unique sur code_rubrique
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_rubrique_paie_code'
    ) THEN
        ALTER TABLE rubrique_paie ADD CONSTRAINT uk_rubrique_paie_code UNIQUE (code_rubrique);
    END IF;
END $$;

-- 5. Insertion des Classes Comptables (SYSCOHADA) avec Numéro et Nom
INSERT INTO param_classe_comptable (code, numero, nom, libelle, description, ordre, actif)
VALUES
    ('CLASSE_6', '6', 'Charges de personnel', 'Classe 6 — Charges de personnel', 'Charges liées aux salaires, primes, indemnités et cotisations patronales', 1, TRUE),
    ('CLASSE_4', '4', 'Comptes de tiers / Dettes', 'Classe 4 — Comptes de tiers / Dettes', 'Comptes de personnel, sécurité sociale, organismes sociaux et impôts', 2, TRUE),
    ('CLASSE_1', '1', 'Capitaux & Provisions', 'Classe 1 — Capitaux & Provisions', 'Capitaux propres, dotations et provisions pour risques et charges', 3, TRUE),
    ('CLASSE_5', '5', 'Trésorerie / Banques', 'Classe 5 — Trésorerie / Banques', 'Comptes bancaires de règlement et caisse', 4, TRUE),
    ('CLASSE_7', '7', 'Produits', 'Classe 7 — Produits', 'Reprises sur provisions, remboursements et produits exceptionnels', 5, TRUE),
    ('CLASSE_2', '2', 'Actifs immobilisés', 'Classe 2 — Actifs immobilisés', 'Immobilisations incorporelles et corporelles', 6, TRUE)
ON CONFLICT (code) DO UPDATE 
SET numero = EXCLUDED.numero,
    nom = EXCLUDED.nom,
    libelle = EXCLUDED.libelle, 
    description = EXCLUDED.description, 
    ordre = EXCLUDED.ordre, 
    actif = EXCLUDED.actif;

-- 6. Insertion des Sens d'Écriture Comptable
INSERT INTO param_sens_ecriture (code, libelle, description, ordre, actif)
VALUES
    ('DEBIT', 'DÉBIT (Charges / Diminution dettes)', 'Constatation des charges du personnel ou diminution de dettes / avoirs', 1, TRUE),
    ('CREDIT', 'CRÉDIT (Net à payer / Retenues / Cotisations)', 'Constatation des dettes, retenues salariales ou net à payer', 2, TRUE)
ON CONFLICT (code) DO UPDATE 
SET libelle = EXCLUDED.libelle, 
    description = EXCLUDED.description, 
    ordre = EXCLUDED.ordre, 
    actif = EXCLUDED.actif;

-- 7. Insertion des Journaux Comptables
INSERT INTO param_journal_comptable (code, libelle, type_journal, description, ordre, actif)
VALUES
    ('OD_PAIE', 'Journal des Opérations Diverses de Paie', 'OD', 'Enregistrement mensuel des salaires bruts, charges patronales et retenues', 1, TRUE),
    ('BQ_PAIE', 'Journal de Banque - Règlements Salaires', 'BANQUE', 'Virement des salaires nets et règlements des cotisations sociales et fiscales', 2, TRUE),
    ('CAISSE_PAIE', 'Journal de Caisse - Règlements Salaires Espèces', 'CAISSE', 'Paiement des salaires et acomptes en espèces au guichet', 3, TRUE),
    ('AN_PAIE', 'Journal des À-nouveaux et Provisions de Paie', 'OD', 'Provisions de congés payés, gratifications de fin d''exercice et régularisations', 4, TRUE)
ON CONFLICT (code) DO UPDATE 
SET libelle = EXCLUDED.libelle, 
    type_journal = EXCLUDED.type_journal,
    description = EXCLUDED.description, 
    ordre = EXCLUDED.ordre, 
    actif = EXCLUDED.actif;

-- 8. Insertion et synchronisation des Rubriques de Paie avec imputation comptable
INSERT INTO rubrique_paie (code_rubrique, libelle, type_rubrique, sens_suggere, classe_suggeree, numero_compte_defaut, imposable, cotisable, description, ordre, actif)
VALUES
    ('SALAIRE_BASE', 'Salaire de base', 'GAIN', 'DEBIT', 'CLASSE_6', '641100', TRUE, TRUE, 'Traitements et salaires fixes indiciaires', 1, TRUE),
    ('SUR_SALAIRE', 'Sur-salaire du personnel', 'GAIN', 'DEBIT', 'CLASSE_6', '642200', TRUE, TRUE, 'Sur-salaire contractuel et majorations', 2, TRUE),
    ('PRIMES', 'Primes & Gratifications', 'GAIN', 'DEBIT', 'CLASSE_6', '641200', TRUE, TRUE, 'Primes d''ancienneté, de rendement, bilan et gratifications', 3, TRUE),
    ('INDEMNITES', 'Indemnités & Avantages divers', 'GAIN', 'DEBIT', 'CLASSE_6', '641300', FALSE, FALSE, 'Indemnités de logement, transport, caisse, responsabilité, fonction, sujétion', 4, TRUE),
    ('RAPPELS', 'Rappels sur salaires antérieurs (Avoirs accordés)', 'GAIN', 'DEBIT', 'CLASSE_6', '642500', TRUE, TRUE, 'Rappels sur salaires antérieurs et régularisations positives', 5, TRUE),
    ('HEURES_SUPP', 'Heures supplémentaires', 'GAIN', 'DEBIT', 'CLASSE_6', '641400', TRUE, TRUE, 'Heures supplémentaires majorées selon barème bancaire', 6, TRUE),
    ('COTISATIONS_PATRONALES', 'Cotisations patronales CNSS', 'PATRONALE', 'DEBIT', 'CLASSE_6', '646100', FALSE, FALSE, 'Charges patronales CNSS (Prestations familiales 7%, Risques pro 3.5%, Retraite 8%)', 7, TRUE),
    ('CRRAE_PATRONALE', 'Cotisations patronales régimes complémentaires (CRRAE)', 'PATRONALE', 'DEBIT', 'CLASSE_6', '646200', FALSE, FALSE, 'Charges patronales de retraite complémentaire CRRAE (RCPNC/RRPC)', 8, TRUE),
    ('TPA', 'Taxe Patronale d''Apprentissage (TPA - Charge)', 'PATRONALE', 'DEBIT', 'CLASSE_6', '647100', FALSE, FALSE, 'Taxe Patronale d''Apprentissage (TPA - 3% / 4%)', 9, TRUE),
    ('CONGES_PAYES', 'Indemnités congés payés', 'GAIN', 'DEBIT', 'CLASSE_6', '641800', TRUE, TRUE, 'Charges sur indemnités de congés payés', 10, TRUE),
    ('NET_A_PAYER', 'Rémunérations dues (Net à payer)', 'NET', 'CREDIT', 'CLASSE_4', '421100', FALSE, FALSE, 'Salaires nets à virer sur comptes bancaires des agents', 11, TRUE),
    ('ACOMPTES', 'Avances & Acomptes', 'RETENUE', 'CREDIT', 'CLASSE_4', '422100', FALSE, FALSE, 'Acomptes sur salaires consentis en cours de mois', 12, TRUE),
    ('PRECOMPTES', 'Personnel - Prêts et précomptes apurés', 'RETENUE', 'CREDIT', 'CLASSE_4', '422000', FALSE, FALSE, 'Retenues mensuelles sur prêts bancaires et précomptes', 13, TRUE),
    ('TROP_PERCUS', 'Personnel - Trop-perçus régularisés', 'RETENUE', 'CREDIT', 'CLASSE_4', '428700', FALSE, FALSE, 'Régularisations et récupérations de trop-perçus', 14, TRUE),
    ('CNSS', 'Sécurité Sociale (CNSS salariale & patronale)', 'RETENUE', 'CREDIT', 'CLASSE_4', '431100', FALSE, FALSE, 'Cotisations CNSS part salariale (5.5%) et patronale (18.5%)', 15, TRUE),
    ('CRRAE', 'Organismes de Prévoyance (CRRAE globale)', 'RETENUE', 'CREDIT', 'CLASSE_4', '431200', FALSE, FALSE, 'Cotisations de prévoyance CRRAE salariale et patronale', 16, TRUE),
    ('IUTS', 'Impôt sur salaires (IUTS)', 'RETENUE', 'CREDIT', 'CLASSE_4', '442100', FALSE, FALSE, 'Retenues à la source IUTS selon barème progressif', 17, TRUE),
    ('FSP', 'Fonds de Soutien Patriotique (FSP)', 'RETENUE', 'CREDIT', 'CLASSE_4', '442800', FALSE, FALSE, 'Prélèvement obligatoire FSP sur rémunérations', 18, TRUE),
    ('TPA_DETTE', 'État - Taxe Patronale d''Apprentissage à reverser (TPA)', 'RETENUE', 'CREDIT', 'CLASSE_4', '447300', FALSE, FALSE, 'Dette envers l''État au titre de la TPA à reverser', 19, TRUE),
    ('PROVISION_CONGES', 'Dettes provisionnées congés payés', 'RETENUE', 'CREDIT', 'CLASSE_4', '428100', FALSE, FALSE, 'Provisions pour congés à payer de fin d''exercice', 20, TRUE),
    ('ARRONDI_CREDIT', 'Personnel - Arrondis / Régularisations (Crédit)', 'REGULARISATION', 'CREDIT', 'CLASSE_4', '428200', FALSE, FALSE, 'Arrondis et ajustements créditeurs sur paie', 21, TRUE),
    ('ARRONDI_DEBIT', 'Charges de personnel - Ajustement d''arrondis (Débit)', 'REGULARISATION', 'DEBIT', 'CLASSE_6', '641900', FALSE, FALSE, 'Écarts d''arrondis débiteurs sur calcul de paie', 22, TRUE),
    ('AUTRE', 'Autre écriture de paie', 'AUTRE', 'DEBIT', 'CLASSE_6', '648000', FALSE, FALSE, 'Autres écritures et imputations comptables exceptionnelles', 23, TRUE)
ON CONFLICT (code_rubrique) DO UPDATE 
SET libelle = EXCLUDED.libelle,
    sens_suggere = EXCLUDED.sens_suggere,
    classe_suggeree = EXCLUDED.classe_suggeree,
    numero_compte_defaut = EXCLUDED.numero_compte_defaut,
    imposable = EXCLUDED.imposable,
    cotisable = EXCLUDED.cotisable,
    description = EXCLUDED.description,
    ordre = EXCLUDED.ordre,
    actif = EXCLUDED.actif;
