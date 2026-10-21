-- ==============================================================================
-- FLYWAY MIGRATION V8 : SCHÉMA COMPLET SIGRH BANQUE DES PME (BPBF)
-- TOUTES LES TABLES DU SYSTÈME (74 ENTITÉS / MODULES) + GESTION 13ÈME & 14ÈME MOIS
-- ==============================================================================
-- Compatible PostgreSQL 12+ / 14 / 15 / 16+
-- Idempotent (IF NOT EXISTS) & Sécurisé (Séquences, Index, Clés Étrangères CASCADE)
-- ==============================================================================

-- ==============================================================================
-- 1. MODULE AUTHENTIFICATION, SÉCURITÉ & AUDIT
-- ==============================================================================

-- 1.1 Rôles & Profils utilisateurs
CREATE TABLE IF NOT EXISTS role_profil (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    description TEXT,
    badge_color VARCHAR(30) DEFAULT '#0060B3',
    actif BOOLEAN DEFAULT TRUE,
    permissions TEXT
);

-- 1.2 Permissions granulaires par action
CREATE TABLE IF NOT EXISTS action_permission (
    id BIGSERIAL PRIMARY KEY,
    module_name VARCHAR(100) NOT NULL,
    action_name VARCHAR(100) NOT NULL,
    action_code VARCHAR(100) NOT NULL UNIQUE,
    roles_access_json TEXT,
    ordre INTEGER DEFAULT 0
);

-- 1.3 Utilisateurs applicatifs
CREATE TABLE IF NOT EXISTS utilisateur (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(150),
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'EMPLOYE',
    actif BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_utilisateur_username ON utilisateur(username);
CREATE INDEX IF NOT EXISTS idx_utilisateur_email ON utilisateur(email);

-- 1.4 Journal d'Audit Bancaire
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    date_heure TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    utilisateur VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    entite VARCHAR(100),
    entite_id BIGINT,
    details TEXT,
    ip_adresse VARCHAR(50),
    statut VARCHAR(20) DEFAULT 'SUCCES'
);
CREATE INDEX IF NOT EXISTS idx_audit_log_date ON audit_log (date_heure DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log (action);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log (utilisateur);

-- ==============================================================================
-- 2. MODULE ORGANISATION & STRUCTURE HIÉRARCHIQUE
-- ==============================================================================

-- 2.1 Directions
CREATE TABLE IF NOT EXISTS direction (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    actif BOOLEAN DEFAULT TRUE
);

-- 2.2 Départements
CREATE TABLE IF NOT EXISTS department (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50),
    libelle VARCHAR(150) NOT NULL,
    direction_id BIGINT,
    actif BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_department_direction FOREIGN KEY (direction_id) REFERENCES direction(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_department_direction ON department(direction_id);

-- 2.3 Services
CREATE TABLE IF NOT EXISTS service (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50),
    libelle VARCHAR(150) NOT NULL,
    department_id BIGINT,
    actif BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_service_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_service_department ON service(department_id);

-- 2.4 Agences bancaires
CREATE TABLE IF NOT EXISTS agence (
    id BIGSERIAL PRIMARY KEY,
    code_agence VARCHAR(50),
    nom_agence VARCHAR(150) NOT NULL,
    ville VARCHAR(100),
    adresse VARCHAR(255),
    telephone VARCHAR(50),
    email VARCHAR(150),
    actif BOOLEAN DEFAULT TRUE
);

-- 2.5 Banques de virement
CREATE TABLE IF NOT EXISTS banque (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    actif BOOLEAN DEFAULT TRUE
);

-- 2.6 Modes de paiement
CREATE TABLE IF NOT EXISTS mode_paiement (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    actif BOOLEAN DEFAULT TRUE
);

-- 2.7 Fonctions
CREATE TABLE IF NOT EXISTS fonction (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    actif BOOLEAN DEFAULT TRUE
);

-- 2.8 Emplois / Postes
CREATE TABLE IF NOT EXISTS emploi (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    actif BOOLEAN DEFAULT TRUE
);

-- 2.9 Catégories socio-professionnelles
CREATE TABLE IF NOT EXISTS categorie (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    actif BOOLEAN DEFAULT TRUE
);

-- 2.10 Échelons
CREATE TABLE IF NOT EXISTS echelon (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE
);

-- 2.11 Grades
CREATE TABLE IF NOT EXISTS grade (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    actif BOOLEAN DEFAULT TRUE
);

-- 2.12 Régimes de Sécurité Sociale (CNSS)
CREATE TABLE IF NOT EXISTS regime_securite_social (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    taux_patronal DOUBLE PRECISION DEFAULT 16.0,
    taux_salarial DOUBLE PRECISION DEFAULT 5.5,
    plafond DOUBLE PRECISION,
    description VARCHAR(255),
    actif BOOLEAN DEFAULT TRUE
);

-- 2.13 Données de référence génériques
CREATE TABLE IF NOT EXISTS generic_ref_data (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL,
    libelle VARCHAR(150) NOT NULL,
    description TEXT,
    grade VARCHAR(50),
    categorie VARCHAR(50),
    taux DOUBLE PRECISION,
    type_retenue VARCHAR(50),
    actif BOOLEAN DEFAULT TRUE
);

-- 2.14 Paramètres RH globaux
CREATE TABLE IF NOT EXISTS parametre_rh (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50),
    code VARCHAR(50) UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    actif BOOLEAN DEFAULT TRUE
);

-- ==============================================================================
-- 3. MODULE GRILLE SALARIALE & PARAMÉTRAGES SOCIAUX
-- ==============================================================================

-- 3.1 Grille Salariale Conventionnelle BPBF
CREATE TABLE IF NOT EXISTS grille_salariale (
    id BIGSERIAL PRIMARY KEY,
    salaire_base NUMERIC(15, 2) NOT NULL DEFAULT 0,
    categorie_id BIGINT,
    echelon_id BIGINT,
    grade_id BIGINT,
    CONSTRAINT fk_grille_categorie FOREIGN KEY (categorie_id) REFERENCES categorie(id) ON DELETE SET NULL,
    CONSTRAINT fk_grille_echelon FOREIGN KEY (echelon_id) REFERENCES echelon(id) ON DELETE SET NULL,
    CONSTRAINT fk_grille_grade FOREIGN KEY (grade_id) REFERENCES grade(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_grille_cat ON grille_salariale(categorie_id);
CREATE INDEX IF NOT EXISTS idx_grille_ech ON grille_salariale(echelon_id);
CREATE INDEX IF NOT EXISTS idx_grille_grade ON grille_salariale(grade_id);

-- 3.2 Types de contrats de travail
CREATE TABLE IF NOT EXISTS type_contrat (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    name VARCHAR(150) NOT NULL
);

-- 3.3 Paramétrage prise en charge médicale
CREATE TABLE IF NOT EXISTS param_prise_en_charge (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    taux DOUBLE PRECISION DEFAULT 80.0,
    description TEXT,
    actif BOOLEAN DEFAULT TRUE
);

-- 3.4 Paramétrage retraite complémentaire
CREATE TABLE IF NOT EXISTS param_retraite (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    grade_id BIGINT,
    libelle VARCHAR(150) NOT NULL,
    taux DOUBLE PRECISION,
    description TEXT,
    actif BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_param_retraite_grade FOREIGN KEY (grade_id) REFERENCES grade(id) ON DELETE SET NULL
);

-- 3.5 Paramétrage par groupe / collège
CREATE TABLE IF NOT EXISTS param_groupe (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    grade_id BIGINT,
    categorie_id BIGINT,
    libelle VARCHAR(150) NOT NULL,
    description TEXT,
    actif BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_param_groupe_grade FOREIGN KEY (grade_id) REFERENCES grade(id) ON DELETE SET NULL,
    CONSTRAINT fk_param_groupe_cat FOREIGN KEY (categorie_id) REFERENCES categorie(id) ON DELETE SET NULL
);

-- ==============================================================================
-- 4. MODULE COLLABORATEURS & CONTRATS
-- ==============================================================================

-- 4.1 Collaborateurs (Employés)
CREATE TABLE IF NOT EXISTS employee (
    id BIGSERIAL PRIMARY KEY,
    matricule VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150),
    nom VARCHAR(100),
    prenom VARCHAR(100),
    nom_jeune_fille VARCHAR(100),
    sexe VARCHAR(20),
    date_naissance VARCHAR(30),
    lieu_naissance VARCHAR(100),
    nationalite VARCHAR(50),
    numerocni VARCHAR(50),
    situation_familiale VARCHAR(50),
    adresse VARCHAR(255),
    ville VARCHAR(100),
    code_postal VARCHAR(20),
    pays VARCHAR(100),
    telephone VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(150),
    date_embauche VARCHAR(30),
    anciennete_reprise INTEGER DEFAULT 0,
    numero_cnss VARCHAR(50),
    statut VARCHAR(50) DEFAULT 'ACTIF',
    state VARCHAR(50) DEFAULT 'ACTIVE',
    sur_salaire DOUBLE PRECISION DEFAULT 0,
    vehicule_fourni BOOLEAN DEFAULT FALSE,
    logement_fourni BOOLEAN DEFAULT FALSE,
    mode_paiement VARCHAR(50),
    banque VARCHAR(100),
    iban VARCHAR(100),
    intitule_compte VARCHAR(150),
    contact_urgence_nom VARCHAR(150),
    contact_urgence_telephone VARCHAR(50),
    contact_urgence_lien VARCHAR(50),
    dernier_diplome VARCHAR(100),
    diplome_recrutement VARCHAR(100),
    branche_etude VARCHAR(150),
    ecole_universite VARCHAR(150),
    direction_id BIGINT,
    department_id BIGINT,
    service_id BIGINT,
    agence_id BIGINT,
    fonction_id BIGINT,
    emploi_id BIGINT,
    categorie_id BIGINT,
    echelon_id BIGINT,
    grade_id BIGINT,
    grille_salariale_id BIGINT,
    regime_securite_social_id BIGINT,
    superviseur_id BIGINT,
    extra_data TEXT,
    CONSTRAINT fk_employee_direction FOREIGN KEY (direction_id) REFERENCES direction(id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_dept FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_service FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_agence FOREIGN KEY (agence_id) REFERENCES agence(id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_fonction FOREIGN KEY (fonction_id) REFERENCES fonction(id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_emploi FOREIGN KEY (emploi_id) REFERENCES emploi(id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_categorie FOREIGN KEY (categorie_id) REFERENCES categorie(id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_echelon FOREIGN KEY (echelon_id) REFERENCES echelon(id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_grade FOREIGN KEY (grade_id) REFERENCES grade(id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_grille FOREIGN KEY (grille_salariale_id) REFERENCES grille_salariale(id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_regime FOREIGN KEY (regime_securite_social_id) REFERENCES regime_securite_social(id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_superviseur FOREIGN KEY (superviseur_id) REFERENCES employee(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_employee_matricule ON employee(matricule);
CREATE INDEX IF NOT EXISTS idx_employee_direction ON employee(direction_id);
CREATE INDEX IF NOT EXISTS idx_employee_department ON employee(department_id);
CREATE INDEX IF NOT EXISTS idx_employee_superviseur ON employee(superviseur_id);

-- 4.2 Contrats des collaborateurs
CREATE TABLE IF NOT EXISTS contrat (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    type_contrat_id BIGINT,
    service_id BIGINT,
    date_debut VARCHAR(30),
    date_fin VARCHAR(30),
    statut VARCHAR(50) DEFAULT 'ACTIF',
    CONSTRAINT fk_contrat_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_contrat_type FOREIGN KEY (type_contrat_id) REFERENCES type_contrat(id) ON DELETE SET NULL,
    CONSTRAINT fk_contrat_service FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_contrat_employee ON contrat(employee_id);

-- 4.3 Membres de la famille de l'employé
CREATE TABLE IF NOT EXISTS famille_employe_membre (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE,
    lien_parente VARCHAR(50) NOT NULL,
    est_charge BOOLEAN NOT NULL DEFAULT FALSE,
    statut VARCHAR(50) DEFAULT 'Actif',
    CONSTRAINT fk_famille_employe FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_famille_employe_id ON famille_employe_membre(employee_id);

-- 4.4 Prise en charge médicale familiale
CREATE TABLE IF NOT EXISTS prise_en_charge_famille (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    nom_membre VARCHAR(100) NOT NULL,
    prenom_membre VARCHAR(100) NOT NULL,
    lien_parente VARCHAR(50) NOT NULL,
    date_naissance DATE,
    taux_prise_en_charge DOUBLE PRECISION DEFAULT 80.0,
    plafond_annuel DOUBLE PRECISION,
    statut_matrimonial VARCHAR(50),
    actif BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_prise_en_charge_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_prise_en_charge_employee ON prise_en_charge_famille(employee_id);

-- ==============================================================================
-- 5. MODULE CONGÉS, ABSENCES & CALENDRIER
-- ==============================================================================

-- 5.1 Types d'absences et de congés
CREATE TABLE IF NOT EXISTS type_absence_conge (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    categorie VARCHAR(50) DEFAULT 'CONGE',
    sexe_requis VARCHAR(20) DEFAULT 'TOUS',
    deductible_du_solde BOOLEAN DEFAULT TRUE,
    duree_max_legale_jours INTEGER DEFAULT 30,
    paye BOOLEAN DEFAULT TRUE,
    actif BOOLEAN DEFAULT TRUE,
    description VARCHAR(255)
);

-- 5.2 Jours fériés légaux
CREATE TABLE IF NOT EXISTS jour_ferie (
    id BIGSERIAL PRIMARY KEY,
    libelle VARCHAR(150) NOT NULL,
    date VARCHAR(30) NOT NULL,
    type VARCHAR(50) DEFAULT 'FIXE',
    chome_paye BOOLEAN DEFAULT TRUE,
    description VARCHAR(255)
);

-- 5.3 Paramétrage global des congés (BCEAO & Code Travail BF)
CREATE TABLE IF NOT EXISTS parametrage_conge (
    id BIGSERIAL PRIMARY KEY,
    droit_annuel_defaut INTEGER NOT NULL DEFAULT 30,
    jours_acquis_par_mois DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    mode_decompte VARCHAR(50) NOT NULL DEFAULT 'OUVRABLE_5J',
    deduire_jours_feries BOOLEAN NOT NULL DEFAULT TRUE,
    plafond_report_jours INTEGER NOT NULL DEFAULT 15,
    bloquer_si_solde_insuffisant BOOLEAN NOT NULL DEFAULT FALSE
);

-- 5.4 Demandes et titres de congés (Workflow Bancaire 5 Étapes)
CREATE TABLE IF NOT EXISTS conge (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    type_absence_conge_id BIGINT,
    date_debut VARCHAR(30) NOT NULL,
    date_fin VARCHAR(30) NOT NULL,
    nb_jours INTEGER NOT NULL,
    employe_nom VARCHAR(255),
    type_nom VARCHAR(255),
    motif VARCHAR(1000),
    justificatif TEXT,
    justificatif_nom VARCHAR(255),
    date_demande VARCHAR(30),
    date_validation VARCHAR(30),
    valide_par VARCHAR(255),
    motif_refus VARCHAR(1000),
    solde_avant_demande INTEGER,
    solde_apres_demande INTEGER,
    statut VARCHAR(50) DEFAULT 'EN_ATTENTE_INTERIM',
    interimaire_id BIGINT,
    statut_interim VARCHAR(50),
    date_avis_interim VARCHAR(50),
    commentaire_interim VARCHAR(1000),
    visa_n1_par VARCHAR(255),
    date_visa_n1 VARCHAR(50),
    commentaire_n1 VARCHAR(1000),
    visa_drh_par VARCHAR(255),
    date_visa_drh VARCHAR(50),
    numero_titre_conge VARCHAR(100),
    poste_sensible_bceao BOOLEAN DEFAULT FALSE,
    statut_si VARCHAR(50) DEFAULT 'NON_REQUIS',
    CONSTRAINT fk_conge_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_conge_type FOREIGN KEY (type_absence_conge_id) REFERENCES type_absence_conge(id) ON DELETE SET NULL,
    CONSTRAINT fk_conge_interimaire FOREIGN KEY (interimaire_id) REFERENCES employee(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_conge_employee ON conge(employee_id);
CREATE INDEX IF NOT EXISTS idx_conge_statut ON conge(statut);

-- 5.5 Absences ponctuelles
CREATE TABLE IF NOT EXISTS absence (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    type_absence_conge_id BIGINT,
    date VARCHAR(30),
    duree VARCHAR(50),
    motif VARCHAR(255),
    statut VARCHAR(50) DEFAULT 'VALIDE',
    CONSTRAINT fk_absence_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_absence_type FOREIGN KEY (type_absence_conge_id) REFERENCES type_absence_conge(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_absence_employee ON absence(employee_id);

-- ==============================================================================
-- 6. MODULE CARRIÈRE, ÉVALUATION, FORMATION & MOBILITÉ
-- ==============================================================================

-- 6.1 Avancements de carrière (ancienneté & mérite)
CREATE TABLE IF NOT EXISTS carriere_avancement (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    exercice INTEGER NOT NULL,
    echelon_actuel_id BIGINT,
    echelon_propose_id BIGINT,
    salaire_base_actuel DOUBLE PRECISION,
    salaire_base_propose DOUBLE PRECISION,
    ecart_salaire DOUBLE PRECISION,
    type_avancement VARCHAR(50) DEFAULT 'ANCIENNETE',
    statut VARCHAR(50) DEFAULT 'PROPOSE',
    date_proposition DATE,
    date_validation DATE,
    validateur VARCHAR(150),
    observations TEXT,
    CONSTRAINT fk_avancement_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_avancement_ech_actuel FOREIGN KEY (echelon_actuel_id) REFERENCES echelon(id) ON DELETE SET NULL,
    CONSTRAINT fk_avancement_ech_prop FOREIGN KEY (echelon_propose_id) REFERENCES echelon(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_avancement_employee ON carriere_avancement(employee_id);

-- 6.2 Reclassements de carrière (titularisation, promotion, diplôme)
CREATE TABLE IF NOT EXISTS carriere_reclassement (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    date_demande DATE,
    date_effet DATE,
    categorie_ancienne_id BIGINT,
    categorie_nouvelle_id BIGINT,
    grade_ancien_id BIGINT,
    grade_nouveau_id BIGINT,
    echelon_ancien_id BIGINT,
    echelon_nouveau_id BIGINT,
    salaire_base_ancien DOUBLE PRECISION,
    salaire_base_nouveau DOUBLE PRECISION,
    reference_acte VARCHAR(150),
    motif VARCHAR(255),
    statut VARCHAR(50) DEFAULT 'VALIDE',
    date_validation DATE,
    validateur VARCHAR(150),
    observations TEXT,
    CONSTRAINT fk_reclassement_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_rec_cat_anc FOREIGN KEY (categorie_ancienne_id) REFERENCES categorie(id) ON DELETE SET NULL,
    CONSTRAINT fk_rec_cat_nouv FOREIGN KEY (categorie_nouvelle_id) REFERENCES categorie(id) ON DELETE SET NULL,
    CONSTRAINT fk_rec_grade_anc FOREIGN KEY (grade_ancien_id) REFERENCES grade(id) ON DELETE SET NULL,
    CONSTRAINT fk_rec_grade_nouv FOREIGN KEY (grade_nouveau_id) REFERENCES grade(id) ON DELETE SET NULL,
    CONSTRAINT fk_rec_ech_anc FOREIGN KEY (echelon_ancien_id) REFERENCES echelon(id) ON DELETE SET NULL,
    CONSTRAINT fk_rec_ech_nouv FOREIGN KEY (echelon_nouveau_id) REFERENCES echelon(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_reclassement_employee ON carriere_reclassement(employee_id);

-- 6.3 Notations annuelles de performance
CREATE TABLE IF NOT EXISTS carriere_notation (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    exercice INTEGER NOT NULL,
    note_objectifs DOUBLE PRECISION,
    note_competences DOUBLE PRECISION,
    note_comportement DOUBLE PRECISION,
    note_globale DOUBLE PRECISION,
    appreciation TEXT,
    evaluateur VARCHAR(150),
    date_evaluation DATE,
    statut VARCHAR(50) DEFAULT 'VALIDE',
    CONSTRAINT fk_notation_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_notation_employee ON carriere_notation(employee_id);

-- 6.4 Demandes de mobilité interne
CREATE TABLE IF NOT EXISTS mobilite_demande (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    type_mobility VARCHAR(50),
    poste_cible VARCHAR(150),
    service_cible VARCHAR(150),
    date_demande VARCHAR(30),
    commentaires TEXT,
    statut VARCHAR(50) DEFAULT 'SOUMIS',
    CONSTRAINT fk_mobilite_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_mobilite_employee ON mobilite_demande(employee_id);

-- 6.5 Entretiens annuels et évaluations
CREATE TABLE IF NOT EXISTS evaluation_entretien (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    date VARCHAR(30),
    evaluateur VARCHAR(150),
    note INTEGER,
    objectifs TEXT,
    commentaires TEXT,
    CONSTRAINT fk_evaluation_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_evaluation_employee ON evaluation_entretien(employee_id);

-- 6.6 Catalogue de formation
CREATE TABLE IF NOT EXISTS formation_catalogue (
    id BIGSERIAL PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    duree INTEGER
);

-- 6.7 Sessions de formation
CREATE TABLE IF NOT EXISTS formation_session (
    id BIGSERIAL PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    date VARCHAR(30),
    participants INTEGER DEFAULT 0,
    statut VARCHAR(50) DEFAULT 'PLANIFIE',
    description TEXT,
    duree INTEGER
);

-- 6.8 Référentiel des compétences
CREATE TABLE IF NOT EXISTS competence (
    id BIGSERIAL PRIMARY KEY,
    libelle VARCHAR(150) NOT NULL,
    categorie VARCHAR(100),
    description TEXT,
    niveaux_raw TEXT
);

-- ==============================================================================
-- 7. MODULE RÉMUNÉRATION, ÉLÉMENTS DE SALAIRE, INDEMNITÉS & RETENUES
-- ==============================================================================

-- 7.1 Catégories d'éléments de salaire
CREATE TABLE IF NOT EXISTS element_salary_category (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(30) DEFAULT 'GAIN'
);

-- 7.2 Éléments de salaire
CREATE TABLE IF NOT EXISTS salary_element (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    rate NUMERIC(10, 4),
    is_cotisable BOOLEAN DEFAULT TRUE,
    is_imposable BOOLEAN DEFAULT TRUE,
    method_calcul VARCHAR(50),
    formule TEXT,
    ordre INTEGER DEFAULT 1,
    statut VARCHAR(50) DEFAULT 'ACTIF',
    salary_category_id BIGINT,
    CONSTRAINT fk_salary_element_cat FOREIGN KEY (salary_category_id) REFERENCES element_salary_category(id) ON DELETE SET NULL
);

-- 7.3 Barème IUTS officiel (Burkina Faso)
CREATE TABLE IF NOT EXISTS bareme_iuts (
    id BIGSERIAL PRIMARY KEY,
    code_tranche VARCHAR(50),
    tranche_min DOUBLE PRECISION NOT NULL,
    tranche_max DOUBLE PRECISION,
    taux_imposition DOUBLE PRECISION NOT NULL,
    abattement_forfaitaire DOUBLE PRECISION DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE
);

-- 7.4 Paramétrage des indemnités par fonction/grade/catégorie
CREATE TABLE IF NOT EXISTS parametrage_indemnite (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type_indemnite_id BIGINT,
    fonction_id BIGINT,
    grade_id BIGINT,
    categorie_id BIGINT,
    emploi_id BIGINT,
    taux DOUBLE PRECISION,
    actif BOOLEAN DEFAULT TRUE,
    regle_type VARCHAR(50),
    CONSTRAINT fk_param_ind_type FOREIGN KEY (type_indemnite_id) REFERENCES type_indemnite(id) ON DELETE SET NULL,
    CONSTRAINT fk_param_ind_fonction FOREIGN KEY (fonction_id) REFERENCES fonction(id) ON DELETE SET NULL,
    CONSTRAINT fk_param_ind_grade FOREIGN KEY (grade_id) REFERENCES grade(id) ON DELETE SET NULL,
    CONSTRAINT fk_param_ind_cat FOREIGN KEY (categorie_id) REFERENCES categorie(id) ON DELETE SET NULL,
    CONSTRAINT fk_param_ind_emploi FOREIGN KEY (emploi_id) REFERENCES emploi(id) ON DELETE SET NULL
);

-- 7.5 Indemnités accordées aux employés
CREATE TABLE IF NOT EXISTS indemnite_employe (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    type_indemnite_id BIGINT NOT NULL,
    parametrage_indemnite_id BIGINT,
    libelle VARCHAR(150),
    montant DOUBLE PRECISION NOT NULL DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_indemnite_emp_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_indemnite_emp_type FOREIGN KEY (type_indemnite_id) REFERENCES type_indemnite(id) ON DELETE CASCADE,
    CONSTRAINT fk_indemnite_emp_param FOREIGN KEY (parametrage_indemnite_id) REFERENCES parametrage_indemnite(id) ON DELETE SET NULL,
    CONSTRAINT uk_indemnite_emp UNIQUE (employee_id, parametrage_indemnite_id)
);
CREATE INDEX IF NOT EXISTS idx_indemnite_emp_employee ON indemnite_employe(employee_id);

-- 7.6 Exonérations fiscales légales
CREATE TABLE IF NOT EXISTS exoneration_fiscale (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50),
    libelle VARCHAR(150) NOT NULL,
    type_exoneration VARCHAR(50),
    taux_exoneration DOUBLE PRECISION,
    montant_plafond DOUBLE PRECISION,
    base_calcul VARCHAR(50),
    nb_charges_famille INTEGER,
    actif BOOLEAN DEFAULT TRUE
);

-- 7.7 Exonérations appliquées aux indemnités de l'employé
CREATE TABLE IF NOT EXISTS exoneration_employe (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    type_indemnite_id BIGINT NOT NULL,
    indemnite_employe_id BIGINT UNIQUE,
    libelle VARCHAR(150),
    montant DOUBLE PRECISION,
    montant_autorise DOUBLE PRECISION,
    taux_exonere DOUBLE PRECISION,
    plafond_exonere DOUBLE PRECISION,
    CONSTRAINT fk_exon_emp_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_exon_emp_type FOREIGN KEY (type_indemnite_id) REFERENCES type_indemnite(id) ON DELETE CASCADE,
    CONSTRAINT fk_exon_emp_indemnite FOREIGN KEY (indemnite_employe_id) REFERENCES indemnite_employe(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_exon_emp_employee ON exoneration_employe(employee_id);

-- 7.8 Retenues conventionnelles & légales
CREATE TABLE IF NOT EXISTS retenue (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    type_retenue_id BIGINT,
    regime_securite_social_id BIGINT,
    taux DOUBLE PRECISION,
    base_calcul VARCHAR(50) NOT NULL DEFAULT 'REMUNERATION_BRUTE',
    description TEXT,
    actif BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_retenue_type FOREIGN KEY (type_retenue_id) REFERENCES type_retenue(id) ON DELETE SET NULL,
    CONSTRAINT fk_retenue_regime FOREIGN KEY (regime_securite_social_id) REFERENCES regime_securite_social(id) ON DELETE SET NULL
);

-- 7.9 Retenues salariales
CREATE TABLE IF NOT EXISTS retenue_salariale (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50),
    libelle VARCHAR(150),
    type_retenue_id BIGINT,
    taux DOUBLE PRECISION,
    base_calcul VARCHAR(50),
    actif BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_retenue_sal_type FOREIGN KEY (type_retenue_id) REFERENCES type_retenue(id) ON DELETE SET NULL
);

-- 7.10 Retenues associées aux emplois
CREATE TABLE IF NOT EXISTS type_retenue_emploi (
    type_retenue_id BIGINT NOT NULL,
    emploi_id BIGINT NOT NULL,
    PRIMARY KEY (type_retenue_id, emploi_id),
    CONSTRAINT fk_tre_type FOREIGN KEY (type_retenue_id) REFERENCES type_retenue(id) ON DELETE CASCADE,
    CONSTRAINT fk_tre_emploi FOREIGN KEY (emploi_id) REFERENCES emploi(id) ON DELETE CASCADE
);

-- 7.11 Retenues associées aux employés
CREATE TABLE IF NOT EXISTS type_retenue_employe (
    type_retenue_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    PRIMARY KEY (type_retenue_id, employee_id),
    CONSTRAINT fk_tremp_type FOREIGN KEY (type_retenue_id) REFERENCES type_retenue(id) ON DELETE CASCADE,
    CONSTRAINT fk_tremp_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- 7.12 Situation salariale d'un collaborateur
CREATE TABLE IF NOT EXISTS situation_salariale (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL UNIQUE,
    grille_salariale_id BIGINT,
    categorie_id BIGINT,
    echelon_id BIGINT,
    grade_id BIGINT,
    salaire_base DOUBLE PRECISION,
    sur_salaire DOUBLE PRECISION,
    total_indemnites DOUBLE PRECISION,
    salaire_brut DOUBLE PRECISION,
    CONSTRAINT fk_situation_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_situation_grille FOREIGN KEY (grille_salariale_id) REFERENCES grille_salariale(id) ON DELETE SET NULL,
    CONSTRAINT fk_situation_cat FOREIGN KEY (categorie_id) REFERENCES categorie(id) ON DELETE SET NULL,
    CONSTRAINT fk_situation_ech FOREIGN KEY (echelon_id) REFERENCES echelon(id) ON DELETE SET NULL,
    CONSTRAINT fk_situation_grade FOREIGN KEY (grade_id) REFERENCES grade(id) ON DELETE SET NULL
);

-- 7.13 Fiche d'information salariale et fiscale mensuelle
CREATE TABLE IF NOT EXISTS information_salariale (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL UNIQUE,
    mode_paiement VARCHAR(50),
    banque VARCHAR(100),
    iban VARCHAR(100),
    intitule_compte VARCHAR(150),
    salaire_base NUMERIC(19, 2),
    sur_salaire NUMERIC(19, 2),
    total_indemnites NUMERIC(19, 2),
    remuneration_brute NUMERIC(19, 2),
    total_exonerations NUMERIC(19, 2),
    base_imposable NUMERIC(19, 2),
    abattement_forfaitaire NUMERIC(19, 2),
    total_retenues_agent NUMERIC(19, 2),
    total_retenues_employeur NUMERIC(19, 2),
    nombre_personnes_charge INTEGER DEFAULT 0,
    iuts_sans_charge NUMERIC(19, 2),
    taux_reduction_charge NUMERIC(5, 2),
    reduction_iuts_charge NUMERIC(19, 2),
    iuts_avec_charge NUMERIC(19, 2),
    total_deduit_employe NUMERIC(19, 2),
    salaire_net NUMERIC(19, 2),
    CONSTRAINT fk_info_salariale_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- 7.14 Détail des retenues sur l'information salariale
CREATE TABLE IF NOT EXISTS information_salariale_retenue (
    id BIGSERIAL PRIMARY KEY,
    information_salariale_id BIGINT NOT NULL,
    retenue_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL,
    libelle VARCHAR(150) NOT NULL,
    type_retenue_code VARCHAR(50) NOT NULL,
    base_calcul VARCHAR(50) NOT NULL,
    montant_base NUMERIC(19, 2) NOT NULL,
    taux NUMERIC(7, 2) NOT NULL,
    montant_calcule NUMERIC(19, 2) NOT NULL,
    CONSTRAINT fk_isr_info_salariale FOREIGN KEY (information_salariale_id) REFERENCES information_salariale(id) ON DELETE CASCADE,
    CONSTRAINT fk_isr_retenue FOREIGN KEY (retenue_id) REFERENCES retenue(id) ON DELETE CASCADE,
    CONSTRAINT uk_info_salariale_retenue UNIQUE (information_salariale_id, retenue_id)
);

-- 7.15 Avoirs (gains récurrents / ponctuels)
CREATE TABLE IF NOT EXISTS avoir (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    salary_element_id BIGINT,
    reference VARCHAR(50),
    motif VARCHAR(255),
    motif_annulation VARCHAR(255),
    date_debut DATE,
    amount NUMERIC(15, 2),
    montant_restant NUMERIC(15, 2),
    echeance INTEGER,
    date_echeance DATE,
    statut VARCHAR(30) DEFAULT 'ACTIF',
    CONSTRAINT fk_avoir_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_avoir_salary_element FOREIGN KEY (salary_element_id) REFERENCES salary_element(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_avoir_employee ON avoir(employee_id);

-- 7.16 Avoirs Employé (rubriques paie & échéancier)
CREATE TABLE IF NOT EXISTS avoir_employe (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    rubrique_paie_id BIGINT,
    libelle VARCHAR(150) NOT NULL,
    montant_initial NUMERIC(19, 2) NOT NULL,
    montant_mensuel NUMERIC(19, 2) NOT NULL,
    montant_restant NUMERIC(19, 2) NOT NULL,
    echeances_total INTEGER,
    echeances_restantes INTEGER,
    date_debut DATE,
    date_fin_prevue DATE,
    statut VARCHAR(30) NOT NULL DEFAULT 'ACTIF',
    motif VARCHAR(255),
    date_creation TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_avoir_emp_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_avoir_emp_employee ON avoir_employe(employee_id);

-- 7.17 Précomptes (avances, prêts, acomptes)
CREATE TABLE IF NOT EXISTS precompte (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    element_salary_id BIGINT,
    reference VARCHAR(50),
    motif VARCHAR(255),
    motif_annulation VARCHAR(255),
    date_debut DATE,
    amount NUMERIC(15, 2),
    montant_restant NUMERIC(15, 2),
    retenue_mensuelle NUMERIC(15, 2),
    echeance INTEGER,
    date_echeance DATE,
    CONSTRAINT fk_precompte_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_precompte_element FOREIGN KEY (element_salary_id) REFERENCES salary_element(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_precompte_employee ON precompte(employee_id);

-- 7.18 Précomptes Employé (rubriques paie & suivi retenues)
CREATE TABLE IF NOT EXISTS precompte_employe (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    rubrique_paie_id BIGINT,
    libelle VARCHAR(150) NOT NULL,
    montant_initial NUMERIC(19, 2) NOT NULL,
    montant_mensuel NUMERIC(19, 2) NOT NULL,
    montant_restant NUMERIC(19, 2) NOT NULL,
    echeances_total INTEGER,
    echeances_restantes INTEGER,
    date_debut DATE,
    date_fin_prevue DATE,
    statut VARCHAR(30) NOT NULL DEFAULT 'ACTIF',
    motif VARCHAR(255),
    justificatif TEXT,
    date_creation TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_precompte_emp_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_precompte_emp_employee ON precompte_employe(employee_id);

-- 7.19 Trop-perçus et régularisations
CREATE TABLE IF NOT EXISTS trop_percu (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    salary_element_id BIGINT,
    mois_origine VARCHAR(30),
    mois_application VARCHAR(30) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    motif VARCHAR(255),
    statut VARCHAR(30) NOT NULL DEFAULT 'EN_ATTENTE',
    date_creation TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_trop_percu_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_trop_percu_salary_element FOREIGN KEY (salary_element_id) REFERENCES salary_element(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_trop_percu_employee ON trop_percu(employee_id);

-- ==============================================================================
-- 8. MODULE COMPTABILITÉ RH SYSCOHADA & CONFIGURATIONS ÉTATS
-- ==============================================================================

-- 8.1 Classes comptables
CREATE TABLE IF NOT EXISTS param_classe_comptable (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    numero VARCHAR(20),
    nom VARCHAR(150),
    libelle VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE
);

-- 8.2 Sens d'écriture comptable (Débit / Crédit)
CREATE TABLE IF NOT EXISTS param_sens_ecriture (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE
);

-- 8.3 Journaux comptables
CREATE TABLE IF NOT EXISTS param_journal_comptable (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    type_journal VARCHAR(50) DEFAULT 'OD',
    description VARCHAR(255),
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE
);

-- 8.4 Plan de comptes comptables RH
CREATE TABLE IF NOT EXISTS compte_comptable (
    id BIGSERIAL PRIMARY KEY,
    numero_compte VARCHAR(30) NOT NULL,
    libelle VARCHAR(150) NOT NULL,
    classe_compte VARCHAR(50),
    sens_par_defaut VARCHAR(10),
    type_rubrique_associee VARCHAR(50),
    code_journal VARCHAR(30),
    description VARCHAR(255),
    actif BOOLEAN DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_compte_comptable_num ON compte_comptable(numero_compte);

-- 8.5 Signataires officiels des états de paie et synthèses
CREATE TABLE IF NOT EXISTS signataire_config (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(60) NOT NULL UNIQUE,
    titre_signataire1 VARCHAR(150) NOT NULL,
    nom_signataire1 VARCHAR(150) NOT NULL,
    employee_id_1 BIGINT,
    titre_signataire2 VARCHAR(150) NOT NULL,
    nom_signataire2 VARCHAR(150) NOT NULL,
    employee_id_2 BIGINT,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- 8.6 Configuration des états de synthèse de paie
CREATE TABLE IF NOT EXISTS etat_synthese_config (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(60) NOT NULL UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    categorie VARCHAR(80),
    description VARCHAR(500),
    icon VARCHAR(50),
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    filtre_type VARCHAR(50),
    filtre_valeur VARCHAR(80)
);

-- ==============================================================================
-- 9. MODULE PAIE, SESSIONS, BULLETINS & 13ÈME / 14ÈME MOIS
-- ==============================================================================

-- 9.1 Rubriques de Paie (SYSCOHADA & Paramétrage dynamique)
CREATE TABLE IF NOT EXISTS rubrique_paie (
    id BIGSERIAL PRIMARY KEY,
    code_rubrique VARCHAR(50) NOT NULL UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    type_rubrique VARCHAR(50) NOT NULL,
    sens_suggere VARCHAR(20) DEFAULT 'DEBIT',
    classe_suggeree VARCHAR(50) DEFAULT 'CLASSE_6',
    numero_compte_defaut VARCHAR(30),
    description VARCHAR(255),
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT TRUE,
    soumise_cotisation BOOLEAN DEFAULT TRUE,
    soumise_imposition BOOLEAN DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_rubrique_paie_code ON rubrique_paie(code_rubrique);

-- 9.2 Sessions de Paie (Ordinaires & Extraordinaires : 13ème / 14ème mois)
CREATE TABLE IF NOT EXISTS session_paie (
    id BIGSERIAL PRIMARY KEY,
    code_session VARCHAR(50) NOT NULL UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    type_session VARCHAR(50) NOT NULL DEFAULT 'MENSUELLE',
    nature_extraordinaire VARCHAR(50),
    date_creation TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    date_calcul TIMESTAMP WITHOUT TIME ZONE,
    date_validation TIMESTAMP WITHOUT TIME ZONE,
    date_cloture TIMESTAMP WITHOUT TIME ZONE,
    date_paiement TIMESTAMP WITHOUT TIME ZONE,
    statut VARCHAR(30) NOT NULL DEFAULT 'BROUILLON',
    commentaire TEXT,
    cree_par VARCHAR(100),
    valide_par VARCHAR(100),
    cloture_par VARCHAR(100),
    periode VARCHAR(50) NOT NULL,
    mois VARCHAR(10) NOT NULL,
    annee VARCHAR(10) NOT NULL,
    date_from DATE,
    date_to DATE,
    total_salaires_bruts DOUBLE PRECISION DEFAULT 0,
    total_cotisations_salariales DOUBLE PRECISION DEFAULT 0,
    total_cotisations_patronales DOUBLE PRECISION DEFAULT 0,
    total_charges_sociales DOUBLE PRECISION DEFAULT 0,
    total_retenues_fiscales DOUBLE PRECISION DEFAULT 0,
    total_autres_retenues DOUBLE PRECISION DEFAULT 0,
    total_salaires_nets DOUBLE PRECISION DEFAULT 0,
    effectif_total INTEGER DEFAULT 0,
    effectif_paye INTEGER DEFAULT 0,
    effectif_en_erreur INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_session_paie_statut ON session_paie(statut);
CREATE INDEX IF NOT EXISTS idx_session_paie_annee_mois ON session_paie(annee, mois);
CREATE INDEX IF NOT EXISTS idx_session_paie_type ON session_paie(type_session, nature_extraordinaire);

-- 9.3 Lots de Bulletins de Paie
CREATE TABLE IF NOT EXISTS bulletin_lot (
    id BIGSERIAL PRIMARY KEY,
    code_lot VARCHAR(50) NOT NULL UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    date_creation TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    statut VARCHAR(30) NOT NULL DEFAULT 'BROUILLON',
    type_session VARCHAR(50) DEFAULT 'MENSUELLE',
    session_paie_id BIGINT NOT NULL,
    total_brut DOUBLE PRECISION DEFAULT 0,
    total_net DOUBLE PRECISION DEFAULT 0,
    total_retenues DOUBLE PRECISION DEFAULT 0,
    nb_bulletins INTEGER DEFAULT 0,
    CONSTRAINT fk_bulletin_lot_session FOREIGN KEY (session_paie_id) REFERENCES session_paie(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_bulletin_lot_session ON bulletin_lot(session_paie_id);

-- 9.4 Bulletins de Paie des Collaborateurs
CREATE TABLE IF NOT EXISTS bulletin (
    id BIGSERIAL PRIMARY KEY,
    reference VARCHAR(100) NOT NULL UNIQUE,
    numero VARCHAR(50),
    session_paie_id BIGINT NOT NULL,
    lot_id BIGINT,
    employee_id BIGINT NOT NULL,
    periode VARCHAR(50) NOT NULL,
    mois VARCHAR(10) NOT NULL,
    annee VARCHAR(10) NOT NULL,
    date_calcul TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    date_paiement TIMESTAMP WITHOUT TIME ZONE,
    statut VARCHAR(30) NOT NULL DEFAULT 'CALCULE',
    mode_paiement VARCHAR(50),
    banque VARCHAR(100),
    iban VARCHAR(100),
    intitule_compte VARCHAR(150),
    matricule VARCHAR(50) NOT NULL,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    emploi VARCHAR(150),
    fonction VARCHAR(150),
    department VARCHAR(150),
    direction VARCHAR(150),
    service VARCHAR(150),
    categorie VARCHAR(50),
    echelon VARCHAR(50),
    grade VARCHAR(50),
    salaire_base DOUBLE PRECISION DEFAULT 0,
    sur_salaire DOUBLE PRECISION DEFAULT 0,
    anciennete_reprise INTEGER DEFAULT 0,
    total_gains DOUBLE PRECISION DEFAULT 0,
    total_retenues DOUBLE PRECISION DEFAULT 0,
    salaire_net DOUBLE PRECISION DEFAULT 0,
    base_imposable DOUBLE PRECISION DEFAULT 0,
    net_imposable DOUBLE PRECISION DEFAULT 0,
    base_cotisable DOUBLE PRECISION DEFAULT 0,
    iuts DOUBLE PRECISION DEFAULT 0,
    cnss_ouvriere DOUBLE PRECISION DEFAULT 0,
    cnss_patronale DOUBLE PRECISION DEFAULT 0,
    crrae_ouvriere DOUBLE PRECISION DEFAULT 0,
    crrae_patronale DOUBLE PRECISION DEFAULT 0,
    total_patronal DOUBLE PRECISION DEFAULT 0,
    cout_total_employeur DOUBLE PRECISION DEFAULT 0,
    cloture BOOLEAN DEFAULT FALSE,
    type_session VARCHAR(50) DEFAULT 'MENSUELLE',
    nature_extraordinaire VARCHAR(50),
    prorata_13eme_mois DOUBLE PRECISION DEFAULT 1.0,
    mois_presence_13eme_mois INTEGER DEFAULT 12,
    commentaire TEXT,
    date_cloture TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_bulletin_session FOREIGN KEY (session_paie_id) REFERENCES session_paie(id) ON DELETE CASCADE,
    CONSTRAINT fk_bulletin_lot FOREIGN KEY (lot_id) REFERENCES bulletin_lot(id) ON DELETE SET NULL,
    CONSTRAINT fk_bulletin_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT uk_bulletin_session_employee UNIQUE (session_paie_id, employee_id)
);
CREATE INDEX IF NOT EXISTS idx_bulletin_session ON bulletin(session_paie_id);
CREATE INDEX IF NOT EXISTS idx_bulletin_employee ON bulletin(employee_id);
CREATE INDEX IF NOT EXISTS idx_bulletin_matricule ON bulletin(matricule);
CREATE INDEX IF NOT EXISTS idx_bulletin_periode ON bulletin(annee, mois);
CREATE INDEX IF NOT EXISTS idx_bulletin_type ON bulletin(type_session, nature_extraordinaire);

-- 9.5 Lignes de Bulletin de Paie (Détail gains & retenues)
CREATE TABLE IF NOT EXISTS bulletin_line (
    id BIGSERIAL PRIMARY KEY,
    bulletin_id BIGINT NOT NULL,
    code_rubrique VARCHAR(50) NOT NULL,
    libelle VARCHAR(150) NOT NULL,
    sens VARCHAR(20) NOT NULL DEFAULT 'DEBIT',
    type VARCHAR(50) NOT NULL DEFAULT 'GAIN',
    base_calcul DOUBLE PRECISION DEFAULT 0,
    taux DOUBLE PRECISION DEFAULT 0,
    montant DOUBLE PRECISION NOT NULL DEFAULT 0,
    ordre INTEGER DEFAULT 0,
    gain BOOLEAN DEFAULT TRUE,
    retenue BOOLEAN DEFAULT FALSE,
    montant_patronal DOUBLE PRECISION DEFAULT 0,
    taux_patronal DOUBLE PRECISION DEFAULT 0,
    formule VARCHAR(255),
    CONSTRAINT fk_bulletin_line_bulletin FOREIGN KEY (bulletin_id) REFERENCES bulletin(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_bulletin_line_bulletin ON bulletin_line(bulletin_id);
CREATE INDEX IF NOT EXISTS idx_bulletin_line_rubrique ON bulletin_line(code_rubrique);

-- 9.6 Demandes de Bulletins & Téléchargements
CREATE TABLE IF NOT EXISTS demande_bulletin (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    session_paie_id BIGINT,
    type_bulletin VARCHAR(50) DEFAULT 'STANDARD',
    type_session VARCHAR(50) DEFAULT 'MENSUELLE',
    nature_session VARCHAR(50),
    motif VARCHAR(255),
    commentaire TEXT,
    statut VARCHAR(30) DEFAULT 'EN_ATTENTE',
    date_demande TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    date_traitement TIMESTAMP WITHOUT TIME ZONE,
    traite_par VARCHAR(100),
    commentaire_refus TEXT,
    motif_rejet TEXT,
    CONSTRAINT fk_demande_bulletin_emp FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_demande_bulletin_session FOREIGN KEY (session_paie_id) REFERENCES session_paie(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_demande_bulletin_emp ON demande_bulletin(employee_id);
CREATE INDEX IF NOT EXISTS idx_demande_bulletin_session ON demande_bulletin(session_paie_id);

-- ==============================================================================
-- 10. DONNÉES DE BASE & SEED INITIAL (SYSCOHADA, BARÈMES & PARAMÈTRES)
-- ==============================================================================

-- 10.1 Classes Comptables (SYSCOHADA)
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

-- 10.2 Sens d'Écriture Comptable
INSERT INTO param_sens_ecriture (code, libelle, description, ordre, actif)
VALUES
    ('DEBIT', 'DÉBIT (Charges / Diminution dettes)', 'Constatation des charges du personnel ou diminution de dettes / avoirs', 1, TRUE),
    ('CREDIT', 'CRÉDIT (Net à payer / Retenues / Cotisations)', 'Constatation des dettes, retenues salariales ou net à payer', 2, TRUE)
ON CONFLICT (code) DO UPDATE 
SET libelle = EXCLUDED.libelle, 
    description = EXCLUDED.description, 
    ordre = EXCLUDED.ordre, 
    actif = EXCLUDED.actif;

-- 10.3 Journaux Comptables
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

-- 10.4 Rubriques de Paie Officielles & Imputation SYSCOHADA (avec 13ème & 14ème mois)
INSERT INTO rubrique_paie (code_rubrique, libelle, type_rubrique, sens_suggere, classe_suggeree, numero_compte_defaut, description, ordre, actif, soumise_cotisation, soumise_imposition)
VALUES
    -- Gains de base
    ('SAL_BASE', 'Salaire de Base Conventionnel', 'SALAIRE_BASE', 'DEBIT', 'CLASSE_6', '661100', 'Rémunération indiciaire de base selon classification bancaire', 1, TRUE, TRUE, TRUE),
    ('SUR_SAL', 'Sur-Salaire Individuel', 'SUR_SALAIRE', 'DEBIT', 'CLASSE_6', '661200', 'Complément individuel de salaire contractuel négocié', 2, TRUE, TRUE, TRUE),
    ('ANCIENNETE', 'Prime d''Ancienneté Légale', 'INDEMNITE', 'DEBIT', 'CLASSE_6', '661300', 'Prime calculée sur le salaire de base et les années de présence', 3, TRUE, TRUE, TRUE),

    -- Gratifications exceptionnelles annuelles
    ('13EME_MOIS', 'Gratification de 13ème Mois (Annuelle)', 'SALAIRE_BASE', 'DEBIT', 'CLASSE_6', '661400', 'Gratification contractuelle de fin d''année au prorata de présence temporis', 4, TRUE, TRUE, TRUE),
    ('14EME_MOIS', 'Gratification de 14ème Mois (Annuelle)', 'SALAIRE_BASE', 'DEBIT', 'CLASSE_6', '661500', 'Gratification exceptionnelle de performance au prorata temporis', 5, TRUE, TRUE, TRUE),

    -- Indemnités & Primes métier
    ('IND_LOGEMENT', 'Indemnité de Logement', 'INDEMNITE', 'DEBIT', 'CLASSE_6', '661600', 'Indemnité de logement selon grille ou barème de fonction', 10, TRUE, TRUE, TRUE),
    ('IND_FONCTION', 'Indemnité de Fonction & Responsabilité', 'INDEMNITE', 'DEBIT', 'CLASSE_6', '661700', 'Indemnité liée aux responsabilités managériales et de direction', 11, TRUE, TRUE, TRUE),
    ('IND_TRANSPORT', 'Indemnité Forfaitaire de Transport', 'INDEMNITE', 'DEBIT', 'CLASSE_6', '661800', 'Participation aux frais de déplacement domicile-travail (exonérée)', 12, FALSE, FALSE, FALSE),
    ('IND_RESPONSABILITE', 'Indemnité de Caisse & Risque', 'INDEMNITE', 'DEBIT', 'CLASSE_6', '661900', 'Prime de responsabilité et de maniement d''espèces', 13, TRUE, TRUE, TRUE),
    ('IND_REPRESENTATION', 'Frais de Représentation', 'INDEMNITE', 'DEBIT', 'CLASSE_6', '662000', 'Frais de mandat et de représentation bancaire', 14, FALSE, FALSE, FALSE),
    ('HEURES_SUPP', 'Heures Supplémentaires Majorées', 'INDEMNITE', 'DEBIT', 'CLASSE_6', '662100', 'Majoration des heures de travail effectuées au-delà du cycle légal', 15, TRUE, TRUE, TRUE),

    -- Retenues Salariales (Part Salarié)
    ('RET_CNSS_SAL', 'Cotisation CNSS (Part Salarié 5,5%)', 'RETENUE', 'CREDIT', 'CLASSE_4', '431100', 'Caisse Nationale de Sécurité Sociale - Régime général vieillesse (5.5%)', 30, TRUE, FALSE, FALSE),
    ('RET_CRRAE_SAL', 'Cotisation Retraite CRRAE-UMOA (Salarié 6%)', 'RETENUE', 'CREDIT', 'CLASSE_4', '431200', 'Caisse de Retraite par Répartition avec Épargne UMOA (6%)', 31, TRUE, FALSE, FALSE),
    ('RET_IUTS', 'Impôt Unique sur Traitements et Salaires (IUTS)', 'RETENUE', 'CREDIT', 'CLASSE_4', '447100', 'Impôt fiscal précompté à la source selon barème progressif BF', 32, TRUE, FALSE, FALSE),
    ('RET_FSP', 'Fonds de Soutien Patriotique (FSP 1%)', 'RETENUE', 'CREDIT', 'CLASSE_4', '447200', 'Contribution patriotique obligatoire prélevée sur le salaire net', 33, TRUE, FALSE, FALSE),
    ('RET_AVANCE', 'Remboursement Avance sur Salaire / Acompte', 'RETENUE', 'CREDIT', 'CLASSE_4', '421200', 'Précompte mensuel d''avance ou d''acompte accordé', 34, TRUE, FALSE, FALSE),
    ('RET_PRET_INTERNE', 'Remboursement Prêt au Personnel', 'RETENUE', 'CREDIT', 'CLASSE_4', '421300', 'Échéance de prêt bancaire consenti au collaborateur', 35, TRUE, FALSE, FALSE),
    ('RET_SAISIE_ARRET', 'Saisie-Arrêt & Cession sur Salaire', 'RETENUE', 'CREDIT', 'CLASSE_4', '421400', 'Prélèvement sur ordonnance judiciaire ou avis à tiers détenteur', 36, TRUE, FALSE, FALSE),

    -- Cotisations Patronales (Charges Entreprise)
    ('COT_CNSS_PAT', 'Cotisation CNSS (Part Patronale 16%)', 'COTISATIONS_PATRONALES', 'DEBIT', 'CLASSE_6', '664100', 'Charges patronales de prévoyance et risques professionnels (16%)', 50, TRUE, FALSE, FALSE),
    ('COT_CRRAE_PAT', 'Cotisation CRRAE-UMOA (Part Patronale 8%)', 'COTISATIONS_PATRONALES', 'DEBIT', 'CLASSE_6', '664200', 'Contribution patronale à la retraite complémentaire bancaire (8%)', 51, TRUE, FALSE, FALSE),
    ('COT_ASSURANCE_PAT', 'Assurance Maladie Groupe (Part Patronale)', 'COTISATIONS_PATRONALES', 'DEBIT', 'CLASSE_6', '664300', 'Prise en charge de la police d''assurance santé collective BPBF', 52, TRUE, FALSE, FALSE),

    -- Règlements & Synthèse
    ('NET_A_PAYER', 'Rémunération Nette à Virer', 'NET_A_PAYER', 'CREDIT', 'CLASSE_4', '422000', 'Dette salariale nette payable par virement bancaire ou caisse', 99, TRUE, FALSE, FALSE)
ON CONFLICT (code_rubrique) DO UPDATE 
SET libelle = EXCLUDED.libelle, 
    type_rubrique = EXCLUDED.type_rubrique, 
    sens_suggere = EXCLUDED.sens_suggere, 
    classe_suggeree = EXCLUDED.classe_suggeree, 
    numero_compte_defaut = EXCLUDED.numero_compte_defaut, 
    description = EXCLUDED.description, 
    ordre = EXCLUDED.ordre, 
    actif = EXCLUDED.actif,
    soumise_cotisation = EXCLUDED.soumise_cotisation,
    soumise_imposition = EXCLUDED.soumise_imposition;

-- 10.5 Barème IUTS Officiel du Burkina Faso
INSERT INTO bareme_iuts (code_tranche, tranche_min, tranche_max, taux_imposition, abattement_forfaitaire, actif)
VALUES
    ('T1', 0, 30000, 0.0, 0, TRUE),
    ('T2', 30001, 50000, 12.1, 0, TRUE),
    ('T3', 50001, 80000, 13.9, 0, TRUE),
    ('T4', 80001, 120000, 15.7, 0, TRUE),
    ('T5', 120001, 170000, 18.4, 0, TRUE),
    ('T6', 170001, 250000, 21.6, 0, TRUE),
    ('T7', 250001, 999999999, 25.0, 0, TRUE)
ON CONFLICT DO NOTHING;

-- 10.6 Types d'absence et congés légaux
INSERT INTO type_absence_conge (code, name, categorie, sexe_requis, deductible_du_solde, duree_max_legale_jours, paye, actif, description)
VALUES
    ('CONGE_ANNUEL', 'Congé Annuel Payé', 'CONGE', 'TOUS', TRUE, 30, TRUE, TRUE, 'Droit légal de 2.5 jours ouvrables par mois de travail effectif'),
    ('CONGE_MATERNITE', 'Congé de Maternité', 'CONGE', 'FEMININ', FALSE, 98, TRUE, TRUE, 'Congé légal de 14 semaines pour accouchement'),
    ('CONGE_PATERNITE', 'Congé de Paternité', 'CONGE', 'MASCULIN', FALSE, 3, TRUE, TRUE, 'Absence rémunérée à la naissance d''un enfant'),
    ('CONGE_MALADIE', 'Congé de Maladie Ordinaire', 'CONGE', 'TOUS', FALSE, 180, TRUE, TRUE, 'Arrêt maladie justifié par certificat médical agréé'),
    ('EVT_MARIAGE', 'Mariage du Collaborateur', 'ABSENCE', 'TOUS', FALSE, 3, TRUE, TRUE, 'Événement familial légal pour célébration'),
    ('EVT_DECES', 'Décès d''un Parent Proche', 'ABSENCE', 'TOUS', FALSE, 5, TRUE, TRUE, 'Événement familial pour obsèques d''un ascendant ou descendant direct'),
    ('EVT_NAISSANCE', 'Déclaration de Naissance', 'ABSENCE', 'TOUS', FALSE, 3, TRUE, TRUE, 'Congé exceptionnel légal'),
    ('ABS_AUTORISEE', 'Absence Exceptionnelle Autorisée', 'ABSENCE', 'TOUS', FALSE, 2, TRUE, TRUE, 'Autorisation spéciale d''absence délivrée par la DRH')
ON CONFLICT (code) DO UPDATE 
SET name = EXCLUDED.name,
    categorie = EXCLUDED.categorie,
    sexe_requis = EXCLUDED.sexe_requis,
    deductible_du_solde = EXCLUDED.deductible_du_solde,
    duree_max_legale_jours = EXCLUDED.duree_max_legale_jours,
    paye = EXCLUDED.paye,
    actif = EXCLUDED.actif;

-- 10.7 Paramétrage global des congés
INSERT INTO parametrage_conge (id, droit_annuel_defaut, jours_acquis_par_mois, mode_decompte, deduire_jours_feries, plafond_report_jours, bloquer_si_solde_insuffisant)
VALUES (1, 30, 2.5, 'OUVRABLE_5J', TRUE, 15, FALSE)
ON CONFLICT (id) DO NOTHING;

-- 10.8 Signataires officiels par défaut
INSERT INTO signataire_config (code, titre_signataire1, nom_signataire1, titre_signataire2, nom_signataire2, actif)
VALUES ('ETAT_SYNTHESE_SIGNATAIRES', 'Le Comptable', 'Ahadi Ismaël YONLI', 'Le Directeur Financier et Comptable', 'Inoussa SANOUIDI', TRUE)
ON CONFLICT (code) DO NOTHING;

-- 10.9 Rôles profil par défaut
INSERT INTO role_profil (code, libelle, description, badge_color, actif)
VALUES
    ('ADMIN', 'Administrateur Système', 'Accès complet à tous les modules, configurations et audits', '#D32F2F', TRUE),
    ('DRH', 'Directeur des Ressources Humaines', 'Pilotage RH, validation des congés, recrutements et carrières', '#7B1FA2', TRUE),
    ('RH', 'Gestionnaire Paie & RH', 'Gestion opérationnelle des collaborateurs, paie et absences', '#1976D2', TRUE),
    ('COMPTABLE', 'Responsable Comptabilité & Finances', 'Suivi des écritures comptables, états de synthèse et virements', '#388E3C', TRUE),
    ('EMPLOYE', 'Collaborateur', 'Consultation personnelle des bulletins, demandes de congés et attestations', '#00796B', TRUE)
ON CONFLICT (code) DO NOTHING;

-- 10.10 Utilisateur administrateur initial si aucun utilisateur n'existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM utilisateur WHERE username = 'admin') THEN
        INSERT INTO utilisateur (username, nom, prenom, email, password, role, actif)
        VALUES ('admin', 'ADMINISTRATEUR', 'Système', 'admin@bpbf.bf', '$2a$10$e8Z4b3z2OQkR0H4xJ3w0uuWp41y7rKj9/yGvTzK3P1Qc7RzXgKx6y', 'ADMIN', TRUE);
    END IF;
END $$;

-- 10.11 Types de contrats standard
INSERT INTO type_contrat (id, code, name)
VALUES 
    (1, 'CDI', 'Contrat à Durée Indéterminée'),
    (2, 'CDD', 'Contrat à Durée Déterminée'),
    (3, 'STAGE', 'Stage Professionnel'),
    (4, 'INTERIM', 'Contrat de Travail Temporaire')
ON CONFLICT (id) DO NOTHING;

-- 10.12 Modes de paiement bancaire
INSERT INTO mode_paiement (code, libelle, description, actif)
VALUES
    ('VIREMENT', 'Virement Bancaire', 'Paiement direct sur compte bancaire', TRUE),
    ('CHEQUE', 'Chèque Bancaire', 'Paiement par chèque de banque', TRUE),
    ('ESPECES', 'Espèces (Caisse)', 'Paiement au guichet de la banque', TRUE)
ON CONFLICT (code) DO NOTHING;

-- ==============================================================================
-- FIN DE LA MIGRATION V8 : SCHÉMA COMPLET SIGRH BPBF (74 TABLES & RÉFÉRENTIELS)
-- ==============================================================================
