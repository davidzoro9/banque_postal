--
-- PostgreSQL database dump
--

\restrict gul0XOhkgLg1dE3QUy8wLoQGUsgMcaDclcoYSXNqPKUpCCMo7BUanhRUUg6cZc4

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: telia; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA telia;


ALTER SCHEMA telia OWNER TO postgres;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: agences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(150) NOT NULL,
    localisation character varying(150),
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.agences OWNER TO postgres;

--
-- Name: TABLE agences; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.agences IS 'Agences et implantations géographiques.';


--
-- Name: conge; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conge (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employe_id uuid NOT NULL,
    type_conges_id uuid NOT NULL,
    date_debut date NOT NULL,
    date_fin date NOT NULL,
    nombre_jours integer NOT NULL,
    statut character varying(20) DEFAULT 'EN_ATTENTE'::character varying NOT NULL,
    motif_rejet character varying(255),
    statut_n1 character varying(20) DEFAULT 'EN_ATTENTE'::character varying NOT NULL,
    superviseur_n1_id uuid,
    approbateur_rh_id uuid,
    approuve_le timestamp without time zone,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_conge_dates CHECK ((date_debut <= date_fin))
);


ALTER TABLE public.conge OWNER TO postgres;

--
-- Name: TABLE conge; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.conge IS 'Demandes d''absences et de congés des agents.';


--
-- Name: contracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contract_ref character varying(50) NOT NULL,
    employee_id uuid NOT NULL,
    contract_type character varying(20) NOT NULL,
    start_date date NOT NULL,
    end_date date,
    trial_period_months integer DEFAULT 0,
    special_clauses text,
    status character varying(20) DEFAULT 'DRAFT'::character varying NOT NULL,
    document_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contracts_contract_type_check CHECK (((contract_type)::text = ANY ((ARRAY['CDI'::character varying, 'CDD'::character varying, 'STAGE'::character varying, 'TEMPORAIRE'::character varying])::text[]))),
    CONSTRAINT contracts_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'PENDING_SIGNATURE'::character varying, 'ACTIVE'::character varying, 'TERMINATED'::character varying, 'EXPIRED'::character varying])::text[]))),
    CONSTRAINT contracts_trial_period_months_check CHECK ((trial_period_months >= 0))
);


ALTER TABLE public.contracts OWNER TO postgres;

--
-- Name: contrat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contrat (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reference_contrat character varying(50) NOT NULL,
    employe_id uuid NOT NULL,
    type_contrat_id uuid NOT NULL,
    date_debut date NOT NULL,
    date_fin date,
    duree_essai_mois integer DEFAULT 0,
    clauses_speciales text,
    statut character varying(30) DEFAULT 'BROUILLON'::character varying NOT NULL,
    document_id uuid,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_contrat_dates CHECK (((date_debut <= date_fin) OR (date_fin IS NULL)))
);


ALTER TABLE public.contrat OWNER TO postgres;

--
-- Name: TABLE contrat; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.contrat IS 'Contrats d''engagement des agents.';


--
-- Name: contrats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contrats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reference_contrat character varying(50) NOT NULL,
    employe_id uuid NOT NULL,
    type_contrat_id uuid NOT NULL,
    date_debut date NOT NULL,
    date_fin date,
    duree_essai_mois integer DEFAULT 0,
    clauses_speciales text,
    statut character varying(30) DEFAULT 'BROUILLON'::character varying NOT NULL,
    document_id uuid,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contrats_duree_essai_mois_check CHECK ((duree_essai_mois >= 0)),
    CONSTRAINT contrats_statut_check CHECK (((statut)::text = ANY ((ARRAY['BROUILLON'::character varying, 'EN_ATTENTE_SIGNATURE'::character varying, 'ACTIF'::character varying, 'RESILIE'::character varying, 'EXPIRE'::character varying])::text[])))
);


ALTER TABLE public.contrats OWNER TO postgres;

--
-- Name: TABLE contrats; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.contrats IS 'Contrats d''engagement. type_contrat_id lié au référentiel types_contrats.';


--
-- Name: demandes_conges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demandes_conges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employe_id uuid NOT NULL,
    type_conge character varying(30) NOT NULL,
    date_debut date NOT NULL,
    date_fin date NOT NULL,
    nombre_jours integer NOT NULL,
    statut character varying(20) DEFAULT 'EN_ATTENTE'::character varying NOT NULL,
    motif_rejet character varying(255),
    statut_n1 character varying(20) DEFAULT 'EN_ATTENTE'::character varying NOT NULL,
    superviseur_n1_id uuid,
    approbateur_rh_id uuid,
    approuve_le timestamp without time zone,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_dates_conge CHECK ((date_fin >= date_debut)),
    CONSTRAINT demandes_conges_nombre_jours_check CHECK ((nombre_jours > 0)),
    CONSTRAINT demandes_conges_statut_check CHECK (((statut)::text = ANY ((ARRAY['EN_ATTENTE'::character varying, 'APPROUVE'::character varying, 'REJETE'::character varying, 'ANNULE'::character varying])::text[]))),
    CONSTRAINT demandes_conges_statut_n1_check CHECK (((statut_n1)::text = ANY ((ARRAY['EN_ATTENTE'::character varying, 'APPROUVE'::character varying, 'REJETE'::character varying])::text[]))),
    CONSTRAINT demandes_conges_type_conge_check CHECK (((type_conge)::text = ANY ((ARRAY['ANNUEL'::character varying, 'MALADIE'::character varying, 'JUSTIFIE'::character varying, 'MATERNITE'::character varying, 'PATERNITE'::character varying, 'SANS_SOLDE'::character varying])::text[])))
);


ALTER TABLE public.demandes_conges OWNER TO postgres;

--
-- Name: TABLE demandes_conges; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.demandes_conges IS 'Demandes d''absences et de congés des agents.';


--
-- Name: departement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departement (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(150) NOT NULL,
    type_structure character varying(50),
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.departement OWNER TO postgres;

--
-- Name: TABLE departement; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.departement IS 'Structures organisationnelles (directions, départements).';


--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(150) NOT NULL,
    type character varying(20) NOT NULL,
    parent_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT departments_type_check CHECK (((type)::text = ANY ((ARRAY['DIRECTION'::character varying, 'DEPARTEMENT'::character varying, 'SERVICE'::character varying, 'AGENCE'::character varying])::text[])))
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: TABLE departments; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.departments IS 'Référentiel des structures organiques (donnée de base isolée).';


--
-- Name: details_personnels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.details_personnels (
    employe_id uuid NOT NULL,
    numero_cnib character varying(50) NOT NULL,
    nationalite character varying(50) DEFAULT 'Burkinabè'::character varying NOT NULL,
    date_naissance date NOT NULL,
    lieu_naissance character varying(100) NOT NULL,
    sexe character(1) NOT NULL,
    adresse_domicile character varying(255),
    numero_cnss character varying(50),
    numero_ifu character varying(50),
    CONSTRAINT details_personnels_sexe_check CHECK ((sexe = ANY (ARRAY['M'::bpchar, 'F'::bpchar])))
);


ALTER TABLE public.details_personnels OWNER TO postgres;

--
-- Name: TABLE details_personnels; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.details_personnels IS 'Rubrique 01 — Informations personnelles et fiscales.';


--
-- Name: directions_departements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directions_departements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(150) NOT NULL,
    type_structure character varying(20) NOT NULL,
    structure_parente_id uuid,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT directions_departements_type_structure_check CHECK (((type_structure)::text = ANY ((ARRAY['DIRECTION'::character varying, 'DEPARTEMENT'::character varying, 'SIEGE'::character varying, 'AGENCE'::character varying])::text[])))
);


ALTER TABLE public.directions_departements OWNER TO postgres;

--
-- Name: TABLE directions_departements; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.directions_departements IS 'Données de base — Structures organisationnelles. Liée à employes.direction_id.';


--
-- Name: document_employe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_employe (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employe_id uuid NOT NULL,
    type_document character varying(50) NOT NULL,
    nom_fichier character varying(255) NOT NULL,
    chemin_fichier character varying(512) NOT NULL,
    taille_fichier integer NOT NULL,
    televerse_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.document_employe OWNER TO postgres;

--
-- Name: TABLE document_employe; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.document_employe IS 'Rubrique 11 - Documents numériques du dossier agent.';


--
-- Name: documents_agents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents_agents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employe_id uuid NOT NULL,
    type_document character varying(50) NOT NULL,
    nom_fichier character varying(255) NOT NULL,
    chemin_fichier character varying(512) NOT NULL,
    taille_fichier integer NOT NULL,
    televerse_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT documents_agents_type_document_check CHECK (((type_document)::text = ANY ((ARRAY['DIPLOME'::character varying, 'CONTRAT'::character varying, 'CERTIFICAT'::character varying, 'COPIE_CNIB'::character varying, 'RIB'::character varying, 'FICHE_PAIE'::character varying, 'AUTRE'::character varying])::text[])))
);


ALTER TABLE public.documents_agents OWNER TO postgres;

--
-- Name: TABLE documents_agents; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.documents_agents IS 'Rubrique 11 — Documents numériques du dossier agent.';


--
-- Name: emplois; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emplois (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(150) NOT NULL,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.emplois OWNER TO postgres;

--
-- Name: TABLE emplois; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.emplois IS 'Données de base — Nomenclature des emplois. Liée à employes.emploi_id.';


--
-- Name: employe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employe (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    utilisateur_id uuid,
    matricule character varying(50) NOT NULL,
    prenom character varying(100) NOT NULL,
    nom character varying(100) NOT NULL,
    email_professionnel character varying(100) NOT NULL,
    telephone character varying(20),
    fonction_id uuid,
    departement_id uuid,
    services_id uuid,
    agences_id uuid,
    grilles_salariale_id uuid,
    type_contrat_id uuid,
    superviseur_n1_id uuid,
    statut character varying(20) DEFAULT 'ACTIF'::character varying NOT NULL,
    date_embauche date NOT NULL,
    badge_rfid character varying(50),
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employe OWNER TO postgres;

--
-- Name: TABLE employe; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.employe IS 'Registre principal des agents TELIA.';


--
-- Name: employee_allowances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_allowances (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    allowance_type character varying(50) NOT NULL,
    amount numeric(15,2) NOT NULL,
    is_taxable boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employee_allowances_allowance_type_check CHECK (((allowance_type)::text = ANY ((ARRAY['LOGEMENT'::character varying, 'TECHNICITE'::character varying, 'ASTREINTE'::character varying, 'RESPONSABILITE'::character varying, 'ANCIENNETE'::character varying, 'AUTRE'::character varying])::text[]))),
    CONSTRAINT employee_allowances_amount_check CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public.employee_allowances OWNER TO postgres;

--
-- Name: employee_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_assignments (
    employee_id uuid NOT NULL,
    department_id uuid NOT NULL,
    job_position_id uuid NOT NULL,
    salary_grid_id uuid NOT NULL,
    base_salary numeric(15,2) NOT NULL,
    bank_name character varying(100) NOT NULL,
    bank_agency_code character varying(5) NOT NULL,
    bank_account_number character varying(15) NOT NULL,
    bank_rib_key character varying(2) NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employee_assignments_base_salary_check CHECK ((base_salary >= (0)::numeric))
);


ALTER TABLE public.employee_assignments OWNER TO postgres;

--
-- Name: TABLE employee_assignments; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.employee_assignments IS 'Affectation, poste, classification active et RIB de lagent.';


--
-- Name: employee_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    document_type character varying(50) NOT NULL,
    file_name character varying(255) NOT NULL,
    file_path character varying(512) NOT NULL,
    file_size integer NOT NULL,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employee_documents_document_type_check CHECK (((document_type)::text = ANY ((ARRAY['DIPLOME'::character varying, 'CONTRAT'::character varying, 'CERTIFICAT'::character varying, 'ACTE_NOMINATION'::character varying, 'CNIB_COPY'::character varying, 'RIB_COPY'::character varying, 'AUTRE'::character varying])::text[])))
);


ALTER TABLE public.employee_documents OWNER TO postgres;

--
-- Name: employee_external_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_external_movements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    movement_type character varying(20) NOT NULL,
    external_organization character varying(150) NOT NULL,
    start_date date NOT NULL,
    end_date date,
    document_reference character varying(100),
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employee_external_movements_movement_type_check CHECK (((movement_type)::text = ANY ((ARRAY['DETACHEMENT'::character varying, 'MISE_A_DISPOSITION'::character varying])::text[]))),
    CONSTRAINT employee_external_movements_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'ENDED'::character varying])::text[])))
);


ALTER TABLE public.employee_external_movements OWNER TO postgres;

--
-- Name: TABLE employee_external_movements; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.employee_external_movements IS 'Suivi des positions d activité externes.';


--
-- Name: employee_families; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_families (
    employee_id uuid NOT NULL,
    marital_status character varying(20) NOT NULL,
    spouse_name character varying(150),
    children_count integer DEFAULT 0 NOT NULL,
    iuts_abatement_rate numeric(5,2) DEFAULT 0.00 NOT NULL,
    CONSTRAINT employee_families_children_count_check CHECK ((children_count >= 0)),
    CONSTRAINT employee_families_iuts_abatement_rate_check CHECK (((iuts_abatement_rate >= (0)::numeric) AND (iuts_abatement_rate <= (100)::numeric))),
    CONSTRAINT employee_families_marital_status_check CHECK (((marital_status)::text = ANY ((ARRAY['SINGLE'::character varying, 'MARRIED'::character varying, 'DIVORCED'::character varying, 'WIDOWED'::character varying])::text[])))
);


ALTER TABLE public.employee_families OWNER TO postgres;

--
-- Name: employee_personal_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_personal_details (
    employee_id uuid NOT NULL,
    cnib_number character varying(50) NOT NULL,
    nationality character varying(50) DEFAULT 'Burkinabè'::character varying NOT NULL,
    birth_date date NOT NULL,
    birth_place character varying(100) NOT NULL,
    gender character(1) NOT NULL,
    CONSTRAINT employee_personal_details_gender_check CHECK ((gender = ANY (ARRAY['M'::bpchar, 'F'::bpchar])))
);


ALTER TABLE public.employee_personal_details OWNER TO postgres;

--
-- Name: employee_rh_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_rh_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    author_id uuid NOT NULL,
    note_content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employee_rh_notes OWNER TO postgres;

--
-- Name: employee_tax_exemptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_tax_exemptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    exemption_type character varying(50) NOT NULL,
    amount_limit numeric(15,2) DEFAULT 0.00 NOT NULL,
    percentage_limit numeric(5,2) DEFAULT 0.00,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employee_tax_exemptions_exemption_type_check CHECK (((exemption_type)::text = ANY ((ARRAY['LOGEMENT_EXONERATION'::character varying, 'AUTRE_EXONERATION'::character varying])::text[])))
);


ALTER TABLE public.employee_tax_exemptions OWNER TO postgres;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    matricule character varying(50) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20),
    department character varying(150),
    "position" character varying(150),
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    hire_date date NOT NULL,
    rfid_badge character varying(50),
    payroll_group_id uuid,
    n1_supervisor_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employees_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying, 'ON_LEAVE'::character varying, 'SUSPENDED'::character varying])::text[])))
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: TABLE employees; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.employees IS 'Registre principal contenant les dossiers administratifs des agents.';


--
-- Name: employes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    utilisateur_id uuid,
    matricule character varying(50) NOT NULL,
    prenom character varying(100) NOT NULL,
    nom character varying(100) NOT NULL,
    email_professionnel character varying(100) NOT NULL,
    telephone character varying(20),
    emploi_id uuid,
    fonction_id uuid,
    direction_id uuid,
    service_id uuid,
    province_id uuid,
    zone_id uuid,
    type_contrat_id uuid,
    type_stage_id uuid,
    residence character varying(150),
    annee_retraite smallint,
    statut character varying(20) DEFAULT 'ACTIF'::character varying NOT NULL,
    date_embauche date NOT NULL,
    superviseur_n1_id uuid,
    badge_rfid character varying(50),
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employes_statut_check CHECK (((statut)::text = ANY ((ARRAY['ACTIF'::character varying, 'INACTIF'::character varying, 'EN_CONGE'::character varying, 'SUSPENDU'::character varying, 'RETRAITE'::character varying, 'DEMISSIONNE'::character varying])::text[])))
);


ALTER TABLE public.employes OWNER TO postgres;

--
-- Name: TABLE employes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.employes IS 'Registre principal des agents BPBF. FK directes vers toutes les données de base.';


--
-- Name: exoneration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exoneration (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employe_id uuid NOT NULL,
    type_indemnite_id uuid,
    montant_exonere numeric(15,2) DEFAULT 0.00 NOT NULL,
    date_debut date NOT NULL,
    date_fin date,
    base_legale character varying(200),
    observation text,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_exoneration_dates CHECK (((date_debut <= date_fin) OR (date_fin IS NULL)))
);


ALTER TABLE public.exoneration OWNER TO postgres;

--
-- Name: TABLE exoneration; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.exoneration IS 'Rubrique 06 - Exonérations fiscales appliquées aux agents.';


--
-- Name: exonerations_fiscales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exonerations_fiscales (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employe_id uuid NOT NULL,
    parametrage_exoneration_id uuid NOT NULL,
    montant_exonere numeric(15,2) DEFAULT 0.00 NOT NULL,
    date_debut date NOT NULL,
    date_fin date,
    observation text,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.exonerations_fiscales OWNER TO postgres;

--
-- Name: TABLE exonerations_fiscales; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.exonerations_fiscales IS 'Rubrique 06 — Exonérations fiscales effectives appliquées à un agent.';


--
-- Name: famille_emp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.famille_emp (
    employe_id uuid NOT NULL,
    situation_matrimoniale character varying(20) NOT NULL,
    nom_conjoint character varying(150),
    nombre_enfants integer DEFAULT 0,
    nombre_parts_iuts numeric(4,1) DEFAULT 1.0,
    taux_abattement_iuts numeric(5,2) DEFAULT 0.00,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.famille_emp OWNER TO postgres;

--
-- Name: TABLE famille_emp; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.famille_emp IS 'Rubrique 02 - Situation familiale (calcul parts IUTS).';


--
-- Name: fonction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fonction (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(150) NOT NULL,
    description text,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.fonction OWNER TO postgres;

--
-- Name: TABLE fonction; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.fonction IS 'Nomenclature des fonctions et postes.';


--
-- Name: fonctions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fonctions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(150) NOT NULL,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.fonctions OWNER TO postgres;

--
-- Name: TABLE fonctions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.fonctions IS 'Données de base — Nomenclature des fonctions. Liée à employes.fonction_id.';


--
-- Name: grilles_salariale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grilles_salariale (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    categorie character varying(20) NOT NULL,
    echelle character varying(10) NOT NULL,
    echelon character varying(10) NOT NULL,
    salaire_base numeric(15,2) NOT NULL,
    indice integer DEFAULT 0,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.grilles_salariale OWNER TO postgres;

--
-- Name: TABLE grilles_salariale; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.grilles_salariale IS 'Grille salariale réglementaire.';


--
-- Name: grilles_salariales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grilles_salariales (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    categorie character varying(20) NOT NULL,
    echelle character varying(10) NOT NULL,
    echelon character varying(10) NOT NULL,
    salaire_base numeric(15,2) NOT NULL,
    indice integer DEFAULT 0,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT grilles_salariales_categorie_check CHECK (((categorie)::text = ANY ((ARRAY['DIRECTION'::character varying, 'CADRE'::character varying, 'MAITRISE'::character varying, 'EMPLOYE'::character varying])::text[]))),
    CONSTRAINT grilles_salariales_salaire_base_check CHECK ((salaire_base >= (0)::numeric))
);


ALTER TABLE public.grilles_salariales OWNER TO postgres;

--
-- Name: TABLE grilles_salariales; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.grilles_salariales IS 'Données de base — Grille salariale réglementaire. Liée à informations_salariales.grille_salariale_id.';


--
-- Name: indemnite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.indemnite (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employe_id uuid NOT NULL,
    type_indemnite_id uuid NOT NULL,
    montant numeric(15,2) NOT NULL,
    date_debut date NOT NULL,
    date_fin date,
    est_actif boolean DEFAULT true NOT NULL,
    observation text,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_indemnite_dates CHECK (((date_debut <= date_fin) OR (date_fin IS NULL)))
);


ALTER TABLE public.indemnite OWNER TO postgres;

--
-- Name: TABLE indemnite; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.indemnite IS 'Rubrique 05 - Indemnités attribuées aux agents.';


--
-- Name: indemnites_agents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.indemnites_agents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employe_id uuid NOT NULL,
    type_indemnite_id uuid NOT NULL,
    montant numeric(15,2) NOT NULL,
    date_debut date NOT NULL,
    date_fin date,
    est_actif boolean DEFAULT true NOT NULL,
    observation text,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT indemnites_agents_montant_check CHECK ((montant >= (0)::numeric))
);


ALTER TABLE public.indemnites_agents OWNER TO postgres;

--
-- Name: TABLE indemnites_agents; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.indemnites_agents IS 'Rubrique 05 — Indemnités attribuées à un agent.';


--
-- Name: info_personnelle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.info_personnelle (
    employe_id uuid NOT NULL,
    numero_cnib character varying(50) NOT NULL,
    nationalite character varying(50) DEFAULT 'Burkinabè'::character varying,
    date_naissance date NOT NULL,
    lieu_naissance character varying(100) NOT NULL,
    sexe character(1) NOT NULL,
    adresse_domicile character varying(255),
    numero_cnss character varying(50),
    numero_ifu character varying(50),
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.info_personnelle OWNER TO postgres;

--
-- Name: TABLE info_personnelle; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.info_personnelle IS 'Rubrique 01 - Informations personnelles et fiscales.';


--
-- Name: info_salaire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.info_salaire (
    employe_id uuid NOT NULL,
    salaire_base numeric(15,2) NOT NULL,
    periodicite character varying(20) DEFAULT 'MENSUELLE'::character varying NOT NULL,
    mode_paiement character varying(20) DEFAULT 'VIREMENT'::character varying NOT NULL,
    nom_banque character varying(100) NOT NULL,
    code_agence character varying(5) NOT NULL,
    numero_compte character varying(15) NOT NULL,
    cle_rib character varying(2) NOT NULL,
    groupe_paie character varying(50),
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.info_salaire OWNER TO postgres;

--
-- Name: TABLE info_salaire; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.info_salaire IS 'Rubrique 07 - Salaire et coordonnées bancaires.';


--
-- Name: informations_salariales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.informations_salariales (
    employe_id uuid NOT NULL,
    grille_salariale_id uuid,
    salaire_base numeric(15,2) NOT NULL,
    periodicite character varying(20) DEFAULT 'MENSUELLE'::character varying NOT NULL,
    mode_paiement character varying(20) DEFAULT 'VIREMENT'::character varying NOT NULL,
    nom_banque character varying(100) NOT NULL,
    code_agence character varying(5) NOT NULL,
    numero_compte character varying(15) NOT NULL,
    cle_rib character varying(2) NOT NULL,
    groupe_paie character varying(50) DEFAULT NULL::character varying,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT informations_salariales_mode_paiement_check CHECK (((mode_paiement)::text = ANY ((ARRAY['VIREMENT'::character varying, 'CHEQUE'::character varying, 'ESPECES'::character varying])::text[]))),
    CONSTRAINT informations_salariales_periodicite_check CHECK (((periodicite)::text = ANY ((ARRAY['MENSUELLE'::character varying, 'BIMENSUELLE'::character varying, 'HEBDOMADAIRE'::character varying])::text[]))),
    CONSTRAINT informations_salariales_salaire_base_check CHECK ((salaire_base >= (0)::numeric))
);


ALTER TABLE public.informations_salariales OWNER TO postgres;

--
-- Name: TABLE informations_salariales; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.informations_salariales IS 'Rubrique 07 — Salaire, coordonnées bancaires et paramètres de traitement.';


--
-- Name: internal_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.internal_movements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    movement_ref character varying(50) NOT NULL,
    employee_id uuid NOT NULL,
    movement_type character varying(25) NOT NULL,
    former_department_id uuid,
    new_department_id uuid NOT NULL,
    former_position_id uuid,
    new_position_id uuid NOT NULL,
    effective_date date NOT NULL,
    act_reference character varying(100),
    act_document_id uuid,
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT internal_movements_movement_type_check CHECK (((movement_type)::text = ANY ((ARRAY['MUTATION_GEOGRAPHIQUE'::character varying, 'CHANGEMENT_POSTE'::character varying, 'PROMOTION'::character varying, 'NOMINATION'::character varying])::text[]))),
    CONSTRAINT internal_movements_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'EFFECTIVE'::character varying, 'CANCELLED'::character varying])::text[])))
);


ALTER TABLE public.internal_movements OWNER TO postgres;

--
-- Name: TABLE internal_movements; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.internal_movements IS 'Suivi et historique des affectations de structures et de postes.';


--
-- Name: job_positions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_positions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    title character varying(150) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.job_positions OWNER TO postgres;

--
-- Name: TABLE job_positions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.job_positions IS 'Référentiel des postes et fonctions (donnée de base isolée).';


--
-- Name: leave_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    leave_type character varying(20) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    number_of_days integer NOT NULL,
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    rejection_reason character varying(255),
    n1_status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    n1_supervisor_id uuid,
    hr_approver_id uuid,
    approved_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_leave_dates CHECK ((end_date >= start_date)),
    CONSTRAINT leave_requests_leave_type_check CHECK (((leave_type)::text = ANY ((ARRAY['ANNUAL'::character varying, 'SICK'::character varying, 'JUSTIFIED'::character varying, 'MATERNITY'::character varying, 'PATERNITY'::character varying, 'UNPAID'::character varying])::text[]))),
    CONSTRAINT leave_requests_n1_status_check CHECK (((n1_status)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying])::text[]))),
    CONSTRAINT leave_requests_number_of_days_check CHECK ((number_of_days > 0)),
    CONSTRAINT leave_requests_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying, 'CANCELLED'::character varying])::text[])))
);


ALTER TABLE public.leave_requests OWNER TO postgres;

--
-- Name: note_emp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.note_emp (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employe_id uuid NOT NULL,
    auteur_id uuid NOT NULL,
    contenu_note text NOT NULL,
    est_confidentielle boolean DEFAULT true,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.note_emp OWNER TO postgres;

--
-- Name: TABLE note_emp; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.note_emp IS 'Rubrique 12 - Notes confidentielles de suivi RH.';


--
-- Name: notes_rh; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notes_rh (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employe_id uuid NOT NULL,
    auteur_id uuid NOT NULL,
    contenu_note text NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notes_rh OWNER TO postgres;

--
-- Name: TABLE notes_rh; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.notes_rh IS 'Rubrique 12 — Notes confidentielles de suivi RH.';


--
-- Name: parametrages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parametrages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cle character varying(100) NOT NULL,
    libelle character varying(200) NOT NULL,
    valeur text NOT NULL,
    type_valeur character varying(20) DEFAULT 'TEXTE'::character varying NOT NULL,
    categorie character varying(50) DEFAULT 'GENERAL'::character varying NOT NULL,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT parametrages_categorie_check CHECK (((categorie)::text = ANY ((ARRAY['GENERAL'::character varying, 'PAIE'::character varying, 'FISCALITE'::character varying, 'CONGES'::character varying, 'SECURITE'::character varying])::text[]))),
    CONSTRAINT parametrages_type_valeur_check CHECK (((type_valeur)::text = ANY ((ARRAY['TEXTE'::character varying, 'NOMBRE'::character varying, 'POURCENTAGE'::character varying, 'BOOLEEN'::character varying, 'DATE'::character varying])::text[])))
);


ALTER TABLE public.parametrages OWNER TO postgres;

--
-- Name: TABLE parametrages; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.parametrages IS 'Configuration globale du système SIRH-BPBF (taux CNSS, barèmes IUTS, durées congés, etc.).';


--
-- Name: parametrages_exonerations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parametrages_exonerations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type_indemnite_id uuid NOT NULL,
    libelle_exoneration character varying(200) NOT NULL,
    base_legale character varying(200),
    plafond_montant numeric(15,2) DEFAULT 0.00,
    plafond_pourcentage numeric(5,2) DEFAULT 0.00,
    mode_calcul character varying(20) DEFAULT 'MONTANT'::character varying NOT NULL,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT parametrages_exonerations_mode_calcul_check CHECK (((mode_calcul)::text = ANY ((ARRAY['MONTANT'::character varying, 'POURCENTAGE'::character varying, 'HYBRIDE'::character varying])::text[])))
);


ALTER TABLE public.parametrages_exonerations OWNER TO postgres;

--
-- Name: TABLE parametrages_exonerations; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.parametrages_exonerations IS 'Paramétrage — Règles fiscales d''exonération par type d''indemnité.';


--
-- Name: provinces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provinces (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(100) NOT NULL,
    region character varying(100),
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.provinces OWNER TO postgres;

--
-- Name: TABLE provinces; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.provinces IS 'Données de base — Provinces du Burkina Faso. Liée à employes.province_id.';


--
-- Name: salary_grids; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary_grids (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category character varying(50) NOT NULL,
    scale character varying(10) NOT NULL,
    step character varying(10) NOT NULL,
    base_salary numeric(15,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT salary_grids_base_salary_check CHECK ((base_salary >= (0)::numeric)),
    CONSTRAINT salary_grids_category_check CHECK (((category)::text = ANY ((ARRAY['CADRE'::character varying, 'MAITRISE'::character varying, 'EMPLOYE'::character varying])::text[])))
);


ALTER TABLE public.salary_grids OWNER TO postgres;

--
-- Name: TABLE salary_grids; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.salary_grids IS 'Grille salariale réglementaire de la BPBF.';


--
-- Name: salary_information; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary_information (
    employee_id uuid NOT NULL,
    salary_grid_id uuid,
    base_salary numeric(15,2) NOT NULL,
    bank_name character varying(100) NOT NULL,
    bank_agency_code character varying(5) NOT NULL,
    bank_account_number character varying(15) NOT NULL,
    bank_rib_key character varying(2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT salary_information_base_salary_check CHECK ((base_salary >= (0)::numeric))
);


ALTER TABLE public.salary_information OWNER TO postgres;

--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(150) NOT NULL,
    direction_id uuid,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: TABLE services; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.services IS 'Services rattachés aux départements.';


--
-- Name: situations_familiales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.situations_familiales (
    employe_id uuid NOT NULL,
    situation_matrimoniale character varying(20) NOT NULL,
    nom_conjoint character varying(150),
    nombre_enfants integer DEFAULT 0 NOT NULL,
    nombre_parts_iuts numeric(4,1) DEFAULT 1.0 NOT NULL,
    taux_abattement_iuts numeric(5,2) DEFAULT 0.00 NOT NULL,
    CONSTRAINT situations_familiales_nombre_enfants_check CHECK ((nombre_enfants >= 0)),
    CONSTRAINT situations_familiales_nombre_parts_iuts_check CHECK ((nombre_parts_iuts >= (1)::numeric)),
    CONSTRAINT situations_familiales_situation_matrimoniale_check CHECK (((situation_matrimoniale)::text = ANY ((ARRAY['CELIBATAIRE'::character varying, 'MARIE'::character varying, 'DIVORCE'::character varying, 'VEUF'::character varying])::text[]))),
    CONSTRAINT situations_familiales_taux_abattement_iuts_check CHECK (((taux_abattement_iuts >= (0)::numeric) AND (taux_abattement_iuts <= (100)::numeric)))
);


ALTER TABLE public.situations_familiales OWNER TO postgres;

--
-- Name: TABLE situations_familiales; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.situations_familiales IS 'Rubrique 02 — Situation familiale (calcul parts IUTS).';


--
-- Name: type_conges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_conges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(100) NOT NULL,
    nombre_jours_max integer,
    est_payant boolean DEFAULT true NOT NULL,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.type_conges OWNER TO postgres;

--
-- Name: TABLE type_conges; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.type_conges IS 'Types d''absences et de congés disponibles.';


--
-- Name: type_contrat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_contrat (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(100) NOT NULL,
    est_permanent boolean DEFAULT false NOT NULL,
    duree_max_mois integer,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.type_contrat OWNER TO postgres;

--
-- Name: TABLE type_contrat; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.type_contrat IS 'Types de contrats de travail.';


--
-- Name: type_indemnite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_indemnite (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(30) NOT NULL,
    libelle character varying(150) NOT NULL,
    description text,
    montant_reference numeric(15,2) DEFAULT 0.00,
    est_imposable boolean DEFAULT true NOT NULL,
    est_cotisable_cnss boolean DEFAULT false NOT NULL,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.type_indemnite OWNER TO postgres;

--
-- Name: TABLE type_indemnite; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.type_indemnite IS 'Catalogue des types d''indemnités et avantages.';


--
-- Name: types_contrats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.types_contrats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(100) NOT NULL,
    est_permanent boolean DEFAULT false NOT NULL,
    duree_max_mois integer,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.types_contrats OWNER TO postgres;

--
-- Name: TABLE types_contrats; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.types_contrats IS 'Données de base — Types de contrats de travail. Liée à employes.type_contrat_id et contrats.type_contrat_id.';


--
-- Name: types_indemnites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.types_indemnites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(30) NOT NULL,
    libelle character varying(150) NOT NULL,
    description text,
    montant_reference numeric(15,2) DEFAULT 0.00,
    est_imposable boolean DEFAULT true NOT NULL,
    est_cotisable_cnss boolean DEFAULT false NOT NULL,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT types_indemnites_montant_reference_check CHECK ((montant_reference >= (0)::numeric))
);


ALTER TABLE public.types_indemnites OWNER TO postgres;

--
-- Name: TABLE types_indemnites; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.types_indemnites IS 'Catalogue de tous les types d''indemnités et avantages en nature de la BPBF.';


--
-- Name: types_stages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.types_stages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(100) NOT NULL,
    duree_max_mois integer,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.types_stages OWNER TO postgres;

--
-- Name: TABLE types_stages; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.types_stages IS 'Données de base — Types de stage. Liée à employes.type_stage_id (NULL si non stagiaire).';


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['SUPER_ADMIN'::character varying, 'HR_MANAGER'::character varying, 'HR_DIRECTOR'::character varying, 'EMPLOYEE'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.users IS 'Comptes d accès au système.';


--
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateur (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nom_utilisateur character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    nom character varying(100) NOT NULL,
    role character varying(50) DEFAULT 'EMPLOYE'::character varying NOT NULL,
    est_actif boolean DEFAULT true NOT NULL,
    derniere_connexion timestamp without time zone,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.utilisateur OWNER TO postgres;

--
-- Name: TABLE utilisateur; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.utilisateur IS 'Comptes d''accès au système SIRH TELIA.';


--
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateurs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nom_utilisateur character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    nom character varying(100) NOT NULL,
    role character varying(30) DEFAULT 'EMPLOYE'::character varying NOT NULL,
    est_actif boolean DEFAULT true NOT NULL,
    derniere_connexion timestamp without time zone,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT utilisateurs_role_check CHECK (((role)::text = ANY ((ARRAY['SUPER_ADMIN'::character varying, 'DRH'::character varying, 'CHARGE_RH'::character varying, 'MANAGER'::character varying, 'EMPLOYE'::character varying])::text[])))
);


ALTER TABLE public.utilisateurs OWNER TO postgres;

--
-- Name: TABLE utilisateurs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.utilisateurs IS 'Comptes d''accès au système SIRH.';


--
-- Name: v_conges_en_attente; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_conges_en_attente AS
 SELECT c.id,
    e.matricule,
    e.prenom,
    e.nom,
    tc.libelle AS type_conge,
    c.date_debut,
    c.date_fin,
    c.nombre_jours,
    c.statut,
    c.statut_n1
   FROM ((public.conge c
     JOIN public.employe e ON ((c.employe_id = e.id)))
     JOIN public.type_conges tc ON ((c.type_conges_id = tc.id)))
  WHERE ((c.statut)::text = ANY ((ARRAY['EN_ATTENTE'::character varying, 'EN_COURS'::character varying])::text[]))
  ORDER BY c.date_debut;


ALTER VIEW public.v_conges_en_attente OWNER TO postgres;

--
-- Name: v_employes_actifs; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_employes_actifs AS
 SELECT e.id,
    e.matricule,
    e.prenom,
    e.nom,
    e.email_professionnel,
    f.libelle AS fonction,
    d.libelle AS departement,
    s.libelle AS service,
    e.statut,
    e.date_embauche
   FROM (((public.employe e
     LEFT JOIN public.fonction f ON ((e.fonction_id = f.id)))
     LEFT JOIN public.departement d ON ((e.departement_id = d.id)))
     LEFT JOIN public.services s ON ((e.services_id = s.id)))
  WHERE ((e.statut)::text = 'ACTIF'::text)
  ORDER BY e.prenom, e.nom;


ALTER VIEW public.v_employes_actifs OWNER TO postgres;

--
-- Name: zones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(100) NOT NULL,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.zones OWNER TO postgres;

--
-- Name: TABLE zones; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.zones IS 'Données de base — Zones géographiques d''affectation. Liée à employes.zone_id.';


--
-- Name: agences; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.agences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(150) NOT NULL,
    localisation character varying(150),
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.agences OWNER TO postgres;

--
-- Name: TABLE agences; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.agences IS 'Agences et implantations géographiques.';


--
-- Name: conge; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.conge (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employe_id uuid NOT NULL,
    type_conges_id uuid NOT NULL,
    date_debut date NOT NULL,
    date_fin date NOT NULL,
    nombre_jours integer NOT NULL,
    statut character varying(20) DEFAULT 'EN_ATTENTE'::character varying NOT NULL,
    motif_rejet character varying(255),
    statut_n1 character varying(20) DEFAULT 'EN_ATTENTE'::character varying NOT NULL,
    approbateur_rh_id uuid,
    approuve_le timestamp without time zone,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.conge OWNER TO postgres;

--
-- Name: TABLE conge; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.conge IS 'Rubrique 04 - Demandes d''absences et de congés.';


--
-- Name: contrat; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.contrat (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reference_contrat character varying(50) NOT NULL,
    employe_id uuid NOT NULL,
    type_contrat_id uuid NOT NULL,
    date_debut date NOT NULL,
    date_fin date,
    duree_essai_mois integer DEFAULT 0,
    clauses_speciales text,
    statut character varying(30) DEFAULT 'BROUILLON'::character varying NOT NULL,
    document_id uuid,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.contrat OWNER TO postgres;

--
-- Name: TABLE contrat; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.contrat IS 'Rubrique 03 - Contrats d''engagement des agents.';


--
-- Name: departement; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.departement (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(150) NOT NULL,
    type_structure character varying(50),
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.departement OWNER TO postgres;

--
-- Name: TABLE departement; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.departement IS 'Structures organisationnelles (directions, départements).';


--
-- Name: document_employe; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.document_employe (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employe_id uuid NOT NULL,
    type_document character varying(50) NOT NULL,
    nom_fichier character varying(255) NOT NULL,
    chemin_fichier character varying(512) NOT NULL,
    taille_fichier integer NOT NULL,
    televerse_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.document_employe OWNER TO postgres;

--
-- Name: TABLE document_employe; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.document_employe IS 'Rubrique 11 - Documents numériques du dossier agent.';


--
-- Name: employe; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.employe (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    utilisateur_id uuid,
    matricule character varying(50) NOT NULL,
    prenom character varying(100) NOT NULL,
    nom character varying(100) NOT NULL,
    email_professionnel character varying(100) NOT NULL,
    telephone character varying(20),
    fonction_id uuid,
    departement_id uuid,
    services_id uuid,
    agences_id uuid,
    grilles_salariale_id uuid,
    superviseur_n1_id uuid,
    statut character varying(20) DEFAULT 'ACTIF'::character varying NOT NULL,
    date_embauche date NOT NULL,
    badge_rfid character varying(50),
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.employe OWNER TO postgres;

--
-- Name: TABLE employe; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.employe IS 'Registre principal des agents TELIA.';


--
-- Name: exoneration; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.exoneration (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employe_id uuid NOT NULL,
    indemnite_id uuid,
    montant_exonere numeric(15,2) DEFAULT 0.00 NOT NULL,
    date_debut date NOT NULL,
    date_fin date,
    base_legale character varying(200),
    observation text,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.exoneration OWNER TO postgres;

--
-- Name: TABLE exoneration; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.exoneration IS 'Rubrique 06 - Exonérations fiscales appliquées aux agents.';


--
-- Name: famille_emp; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.famille_emp (
    employe_id uuid NOT NULL,
    situation_matrimoniale character varying(20) NOT NULL,
    nom_conjoint character varying(150),
    nombre_enfants integer DEFAULT 0,
    nombre_parts_iuts numeric(4,1) DEFAULT 1.0,
    taux_abattement_iuts numeric(5,2) DEFAULT 0.00,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.famille_emp OWNER TO postgres;

--
-- Name: TABLE famille_emp; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.famille_emp IS 'Rubrique 02 - Situation familiale (calcul parts IUTS).';


--
-- Name: fonction; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.fonction (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(150) NOT NULL,
    description text,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.fonction OWNER TO postgres;

--
-- Name: TABLE fonction; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.fonction IS 'Nomenclature des fonctions et postes.';


--
-- Name: grilles_salariale; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.grilles_salariale (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    categorie character varying(20) NOT NULL,
    echelle character varying(10) NOT NULL,
    echelon character varying(10) NOT NULL,
    salaire_base numeric(15,2) NOT NULL,
    indice integer DEFAULT 0,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.grilles_salariale OWNER TO postgres;

--
-- Name: TABLE grilles_salariale; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.grilles_salariale IS 'Grille salariale réglementaire.';


--
-- Name: indemnite; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.indemnite (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employe_id uuid NOT NULL,
    type_indemnite_id uuid NOT NULL,
    montant numeric(15,2) NOT NULL,
    date_debut date NOT NULL,
    date_fin date,
    est_actif boolean DEFAULT true NOT NULL,
    observation text,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.indemnite OWNER TO postgres;

--
-- Name: TABLE indemnite; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.indemnite IS 'Rubrique 05 - Indemnités attribuées aux agents.';


--
-- Name: info_personnelle; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.info_personnelle (
    employe_id uuid NOT NULL,
    numero_cnib character varying(50) NOT NULL,
    nationalite character varying(50) DEFAULT 'Burkinabè'::character varying,
    date_naissance date NOT NULL,
    lieu_naissance character varying(100) NOT NULL,
    sexe character(1) NOT NULL,
    adresse_domicile character varying(255),
    numero_cnss character varying(50),
    numero_ifu character varying(50),
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.info_personnelle OWNER TO postgres;

--
-- Name: TABLE info_personnelle; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.info_personnelle IS 'Rubrique 01 - Informations personnelles et fiscales.';


--
-- Name: info_salaire; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.info_salaire (
    employe_id uuid NOT NULL,
    salaire_base numeric(15,2) NOT NULL,
    periodicite character varying(20) DEFAULT 'MENSUELLE'::character varying NOT NULL,
    mode_paiement character varying(20) DEFAULT 'VIREMENT'::character varying NOT NULL,
    nom_banque character varying(100) NOT NULL,
    code_agence character varying(5) NOT NULL,
    numero_compte character varying(15) NOT NULL,
    cle_rib character varying(2) NOT NULL,
    groupe_paie character varying(50),
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.info_salaire OWNER TO postgres;

--
-- Name: TABLE info_salaire; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.info_salaire IS 'Rubrique 07 - Salaire et coordonnées bancaires.';


--
-- Name: note_emp; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.note_emp (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employe_id uuid NOT NULL,
    auteur_id uuid NOT NULL,
    contenu_note text NOT NULL,
    est_confidentielle boolean DEFAULT true,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.note_emp OWNER TO postgres;

--
-- Name: TABLE note_emp; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.note_emp IS 'Rubrique 12 - Notes confidentielles de suivi RH.';


--
-- Name: services; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(150) NOT NULL,
    departement_id uuid,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.services OWNER TO postgres;

--
-- Name: TABLE services; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.services IS 'Services rattachés aux départements.';


--
-- Name: type_conges; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.type_conges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(100) NOT NULL,
    nombre_jours_max integer,
    est_payant boolean DEFAULT true NOT NULL,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.type_conges OWNER TO postgres;

--
-- Name: TABLE type_conges; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.type_conges IS 'Types d''absences et de congés disponibles.';


--
-- Name: type_contrat; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.type_contrat (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    libelle character varying(100) NOT NULL,
    est_permanent boolean DEFAULT false NOT NULL,
    duree_max_mois integer,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.type_contrat OWNER TO postgres;

--
-- Name: TABLE type_contrat; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.type_contrat IS 'Types de contrats de travail.';


--
-- Name: type_indemnite; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.type_indemnite (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(30) NOT NULL,
    libelle character varying(150) NOT NULL,
    description text,
    montant_reference numeric(15,2) DEFAULT 0.00,
    est_imposable boolean DEFAULT true NOT NULL,
    est_cotisable_cnss boolean DEFAULT false NOT NULL,
    est_actif boolean DEFAULT true NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.type_indemnite OWNER TO postgres;

--
-- Name: TABLE type_indemnite; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.type_indemnite IS 'Catalogue des types d''indemnités et avantages.';


--
-- Name: utilisateur; Type: TABLE; Schema: telia; Owner: postgres
--

CREATE TABLE telia.utilisateur (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nom_utilisateur character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    nom character varying(100) NOT NULL,
    role character varying(50) DEFAULT 'EMPLOYE'::character varying NOT NULL,
    est_actif boolean DEFAULT true NOT NULL,
    derniere_connexion timestamp without time zone,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE telia.utilisateur OWNER TO postgres;

--
-- Name: TABLE utilisateur; Type: COMMENT; Schema: telia; Owner: postgres
--

COMMENT ON TABLE telia.utilisateur IS 'Comptes d''accès au système SIRH TELIA.';


--
-- Data for Name: agences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agences (id, code, libelle, localisation, est_actif, cree_le) FROM stdin;
\.


--
-- Data for Name: conge; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conge (id, employe_id, type_conges_id, date_debut, date_fin, nombre_jours, statut, motif_rejet, statut_n1, superviseur_n1_id, approbateur_rh_id, approuve_le, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contracts (id, contract_ref, employee_id, contract_type, start_date, end_date, trial_period_months, special_clauses, status, document_id, created_at, updated_at) FROM stdin;
c5000000-0000-0000-0000-000000000001	CT-BP-2026-01	e4000000-0000-0000-0000-000000000001	CDI	2026-01-01	\N	3	\N	ACTIVE	\N	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
c5000000-0000-0000-0000-000000000002	CT-BP-2026-88	e4000000-0000-0000-0000-000000000004	CDD	2026-03-15	2027-03-14	2	\N	PENDING_SIGNATURE	\N	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
\.


--
-- Data for Name: contrat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contrat (id, reference_contrat, employe_id, type_contrat_id, date_debut, date_fin, duree_essai_mois, clauses_speciales, statut, document_id, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: contrats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contrats (id, reference_contrat, employe_id, type_contrat_id, date_debut, date_fin, duree_essai_mois, clauses_speciales, statut, document_id, cree_le, modifie_le) FROM stdin;
bc000009-0000-0000-0000-000000000001	CT-BP-2026-001	bb000008-0000-0000-0000-000000000001	40000001-0000-0000-0000-000000000001	2026-01-01	\N	3	\N	ACTIF	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
bc000009-0000-0000-0000-000000000002	CT-BP-2026-002	bb000008-0000-0000-0000-000000000002	40000001-0000-0000-0000-000000000001	2025-06-01	\N	3	\N	ACTIF	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
bc000009-0000-0000-0000-000000000003	CT-BP-2026-003	bb000008-0000-0000-0000-000000000004	40000001-0000-0000-0000-000000000002	2026-03-15	2027-03-14	2	\N	EN_ATTENTE_SIGNATURE	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: demandes_conges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.demandes_conges (id, employe_id, type_conge, date_debut, date_fin, nombre_jours, statut, motif_rejet, statut_n1, superviseur_n1_id, approbateur_rh_id, approuve_le, cree_le, modifie_le) FROM stdin;
dc000010-0000-0000-0000-000000000001	bb000008-0000-0000-0000-000000000002	ANNUEL	2026-06-05	2026-07-05	30	APPROUVE	\N	APPROUVE	\N	ba000007-0000-0000-0000-000000000005	2026-06-01 10:00:00	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
dc000010-0000-0000-0000-000000000002	bb000008-0000-0000-0000-000000000003	JUSTIFIE	2026-06-10	2026-06-10	1	EN_ATTENTE	\N	EN_ATTENTE	bb000008-0000-0000-0000-000000000002	\N	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: departement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departement (id, code, libelle, type_structure, est_actif, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, code, name, type, parent_id, created_at, updated_at) FROM stdin;
d1000000-0000-0000-0000-000000000001	DG	Direction Générale	DIRECTION	\N	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
d1000000-0000-0000-0000-000000000002	DRC	Direction du Réseau et de la Clientèle	DIRECTION	d1000000-0000-0000-0000-000000000001	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
d1000000-0000-0000-0000-000000000003	SGC	Secrétariat Général et Conformité	DIRECTION	d1000000-0000-0000-0000-000000000001	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
d1000000-0000-0000-0000-000000000004	AP-OK	Agence Principale Ouaga Koulouba	AGENCE	d1000000-0000-0000-0000-000000000002	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
d1000000-0000-0000-0000-000000000005	AG-BD	Agence Bobo Dioulasso	AGENCE	d1000000-0000-0000-0000-000000000002	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
d1000000-0000-0000-0000-000000000006	DIR-COMPT	Direction de la Comptabilité	DIRECTION	d1000000-0000-0000-0000-000000000001	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
d1000000-0000-0000-0000-000000000007	DIR-AUDIT	Direction de l'Audit Interne	DIRECTION	d1000000-0000-0000-0000-000000000001	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
\.


--
-- Data for Name: details_personnels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.details_personnels (employe_id, numero_cnib, nationalite, date_naissance, lieu_naissance, sexe, adresse_domicile, numero_cnss, numero_ifu) FROM stdin;
bb000008-0000-0000-0000-000000000001	B12457896	Burkinabè	1992-05-15	Ouagadougou	F	Secteur 15, Ouagadougou	CNSS-BF-001234	\N
bb000008-0000-0000-0000-000000000002	B85412369	Burkinabè	1988-11-20	Bobo-Dioulasso	M	Secteur 07, Ouagadougou	CNSS-BF-002345	\N
bb000008-0000-0000-0000-000000000003	B96325874	Burkinabè	1995-02-02	Dori	F	Secteur 22, Ouagadougou	\N	\N
bb000008-0000-0000-0000-000000000004	B14725836	Burkinabè	1990-08-10	Banfora	M	Secteur 30, Ouagadougou	CNSS-BF-004567	IFU-BF-9876
\.


--
-- Data for Name: directions_departements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directions_departements (id, code, libelle, type_structure, structure_parente_id, est_actif, cree_le, modifie_le) FROM stdin;
d0000002-0000-0000-0000-000000000001	SIEGE	Siège Social de la BPBF	SIEGE	\N	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000002	DG	Direction Générale	DIRECTION	d0000002-0000-0000-0000-000000000001	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000003	DRH	Direction des Ressources Humaines	DIRECTION	d0000002-0000-0000-0000-000000000002	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000004	DRC	Direction du Réseau et de la Clientèle	DIRECTION	d0000002-0000-0000-0000-000000000002	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000005	DSJC	Direction des Services Juridiques	DIRECTION	d0000002-0000-0000-0000-000000000002	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000006	DCOMP	Direction de la Comptabilité	DIRECTION	d0000002-0000-0000-0000-000000000002	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000007	DAUDIT	Direction de l'Audit Interne	DIRECTION	d0000002-0000-0000-0000-000000000002	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000008	AP-OKL	Agence Principale Ouaga Koulouba	AGENCE	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000009	AG-BD	Agence Bobo-Dioulasso Centre	AGENCE	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000010	AG-KAYA	Agence Kaya	AGENCE	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000011	DEPT-PAIE	Département Paie et Rémunération	DEPARTEMENT	d0000002-0000-0000-0000-000000000003	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000012	DEPT-REC	Département Recrutement et Formation	DEPARTEMENT	d0000002-0000-0000-0000-000000000003	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000013	DEPT-CARR	Département Carrières et Compétences	DEPARTEMENT	d0000002-0000-0000-0000-000000000003	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000014	DEPT-CRED	Département Gestion des Crédits	DEPARTEMENT	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000015	DEPT-EPARG	Département Épargne et Dépôts	DEPARTEMENT	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000016	DEPT-MONETI	Département Monétique et Digital	DEPARTEMENT	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000017	DEPT-JUR	Département Juridique et Contentieux	DEPARTEMENT	d0000002-0000-0000-0000-000000000005	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000018	DEPT-CONF	Département Conformité et Compliance	DEPARTEMENT	d0000002-0000-0000-0000-000000000005	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000019	DEPT-COMG	Département Comptabilité Générale	DEPARTEMENT	d0000002-0000-0000-0000-000000000006	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000020	DEPT-FISCA	Département Fiscalité et Déclarations	DEPARTEMENT	d0000002-0000-0000-0000-000000000006	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000021	DEPT-AUDIT	Département Contrôle et Audit Interne	DEPARTEMENT	d0000002-0000-0000-0000-000000000007	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000022	DEPT-RQUAL	Département Risques et Qualité	DEPARTEMENT	d0000002-0000-0000-0000-000000000007	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000023	AG-DEDOU	Agence Dédougou	AGENCE	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000024	AG-OUAHIG	Agence Ouahigouya	AGENCE	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000025	AG-FADA	Agence Fada N'Gourma	AGENCE	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000026	AG-BANFORA	Agence Banfora	AGENCE	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000027	AG-MANGA	Agence Manga	AGENCE	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000028	AG-TENKOD	Agence Tenkodogo	AGENCE	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000029	AG-ZINIAR	Agence Ziniaré	AGENCE	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
d0000002-0000-0000-0000-000000000030	AG-OUAGA2	Agence Ouagadougou Secteur 15	AGENCE	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: document_employe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_employe (id, employe_id, type_document, nom_fichier, chemin_fichier, taille_fichier, televerse_le) FROM stdin;
\.


--
-- Data for Name: documents_agents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents_agents (id, employe_id, type_document, nom_fichier, chemin_fichier, taille_fichier, televerse_le) FROM stdin;
\.


--
-- Data for Name: emplois; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emplois (id, code, libelle, est_actif, cree_le, modifie_le) FROM stdin;
b0000001-0000-0000-0000-000000000001	EMP-GC	Gestionnaire de Crédit	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000002	EMP-AC	Analyste de Crédits	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000003	EMP-CAIS	Caissier	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000004	EMP-INF	Informaticien / Expert Technique	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000005	EMP-RH	Gestionnaire des Ressources Humaines	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000006	EMP-JUR	Juriste	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000007	EMP-AUD	Auditeur Interne	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000008	EMP-ACC	Agent d'Accueil	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000009	EMP-CHF	Chauffeur	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000010	EMP-COMPT	Comptable	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000011	EMP-TRESR	Trésorier	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000012	EMP-CONF	Responsable Conformité	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000013	EMP-RISQ	Gestionnaire des Risques	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000014	EMP-FORM	Formateur / Responsable Formation	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000015	EMP-MONETI	Technicien Monétique	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000016	EMP-ARCH	Archiviste / Gestionnaire GED	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000017	EMP-SGARD	Agent de Sécurité / Gardien	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b0000001-0000-0000-0000-000000000018	EMP-MAINT	Technicien de Maintenance	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: employe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employe (id, utilisateur_id, matricule, prenom, nom, email_professionnel, telephone, fonction_id, departement_id, services_id, agences_id, grilles_salariale_id, type_contrat_id, superviseur_n1_id, statut, date_embauche, badge_rfid, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: employee_allowances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_allowances (id, employee_id, allowance_type, amount, is_taxable, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: employee_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_assignments (employee_id, department_id, job_position_id, salary_grid_id, base_salary, bank_name, bank_agency_code, bank_account_number, bank_rib_key, updated_at) FROM stdin;
e4000000-0000-0000-0000-000000000001	d1000000-0000-0000-0000-000000000002	a2000000-0000-0000-0000-000000000001	b3000000-0000-0000-0000-000000000002	280000.00	CORIS BANK	01001	12345678901	45	2026-06-04 11:35:41.272508
e4000000-0000-0000-0000-000000000002	d1000000-0000-0000-0000-000000000004	a2000000-0000-0000-0000-000000000004	b3000000-0000-0000-0000-000000000001	450000.00	ECOBANK	02005	98765432109	12	2026-06-04 11:35:41.272508
e4000000-0000-0000-0000-000000000003	d1000000-0000-0000-0000-000000000003	a2000000-0000-0000-0000-000000000001	b3000000-0000-0000-0000-000000000003	180000.00	BOA	03009	11223344556	88	2026-06-04 11:35:41.272508
e4000000-0000-0000-0000-000000000004	d1000000-0000-0000-0000-000000000001	a2000000-0000-0000-0000-000000000002	b3000000-0000-0000-0000-000000000001	450000.00	SOCIETE GENERALE	04008	44556677889	99	2026-06-04 11:35:41.272508
e4000000-0000-0000-0000-000000000005	d1000000-0000-0000-0000-000000000001	a2000000-0000-0000-0000-000000000001	b3000000-0000-0000-0000-000000000002	280000.00	UBA	05002	99887766554	77	2026-06-04 11:35:41.272508
e4000000-0000-0000-0000-000000000006	d1000000-0000-0000-0000-000000000006	a2000000-0000-0000-0000-000000000003	b3000000-0000-0000-0000-000000000001	450000.00	BICIAB	06001	11224466880	66	2026-06-04 11:35:41.272508
\.


--
-- Data for Name: employee_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_documents (id, employee_id, document_type, file_name, file_path, file_size, uploaded_at) FROM stdin;
\.


--
-- Data for Name: employee_external_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_external_movements (id, employee_id, movement_type, external_organization, start_date, end_date, document_reference, status, notes, created_at) FROM stdin;
\.


--
-- Data for Name: employee_families; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_families (employee_id, marital_status, spouse_name, children_count, iuts_abatement_rate) FROM stdin;
e4000000-0000-0000-0000-000000000001	MARRIED	\N	2	8.00
e4000000-0000-0000-0000-000000000002	MARRIED	\N	4	12.00
e4000000-0000-0000-0000-000000000003	SINGLE	\N	0	0.00
e4000000-0000-0000-0000-000000000004	SINGLE	\N	1	4.00
\.


--
-- Data for Name: employee_personal_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_personal_details (employee_id, cnib_number, nationality, birth_date, birth_place, gender) FROM stdin;
e4000000-0000-0000-0000-000000000001	B12457896	Burkinabè	1992-05-15	Ouagadougou	F
e4000000-0000-0000-0000-000000000002	B85412369	Burkinabè	1988-11-20	Bobo-Dioulasso	M
e4000000-0000-0000-0000-000000000003	B96325874	Burkinabè	1995-02-02	Dori	F
e4000000-0000-0000-0000-000000000004	B14725836	Burkinabè	1990-08-10	Banfora	M
\.


--
-- Data for Name: employee_rh_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_rh_notes (id, employee_id, author_id, note_content, created_at) FROM stdin;
\.


--
-- Data for Name: employee_tax_exemptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_tax_exemptions (id, employee_id, exemption_type, amount_limit, percentage_limit, created_at) FROM stdin;
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, user_id, matricule, first_name, last_name, email, phone, department, "position", status, hire_date, rfid_badge, payroll_group_id, n1_supervisor_id, created_at, updated_at) FROM stdin;
e4000000-0000-0000-0000-000000000001	f5000000-0000-0000-0000-000000000001	BP-0014	Aminata	OUEDRAOGO	aminata.ouedraogo@bpbf.bf	+22670001414	Direction du Réseau et de la Clientèle	Agent de Banque	ACTIVE	2026-01-01	\N	\N	\N	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
e4000000-0000-0000-0000-000000000002	f5000000-0000-0000-0000-000000000002	BP-0205	Jean-Pierre	SANON	jp.sanon@bpbf.bf	+22676123456	Agence Principale Ouaga Koulouba	Chef d'Agence	ACTIVE	2025-06-01	\N	\N	\N	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
e4000000-0000-0000-0000-000000000003	f5000000-0000-0000-0000-000000000003	BP-0389	Fatoumata	DIALLO	fatou.diallo@bpbf.bf	+22678003389	Secrétariat Général et Conformité	Agent de Banque	INACTIVE	2026-03-01	\N	\N	\N	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
e4000000-0000-0000-0000-000000000004	f5000000-0000-0000-0000-000000000004	BP-0412	Ibrahim	TRAORE	ibrahim.traore@bpbf.bf	+22670987654	Siège Social Ouaga	Expert Technique Informatique	ACTIVE	2026-03-15	\N	\N	\N	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
\.


--
-- Data for Name: employes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employes (id, utilisateur_id, matricule, prenom, nom, email_professionnel, telephone, emploi_id, fonction_id, direction_id, service_id, province_id, zone_id, type_contrat_id, type_stage_id, residence, annee_retraite, statut, date_embauche, superviseur_n1_id, badge_rfid, cree_le, modifie_le) FROM stdin;
bb000008-0000-0000-0000-000000000001	ba000007-0000-0000-0000-000000000001	BP-0014	Aminata	OUEDRAOGO	aminata.ouedraogo@bpbf.bf	+22670001414	b0000001-0000-0000-0000-000000000003	c0000001-0000-0000-0000-000000000004	d0000002-0000-0000-0000-000000000004	e0000001-0000-0000-0000-000000000003	f0000001-0000-0000-0000-000000000001	60000001-0000-0000-0000-000000000001	40000001-0000-0000-0000-000000000001	\N	Secteur 15, Ouagadougou	2052	ACTIF	2026-01-01	\N	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
bb000008-0000-0000-0000-000000000002	ba000007-0000-0000-0000-000000000002	BP-0205	Jean-Pierre	SANON	jp.sanon@bpbf.bf	+22676123456	b0000001-0000-0000-0000-000000000002	c0000001-0000-0000-0000-000000000002	d0000002-0000-0000-0000-000000000008	e0000001-0000-0000-0000-000000000003	f0000001-0000-0000-0000-000000000001	60000001-0000-0000-0000-000000000001	40000001-0000-0000-0000-000000000001	\N	Secteur 07, Ouagadougou	2048	ACTIF	2025-06-01	\N	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
bb000008-0000-0000-0000-000000000003	ba000007-0000-0000-0000-000000000003	BP-0389	Fatoumata	DIALLO	fatou.diallo@bpbf.bf	+22678003389	b0000001-0000-0000-0000-000000000001	c0000001-0000-0000-0000-000000000004	d0000002-0000-0000-0000-000000000004	e0000001-0000-0000-0000-000000000003	f0000001-0000-0000-0000-000000000001	60000001-0000-0000-0000-000000000001	40000001-0000-0000-0000-000000000002	\N	Secteur 22, Ouagadougou	2055	INACTIF	2026-03-01	\N	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
bb000008-0000-0000-0000-000000000004	ba000007-0000-0000-0000-000000000004	BP-0412	Ibrahim	TRAORE	ibrahim.traore@bpbf.bf	+22670987654	b0000001-0000-0000-0000-000000000004	c0000001-0000-0000-0000-000000000005	d0000002-0000-0000-0000-000000000003	e0000001-0000-0000-0000-000000000006	f0000001-0000-0000-0000-000000000001	60000001-0000-0000-0000-000000000001	40000001-0000-0000-0000-000000000002	\N	Secteur 30, Ouagadougou	2050	ACTIF	2026-03-15	\N	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: exoneration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exoneration (id, employe_id, type_indemnite_id, montant_exonere, date_debut, date_fin, base_legale, observation, cree_le) FROM stdin;
\.


--
-- Data for Name: exonerations_fiscales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exonerations_fiscales (id, employe_id, parametrage_exoneration_id, montant_exonere, date_debut, date_fin, observation, cree_le) FROM stdin;
9db88e95-0ba0-4db9-ab6b-c0b875c45292	bb000008-0000-0000-0000-000000000001	af000006-0000-0000-0000-000000000001	50000.00	2026-01-01	\N	\N	2026-06-04 22:50:28.519129
3e10cc6c-c9b8-4d9c-b81c-2be1a98dda0f	bb000008-0000-0000-0000-000000000001	af000006-0000-0000-0000-000000000002	15000.00	2026-01-01	\N	\N	2026-06-04 22:50:28.519129
cfc80e5a-23b0-4b1e-8eb8-5f44bac63f58	bb000008-0000-0000-0000-000000000002	af000006-0000-0000-0000-000000000001	50000.00	2025-06-01	\N	\N	2026-06-04 22:50:28.519129
94b6a443-a637-4472-bec0-6b9a3b828700	bb000008-0000-0000-0000-000000000002	af000006-0000-0000-0000-000000000002	15000.00	2025-06-01	\N	\N	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: famille_emp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.famille_emp (employe_id, situation_matrimoniale, nom_conjoint, nombre_enfants, nombre_parts_iuts, taux_abattement_iuts, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: fonction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fonction (id, code, libelle, description, est_actif, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: fonctions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fonctions (id, code, libelle, est_actif, cree_le, modifie_le) FROM stdin;
c0000001-0000-0000-0000-000000000001	FCT-DIR	Directeur	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
c0000001-0000-0000-0000-000000000002	FCT-CHEF	Chef de Service / Chef d'Agence	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
c0000001-0000-0000-0000-000000000003	FCT-RESP	Responsable	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
c0000001-0000-0000-0000-000000000004	FCT-AGT	Agent	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
c0000001-0000-0000-0000-000000000005	FCT-TECH	Technicien Spécialisé	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
c0000001-0000-0000-0000-000000000006	FCT-COOR	Coordinateur	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
c0000001-0000-0000-0000-000000000007	FCT-ADJ	Adjoint / Assistant	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
c0000001-0000-0000-0000-000000000008	FCT-STAGE	Stagiaire	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
c0000001-0000-0000-0000-000000000009	FCT-APPR	Apprenti	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: grilles_salariale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grilles_salariale (id, categorie, echelle, echelon, salaire_base, indice, est_actif, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: grilles_salariales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grilles_salariales (id, categorie, echelle, echelon, salaire_base, indice, est_actif, cree_le, modifie_le) FROM stdin;
ac000004-0000-0000-0000-000000000001	DIRECTION	S	1	900000.00	900	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ac000004-0000-0000-0000-000000000002	DIRECTION	S	2	1100000.00	1100	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ac000004-0000-0000-0000-000000000003	CADRE	A	1	450000.00	450	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ac000004-0000-0000-0000-000000000004	CADRE	A	2	520000.00	520	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ac000004-0000-0000-0000-000000000005	CADRE	A	3	600000.00	600	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ac000004-0000-0000-0000-000000000006	MAITRISE	B	1	280000.00	280	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ac000004-0000-0000-0000-000000000007	MAITRISE	B	2	320000.00	320	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ac000004-0000-0000-0000-000000000008	MAITRISE	B	3	360000.00	360	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ac000004-0000-0000-0000-000000000009	EMPLOYE	C	1	150000.00	150	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ac000004-0000-0000-0000-000000000010	EMPLOYE	C	2	180000.00	180	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ac000004-0000-0000-0000-000000000011	EMPLOYE	C	3	210000.00	210	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: indemnite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.indemnite (id, employe_id, type_indemnite_id, montant, date_debut, date_fin, est_actif, observation, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: indemnites_agents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.indemnites_agents (id, employe_id, type_indemnite_id, montant, date_debut, date_fin, est_actif, observation, cree_le, modifie_le) FROM stdin;
ae7cb55c-823d-4582-b480-2d7086e4687c	bb000008-0000-0000-0000-000000000001	ae000005-0000-0000-0000-000000000001	50000.00	2026-01-01	\N	t	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
14b33dec-dc78-4347-80a6-82cd986c69c1	bb000008-0000-0000-0000-000000000001	ae000005-0000-0000-0000-000000000002	15000.00	2026-01-01	\N	t	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
55bae922-2a08-446f-af9f-1e0787ccab8e	bb000008-0000-0000-0000-000000000002	ae000005-0000-0000-0000-000000000001	50000.00	2025-06-01	\N	t	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
6dcc92fd-3f70-4f4d-ae88-27d9e13f1ad4	bb000008-0000-0000-0000-000000000002	ae000005-0000-0000-0000-000000000005	40000.00	2025-06-01	\N	t	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ea36a431-ff65-4858-b4bd-38a9177bc32d	bb000008-0000-0000-0000-000000000002	ae000005-0000-0000-0000-000000000002	15000.00	2025-06-01	\N	t	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
b871f061-7616-4c10-b581-9e84443f5e14	bb000008-0000-0000-0000-000000000004	ae000005-0000-0000-0000-000000000003	30000.00	2026-03-15	\N	t	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
588dd2cd-fc50-4978-b4d1-0bc865e15b46	bb000008-0000-0000-0000-000000000004	ae000005-0000-0000-0000-000000000002	15000.00	2026-03-15	\N	t	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: info_personnelle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.info_personnelle (employe_id, numero_cnib, nationalite, date_naissance, lieu_naissance, sexe, adresse_domicile, numero_cnss, numero_ifu, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: info_salaire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.info_salaire (employe_id, salaire_base, periodicite, mode_paiement, nom_banque, code_agence, numero_compte, cle_rib, groupe_paie, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: informations_salariales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.informations_salariales (employe_id, grille_salariale_id, salaire_base, periodicite, mode_paiement, nom_banque, code_agence, numero_compte, cle_rib, groupe_paie, cree_le, modifie_le) FROM stdin;
bb000008-0000-0000-0000-000000000001	ac000004-0000-0000-0000-000000000007	320000.00	MENSUELLE	VIREMENT	CORIS BANK	01001	12345678901	45	Grille Permanent Maîtrise	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
bb000008-0000-0000-0000-000000000002	ac000004-0000-0000-0000-000000000004	520000.00	MENSUELLE	VIREMENT	ECOBANK	02005	98765432109	12	Grille Permanent Cadre	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
bb000008-0000-0000-0000-000000000003	ac000004-0000-0000-0000-000000000010	180000.00	MENSUELLE	VIREMENT	BOA	03009	11223344556	88	Grille Permanent Employé	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
bb000008-0000-0000-0000-000000000004	ac000004-0000-0000-0000-000000000004	520000.00	MENSUELLE	VIREMENT	SOCIETE GENERALE	04008	44556677889	99	Grille Permanent Cadre	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: internal_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.internal_movements (id, movement_ref, employee_id, movement_type, former_department_id, new_department_id, former_position_id, new_position_id, effective_date, act_reference, act_document_id, status, created_at, updated_at) FROM stdin;
f6000000-0000-0000-0000-000000000001	MOV-4029	e4000000-0000-0000-0000-000000000005	MUTATION_GEOGRAPHIQUE	d1000000-0000-0000-0000-000000000005	d1000000-0000-0000-0000-000000000001	a2000000-0000-0000-0000-000000000001	a2000000-0000-0000-0000-000000000001	2026-05-01	DECISION-DG-N0852	\N	EFFECTIVE	2026-06-04 11:35:41.272508	2026-06-04 11:35:41.272508
f6000000-0000-0000-0000-000000000002	MOV-4110	e4000000-0000-0000-0000-000000000006	CHANGEMENT_POSTE	d1000000-0000-0000-0000-000000000006	d1000000-0000-0000-0000-000000000007	a2000000-0000-0000-0000-000000000003	a2000000-0000-0000-0000-000000000003	2026-05-15	DECRET-NOMINATION-N096	\N	EFFECTIVE	2026-06-04 11:35:41.272508	2026-06-04 11:35:41.272508
\.


--
-- Data for Name: job_positions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_positions (id, code, title, created_at, updated_at) FROM stdin;
a2000000-0000-0000-0000-000000000001	AG_BANQUE	Agent de Banque	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
a2000000-0000-0000-0000-000000000002	EXP_INFO	Expert Technique Informatique	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
a2000000-0000-0000-0000-000000000003	RESP_AUDIT	Auditeur Interne	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
a2000000-0000-0000-0000-000000000004	CHEF_AGENCE	Chef d'Agence	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
\.


--
-- Data for Name: leave_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_requests (id, employee_id, leave_type, start_date, end_date, number_of_days, status, rejection_reason, n1_status, n1_supervisor_id, hr_approver_id, approved_at, created_at, updated_at) FROM stdin;
a7000000-0000-0000-0000-000000000001	e4000000-0000-0000-0000-000000000002	ANNUAL	2026-06-05	2026-07-05	30	APPROVED	\N	APPROVED	\N	f5000000-0000-0000-0000-000000000005	2026-06-01 10:00:00	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
a7000000-0000-0000-0000-000000000002	e4000000-0000-0000-0000-000000000003	JUSTIFIED	2026-06-10	2026-06-10	1	PENDING	\N	PENDING	e4000000-0000-0000-0000-000000000002	\N	\N	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
\.


--
-- Data for Name: note_emp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.note_emp (id, employe_id, auteur_id, contenu_note, est_confidentielle, cree_le) FROM stdin;
\.


--
-- Data for Name: notes_rh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notes_rh (id, employe_id, auteur_id, contenu_note, cree_le) FROM stdin;
\.


--
-- Data for Name: parametrages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parametrages (id, cle, libelle, valeur, type_valeur, categorie, est_actif, cree_le, modifie_le) FROM stdin;
a0000001-0000-0000-0000-000000000001	TAUX_CNSS_EMPLOYE	Taux CNSS (part salariale)	5.5	POURCENTAGE	PAIE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000002	TAUX_CNSS_EMPLOYEUR	Taux CNSS (part patronale)	16	POURCENTAGE	PAIE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000003	TAUX_IUTS_TRANCHE_1	Taux IUTS tranche 1 (0 à 90 000 FCFA)	0	POURCENTAGE	FISCALITE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000004	TAUX_IUTS_TRANCHE_2	Taux IUTS tranche 2 (90 001 à 130 000 FCFA)	10	POURCENTAGE	FISCALITE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000005	TAUX_IUTS_TRANCHE_3	Taux IUTS tranche 3 (130 001 à 200 000 FCFA)	15	POURCENTAGE	FISCALITE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000006	TAUX_IUTS_TRANCHE_4	Taux IUTS tranche 4 (200 001 à 500 000 FCFA)	20	POURCENTAGE	FISCALITE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000007	TAUX_IUTS_TRANCHE_5	Taux IUTS tranche 5 (supérieur à 500 000 FCFA)	25	POURCENTAGE	FISCALITE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000008	DUREE_CONGE_ANNUEL	Durée réglementaire du congé annuel (jours)	30	NOMBRE	CONGES	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000009	DEVISE	Devise officielle du système	FCFA	TEXTE	GENERAL	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000010	NOM_ORGANISATION	Nom de l'organisation	BPBF	TEXTE	GENERAL	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000011	PLAFOND_SALAIRE_CNSS	Plafond mensuel soumis à la CNSS (FCFA)	500000	NOMBRE	PAIE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000012	TAUX_AT_MP	Taux accident du travail / maladie professionnelle	1	POURCENTAGE	PAIE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000013	SMIG_BF	Salaire Minimum Interprofessionnel Garanti (FCFA)	30684	NOMBRE	PAIE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000014	AGE_RETRAITE_BF	Âge légal de départ à la retraite (années)	60	NOMBRE	GENERAL	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000015	IUTS_TRANCHE_1_PLAFOND	Plafond tranche 1 IUTS (FCFA)	90000	NOMBRE	FISCALITE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000016	IUTS_TRANCHE_2_PLAFOND	Plafond tranche 2 IUTS (FCFA)	130000	NOMBRE	FISCALITE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000017	IUTS_TRANCHE_3_PLAFOND	Plafond tranche 3 IUTS (FCFA)	200000	NOMBRE	FISCALITE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000018	IUTS_TRANCHE_4_PLAFOND	Plafond tranche 4 IUTS (FCFA)	500000	NOMBRE	FISCALITE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000019	IUTS_TRANCHE_5_PLAFOND	Plafond tranche 5 IUTS (illimité, valeur pivot)	999999999	NOMBRE	FISCALITE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000020	TAUX_ABATTEMENT_IUTS	Taux d'abattement forfaitaire IUTS	10	POURCENTAGE	FISCALITE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000021	DUREE_CONGE_MATERNITE	Durée congé maternité (jours)	98	NOMBRE	CONGES	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000022	DUREE_CONGE_PATERNITE	Durée congé paternité (jours)	3	NOMBRE	CONGES	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000023	DUREE_CONGE_MALADIE_MAX	Durée maximale congé maladie (jours/an)	180	NOMBRE	CONGES	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000024	DELAI_DEMANDE_CONGE	Délai minimum de dépôt d'une demande (jours)	15	NOMBRE	CONGES	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000025	SOLDE_CONGE_REPORT_MAX	Nombre maximum de jours de congé reportables	15	NOMBRE	CONGES	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000026	MAX_TENTATIVES_LOGIN	Nombre maximum de tentatives de connexion	5	NOMBRE	SECURITE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000027	DUREE_SESSION_MINUTES	Durée maximale d'une session active (minutes)	30	NOMBRE	SECURITE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000028	DUREE_BLOCAGE_COMPTE	Durée de blocage après échec login (minutes)	15	NOMBRE	SECURITE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000029	DUREE_VALIDITE_MDP	Durée de validité d'un mot de passe (jours)	90	NOMBRE	SECURITE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000030	ANCIENNETE_PRIME_DEBUT	Ancienneté minimale pour prime (années)	1	NOMBRE	PAIE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000031	TAUX_PRIME_ANCIENNETE	Taux de la prime d'ancienneté par an (%)	2	POURCENTAGE	PAIE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000032	PLAFOND_PRIME_ANCIENNETE	Plafond de la prime d'ancienneté (%)	30	POURCENTAGE	PAIE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000033	DUREE_PERIODE_ESSAI_CDI	Durée période d'essai CDI (mois)	3	NOMBRE	GENERAL	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000034	DUREE_PERIODE_ESSAI_CDD	Durée période d'essai CDD (mois)	1	NOMBRE	GENERAL	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000035	HEURE_DEBUT_JOURNEE	Heure de début de journée de travail	07:30	TEXTE	GENERAL	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000036	HEURE_FIN_JOURNEE	Heure de fin de journée de travail	16:30	TEXTE	GENERAL	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000037	NB_HEURES_SEMAINE	Nombre d'heures légales par semaine	40	NOMBRE	GENERAL	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000038	TAUX_HEURE_SUPP	Majoration heures supplémentaires (%)	25	POURCENTAGE	PAIE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000039	TAUX_HEURE_SUPP_NUIT	Majoration heures supplémentaires nuit (%)	50	POURCENTAGE	PAIE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
a0000001-0000-0000-0000-000000000040	TAUX_HEURE_SUPP_FERIER	Majoration jours fériés (%)	100	POURCENTAGE	PAIE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: parametrages_exonerations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parametrages_exonerations (id, type_indemnite_id, libelle_exoneration, base_legale, plafond_montant, plafond_pourcentage, mode_calcul, est_actif, cree_le, modifie_le) FROM stdin;
af000006-0000-0000-0000-000000000001	ae000005-0000-0000-0000-000000000001	Exonération IUTS sur Indemnité de Logement	Art. 52 al. 3 du Code Général des Impôts du Burkina Faso	50000.00	0.00	MONTANT	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
af000006-0000-0000-0000-000000000002	ae000005-0000-0000-0000-000000000002	Exonération IUTS sur Indemnité de Transport	Art. 52 al. 4 du Code Général des Impôts du Burkina Faso	15000.00	0.00	MONTANT	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
af000006-0000-0000-0000-000000000003	ae000005-0000-0000-0000-000000000007	Exonération IUTS sur Indemnité de Représentation	Art. 52 al. 5 du Code Général des Impôts du Burkina Faso	0.00	10.00	POURCENTAGE	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
af000006-0000-0000-0000-000000000004	ae000005-0000-0000-0000-000000000008	Exonération IUTS sur Indemnité de Risque	Art. 52 al. 6 du Code Général des Impôts du Burkina Faso	10000.00	0.00	MONTANT	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
af000006-0000-0000-0000-000000000005	ae000005-0000-0000-0000-000000000009	Exonération IUTS sur Indemnité de Panier (Repas)	Art. 52 al. 7 du Code Général des Impôts du Burkina Faso	5000.00	0.00	MONTANT	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.provinces (id, code, libelle, region, est_actif, cree_le) FROM stdin;
f0000001-0000-0000-0000-000000000001	KADIOGO	Kadiogo	Centre	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000002	HOUET	Houet	Hauts-Bassins	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000003	SANMATENGA	Sanmatenga	Centre-Nord	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000004	COMOE	Comoé	Cascades	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000005	SISSILI	Sissili	Centre-Ouest	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000006	BALE	Balé	Boucle du Mouhoun	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000007	BANWA	Banwa	Boucle du Mouhoun	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000008	KOSSI	Kossi	Boucle du Mouhoun	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000009	MOUHOUN	Mouhoun	Boucle du Mouhoun	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000010	NAYALA	Nayala	Boucle du Mouhoun	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000011	SOUROU	Sourou	Boucle du Mouhoun	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000012	LERABA	Léraba	Cascades	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000013	BAZEGA	Bazèga	Centre-Sud	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000014	BOULGOU	Boulgou	Centre-Est	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000015	KOULPELOGO	Koulpélogo	Centre-Est	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000016	KOURITENGA	Kouritenga	Centre-Est	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000017	BAM	Bam	Centre-Nord	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000018	NAMENTENGA	Namentenga	Centre-Nord	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000019	BOULKIEMDE	Boulkiemdé	Centre-Ouest	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000020	SANGUIE	Sanguié	Centre-Ouest	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000021	ZIRO	Ziro	Centre-Ouest	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000022	NAHOURI	Nahouri	Centre-Sud	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000023	ZOUNDWEOGO	Zoundwéogo	Centre-Sud	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000024	GOURMA	Gourma	Est	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000025	GNAGNA	Gnagna	Est	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000026	KOMPIENGA	Kompienga	Est	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000027	TAPOA	Tapoa	Est	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000028	KENEDOUGOU	Kénédougou	Hauts-Bassins	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000029	TUY	Tuy	Hauts-Bassins	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000030	LOROUM	Loroum	Nord	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000031	PASSORE	Passoré	Nord	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000032	YATENGA	Yatenga	Nord	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000033	ZONDOMA	Zondoma	Nord	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000034	GANZOURGOU	Ganzourgou	Plateau-Central	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000035	KOURWEOGO	Kourwéogo	Plateau-Central	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000036	OUBRITENGA	Oubritenga	Plateau-Central	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000037	OUDALAN	Oudalan	Sahel	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000038	SENO	Séno	Sahel	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000039	SOUM	Soum	Sahel	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000040	YAGHA	Yagha	Sahel	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000041	BOUGOURIBA	Bougouriba	Sud-Ouest	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000042	IOBA	Ioba	Sud-Ouest	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000043	NOUMBIEL	Noumbiel	Sud-Ouest	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000044	PONI	Poni	Sud-Ouest	t	2026-06-04 22:50:28.519129
f0000001-0000-0000-0000-000000000045	ZOUNDOMA	Zoundoma	Nord	t	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: salary_grids; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salary_grids (id, category, scale, step, base_salary, created_at, updated_at) FROM stdin;
b3000000-0000-0000-0000-000000000001	CADRE	A	1	450000.00	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
b3000000-0000-0000-0000-000000000002	MAITRISE	B	2	280000.00	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
b3000000-0000-0000-0000-000000000003	EMPLOYE	C	3	180000.00	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
\.


--
-- Data for Name: salary_information; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salary_information (employee_id, salary_grid_id, base_salary, bank_name, bank_agency_code, bank_account_number, bank_rib_key, created_at, updated_at) FROM stdin;
e4000000-0000-0000-0000-000000000001	b3000000-0000-0000-0000-000000000002	280000.00	CORIS BANK	01001	12345678901	45	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
e4000000-0000-0000-0000-000000000002	b3000000-0000-0000-0000-000000000001	450000.00	ECOBANK	02005	98765432109	12	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
e4000000-0000-0000-0000-000000000003	b3000000-0000-0000-0000-000000000003	180000.00	BOA	03009	11223344556	88	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
e4000000-0000-0000-0000-000000000004	b3000000-0000-0000-0000-000000000001	450000.00	SOCIETE GENERALE	04008	44556677889	99	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, code, libelle, direction_id, est_actif, cree_le, modifie_le) FROM stdin;
e0000001-0000-0000-0000-000000000001	SRV-PAIE	Service Paie et Rémunération	d0000002-0000-0000-0000-000000000003	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000002	SRV-REC	Service Recrutement et Formation	d0000002-0000-0000-0000-000000000003	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000003	SRV-CRED	Service Gestion des Crédits	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000004	SRV-COMPTA	Service Comptabilité Générale	d0000002-0000-0000-0000-000000000006	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000005	SRV-AUDIT	Service Contrôle et Audit	d0000002-0000-0000-0000-000000000007	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000006	SRV-INFO	Service Informatique et Systèmes	d0000002-0000-0000-0000-000000000003	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000007	SRV-CARR	Service Carrières et Mobilité	d0000002-0000-0000-0000-000000000003	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000008	SRV-FORM	Service Formation et Développement RH	d0000002-0000-0000-0000-000000000003	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000009	SRV-EPARG	Service Épargne et Placement	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000010	SRV-MONETI	Service Monétique et Paiement Digital	d0000002-0000-0000-0000-000000000004	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000011	SRV-CONF	Service Conformité et KYC	d0000002-0000-0000-0000-000000000005	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000012	SRV-CONT	Service Contentieux et Recouvrement	d0000002-0000-0000-0000-000000000005	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000013	SRV-FISCA	Service Fiscalité et Déclarations	d0000002-0000-0000-0000-000000000006	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000014	SRV-TRESO	Service Trésorerie et Gestion de Caisse	d0000002-0000-0000-0000-000000000006	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000015	SRV-RISQ	Service Risques Opérationnels	d0000002-0000-0000-0000-000000000007	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000016	SRV-QUAL	Service Qualité et Processus	d0000002-0000-0000-0000-000000000007	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000017	SRV-SECU	Service Sécurité des Systèmes	d0000002-0000-0000-0000-000000000003	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
e0000001-0000-0000-0000-000000000018	SRV-ARCH	Service Archivage et GED	d0000002-0000-0000-0000-000000000003	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: situations_familiales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.situations_familiales (employe_id, situation_matrimoniale, nom_conjoint, nombre_enfants, nombre_parts_iuts, taux_abattement_iuts) FROM stdin;
bb000008-0000-0000-0000-000000000001	MARIE	\N	2	3.0	8.00
bb000008-0000-0000-0000-000000000002	MARIE	\N	4	5.0	12.00
bb000008-0000-0000-0000-000000000003	CELIBATAIRE	\N	0	1.0	0.00
bb000008-0000-0000-0000-000000000004	CELIBATAIRE	\N	1	2.0	4.00
\.


--
-- Data for Name: type_conges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_conges (id, code, libelle, nombre_jours_max, est_payant, est_actif, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: type_contrat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_contrat (id, code, libelle, est_permanent, duree_max_mois, est_actif, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: type_indemnite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_indemnite (id, code, libelle, description, montant_reference, est_imposable, est_cotisable_cnss, est_actif, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: types_contrats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.types_contrats (id, code, libelle, est_permanent, duree_max_mois, est_actif, cree_le, modifie_le) FROM stdin;
40000001-0000-0000-0000-000000000001	CDI	Contrat à Durée Indéterminée	t	\N	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
40000001-0000-0000-0000-000000000002	CDD	Contrat à Durée Déterminée	f	24	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
40000001-0000-0000-0000-000000000003	STAGE	Convention de Stage	f	12	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
40000001-0000-0000-0000-000000000004	TEMPORAIRE	Contrat de Travail Temporaire	f	6	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
40000001-0000-0000-0000-000000000005	CARFO	Contractuel Régime CARFO	t	\N	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: types_indemnites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.types_indemnites (id, code, libelle, description, montant_reference, est_imposable, est_cotisable_cnss, est_actif, cree_le, modifie_le) FROM stdin;
ae000005-0000-0000-0000-000000000001	IND_LOGEMENT	Indemnité de Logement	Allocation pour prise en charge partielle du loyer.	50000.00	f	f	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ae000005-0000-0000-0000-000000000002	IND_TRANSPORT	Indemnité de Transport	Prise en charge des frais de déplacement domicile-travail.	15000.00	f	f	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ae000005-0000-0000-0000-000000000003	IND_TECHNICITE	Indemnité de Technicité	Supplément pour expertise technique spécialisée.	30000.00	t	t	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ae000005-0000-0000-0000-000000000004	IND_ASTREINTE	Indemnité d'Astreinte	Compensation pour disponibilité hors heures normales.	20000.00	t	t	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ae000005-0000-0000-0000-000000000005	IND_RESPONS	Indemnité de Responsabilité	Supplément pour poste d'encadrement.	40000.00	t	t	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ae000005-0000-0000-0000-000000000006	IND_ANCIENNETE	Prime d'Ancienneté	Prime calculée selon l'ancienneté au sein de la BPBF.	0.00	t	t	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ae000005-0000-0000-0000-000000000007	IND_REPR	Indemnité de Représentation	Frais de représentation alloués aux cadres dirigeants.	60000.00	f	f	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ae000005-0000-0000-0000-000000000008	IND_RISQUE	Indemnité de Risque	Allocation pour activités à risque (ex : caissiers).	10000.00	f	f	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ae000005-0000-0000-0000-000000000009	IND_PANIER	Indemnité de Panier (Repas)	Prise en charge partielle des repas.	5000.00	f	f	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ae000005-0000-0000-0000-000000000010	IND_AUTRE	Autre Indemnité	Catégorie générique pour toute autre indemnité non listée.	0.00	t	f	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: types_stages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.types_stages (id, code, libelle, duree_max_mois, est_actif, cree_le, modifie_le) FROM stdin;
50000001-0000-0000-0000-000000000001	STG-ACAD	Stage Académique	6	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
50000001-0000-0000-0000-000000000002	STG-PROF	Stage Professionnel	12	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
50000001-0000-0000-0000-000000000003	STG-PREBA	Stage Pré-Embauche	3	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
50000001-0000-0000-0000-000000000004	APPRENT	Apprentissage	24	t	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, first_name, last_name, role, created_at, updated_at) FROM stdin;
f5000000-0000-0000-0000-000000000001	aminata.ouedraogo	aminata.ouedraogo@bpbf.bf	Aminata	OUEDRAOGO	EMPLOYEE	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
f5000000-0000-0000-0000-000000000002	jp.sanon	jp.sanon@bpbf.bf	Jean-Pierre	SANON	EMPLOYEE	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
f5000000-0000-0000-0000-000000000003	fatou.diallo	fatou.diallo@bpbf.bf	Fatoumata	DIALLO	EMPLOYEE	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
f5000000-0000-0000-0000-000000000004	ibrahim.traore	ibrahim.traore@bpbf.bf	Ibrahim	TRAORE	EMPLOYEE	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
f5000000-0000-0000-0000-000000000005	david.zorom	david.zorom@telia.bf	David	ZOROM	HR_MANAGER	2026-06-04 13:47:37.547406	2026-06-04 13:47:37.547406
\.


--
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateur (id, nom_utilisateur, email, prenom, nom, role, est_actif, derniere_connexion, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateurs (id, nom_utilisateur, email, prenom, nom, role, est_actif, derniere_connexion, cree_le, modifie_le) FROM stdin;
ba000007-0000-0000-0000-000000000001	aminata.ouedraogo	aminata.ouedraogo@bpbf.bf	Aminata	OUEDRAOGO	EMPLOYE	t	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ba000007-0000-0000-0000-000000000002	jp.sanon	jp.sanon@bpbf.bf	Jean-Pierre	SANON	MANAGER	t	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ba000007-0000-0000-0000-000000000003	fatou.diallo	fatou.diallo@bpbf.bf	Fatoumata	DIALLO	EMPLOYE	t	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ba000007-0000-0000-0000-000000000004	ibrahim.traore	ibrahim.traore@bpbf.bf	Ibrahim	TRAORE	EMPLOYE	t	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
ba000007-0000-0000-0000-000000000005	david.zorom	david.zorom@bpbf.bf	David	ZOROM	CHARGE_RH	t	\N	2026-06-04 22:50:28.519129	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: zones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.zones (id, code, libelle, est_actif, cree_le) FROM stdin;
60000001-0000-0000-0000-000000000001	ZONE-URB	Zone Urbaine	t	2026-06-04 22:50:28.519129
60000001-0000-0000-0000-000000000002	ZONE-SEMI	Zone Semi-Urbaine	t	2026-06-04 22:50:28.519129
60000001-0000-0000-0000-000000000003	ZONE-RUR	Zone Rurale	t	2026-06-04 22:50:28.519129
\.


--
-- Data for Name: agences; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.agences (id, code, libelle, localisation, est_actif, cree_le) FROM stdin;
\.


--
-- Data for Name: conge; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.conge (id, employe_id, type_conges_id, date_debut, date_fin, nombre_jours, statut, motif_rejet, statut_n1, approbateur_rh_id, approuve_le, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: contrat; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.contrat (id, reference_contrat, employe_id, type_contrat_id, date_debut, date_fin, duree_essai_mois, clauses_speciales, statut, document_id, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: departement; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.departement (id, code, libelle, type_structure, est_actif, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: document_employe; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.document_employe (id, employe_id, type_document, nom_fichier, chemin_fichier, taille_fichier, televerse_le) FROM stdin;
\.


--
-- Data for Name: employe; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.employe (id, utilisateur_id, matricule, prenom, nom, email_professionnel, telephone, fonction_id, departement_id, services_id, agences_id, grilles_salariale_id, superviseur_n1_id, statut, date_embauche, badge_rfid, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: exoneration; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.exoneration (id, employe_id, indemnite_id, montant_exonere, date_debut, date_fin, base_legale, observation, cree_le) FROM stdin;
\.


--
-- Data for Name: famille_emp; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.famille_emp (employe_id, situation_matrimoniale, nom_conjoint, nombre_enfants, nombre_parts_iuts, taux_abattement_iuts, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: fonction; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.fonction (id, code, libelle, description, est_actif, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: grilles_salariale; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.grilles_salariale (id, categorie, echelle, echelon, salaire_base, indice, est_actif, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: indemnite; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.indemnite (id, employe_id, type_indemnite_id, montant, date_debut, date_fin, est_actif, observation, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: info_personnelle; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.info_personnelle (employe_id, numero_cnib, nationalite, date_naissance, lieu_naissance, sexe, adresse_domicile, numero_cnss, numero_ifu, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: info_salaire; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.info_salaire (employe_id, salaire_base, periodicite, mode_paiement, nom_banque, code_agence, numero_compte, cle_rib, groupe_paie, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: note_emp; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.note_emp (id, employe_id, auteur_id, contenu_note, est_confidentielle, cree_le) FROM stdin;
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.services (id, code, libelle, departement_id, est_actif, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: type_conges; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.type_conges (id, code, libelle, nombre_jours_max, est_payant, est_actif, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: type_contrat; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.type_contrat (id, code, libelle, est_permanent, duree_max_mois, est_actif, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: type_indemnite; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.type_indemnite (id, code, libelle, description, montant_reference, est_imposable, est_cotisable_cnss, est_actif, cree_le, modifie_le) FROM stdin;
\.


--
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: telia; Owner: postgres
--

COPY telia.utilisateur (id, nom_utilisateur, email, prenom, nom, role, est_actif, derniere_connexion, cree_le, modifie_le) FROM stdin;
\.


--
-- Name: agences agences_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agences
    ADD CONSTRAINT agences_code_key UNIQUE (code);


--
-- Name: agences agences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agences
    ADD CONSTRAINT agences_pkey PRIMARY KEY (id);


--
-- Name: conge conge_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conge
    ADD CONSTRAINT conge_pkey PRIMARY KEY (id);


--
-- Name: contracts contracts_contract_ref_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_contract_ref_key UNIQUE (contract_ref);


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);


--
-- Name: contrat contrat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrat
    ADD CONSTRAINT contrat_pkey PRIMARY KEY (id);


--
-- Name: contrat contrat_reference_contrat_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrat
    ADD CONSTRAINT contrat_reference_contrat_key UNIQUE (reference_contrat);


--
-- Name: contrats contrats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrats
    ADD CONSTRAINT contrats_pkey PRIMARY KEY (id);


--
-- Name: contrats contrats_reference_contrat_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrats
    ADD CONSTRAINT contrats_reference_contrat_key UNIQUE (reference_contrat);


--
-- Name: demandes_conges demandes_conges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes_conges
    ADD CONSTRAINT demandes_conges_pkey PRIMARY KEY (id);


--
-- Name: departement departement_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departement
    ADD CONSTRAINT departement_code_key UNIQUE (code);


--
-- Name: departement departement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departement
    ADD CONSTRAINT departement_pkey PRIMARY KEY (id);


--
-- Name: departments departments_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key UNIQUE (code);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: details_personnels details_personnels_numero_cnib_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.details_personnels
    ADD CONSTRAINT details_personnels_numero_cnib_key UNIQUE (numero_cnib);


--
-- Name: details_personnels details_personnels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.details_personnels
    ADD CONSTRAINT details_personnels_pkey PRIMARY KEY (employe_id);


--
-- Name: directions_departements directions_departements_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directions_departements
    ADD CONSTRAINT directions_departements_code_key UNIQUE (code);


--
-- Name: directions_departements directions_departements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directions_departements
    ADD CONSTRAINT directions_departements_pkey PRIMARY KEY (id);


--
-- Name: document_employe document_employe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_employe
    ADD CONSTRAINT document_employe_pkey PRIMARY KEY (id);


--
-- Name: documents_agents documents_agents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents_agents
    ADD CONSTRAINT documents_agents_pkey PRIMARY KEY (id);


--
-- Name: emplois emplois_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emplois
    ADD CONSTRAINT emplois_code_key UNIQUE (code);


--
-- Name: emplois emplois_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emplois
    ADD CONSTRAINT emplois_pkey PRIMARY KEY (id);


--
-- Name: employe employe_email_professionnel_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_email_professionnel_key UNIQUE (email_professionnel);


--
-- Name: employe employe_matricule_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_matricule_key UNIQUE (matricule);


--
-- Name: employe employe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_pkey PRIMARY KEY (id);


--
-- Name: employe employe_utilisateur_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_utilisateur_id_key UNIQUE (utilisateur_id);


--
-- Name: employee_allowances employee_allowances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_allowances
    ADD CONSTRAINT employee_allowances_pkey PRIMARY KEY (id);


--
-- Name: employee_assignments employee_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_assignments
    ADD CONSTRAINT employee_assignments_pkey PRIMARY KEY (employee_id);


--
-- Name: employee_documents employee_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_documents
    ADD CONSTRAINT employee_documents_pkey PRIMARY KEY (id);


--
-- Name: employee_external_movements employee_external_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_external_movements
    ADD CONSTRAINT employee_external_movements_pkey PRIMARY KEY (id);


--
-- Name: employee_families employee_families_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_families
    ADD CONSTRAINT employee_families_pkey PRIMARY KEY (employee_id);


--
-- Name: employee_personal_details employee_personal_details_cnib_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_personal_details
    ADD CONSTRAINT employee_personal_details_cnib_number_key UNIQUE (cnib_number);


--
-- Name: employee_personal_details employee_personal_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_personal_details
    ADD CONSTRAINT employee_personal_details_pkey PRIMARY KEY (employee_id);


--
-- Name: employee_rh_notes employee_rh_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_rh_notes
    ADD CONSTRAINT employee_rh_notes_pkey PRIMARY KEY (id);


--
-- Name: employee_tax_exemptions employee_tax_exemptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_tax_exemptions
    ADD CONSTRAINT employee_tax_exemptions_pkey PRIMARY KEY (id);


--
-- Name: employees employees_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_email_key UNIQUE (email);


--
-- Name: employees employees_matricule_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_matricule_key UNIQUE (matricule);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: employees employees_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_key UNIQUE (user_id);


--
-- Name: employes employes_email_professionnel_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_email_professionnel_key UNIQUE (email_professionnel);


--
-- Name: employes employes_matricule_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_matricule_key UNIQUE (matricule);


--
-- Name: employes employes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_pkey PRIMARY KEY (id);


--
-- Name: employes employes_utilisateur_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_utilisateur_id_key UNIQUE (utilisateur_id);


--
-- Name: exoneration exoneration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exoneration
    ADD CONSTRAINT exoneration_pkey PRIMARY KEY (id);


--
-- Name: exonerations_fiscales exonerations_fiscales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exonerations_fiscales
    ADD CONSTRAINT exonerations_fiscales_pkey PRIMARY KEY (id);


--
-- Name: famille_emp famille_emp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.famille_emp
    ADD CONSTRAINT famille_emp_pkey PRIMARY KEY (employe_id);


--
-- Name: fonction fonction_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fonction
    ADD CONSTRAINT fonction_code_key UNIQUE (code);


--
-- Name: fonction fonction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fonction
    ADD CONSTRAINT fonction_pkey PRIMARY KEY (id);


--
-- Name: fonctions fonctions_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fonctions
    ADD CONSTRAINT fonctions_code_key UNIQUE (code);


--
-- Name: fonctions fonctions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fonctions
    ADD CONSTRAINT fonctions_pkey PRIMARY KEY (id);


--
-- Name: grilles_salariale grilles_salariale_categorie_echelle_echelon_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grilles_salariale
    ADD CONSTRAINT grilles_salariale_categorie_echelle_echelon_key UNIQUE (categorie, echelle, echelon);


--
-- Name: grilles_salariale grilles_salariale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grilles_salariale
    ADD CONSTRAINT grilles_salariale_pkey PRIMARY KEY (id);


--
-- Name: grilles_salariales grilles_salariales_categorie_echelle_echelon_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grilles_salariales
    ADD CONSTRAINT grilles_salariales_categorie_echelle_echelon_key UNIQUE (categorie, echelle, echelon);


--
-- Name: grilles_salariales grilles_salariales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grilles_salariales
    ADD CONSTRAINT grilles_salariales_pkey PRIMARY KEY (id);


--
-- Name: indemnite indemnite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.indemnite
    ADD CONSTRAINT indemnite_pkey PRIMARY KEY (id);


--
-- Name: indemnites_agents indemnites_agents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.indemnites_agents
    ADD CONSTRAINT indemnites_agents_pkey PRIMARY KEY (id);


--
-- Name: info_personnelle info_personnelle_numero_cnib_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info_personnelle
    ADD CONSTRAINT info_personnelle_numero_cnib_key UNIQUE (numero_cnib);


--
-- Name: info_personnelle info_personnelle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info_personnelle
    ADD CONSTRAINT info_personnelle_pkey PRIMARY KEY (employe_id);


--
-- Name: info_salaire info_salaire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info_salaire
    ADD CONSTRAINT info_salaire_pkey PRIMARY KEY (employe_id);


--
-- Name: informations_salariales informations_salariales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.informations_salariales
    ADD CONSTRAINT informations_salariales_pkey PRIMARY KEY (employe_id);


--
-- Name: internal_movements internal_movements_movement_ref_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internal_movements
    ADD CONSTRAINT internal_movements_movement_ref_key UNIQUE (movement_ref);


--
-- Name: internal_movements internal_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internal_movements
    ADD CONSTRAINT internal_movements_pkey PRIMARY KEY (id);


--
-- Name: job_positions job_positions_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_positions
    ADD CONSTRAINT job_positions_code_key UNIQUE (code);


--
-- Name: job_positions job_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_positions
    ADD CONSTRAINT job_positions_pkey PRIMARY KEY (id);


--
-- Name: leave_requests leave_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_pkey PRIMARY KEY (id);


--
-- Name: note_emp note_emp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.note_emp
    ADD CONSTRAINT note_emp_pkey PRIMARY KEY (id);


--
-- Name: notes_rh notes_rh_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes_rh
    ADD CONSTRAINT notes_rh_pkey PRIMARY KEY (id);


--
-- Name: parametrages parametrages_cle_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parametrages
    ADD CONSTRAINT parametrages_cle_key UNIQUE (cle);


--
-- Name: parametrages_exonerations parametrages_exonerations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parametrages_exonerations
    ADD CONSTRAINT parametrages_exonerations_pkey PRIMARY KEY (id);


--
-- Name: parametrages parametrages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parametrages
    ADD CONSTRAINT parametrages_pkey PRIMARY KEY (id);


--
-- Name: provinces provinces_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_code_key UNIQUE (code);


--
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (id);


--
-- Name: salary_grids salary_grids_category_scale_step_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_grids
    ADD CONSTRAINT salary_grids_category_scale_step_key UNIQUE (category, scale, step);


--
-- Name: salary_grids salary_grids_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_grids
    ADD CONSTRAINT salary_grids_pkey PRIMARY KEY (id);


--
-- Name: salary_information salary_information_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_information
    ADD CONSTRAINT salary_information_pkey PRIMARY KEY (employee_id);


--
-- Name: services services_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_code_key UNIQUE (code);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: situations_familiales situations_familiales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.situations_familiales
    ADD CONSTRAINT situations_familiales_pkey PRIMARY KEY (employe_id);


--
-- Name: type_conges type_conges_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_conges
    ADD CONSTRAINT type_conges_code_key UNIQUE (code);


--
-- Name: type_conges type_conges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_conges
    ADD CONSTRAINT type_conges_pkey PRIMARY KEY (id);


--
-- Name: type_contrat type_contrat_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_contrat
    ADD CONSTRAINT type_contrat_code_key UNIQUE (code);


--
-- Name: type_contrat type_contrat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_contrat
    ADD CONSTRAINT type_contrat_pkey PRIMARY KEY (id);


--
-- Name: type_indemnite type_indemnite_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_indemnite
    ADD CONSTRAINT type_indemnite_code_key UNIQUE (code);


--
-- Name: type_indemnite type_indemnite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_indemnite
    ADD CONSTRAINT type_indemnite_pkey PRIMARY KEY (id);


--
-- Name: types_contrats types_contrats_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.types_contrats
    ADD CONSTRAINT types_contrats_code_key UNIQUE (code);


--
-- Name: types_contrats types_contrats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.types_contrats
    ADD CONSTRAINT types_contrats_pkey PRIMARY KEY (id);


--
-- Name: types_indemnites types_indemnites_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.types_indemnites
    ADD CONSTRAINT types_indemnites_code_key UNIQUE (code);


--
-- Name: types_indemnites types_indemnites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.types_indemnites
    ADD CONSTRAINT types_indemnites_pkey PRIMARY KEY (id);


--
-- Name: types_stages types_stages_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.types_stages
    ADD CONSTRAINT types_stages_code_key UNIQUE (code);


--
-- Name: types_stages types_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.types_stages
    ADD CONSTRAINT types_stages_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: utilisateur utilisateur_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_email_key UNIQUE (email);


--
-- Name: utilisateur utilisateur_nom_utilisateur_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_nom_utilisateur_key UNIQUE (nom_utilisateur);


--
-- Name: utilisateur utilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (id);


--
-- Name: utilisateurs utilisateurs_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_email_key UNIQUE (email);


--
-- Name: utilisateurs utilisateurs_nom_utilisateur_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_nom_utilisateur_key UNIQUE (nom_utilisateur);


--
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (id);


--
-- Name: zones zones_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_code_key UNIQUE (code);


--
-- Name: zones zones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_pkey PRIMARY KEY (id);


--
-- Name: agences agences_code_key; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.agences
    ADD CONSTRAINT agences_code_key UNIQUE (code);


--
-- Name: agences agences_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.agences
    ADD CONSTRAINT agences_pkey PRIMARY KEY (id);


--
-- Name: conge conge_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.conge
    ADD CONSTRAINT conge_pkey PRIMARY KEY (id);


--
-- Name: contrat contrat_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.contrat
    ADD CONSTRAINT contrat_pkey PRIMARY KEY (id);


--
-- Name: contrat contrat_reference_contrat_key; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.contrat
    ADD CONSTRAINT contrat_reference_contrat_key UNIQUE (reference_contrat);


--
-- Name: departement departement_code_key; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.departement
    ADD CONSTRAINT departement_code_key UNIQUE (code);


--
-- Name: departement departement_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.departement
    ADD CONSTRAINT departement_pkey PRIMARY KEY (id);


--
-- Name: document_employe document_employe_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.document_employe
    ADD CONSTRAINT document_employe_pkey PRIMARY KEY (id);


--
-- Name: employe employe_email_professionnel_key; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.employe
    ADD CONSTRAINT employe_email_professionnel_key UNIQUE (email_professionnel);


--
-- Name: employe employe_matricule_key; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.employe
    ADD CONSTRAINT employe_matricule_key UNIQUE (matricule);


--
-- Name: employe employe_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.employe
    ADD CONSTRAINT employe_pkey PRIMARY KEY (id);


--
-- Name: employe employe_utilisateur_id_key; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.employe
    ADD CONSTRAINT employe_utilisateur_id_key UNIQUE (utilisateur_id);


--
-- Name: exoneration exoneration_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.exoneration
    ADD CONSTRAINT exoneration_pkey PRIMARY KEY (id);


--
-- Name: famille_emp famille_emp_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.famille_emp
    ADD CONSTRAINT famille_emp_pkey PRIMARY KEY (employe_id);


--
-- Name: fonction fonction_code_key; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.fonction
    ADD CONSTRAINT fonction_code_key UNIQUE (code);


--
-- Name: fonction fonction_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.fonction
    ADD CONSTRAINT fonction_pkey PRIMARY KEY (id);


--
-- Name: grilles_salariale grilles_salariale_categorie_echelle_echelon; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.grilles_salariale
    ADD CONSTRAINT grilles_salariale_categorie_echelle_echelon UNIQUE (categorie, echelle, echelon);


--
-- Name: grilles_salariale grilles_salariale_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.grilles_salariale
    ADD CONSTRAINT grilles_salariale_pkey PRIMARY KEY (id);


--
-- Name: indemnite indemnite_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.indemnite
    ADD CONSTRAINT indemnite_pkey PRIMARY KEY (id);


--
-- Name: info_personnelle info_personnelle_cnib_key; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.info_personnelle
    ADD CONSTRAINT info_personnelle_cnib_key UNIQUE (numero_cnib);


--
-- Name: info_personnelle info_personnelle_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.info_personnelle
    ADD CONSTRAINT info_personnelle_pkey PRIMARY KEY (employe_id);


--
-- Name: info_salaire info_salaire_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.info_salaire
    ADD CONSTRAINT info_salaire_pkey PRIMARY KEY (employe_id);


--
-- Name: note_emp note_emp_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.note_emp
    ADD CONSTRAINT note_emp_pkey PRIMARY KEY (id);


--
-- Name: services services_code_key; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.services
    ADD CONSTRAINT services_code_key UNIQUE (code);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: type_conges type_conges_code_key; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.type_conges
    ADD CONSTRAINT type_conges_code_key UNIQUE (code);


--
-- Name: type_conges type_conges_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.type_conges
    ADD CONSTRAINT type_conges_pkey PRIMARY KEY (id);


--
-- Name: type_contrat type_contrat_code_key; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.type_contrat
    ADD CONSTRAINT type_contrat_code_key UNIQUE (code);


--
-- Name: type_contrat type_contrat_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.type_contrat
    ADD CONSTRAINT type_contrat_pkey PRIMARY KEY (id);


--
-- Name: type_indemnite type_indemnite_code_key; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.type_indemnite
    ADD CONSTRAINT type_indemnite_code_key UNIQUE (code);


--
-- Name: type_indemnite type_indemnite_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.type_indemnite
    ADD CONSTRAINT type_indemnite_pkey PRIMARY KEY (id);


--
-- Name: utilisateur utilisateur_email_key; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.utilisateur
    ADD CONSTRAINT utilisateur_email_key UNIQUE (email);


--
-- Name: utilisateur utilisateur_nom_utilisateur_key; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.utilisateur
    ADD CONSTRAINT utilisateur_nom_utilisateur_key UNIQUE (nom_utilisateur);


--
-- Name: utilisateur utilisateur_pkey; Type: CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (id);


--
-- Name: idx_assignments_dept; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assignments_dept ON public.employee_assignments USING btree (department_id);


--
-- Name: idx_assignments_job; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assignments_job ON public.employee_assignments USING btree (job_position_id);


--
-- Name: idx_conge_employe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_conge_employe ON public.conge USING btree (employe_id);


--
-- Name: idx_conge_statut; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_conge_statut ON public.conge USING btree (statut);


--
-- Name: idx_conges_employe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_conges_employe ON public.demandes_conges USING btree (employe_id);


--
-- Name: idx_conges_periode; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_conges_periode ON public.demandes_conges USING btree (date_debut, date_fin, statut);


--
-- Name: idx_contracts_validity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contracts_validity ON public.contracts USING btree (status, start_date, end_date);


--
-- Name: idx_contrat_employe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contrat_employe ON public.contrat USING btree (employe_id);


--
-- Name: idx_contrat_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contrat_type ON public.contrat USING btree (type_contrat_id);


--
-- Name: idx_contrats_statut; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contrats_statut ON public.contrats USING btree (statut, date_debut, date_fin);


--
-- Name: idx_contrats_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contrats_type ON public.contrats USING btree (type_contrat_id);


--
-- Name: idx_document_employe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_employe ON public.document_employe USING btree (employe_id);


--
-- Name: idx_employe_departement; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employe_departement ON public.employe USING btree (departement_id);


--
-- Name: idx_employe_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employe_email ON public.employe USING btree (email_professionnel);


--
-- Name: idx_employe_fonction; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employe_fonction ON public.employe USING btree (fonction_id);


--
-- Name: idx_employe_matricule; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employe_matricule ON public.employe USING btree (matricule);


--
-- Name: idx_employe_superviseur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employe_superviseur ON public.employe USING btree (superviseur_n1_id);


--
-- Name: idx_employees_matricule; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_matricule ON public.employees USING btree (matricule);


--
-- Name: idx_employees_names; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_names ON public.employees USING btree (last_name, first_name);


--
-- Name: idx_employees_status_search; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_status_search ON public.employees USING btree (status);


--
-- Name: idx_employes_direction; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employes_direction ON public.employes USING btree (direction_id);


--
-- Name: idx_employes_emploi; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employes_emploi ON public.employes USING btree (emploi_id);


--
-- Name: idx_employes_fonction; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employes_fonction ON public.employes USING btree (fonction_id);


--
-- Name: idx_employes_matricule; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employes_matricule ON public.employes USING btree (matricule);


--
-- Name: idx_employes_noms; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employes_noms ON public.employes USING btree (nom, prenom);


--
-- Name: idx_employes_province; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employes_province ON public.employes USING btree (province_id);


--
-- Name: idx_employes_service; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employes_service ON public.employes USING btree (service_id);


--
-- Name: idx_employes_statut; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employes_statut ON public.employes USING btree (statut);


--
-- Name: idx_employes_superviseur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employes_superviseur ON public.employes USING btree (superviseur_n1_id);


--
-- Name: idx_employes_type_contrat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employes_type_contrat ON public.employes USING btree (type_contrat_id);


--
-- Name: idx_employes_type_stage; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employes_type_stage ON public.employes USING btree (type_stage_id);


--
-- Name: idx_employes_zone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employes_zone ON public.employes USING btree (zone_id);


--
-- Name: idx_exoneration_employe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exoneration_employe ON public.exoneration USING btree (employe_id);


--
-- Name: idx_exonerations_employe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exonerations_employe ON public.exonerations_fiscales USING btree (employe_id);


--
-- Name: idx_exonerations_param; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exonerations_param ON public.exonerations_fiscales USING btree (parametrage_exoneration_id);


--
-- Name: idx_indemnite_employe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_indemnite_employe ON public.indemnite USING btree (employe_id);


--
-- Name: idx_indemnite_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_indemnite_type ON public.indemnite USING btree (type_indemnite_id);


--
-- Name: idx_indemnites_employe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_indemnites_employe ON public.indemnites_agents USING btree (employe_id);


--
-- Name: idx_indemnites_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_indemnites_type ON public.indemnites_agents USING btree (type_indemnite_id);


--
-- Name: idx_info_sal_grille; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_info_sal_grille ON public.informations_salariales USING btree (grille_salariale_id);


--
-- Name: idx_leaves_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leaves_employee ON public.leave_requests USING btree (employee_id);


--
-- Name: idx_leaves_period; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leaves_period ON public.leave_requests USING btree (start_date, end_date, status);


--
-- Name: idx_movements_employee_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movements_employee_date ON public.internal_movements USING btree (employee_id, effective_date);


--
-- Name: idx_note_employe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_note_employe ON public.note_emp USING btree (employe_id);


--
-- Name: idx_param_exo_type_ind; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_param_exo_type_ind ON public.parametrages_exonerations USING btree (type_indemnite_id);


--
-- Name: idx_parametrages_categorie; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_parametrages_categorie ON public.parametrages USING btree (categorie);


--
-- Name: idx_salary_info_grid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_salary_info_grid ON public.salary_information USING btree (salary_grid_id);


--
-- Name: idx_services_direction; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_services_direction ON public.services USING btree (direction_id);


--
-- Name: idx_conge_employe; Type: INDEX; Schema: telia; Owner: postgres
--

CREATE INDEX idx_conge_employe ON telia.conge USING btree (employe_id);


--
-- Name: idx_contrat_employe; Type: INDEX; Schema: telia; Owner: postgres
--

CREATE INDEX idx_contrat_employe ON telia.contrat USING btree (employe_id);


--
-- Name: idx_contrat_type; Type: INDEX; Schema: telia; Owner: postgres
--

CREATE INDEX idx_contrat_type ON telia.contrat USING btree (type_contrat_id);


--
-- Name: idx_document_employe; Type: INDEX; Schema: telia; Owner: postgres
--

CREATE INDEX idx_document_employe ON telia.document_employe USING btree (employe_id);


--
-- Name: idx_employe_departement; Type: INDEX; Schema: telia; Owner: postgres
--

CREATE INDEX idx_employe_departement ON telia.employe USING btree (departement_id);


--
-- Name: idx_employe_fonction; Type: INDEX; Schema: telia; Owner: postgres
--

CREATE INDEX idx_employe_fonction ON telia.employe USING btree (fonction_id);


--
-- Name: idx_employe_superviseur; Type: INDEX; Schema: telia; Owner: postgres
--

CREATE INDEX idx_employe_superviseur ON telia.employe USING btree (superviseur_n1_id);


--
-- Name: idx_employe_utilisateur; Type: INDEX; Schema: telia; Owner: postgres
--

CREATE INDEX idx_employe_utilisateur ON telia.employe USING btree (utilisateur_id);


--
-- Name: idx_exoneration_employe; Type: INDEX; Schema: telia; Owner: postgres
--

CREATE INDEX idx_exoneration_employe ON telia.exoneration USING btree (employe_id);


--
-- Name: idx_exoneration_indemnite; Type: INDEX; Schema: telia; Owner: postgres
--

CREATE INDEX idx_exoneration_indemnite ON telia.exoneration USING btree (indemnite_id);


--
-- Name: idx_indemnite_employe; Type: INDEX; Schema: telia; Owner: postgres
--

CREATE INDEX idx_indemnite_employe ON telia.indemnite USING btree (employe_id);


--
-- Name: idx_indemnite_type; Type: INDEX; Schema: telia; Owner: postgres
--

CREATE INDEX idx_indemnite_type ON telia.indemnite USING btree (type_indemnite_id);


--
-- Name: idx_note_employe; Type: INDEX; Schema: telia; Owner: postgres
--

CREATE INDEX idx_note_employe ON telia.note_emp USING btree (employe_id);


--
-- Name: idx_services_departement; Type: INDEX; Schema: telia; Owner: postgres
--

CREATE INDEX idx_services_departement ON telia.services USING btree (departement_id);


--
-- Name: conge conge_approbateur_rh_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conge
    ADD CONSTRAINT conge_approbateur_rh_id_fkey FOREIGN KEY (approbateur_rh_id) REFERENCES public.utilisateur(id) ON DELETE SET NULL;


--
-- Name: conge conge_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conge
    ADD CONSTRAINT conge_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employe(id) ON DELETE CASCADE;


--
-- Name: conge conge_superviseur_n1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conge
    ADD CONSTRAINT conge_superviseur_n1_id_fkey FOREIGN KEY (superviseur_n1_id) REFERENCES public.employe(id) ON DELETE SET NULL;


--
-- Name: conge conge_type_conges_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conge
    ADD CONSTRAINT conge_type_conges_id_fkey FOREIGN KEY (type_conges_id) REFERENCES public.type_conges(id) ON DELETE RESTRICT;


--
-- Name: contracts contracts_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.employee_documents(id) ON DELETE SET NULL;


--
-- Name: contracts contracts_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: contrat contrat_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrat
    ADD CONSTRAINT contrat_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employe(id) ON DELETE CASCADE;


--
-- Name: contrat contrat_type_contrat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrat
    ADD CONSTRAINT contrat_type_contrat_id_fkey FOREIGN KEY (type_contrat_id) REFERENCES public.type_contrat(id) ON DELETE RESTRICT;


--
-- Name: contrats contrats_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrats
    ADD CONSTRAINT contrats_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents_agents(id) ON DELETE SET NULL;


--
-- Name: contrats contrats_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrats
    ADD CONSTRAINT contrats_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employes(id) ON DELETE CASCADE;


--
-- Name: contrats contrats_type_contrat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contrats
    ADD CONSTRAINT contrats_type_contrat_id_fkey FOREIGN KEY (type_contrat_id) REFERENCES public.types_contrats(id) ON DELETE RESTRICT;


--
-- Name: demandes_conges demandes_conges_approbateur_rh_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes_conges
    ADD CONSTRAINT demandes_conges_approbateur_rh_id_fkey FOREIGN KEY (approbateur_rh_id) REFERENCES public.utilisateurs(id) ON DELETE SET NULL;


--
-- Name: demandes_conges demandes_conges_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes_conges
    ADD CONSTRAINT demandes_conges_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employes(id) ON DELETE CASCADE;


--
-- Name: demandes_conges demandes_conges_superviseur_n1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes_conges
    ADD CONSTRAINT demandes_conges_superviseur_n1_id_fkey FOREIGN KEY (superviseur_n1_id) REFERENCES public.employes(id) ON DELETE SET NULL;


--
-- Name: details_personnels details_personnels_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.details_personnels
    ADD CONSTRAINT details_personnels_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employes(id) ON DELETE CASCADE;


--
-- Name: directions_departements directions_departements_structure_parente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directions_departements
    ADD CONSTRAINT directions_departements_structure_parente_id_fkey FOREIGN KEY (structure_parente_id) REFERENCES public.directions_departements(id) ON DELETE SET NULL;


--
-- Name: document_employe document_employe_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_employe
    ADD CONSTRAINT document_employe_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employe(id) ON DELETE CASCADE;


--
-- Name: documents_agents documents_agents_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents_agents
    ADD CONSTRAINT documents_agents_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employes(id) ON DELETE CASCADE;


--
-- Name: employe employe_agences_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_agences_id_fkey FOREIGN KEY (agences_id) REFERENCES public.agences(id) ON DELETE SET NULL;


--
-- Name: employe employe_departement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_departement_id_fkey FOREIGN KEY (departement_id) REFERENCES public.departement(id) ON DELETE SET NULL;


--
-- Name: employe employe_fonction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_fonction_id_fkey FOREIGN KEY (fonction_id) REFERENCES public.fonction(id) ON DELETE SET NULL;


--
-- Name: employe employe_grilles_salariale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_grilles_salariale_id_fkey FOREIGN KEY (grilles_salariale_id) REFERENCES public.grilles_salariale(id) ON DELETE SET NULL;


--
-- Name: employe employe_services_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_services_id_fkey FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE SET NULL;


--
-- Name: employe employe_superviseur_n1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_superviseur_n1_id_fkey FOREIGN KEY (superviseur_n1_id) REFERENCES public.employe(id) ON DELETE SET NULL;


--
-- Name: employe employe_type_contrat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_type_contrat_id_fkey FOREIGN KEY (type_contrat_id) REFERENCES public.type_contrat(id) ON DELETE SET NULL;


--
-- Name: employe employe_utilisateur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employe
    ADD CONSTRAINT employe_utilisateur_id_fkey FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateur(id) ON DELETE SET NULL;


--
-- Name: employee_allowances employee_allowances_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_allowances
    ADD CONSTRAINT employee_allowances_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employee_documents employee_documents_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_documents
    ADD CONSTRAINT employee_documents_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employee_families employee_families_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_families
    ADD CONSTRAINT employee_families_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employee_personal_details employee_personal_details_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_personal_details
    ADD CONSTRAINT employee_personal_details_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employee_rh_notes employee_rh_notes_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_rh_notes
    ADD CONSTRAINT employee_rh_notes_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: employee_rh_notes employee_rh_notes_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_rh_notes
    ADD CONSTRAINT employee_rh_notes_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employee_tax_exemptions employee_tax_exemptions_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_tax_exemptions
    ADD CONSTRAINT employee_tax_exemptions_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employees employees_n1_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_n1_supervisor_id_fkey FOREIGN KEY (n1_supervisor_id) REFERENCES public.employees(id) ON DELETE SET NULL;


--
-- Name: employees employees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: employes employes_direction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_direction_id_fkey FOREIGN KEY (direction_id) REFERENCES public.directions_departements(id) ON DELETE SET NULL;


--
-- Name: employes employes_emploi_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_emploi_id_fkey FOREIGN KEY (emploi_id) REFERENCES public.emplois(id) ON DELETE SET NULL;


--
-- Name: employes employes_fonction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_fonction_id_fkey FOREIGN KEY (fonction_id) REFERENCES public.fonctions(id) ON DELETE SET NULL;


--
-- Name: employes employes_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(id) ON DELETE SET NULL;


--
-- Name: employes employes_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL;


--
-- Name: employes employes_superviseur_n1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_superviseur_n1_id_fkey FOREIGN KEY (superviseur_n1_id) REFERENCES public.employes(id) ON DELETE SET NULL;


--
-- Name: employes employes_type_contrat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_type_contrat_id_fkey FOREIGN KEY (type_contrat_id) REFERENCES public.types_contrats(id) ON DELETE SET NULL;


--
-- Name: employes employes_type_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_type_stage_id_fkey FOREIGN KEY (type_stage_id) REFERENCES public.types_stages(id) ON DELETE SET NULL;


--
-- Name: employes employes_utilisateur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_utilisateur_id_fkey FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateurs(id) ON DELETE SET NULL;


--
-- Name: employes employes_zone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.zones(id) ON DELETE SET NULL;


--
-- Name: exoneration exoneration_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exoneration
    ADD CONSTRAINT exoneration_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employe(id) ON DELETE CASCADE;


--
-- Name: exoneration exoneration_type_indemnite_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exoneration
    ADD CONSTRAINT exoneration_type_indemnite_id_fkey FOREIGN KEY (type_indemnite_id) REFERENCES public.type_indemnite(id) ON DELETE SET NULL;


--
-- Name: exonerations_fiscales exonerations_fiscales_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exonerations_fiscales
    ADD CONSTRAINT exonerations_fiscales_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employes(id) ON DELETE CASCADE;


--
-- Name: exonerations_fiscales exonerations_fiscales_parametrage_exoneration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exonerations_fiscales
    ADD CONSTRAINT exonerations_fiscales_parametrage_exoneration_id_fkey FOREIGN KEY (parametrage_exoneration_id) REFERENCES public.parametrages_exonerations(id) ON DELETE RESTRICT;


--
-- Name: famille_emp famille_emp_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.famille_emp
    ADD CONSTRAINT famille_emp_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employe(id) ON DELETE CASCADE;


--
-- Name: indemnite indemnite_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.indemnite
    ADD CONSTRAINT indemnite_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employe(id) ON DELETE CASCADE;


--
-- Name: indemnite indemnite_type_indemnite_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.indemnite
    ADD CONSTRAINT indemnite_type_indemnite_id_fkey FOREIGN KEY (type_indemnite_id) REFERENCES public.type_indemnite(id) ON DELETE RESTRICT;


--
-- Name: indemnites_agents indemnites_agents_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.indemnites_agents
    ADD CONSTRAINT indemnites_agents_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employes(id) ON DELETE CASCADE;


--
-- Name: indemnites_agents indemnites_agents_type_indemnite_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.indemnites_agents
    ADD CONSTRAINT indemnites_agents_type_indemnite_id_fkey FOREIGN KEY (type_indemnite_id) REFERENCES public.types_indemnites(id) ON DELETE RESTRICT;


--
-- Name: info_personnelle info_personnelle_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info_personnelle
    ADD CONSTRAINT info_personnelle_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employe(id) ON DELETE CASCADE;


--
-- Name: info_salaire info_salaire_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info_salaire
    ADD CONSTRAINT info_salaire_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employe(id) ON DELETE CASCADE;


--
-- Name: informations_salariales informations_salariales_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.informations_salariales
    ADD CONSTRAINT informations_salariales_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employes(id) ON DELETE CASCADE;


--
-- Name: informations_salariales informations_salariales_grille_salariale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.informations_salariales
    ADD CONSTRAINT informations_salariales_grille_salariale_id_fkey FOREIGN KEY (grille_salariale_id) REFERENCES public.grilles_salariales(id) ON DELETE SET NULL;


--
-- Name: leave_requests leave_requests_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: leave_requests leave_requests_hr_approver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_hr_approver_id_fkey FOREIGN KEY (hr_approver_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: leave_requests leave_requests_n1_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_n1_supervisor_id_fkey FOREIGN KEY (n1_supervisor_id) REFERENCES public.employees(id) ON DELETE SET NULL;


--
-- Name: note_emp note_emp_auteur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.note_emp
    ADD CONSTRAINT note_emp_auteur_id_fkey FOREIGN KEY (auteur_id) REFERENCES public.utilisateur(id) ON DELETE RESTRICT;


--
-- Name: note_emp note_emp_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.note_emp
    ADD CONSTRAINT note_emp_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employe(id) ON DELETE CASCADE;


--
-- Name: notes_rh notes_rh_auteur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes_rh
    ADD CONSTRAINT notes_rh_auteur_id_fkey FOREIGN KEY (auteur_id) REFERENCES public.utilisateurs(id) ON DELETE RESTRICT;


--
-- Name: notes_rh notes_rh_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes_rh
    ADD CONSTRAINT notes_rh_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employes(id) ON DELETE CASCADE;


--
-- Name: parametrages_exonerations parametrages_exonerations_type_indemnite_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parametrages_exonerations
    ADD CONSTRAINT parametrages_exonerations_type_indemnite_id_fkey FOREIGN KEY (type_indemnite_id) REFERENCES public.types_indemnites(id) ON DELETE CASCADE;


--
-- Name: salary_information salary_information_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_information
    ADD CONSTRAINT salary_information_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: salary_information salary_information_salary_grid_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_information
    ADD CONSTRAINT salary_information_salary_grid_id_fkey FOREIGN KEY (salary_grid_id) REFERENCES public.salary_grids(id) ON DELETE SET NULL;


--
-- Name: services services_direction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_direction_id_fkey FOREIGN KEY (direction_id) REFERENCES public.directions_departements(id) ON DELETE SET NULL;


--
-- Name: situations_familiales situations_familiales_employe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.situations_familiales
    ADD CONSTRAINT situations_familiales_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES public.employes(id) ON DELETE CASCADE;


--
-- Name: conge conge_approbateur_rh_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.conge
    ADD CONSTRAINT conge_approbateur_rh_id_fkey FOREIGN KEY (approbateur_rh_id) REFERENCES telia.utilisateur(id) ON DELETE SET NULL;


--
-- Name: conge conge_employe_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.conge
    ADD CONSTRAINT conge_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;


--
-- Name: conge conge_type_conges_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.conge
    ADD CONSTRAINT conge_type_conges_id_fkey FOREIGN KEY (type_conges_id) REFERENCES telia.type_conges(id) ON DELETE RESTRICT;


--
-- Name: contrat contrat_document_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.contrat
    ADD CONSTRAINT contrat_document_id_fkey FOREIGN KEY (document_id) REFERENCES telia.document_employe(id) ON DELETE SET NULL;


--
-- Name: contrat contrat_employe_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.contrat
    ADD CONSTRAINT contrat_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;


--
-- Name: contrat contrat_type_contrat_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.contrat
    ADD CONSTRAINT contrat_type_contrat_id_fkey FOREIGN KEY (type_contrat_id) REFERENCES telia.type_contrat(id) ON DELETE RESTRICT;


--
-- Name: document_employe document_employe_employe_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.document_employe
    ADD CONSTRAINT document_employe_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;


--
-- Name: employe employe_agences_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.employe
    ADD CONSTRAINT employe_agences_id_fkey FOREIGN KEY (agences_id) REFERENCES telia.agences(id) ON DELETE SET NULL;


--
-- Name: employe employe_departement_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.employe
    ADD CONSTRAINT employe_departement_id_fkey FOREIGN KEY (departement_id) REFERENCES telia.departement(id) ON DELETE SET NULL;


--
-- Name: employe employe_fonction_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.employe
    ADD CONSTRAINT employe_fonction_id_fkey FOREIGN KEY (fonction_id) REFERENCES telia.fonction(id) ON DELETE SET NULL;


--
-- Name: employe employe_grilles_salariale_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.employe
    ADD CONSTRAINT employe_grilles_salariale_id_fkey FOREIGN KEY (grilles_salariale_id) REFERENCES telia.grilles_salariale(id) ON DELETE SET NULL;


--
-- Name: employe employe_services_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.employe
    ADD CONSTRAINT employe_services_id_fkey FOREIGN KEY (services_id) REFERENCES telia.services(id) ON DELETE SET NULL;


--
-- Name: employe employe_superviseur_n1_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.employe
    ADD CONSTRAINT employe_superviseur_n1_id_fkey FOREIGN KEY (superviseur_n1_id) REFERENCES telia.employe(id) ON DELETE SET NULL;


--
-- Name: employe employe_utilisateur_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.employe
    ADD CONSTRAINT employe_utilisateur_id_fkey FOREIGN KEY (utilisateur_id) REFERENCES telia.utilisateur(id) ON DELETE SET NULL;


--
-- Name: exoneration exoneration_employe_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.exoneration
    ADD CONSTRAINT exoneration_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;


--
-- Name: exoneration exoneration_indemnite_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.exoneration
    ADD CONSTRAINT exoneration_indemnite_id_fkey FOREIGN KEY (indemnite_id) REFERENCES telia.indemnite(id) ON DELETE SET NULL;


--
-- Name: famille_emp famille_emp_employe_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.famille_emp
    ADD CONSTRAINT famille_emp_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;


--
-- Name: indemnite indemnite_employe_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.indemnite
    ADD CONSTRAINT indemnite_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;


--
-- Name: indemnite indemnite_type_indemnite_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.indemnite
    ADD CONSTRAINT indemnite_type_indemnite_id_fkey FOREIGN KEY (type_indemnite_id) REFERENCES telia.type_indemnite(id) ON DELETE RESTRICT;


--
-- Name: info_personnelle info_personnelle_employe_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.info_personnelle
    ADD CONSTRAINT info_personnelle_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;


--
-- Name: info_salaire info_salaire_employe_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.info_salaire
    ADD CONSTRAINT info_salaire_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;


--
-- Name: note_emp note_emp_auteur_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.note_emp
    ADD CONSTRAINT note_emp_auteur_id_fkey FOREIGN KEY (auteur_id) REFERENCES telia.utilisateur(id) ON DELETE RESTRICT;


--
-- Name: note_emp note_emp_employe_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.note_emp
    ADD CONSTRAINT note_emp_employe_id_fkey FOREIGN KEY (employe_id) REFERENCES telia.employe(id) ON DELETE CASCADE;


--
-- Name: services services_departement_id_fkey; Type: FK CONSTRAINT; Schema: telia; Owner: postgres
--

ALTER TABLE ONLY telia.services
    ADD CONSTRAINT services_departement_id_fkey FOREIGN KEY (departement_id) REFERENCES telia.departement(id) ON DELETE SET NULL;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: telia; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA telia GRANT ALL ON SEQUENCES TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: telia; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA telia GRANT ALL ON TABLES TO postgres;


--
-- PostgreSQL database dump complete
--

\unrestrict gul0XOhkgLg1dE3QUy8wLoQGUsgMcaDclcoYSXNqPKUpCCMo7BUanhRUUg6cZc4

