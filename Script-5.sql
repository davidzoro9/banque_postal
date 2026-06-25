-- ============================================================================
-- PROJET      : SIRH-BPBF
-- DESCRIPTION : Schéma PostgreSQL avec attributs explicites, relations et traçabilité utilisateur
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS telia;
SET search_path TO telia, public;

-- NETTOYAGE DES TABLES EXISTANTES
DROP TABLE IF EXISTS telia.agences CASCADE;
DROP TABLE IF EXISTS telia.categorie_employe CASCADE;
DROP TABLE IF EXISTS telia.conge CASCADE;
DROP TABLE IF EXISTS telia.absence CASCADE;
DROP TABLE IF EXISTS telia.type_absence CASCADE;
DROP TABLE IF EXISTS telia.contrat CASCADE;
DROP TABLE IF EXISTS telia.departement CASCADE;
DROP TABLE IF EXISTS telia.direction CASCADE;
DROP TABLE IF EXISTS telia.document_employe CASCADE;
DROP TABLE IF EXISTS telia.emploie CASCADE;
DROP TABLE IF EXISTS telia.employe CASCADE;
DROP TABLE IF EXISTS telia.exoneration CASCADE;
DROP TABLE IF EXISTS telia.famille_emp CASCADE;
DROP TABLE IF EXISTS telia.fonction CASCADE;
DROP TABLE IF EXISTS telia.grilles_salariale CASCADE;
DROP TABLE IF EXISTS telia.indemnite CASCADE;
DROP TABLE IF EXISTS telia.info_personnelle CASCADE;
DROP TABLE IF EXISTS telia.info_salaire CASCADE;
DROP TABLE IF EXISTS telia.note_emp CASCADE;
DROP TABLE IF EXISTS telia.services CASCADE;
DROP TABLE IF EXISTS telia.type_conges CASCADE;
DROP TABLE IF EXISTS telia.type_contrat CASCADE;
DROP TABLE IF EXISTS telia.type_indemnite CASCADE;
DROP TABLE IF EXISTS telia.utilisateur CASCADE;
DROP TABLE IF EXISTS telia.donnee_de_base CASCADE;
DROP TABLE IF EXISTS telia.emploi CASCADE;
DROP TABLE IF EXISTS telia.grade CASCADE;
DROP TABLE IF EXISTS telia.echelon CASCADE;
DROP TABLE IF EXISTS telia.competences CASCADE;
DROP TABLE IF EXISTS telia.type_formation CASCADE;
DROP TABLE IF EXISTS telia.type_evaluation CASCADE;
DROP TABLE IF EXISTS telia.rubrique CASCADE;
DROP TABLE IF EXISTS telia.cotisation CASCADE;
DROP TABLE IF EXISTS telia.bareme CASCADE;
DROP TABLE IF EXISTS telia.mode_paiement CASCADE;
DROP TABLE IF EXISTS telia.calendrier CASCADE;
DROP TABLE IF EXISTS telia.competence_employe CASCADE;

-- ============================================================================
-- 1. TABLE CONCEPTUELLE PARENT DES DONNÉES DE BASE (FACULTATIVE)
-- ============================================================================
CREATE TABLE telia.donnee_de_base (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid
);

-- ============================================================================
-- 2. TABLES DES DONNÉES DE BASE (ATTRIBUTS EXPLICITES + LIAISON TRACABILITÉ)
-- ============================================================================

CREATE TABLE telia.agences (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT agences_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.categorie_employe (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT categorie_employe_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.departement (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    direction_code character varying(20),
    utilisateur_id uuid,
    CONSTRAINT departement_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.direction (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT direction_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.fonction (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT fonction_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.services (
    id               uuid NOT NULL DEFAULT gen_random_uuid(),
    code             character varying(20) NOT NULL,
    name             character varying(150) NOT NULL,
    departement_code character varying(20),
    utilisateur_id   uuid,
    CONSTRAINT services_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.type_conges (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT type_conges_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.type_absence (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT type_absence_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.type_contrat (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT type_contrat_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.type_indemnite (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT type_indemnite_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.emploi (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT emploi_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.grade (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT grade_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.echelon (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT echelon_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.competences (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT competences_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.type_formation (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT type_formation_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.type_evaluation (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT type_evaluation_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.rubrique (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT rubrique_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.cotisation (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT cotisation_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.bareme (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT bareme_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.mode_paiement (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT mode_paiement_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.calendrier (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT calendrier_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.indemnite (
    id                   uuid NOT NULL DEFAULT gen_random_uuid(),
    code                 character varying(20) NOT NULL,
    name                 character varying(150) NOT NULL,
    categorie_employe_id uuid,
    grade_id             uuid,
    echelon_id           uuid,
    departement_id       uuid,
    utilisateur_id       uuid,
    CONSTRAINT indemnite_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- 3. TABLE GRILLES SALARIALE (EXCEPTION)
-- ============================================================================
CREATE TABLE telia.grilles_salariale (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    classe         character varying(50)  NOT NULL,
    echelle        character varying(10)  NOT NULL,
    echelon        character varying(10)  NOT NULL,
    categorie      character varying(100) NOT NULL,
    utilisateur_id uuid,
    CONSTRAINT grilles_salariale_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- 4. STRUCTURE DE LA TABLE EMPLOYE
-- ============================================================================
CREATE TABLE telia.employe (
    id                     uuid NOT NULL DEFAULT gen_random_uuid(),
    matricule              character varying(50) NOT NULL,
    prenom                 character varying(100) NOT NULL,
    nom                    character varying(100) NOT NULL,
    email_professionnel    character varying(100) NOT NULL,
    telephone              character varying(20),
    statut                 character varying(20) NOT NULL DEFAULT 'ACTIF'::character varying,
    date_embauche          date NOT NULL,
    badge_rfid             character varying(50),
    
    -- Liaisons fonctionnelles
    utilisateur_id         uuid, -- Représente aussi la traçabilité
    superviseur_n1_id      uuid,
    
    -- Liaisons données de base (code)
    agences_code           character varying(20),
    categorie_employe_code character varying(20),
    departement_code       character varying(20),
    direction_code         character varying(20),
    service_code           character varying(20),
    fonction_code          character varying(20),
    emploi_code            character varying(20),
    grade_code             character varying(20),
    echelon_code           character varying(20),
    
    cree_le                timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le             timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employe_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- 5. AUTRES TABLES
-- ============================================================================
CREATE TABLE telia.utilisateur (
    id   uuid NOT NULL DEFAULT gen_random_uuid(),
    code character varying(20) NOT NULL,
    name character varying(150) NOT NULL,
    CONSTRAINT utilisateur_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.conge (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    employe_id     uuid NOT NULL,
    type_conges_id uuid,
    utilisateur_id uuid, -- Traçabilité
    CONSTRAINT conge_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.absence (
    id                uuid NOT NULL DEFAULT gen_random_uuid(),
    code              character varying(20) NOT NULL,
    name              character varying(150) NOT NULL,
    employe_id        uuid NOT NULL,
    periode           character varying(100) NOT NULL,
    type_absence_code character varying(20) NOT NULL,
    utilisateur_id    uuid, -- Traçabilité
    CONSTRAINT absence_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.contrat (
    id              uuid NOT NULL DEFAULT gen_random_uuid(),
    code            character varying(20) NOT NULL,
    name            character varying(150) NOT NULL,
    employe_id      uuid NOT NULL,
    type_contrat_id uuid,
    utilisateur_id  uuid, -- Traçabilité
    CONSTRAINT contrat_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.document_employe (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    employe_id     uuid NOT NULL,
    utilisateur_id uuid, -- Traçabilité
    CONSTRAINT document_employe_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.emploie (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    employe_id     uuid NOT NULL,
    utilisateur_id uuid, -- Traçabilité
    CONSTRAINT emploie_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.exoneration (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    employe_id     uuid NOT NULL,
    utilisateur_id uuid, -- Traçabilité
    CONSTRAINT exoneration_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.famille_emp (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    employe_id     uuid NOT NULL,
    utilisateur_id uuid, -- Traçabilité
    CONSTRAINT famille_emp_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.info_personnelle (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    employe_id     uuid NOT NULL,
    utilisateur_id uuid, -- Traçabilité
    CONSTRAINT info_personnelle_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.info_salaire (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    employe_id     uuid NOT NULL,
    utilisateur_id uuid, -- Traçabilité
    CONSTRAINT info_salaire_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.note_emp (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    employe_id     uuid NOT NULL,
    utilisateur_id uuid, -- Traçabilité
    CONSTRAINT note_emp_pkey PRIMARY KEY (id)
);

CREATE TABLE telia.competence_employe (
    id             uuid NOT NULL DEFAULT gen_random_uuid(),
    code           character varying(20) NOT NULL,
    name           character varying(150) NOT NULL,
    employe_id     uuid NOT NULL,
    utilisateur_id uuid, -- Traçabilité
    CONSTRAINT competence_employe_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- 6. CONTRAINTES DE CLÉS ÉTRANGÈRES ENTRE TABLES FONCTIONNELLES (UUID)
-- ============================================================================

-- Clés étrangères de la table employe
ALTER TABLE telia.employe
    ADD CONSTRAINT employe_utilisateur_id_fkey
    FOREIGN KEY (utilisateur_id) REFERENCES telia.utilisateur(id) ON DELETE SET NULL;

ALTER TABLE telia.employe
    ADD CONSTRAINT employe_superviseur_n1_id_fkey
    FOREIGN KEY (superviseur_n1_id) REFERENCES telia.employe(id) ON DELETE SET NULL;

-- Clés étrangères de la table indemnite
ALTER TABLE telia.indemnite
    ADD CONSTRAINT indemnite_categorie_employe_id_fkey
    FOREIGN KEY (categorie_employe_id) REFERENCES telia.categorie_employe(id) ON DELETE SET NULL;

ALTER TABLE telia.indemnite
    ADD CONSTRAINT indemnite_grade_id_fkey
    FOREIGN KEY (grade_id) REFERENCES telia.grade(id) ON DELETE SET NULL;

ALTER TABLE telia.indemnite
    ADD CONSTRAINT indemnite_echelon_id_fkey
    FOREIGN KEY (echelon_id) REFERENCES telia.echelon(id) ON DELETE SET NULL;

ALTER TABLE telia.indemnite
    ADD CONSTRAINT indemnite_departement_id_fkey
    FOREIGN KEY (departement_id) REFERENCES telia.departement(id) ON DELETE SET NULL;

-- Clés étrangères pointant vers employe (Colonnes NOT NULL -> ON DELETE CASCADE)
ALTER TABLE telia.conge
    ADD CONSTRAINT conge_employe_id_fkey
    FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;

ALTER TABLE telia.conge
    ADD CONSTRAINT conge_type_conges_id_fkey
    FOREIGN KEY (type_conges_id) REFERENCES telia.type_conges(id) ON DELETE CASCADE;

ALTER TABLE telia.conge
    ADD CONSTRAINT conge_utilisateur_id_fkey
    FOREIGN KEY (utilisateur_id) REFERENCES telia.utilisateur(id) ON DELETE CASCADE;

ALTER TABLE telia.absence
    ADD CONSTRAINT absence_employe_id_fkey
    FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;

ALTER TABLE telia.contrat
    ADD CONSTRAINT contrat_employe_id_fkey
    FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;

ALTER TABLE telia.contrat
    ADD CONSTRAINT contrat_type_contrat_id_fkey
    FOREIGN KEY (type_contrat_id) REFERENCES telia.type_contrat(id) ON DELETE CASCADE;

ALTER TABLE telia.document_employe
    ADD CONSTRAINT document_employe_employe_id_fkey
    FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;

ALTER TABLE telia.emploie
    ADD CONSTRAINT emploie_employe_id_fkey
    FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;

-- Clés étrangères pointant vers employe
ALTER TABLE telia.exoneration
    ADD CONSTRAINT exoneration_employe_id_fkey
    FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;

ALTER TABLE telia.famille_emp
    ADD CONSTRAINT famille_emp_employe_id_fkey
    FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;

ALTER TABLE telia.info_personnelle
    ADD CONSTRAINT info_personnelle_employe_id_fkey
    FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;

ALTER TABLE telia.info_salaire
    ADD CONSTRAINT info_salaire_employe_id_fkey
    FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;

ALTER TABLE telia.note_emp
    ADD CONSTRAINT note_emp_employe_id_fkey
    FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;

ALTER TABLE telia.competence_employe
    ADD CONSTRAINT competence_employe_employe_id_fkey
    FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;

