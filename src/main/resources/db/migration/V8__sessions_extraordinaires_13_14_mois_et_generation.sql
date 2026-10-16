-- ==============================================================================
-- FLYWAY MIGRATION V8 : SCHÉMA COMPLET ET INTÉGRAL DU MODULE PAIE & SESSIONS
-- (Sessions Ordinaires & Extraordinaires 13è/14è Mois, STC, Congés, Bulletins & Lignes)
-- ==============================================================================
-- 100% Autonome & Idempotent : Fonctionne sur base neuve ou base existante.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Table `session_paie` : Cycle de paie mensuel et annuel
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS session_paie (
    id BIGSERIAL PRIMARY KEY,
    code_session VARCHAR(100) NOT NULL,
    mois VARCHAR(20) NOT NULL,
    annee INTEGER NOT NULL,
    periode VARCHAR(255) NOT NULL,
    type_session VARCHAR(100) DEFAULT 'ORDINAIRE',
    nature_session VARCHAR(100),
    name VARCHAR(255),
    date_from DATE,
    date_to DATE,
    statut VARCHAR(20) NOT NULL DEFAULT 'BROUILLON',
    nombre_employes INTEGER DEFAULT 0,
    nombre_valide INTEGER DEFAULT 0,
    total_masse_salariale NUMERIC(19, 2) DEFAULT 0,
    total_brut NUMERIC(19, 2) DEFAULT 0,
    total_net NUMERIC(19, 2) DEFAULT 0,
    total_retenues NUMERIC(19, 2) DEFAULT 0,
    total_cotisations_patronales NUMERIC(19, 2) DEFAULT 0,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_validation TIMESTAMP,
    date_cloture TIMESTAMP,
    cree_par VARCHAR(255),
    cloture_par VARCHAR(255)
);

-- Garantir la présence de toutes les colonnes sur base existante
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS code_session VARCHAR(100);
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS mois VARCHAR(20);
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS annee INTEGER;
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS periode VARCHAR(255);
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS type_session VARCHAR(100) DEFAULT 'ORDINAIRE';
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS nature_session VARCHAR(100);
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS date_from DATE;
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS date_to DATE;
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS statut VARCHAR(20) DEFAULT 'BROUILLON';
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS nombre_employes INTEGER DEFAULT 0;
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS nombre_valide INTEGER DEFAULT 0;
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS total_masse_salariale NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS total_brut NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS total_net NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS total_retenues NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS total_cotisations_patronales NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS date_validation TIMESTAMP;
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS date_cloture TIMESTAMP;
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS cree_par VARCHAR(255);
ALTER TABLE session_paie ADD COLUMN IF NOT EXISTS cloture_par VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_sess_code ON session_paie(code_session);
CREATE INDEX IF NOT EXISTS idx_sess_annee_mois ON session_paie(annee, mois);
CREATE INDEX IF NOT EXISTS idx_sess_nature ON session_paie(nature_session);
CREATE INDEX IF NOT EXISTS idx_sess_type ON session_paie(type_session);
CREATE INDEX IF NOT EXISTS idx_sess_statut ON session_paie(statut);


-- ------------------------------------------------------------------------------
-- 2. Table `bulletin_lot` : Gestion des lots de paie
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bulletin_lot (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    date_from DATE,
    date_to DATE,
    type_session VARCHAR(50) DEFAULT 'NORMALE',
    nombre_bulletin INTEGER DEFAULT 0,
    nombre_valide INTEGER DEFAULT 0,
    statut VARCHAR(50) DEFAULT 'BROUILLON'
);

ALTER TABLE bulletin_lot ADD COLUMN IF NOT EXISTS name VARCHAR(150);
ALTER TABLE bulletin_lot ADD COLUMN IF NOT EXISTS date_from DATE;
ALTER TABLE bulletin_lot ADD COLUMN IF NOT EXISTS date_to DATE;
ALTER TABLE bulletin_lot ADD COLUMN IF NOT EXISTS type_session VARCHAR(50) DEFAULT 'NORMALE';
ALTER TABLE bulletin_lot ADD COLUMN IF NOT EXISTS nombre_bulletin INTEGER DEFAULT 0;
ALTER TABLE bulletin_lot ADD COLUMN IF NOT EXISTS nombre_valide INTEGER DEFAULT 0;
ALTER TABLE bulletin_lot ADD COLUMN IF NOT EXISTS statut VARCHAR(50) DEFAULT 'BROUILLON';


-- ------------------------------------------------------------------------------
-- 3. Table `bulletin` : Bulletins de salaire des agents
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bulletin (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL,
    employee_id BIGINT NOT NULL,
    session_paie_id BIGINT,
    bulletin_lot_id BIGINT,
    grade_id BIGINT,
    contrat_id BIGINT,
    type_session VARCHAR(50) DEFAULT 'ORDINAIRE',
    nature_session VARCHAR(50),
    date_from DATE,
    date_to DATE,
    motif_rupture VARCHAR(100),
    statut_preavis VARCHAR(50),
    montant_indemnite_licenciement NUMERIC(19, 2) DEFAULT 0,
    montant_indemnite_preavis NUMERIC(19, 2) DEFAULT 0,
    montant_indemnite_conges NUMERIC(19, 2) DEFAULT 0,
    scheduled_working_days NUMERIC(5, 2) DEFAULT 30.00,
    worked_days NUMERIC(5, 2) DEFAULT 30.00,
    salaire_base NUMERIC(19, 2) DEFAULT 0,
    sur_salaire NUMERIC(19, 2) DEFAULT 0,
    total_indemnites NUMERIC(19, 2) DEFAULT 0,
    total_avoirs NUMERIC(19, 2) DEFAULT 0,
    salaire_brut NUMERIC(19, 2) DEFAULT 0,
    total_exonerations NUMERIC(19, 2) DEFAULT 0,
    abattement_forfaitaire NUMERIC(19, 2) DEFAULT 0,
    base_imposable NUMERIC(19, 2) DEFAULT 0,
    cotisation_cnss NUMERIC(19, 2) DEFAULT 0,
    impot_iuts_sans_charge NUMERIC(19, 2) DEFAULT 0,
    reduction_iuts_charge NUMERIC(19, 2) DEFAULT 0,
    impot_iuts NUMERIC(19, 2) DEFAULT 0,
    total_retenues_sociales NUMERIC(19, 2) DEFAULT 0,
    total_precomptes NUMERIC(19, 2) DEFAULT 0,
    total_retenues NUMERIC(19, 2) DEFAULT 0,
    total_cotisations_patronales NUMERIC(19, 2) DEFAULT 0,
    salaire_net NUMERIC(19, 2) DEFAULT 0,
    statut VARCHAR(30) NOT NULL DEFAULT 'GENERE',
    date_calcul TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_validation TIMESTAMP,
    justification_ecart TEXT,
    CONSTRAINT uk_bulletin_session_employee UNIQUE (session_paie_id, employee_id)
);

-- Garantir la présence de toutes les colonnes sur base existante
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS code VARCHAR(100);
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS employee_id BIGINT;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS session_paie_id BIGINT;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS bulletin_lot_id BIGINT;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS grade_id BIGINT;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS contrat_id BIGINT;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS type_session VARCHAR(50) DEFAULT 'ORDINAIRE';
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS nature_session VARCHAR(50);
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS date_from DATE;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS date_to DATE;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS motif_rupture VARCHAR(100);
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS statut_preavis VARCHAR(50);
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS montant_indemnite_licenciement NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS montant_indemnite_preavis NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS montant_indemnite_conges NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS scheduled_working_days NUMERIC(5, 2) DEFAULT 30.00;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS worked_days NUMERIC(5, 2) DEFAULT 30.00;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS salaire_base NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS sur_salaire NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS total_indemnites NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS total_avoirs NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS salaire_brut NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS total_exonerations NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS abattement_forfaitaire NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS base_imposable NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS cotisation_cnss NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS impot_iuts_sans_charge NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS reduction_iuts_charge NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS impot_iuts NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS total_retenues_sociales NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS total_precomptes NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS total_retenues NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS total_cotisations_patronales NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS salaire_net NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS statut VARCHAR(30) DEFAULT 'GENERE';
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS date_calcul TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS date_validation TIMESTAMP;
ALTER TABLE bulletin ADD COLUMN IF NOT EXISTS justification_ecart TEXT;

-- Index sur bulletin
CREATE INDEX IF NOT EXISTS idx_bulletin_code ON bulletin(code);
CREATE INDEX IF NOT EXISTS idx_bulletin_emp ON bulletin(employee_id);
CREATE INDEX IF NOT EXISTS idx_bulletin_session ON bulletin(session_paie_id);
CREATE INDEX IF NOT EXISTS idx_bulletin_lot ON bulletin(bulletin_lot_id);
CREATE INDEX IF NOT EXISTS idx_bulletin_nature ON bulletin(nature_session);
CREATE INDEX IF NOT EXISTS idx_bulletin_type ON bulletin(type_session);

-- Contrainte UNIQUE sur (session_paie_id, employee_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_bulletin_session_employee'
    ) THEN
        ALTER TABLE bulletin ADD CONSTRAINT uk_bulletin_session_employee UNIQUE (session_paie_id, employee_id);
    END IF;
END $$;


-- ------------------------------------------------------------------------------
-- 4. Table `bulletin_line` : Détail des gains, retenues et cotisations du bulletin
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bulletin_line (
    id BIGSERIAL PRIMARY KEY,
    bulletin_id BIGINT NOT NULL,
    rubrique_paie_id BIGINT,
    code VARCHAR(50) NOT NULL,
    libelle VARCHAR(150) NOT NULL,
    type_ligne VARCHAR(50) NOT NULL,
    base_calcul NUMERIC(19, 2),
    taux NUMERIC(8, 4),
    montant NUMERIC(19, 2) NOT NULL DEFAULT 0,
    part_patronale NUMERIC(19, 2) DEFAULT 0,
    ordre INTEGER DEFAULT 0
);

ALTER TABLE bulletin_line ADD COLUMN IF NOT EXISTS bulletin_id BIGINT;
ALTER TABLE bulletin_line ADD COLUMN IF NOT EXISTS rubrique_paie_id BIGINT;
ALTER TABLE bulletin_line ADD COLUMN IF NOT EXISTS code VARCHAR(50);
ALTER TABLE bulletin_line ADD COLUMN IF NOT EXISTS libelle VARCHAR(150);
ALTER TABLE bulletin_line ADD COLUMN IF NOT EXISTS type_ligne VARCHAR(50);
ALTER TABLE bulletin_line ADD COLUMN IF NOT EXISTS base_calcul NUMERIC(19, 2);
ALTER TABLE bulletin_line ADD COLUMN IF NOT EXISTS taux NUMERIC(8, 4);
ALTER TABLE bulletin_line ADD COLUMN IF NOT EXISTS montant NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin_line ADD COLUMN IF NOT EXISTS part_patronale NUMERIC(19, 2) DEFAULT 0;
ALTER TABLE bulletin_line ADD COLUMN IF NOT EXISTS ordre INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_bulletin_line_bulletin_id ON bulletin_line(bulletin_id);
CREATE INDEX IF NOT EXISTS idx_bulletin_line_code ON bulletin_line(code);
CREATE INDEX IF NOT EXISTS idx_bulletin_line_type ON bulletin_line(type_ligne);


-- ------------------------------------------------------------------------------
-- 5. Clés étrangères avec ON DELETE CASCADE
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    -- FK bulletin -> session_paie
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'session_paie') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_bulletin_session_paie') THEN
            ALTER TABLE bulletin 
            ADD CONSTRAINT fk_bulletin_session_paie 
            FOREIGN KEY (session_paie_id) REFERENCES session_paie(id) ON DELETE CASCADE;
        END IF;
    END IF;

    -- FK bulletin_line -> bulletin
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bulletin') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_bulletin_line_bulletin') THEN
            ALTER TABLE bulletin_line 
            ADD CONSTRAINT fk_bulletin_line_bulletin 
            FOREIGN KEY (bulletin_id) REFERENCES bulletin(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;


-- ------------------------------------------------------------------------------
-- 6. Table `demande_bulletin` : Demandes de bulletins depuis Mon Espace
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS demande_bulletin (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT,
    employee_name VARCHAR(255),
    matricule VARCHAR(50),
    periode VARCHAR(50),
    motif VARCHAR(255),
    type_bulletin VARCHAR(100) DEFAULT 'ORDINAIRE',
    urgence VARCHAR(50),
    commentaire TEXT,
    statut VARCHAR(50) DEFAULT 'EN_ATTENTE_RH',
    date_demande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_traitement TIMESTAMP,
    traite_par VARCHAR(100),
    bulletin_id BIGINT,
    session_id BIGINT
);

ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS employee_id BIGINT;
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS employee_name VARCHAR(255);
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS matricule VARCHAR(50);
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS periode VARCHAR(50);
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS motif VARCHAR(255);
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS type_bulletin VARCHAR(100) DEFAULT 'ORDINAIRE';
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS urgence VARCHAR(50);
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS commentaire TEXT;
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS statut VARCHAR(50) DEFAULT 'EN_ATTENTE_RH';
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS date_demande TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS date_traitement TIMESTAMP;
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS traite_par VARCHAR(100);
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS bulletin_id BIGINT;
ALTER TABLE demande_bulletin ADD COLUMN IF NOT EXISTS session_id BIGINT;

CREATE INDEX IF NOT EXISTS idx_demande_bulletin_emp ON demande_bulletin(employee_id);
CREATE INDEX IF NOT EXISTS idx_demande_bulletin_statut ON demande_bulletin(statut);


-- ------------------------------------------------------------------------------
-- 7. Table `rubrique_paie` : Répertoire officiel et SYSCOHADA des éléments de paie
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rubrique_paie (
    id BIGSERIAL PRIMARY KEY,
    code_rubrique VARCHAR(50) NOT NULL UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    type_rubrique VARCHAR(50),
    sens_suggere VARCHAR(20),
    classe_suggeree VARCHAR(50),
    numero_compte_defaut VARCHAR(30),
    description VARCHAR(255),
    ordre INT DEFAULT 0,
    imposable BOOLEAN DEFAULT TRUE,
    cotisable BOOLEAN DEFAULT TRUE,
    formule_calcul VARCHAR(255),
    actif BOOLEAN DEFAULT TRUE
);

ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS code_rubrique VARCHAR(50);
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS libelle VARCHAR(150);
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS type_rubrique VARCHAR(50);
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS sens_suggere VARCHAR(20);
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS classe_suggeree VARCHAR(50);
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS numero_compte_defaut VARCHAR(30);
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS description VARCHAR(255);
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS ordre INT DEFAULT 0;
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS imposable BOOLEAN DEFAULT TRUE;
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS cotisable BOOLEAN DEFAULT TRUE;
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS formule_calcul VARCHAR(255);
ALTER TABLE rubrique_paie ADD COLUMN IF NOT EXISTS actif BOOLEAN DEFAULT TRUE;


-- ------------------------------------------------------------------------------
-- 8. Données Initiales : Rubriques officielles complètes du système de Paie
-- ------------------------------------------------------------------------------
INSERT INTO rubrique_paie (code_rubrique, libelle, type_rubrique, sens_suggere, classe_suggeree, numero_compte_defaut, description, imposable, cotisable, ordre, actif)
VALUES
    -- GAINS DE BASE & GRATIFICATIONS
    ('SAL_BASE', 'Salaire de Base', 'GAIN', 'DEBIT', 'CLASSE_6', '641100', 'Rémunération de base indiciaire', true, true, 10, true),
    ('SUR_SALAIRE', 'Sur-salaire', 'GAIN', 'DEBIT', 'CLASSE_6', '641101', 'Sur-salaire conventionnel ou contractuel', true, true, 20, true),
    ('PRIME_ANC', 'Prime d''Ancienneté', 'GAIN', 'DEBIT', 'CLASSE_6', '641200', 'Prime légale selon barème d''ancienneté', true, true, 30, true),
    ('GRAT_13EME', '13ème Mois (Gratification)', 'GAIN', 'DEBIT', 'CLASSE_6', '641113', 'Gratification annuelle 13ème mois au prorata temporis', false, false, 40, true),
    ('GRAT_14EME', '14ème Mois (Gratification)', 'GAIN', 'DEBIT', 'CLASSE_6', '641114', 'Gratification annuelle 14ème mois au prorata temporis', false, false, 50, true),

    -- INDEMNITÉS CONVENTIONNELLES BANCAIRES
    ('IND_LOGEMENT', 'Indemnité de Logement', 'GAIN', 'DEBIT', 'CLASSE_6', '641300', 'Indemnité mensuelle de logement', true, true, 60, true),
    ('IND_TRANSPORT', 'Indemnité de Transport', 'GAIN', 'DEBIT', 'CLASSE_6', '641301', 'Indemnité mensuelle de transport', false, false, 70, true),
    ('IND_FONCTION', 'Indemnité de Fonction', 'GAIN', 'DEBIT', 'CLASSE_6', '641302', 'Indemnité liée à la fonction occupée', true, true, 80, true),
    ('IND_CAISSE', 'Indemnité de Caisse', 'GAIN', 'DEBIT', 'CLASSE_6', '641303', 'Prime de responsabilité de caisse', false, false, 90, true),
    ('IND_SUJETION', 'Indemnité de Sujétion', 'GAIN', 'DEBIT', 'CLASSE_6', '641304', 'Indemnité de sujétion et contraintes', true, true, 100, true),

    -- CONGÉS & SOLDE DE TOUT COMPTE
    ('IND_CONGE', 'Allocation de Congé Payé', 'GAIN', 'DEBIT', 'CLASSE_6', '641400', 'Indemnité légale de congé annuel payé', true, true, 110, true),
    ('STC_PREAVIS', 'Indemnité de Préavis', 'GAIN', 'DEBIT', 'CLASSE_6', '641500', 'Indemnité compensatrice de préavis', true, true, 120, true),
    ('STC_CONGE', 'Indemnité Compensatrice Congé', 'GAIN', 'DEBIT', 'CLASSE_6', '641501', 'Reliquat de congés payés dus au départ', true, true, 130, true),
    ('STC_LICENC', 'Indemnité de Licenciement', 'GAIN', 'DEBIT', 'CLASSE_6', '641502', 'Indemnité légale ou conventionnelle de rupture', false, false, 140, true),

    -- RETENUES SOCIALES & FISCALES
    ('RET_CNSS', 'Cotisation CNSS Ouvrière', 'RETENUE', 'CREDIT', 'CLASSE_4', '431100', 'Sécurité sociale ouvrière (5.5%)', false, false, 200, true),
    ('RET_CRRAE', 'Cotisation CRRAE/RCPNC', 'RETENUE', 'CREDIT', 'CLASSE_4', '431200', 'Régime complémentaire de retraite UMOA (6%)', false, false, 210, true),
    ('RET_IUTS', 'Retenue IUTS', 'RETENUE', 'CREDIT', 'CLASSE_4', '442100', 'Impôt Unique sur Traitements et Salaires', false, false, 220, true),
    ('RET_FSP', 'Fonds de Solidarité (FSP)', 'RETENUE', 'CREDIT', 'CLASSE_4', '442200', 'Contribution patriotique obligatoire (1%)', false, false, 230, true),

    -- PRÉCOMPTES & RETENUES DIVERSES
    ('RET_ACOMPTE', 'Acompte sur Salaire', 'RETENUE', 'CREDIT', 'CLASSE_4', '421200', 'Remboursement d''acompte perçu dans le mois', false, false, 300, true),
    ('RET_PRET', 'Remboursement Prêt Bancaire', 'RETENUE', 'CREDIT', 'CLASSE_4', '421300', 'Échéance mensuelle de prêt bancaire / social', false, false, 310, true)
ON CONFLICT (code_rubrique) DO UPDATE 
SET libelle = EXCLUDED.libelle,
    type_rubrique = EXCLUDED.type_rubrique,
    sens_suggere = EXCLUDED.sens_suggere,
    classe_suggeree = EXCLUDED.classe_suggeree,
    numero_compte_defaut = EXCLUDED.numero_compte_defaut,
    description = EXCLUDED.description,
    imposable = EXCLUDED.imposable,
    cotisable = EXCLUDED.cotisable,
    ordre = EXCLUDED.ordre,
    actif = true;


-- ------------------------------------------------------------------------------
-- 9. Mise à niveau et recalage des séquences auto-incrémentées
-- ------------------------------------------------------------------------------
SELECT setval('session_paie_id_seq', COALESCE((SELECT MAX(id) FROM session_paie), 0) + 1, false);
SELECT setval('bulletin_lot_id_seq', COALESCE((SELECT MAX(id) FROM bulletin_lot), 0) + 1, false);
SELECT setval('bulletin_id_seq', COALESCE((SELECT MAX(id) FROM bulletin), 0) + 1, false);
SELECT setval('bulletin_line_id_seq', COALESCE((SELECT MAX(id) FROM bulletin_line), 0) + 1, false);
SELECT setval('demande_bulletin_id_seq', COALESCE((SELECT MAX(id) FROM demande_bulletin), 0) + 1, false);
SELECT setval('rubrique_paie_id_seq', COALESCE((SELECT MAX(id) FROM rubrique_paie), 0) + 1, false);
