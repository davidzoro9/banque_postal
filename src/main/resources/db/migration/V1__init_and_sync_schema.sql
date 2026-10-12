-- ==============================================================================
-- FLYWAY MIGRATION V1 : INITIALISATION ET SYNCHRONISATION DU SCHÉMA SIGRH (BPBF)
-- ==============================================================================
-- Idempotent : Compatible avec les bases existantes (locale et VPS) sans perte de données.
-- ==============================================================================

-- 1. Table des Collaborateurs (employee) : Assurer la présence de toutes les colonnes requises
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'employee') THEN
        -- Identité & État civil
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS matricule VARCHAR(50);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS name VARCHAR(150);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS nom VARCHAR(100);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS prenom VARCHAR(100);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS nom_jeune_fille VARCHAR(100);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS sexe VARCHAR(20);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS date_naissance VARCHAR(30);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS lieu_naissance VARCHAR(100);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS nationalite VARCHAR(50);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS numerocni VARCHAR(50);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS situation_familiale VARCHAR(50);
        
        -- Coordonnées
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS adresse VARCHAR(255);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS ville VARCHAR(100);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS code_postal VARCHAR(20);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS pays VARCHAR(100);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS telephone VARCHAR(50);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS email VARCHAR(150);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS date_embauche VARCHAR(30);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS statut VARCHAR(50);

        -- Données RH & Paie
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS anciennete_reprise INTEGER DEFAULT 0;
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS numero_cnss VARCHAR(50);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS sur_salaire DOUBLE PRECISION DEFAULT 0;
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS vehicule_fourni BOOLEAN DEFAULT FALSE;
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS logement_fourni BOOLEAN DEFAULT FALSE;

        -- Informations Bancaires
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS mode_paiement VARCHAR(50);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS banque VARCHAR(100);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS iban VARCHAR(100);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS intitule_compte VARCHAR(150);

        -- Contact d'urgence
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS contact_urgence_nom VARCHAR(150);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS contact_urgence_telephone VARCHAR(50);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS contact_urgence_lien VARCHAR(50);

        -- Diplômes & Études
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS dernier_diplome VARCHAR(100);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS diplome_recrutement VARCHAR(100);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS branche_etude VARCHAR(150);
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS ecole_universite VARCHAR(150);

        -- Clés étrangères structurelles
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS direction_id BIGINT;
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS department_id BIGINT;
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS service_id BIGINT;
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS agence_id BIGINT;
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS fonction_id BIGINT;
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS emploi_id BIGINT;
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS categorie_id BIGINT;
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS echelon_id BIGINT;
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS grade_id BIGINT;
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS grille_salariale_id BIGINT;
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS regime_securite_social_id BIGINT;
        ALTER TABLE employee ADD COLUMN IF NOT EXISTS superviseur_id BIGINT;
    END IF;
END $$;

-- Index sur employee
CREATE INDEX IF NOT EXISTS idx_employee_matricule ON employee(matricule);
CREATE INDEX IF NOT EXISTS idx_employee_direction ON employee(direction_id);
CREATE INDEX IF NOT EXISTS idx_employee_department ON employee(department_id);
CREATE INDEX IF NOT EXISTS idx_employee_superviseur ON employee(superviseur_id);

-- 2. Table des Membres de la Famille de l'Employé (famille_employe_membre)
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

-- 3. Table des Congés (conge) : Workflow Bancaire à 5 Étapes & Sécurité SI
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conge') THEN
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS employe_nom VARCHAR(255);
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS type_nom VARCHAR(255);
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS motif_refus VARCHAR(1000);
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS solde_avant_demande INTEGER;
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS solde_apres_demande INTEGER;
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS interimaire_id BIGINT;
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS statut_interim VARCHAR(255);
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS date_avis_interim VARCHAR(255);
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS commentaire_interim VARCHAR(1000);
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS visa_n1_par VARCHAR(255);
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS date_visa_n1 VARCHAR(255);
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS commentaire_n1 VARCHAR(1000);
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS visa_drh_par VARCHAR(255);
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS date_visa_drh VARCHAR(255);
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS numero_titre_conge VARCHAR(255);
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS poste_sensible_bceao BOOLEAN DEFAULT FALSE;
        ALTER TABLE conge ADD COLUMN IF NOT EXISTS statut_si VARCHAR(255) DEFAULT 'NON_REQUIS';
    END IF;
END $$;

-- 4. Table des Types d'Absences et Congés (type_absence_conge)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'type_absence_conge') THEN
        ALTER TABLE type_absence_conge ADD COLUMN IF NOT EXISTS categorie VARCHAR(50) DEFAULT 'CONGE';
        ALTER TABLE type_absence_conge ADD COLUMN IF NOT EXISTS sexe_requis VARCHAR(20) DEFAULT 'TOUS';

        -- Mise à niveau des valeurs officielles
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
    END IF;
END $$;

-- 5. Exonérations Employés (exoneration_employe)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'exoneration_employe') THEN
        ALTER TABLE exoneration_employe ADD COLUMN IF NOT EXISTS montant_autorise DOUBLE PRECISION;
    END IF;
END $$;

-- 6. Journal d'Audit Bancaire (audit_log)
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

-- 7. Contraintes de Retenues (CRRAE-UMOA sur Salaire de base + Sur-salaire)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'retenue') THEN
        ALTER TABLE retenue DROP CONSTRAINT IF EXISTS retenue_base_calcul_check;
        ALTER TABLE retenue ADD CONSTRAINT retenue_base_calcul_check CHECK (
            base_calcul::text = ANY (ARRAY['SALAIRE_BASE'::character varying, 'SALAIRE_BASE_SUR_SALAIRE'::character varying, 'REMUNERATION_BRUTE'::character varying, 'BASE_IMPOSABLE'::character varying]::text[])
        );
        UPDATE retenue SET base_calcul = 'SALAIRE_BASE_SUR_SALAIRE' WHERE code = 'RET-005';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'information_salariale_retenue') THEN
        ALTER TABLE information_salariale_retenue DROP CONSTRAINT IF EXISTS information_salariale_retenue_base_calcul_check;
        ALTER TABLE information_salariale_retenue ADD CONSTRAINT information_salariale_retenue_base_calcul_check CHECK (
            base_calcul::text = ANY (ARRAY['SALAIRE_BASE'::character varying, 'SALAIRE_BASE_SUR_SALAIRE'::character varying, 'REMUNERATION_BRUTE'::character varying, 'BASE_IMPOSABLE'::character varying]::text[])
        );
    END IF;
END $$;
