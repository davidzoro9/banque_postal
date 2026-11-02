-- ============================================================================
-- V16 : Ajout de la durée de préavis, des 3 états détaillés d'indemnités de rupture
--       et du paramétrage dynamique des taux par tranche d'ancienneté pour licenciement
-- ============================================================================

-- 1. Ajout de la colonne duree_preavis dans la table employee
ALTER TABLE employee ADD COLUMN IF NOT EXISTS duree_preavis integer;

-- 2. Suppression de l'ancien état STC global
DELETE FROM etat_synthese_config WHERE code IN ('ETAT_STC', 'ETAT_SOLDE_TOUT_COMPTE');

-- 3. Insertion / Mise à jour des 3 nouveaux états détaillés de rupture

-- État détaillé indemnité de congé
INSERT INTO etat_synthese_config (
    code, libelle, categorie, description, icon, ordre, actif, is_system, filtre_type
) VALUES (
    'ETAT_INDEMNITE_CONGE',
    'État Détaillé Indemnité de Congé',
    'Indemnités de Rupture',
    'État détaillé de calcul de l''indemnité compensatrice de congés payés par agent : historique des salaires bruts mensuels, solde de jours de congés et indemnité compensatrice.',
    'beach_access',
    9,
    true,
    true,
    'ALL'
) ON CONFLICT (code) DO UPDATE SET 
    libelle = EXCLUDED.libelle,
    categorie = EXCLUDED.categorie,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    ordre = EXCLUDED.ordre,
    actif = EXCLUDED.actif;

-- État détaillé indemnité de licenciement
INSERT INTO etat_synthese_config (
    code, libelle, categorie, description, icon, ordre, actif, is_system, filtre_type
) VALUES (
    'ETAT_INDEMNITE_LICENCIEMENT',
    'État Détaillé Indemnité de Licenciement',
    'Indemnités de Rupture',
    'État détaillé de calcul de l''indemnité légale de licenciement par agent : historique des salaires bruts mensuels, salaire global moyen (SGM), ancienneté et montant calculé.',
    'work_off',
    10,
    true,
    true,
    'ALL'
) ON CONFLICT (code) DO UPDATE SET 
    libelle = EXCLUDED.libelle,
    categorie = EXCLUDED.categorie,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    ordre = EXCLUDED.ordre,
    actif = EXCLUDED.actif;

-- État détaillé indemnité de préavis
INSERT INTO etat_synthese_config (
    code, libelle, categorie, description, icon, ordre, actif, is_system, filtre_type
) VALUES (
    'ETAT_INDEMNITE_PREAVIS',
    'État Détaillé Indemnité de Préavis',
    'Indemnités de Rupture',
    'État détaillé de calcul de l''indemnité compensatrice de préavis par agent : salaire brut moyen mensuel, durée du préavis en mois et montant de l''indemnité.',
    'schedule',
    11,
    true,
    true,
    'ALL'
) ON CONFLICT (code) DO UPDATE SET 
    libelle = EXCLUDED.libelle,
    categorie = EXCLUDED.categorie,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    ordre = EXCLUDED.ordre,
    actif = EXCLUDED.actif;

-- 4. Table des tranches d'ancienneté pour l'indemnité de licenciement
CREATE TABLE IF NOT EXISTS param_tranche_indemnite_licenciement (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    libelle VARCHAR(255) NOT NULL,
    annee_debut INTEGER NOT NULL,
    annee_fin INTEGER,
    taux NUMERIC(5,2) NOT NULL,
    description TEXT,
    ordre INTEGER DEFAULT 1,
    actif BOOLEAN DEFAULT TRUE
);

INSERT INTO param_tranche_indemnite_licenciement (code, libelle, annee_debut, annee_fin, taux, description, ordre, actif)
VALUES 
    ('TRANCHE_1_5', 'De la 1ʳᵉ à la 5ᵉ année', 1, 5, 25.00, '25 % du salaire mensuel par année de service.', 1, true),
    ('TRANCHE_6_10', 'De la 6ᵉ à la 10ᵉ année', 6, 10, 30.00, '30 % du salaire mensuel par année de service.', 2, true),
    ('TRANCHE_11_PLUS', 'Au-delà de la 10ᵉ année (11ᵉ année et plus)', 11, NULL, 40.00, '40 % du salaire mensuel par année de service.', 3, true)
ON CONFLICT (code) DO UPDATE SET 
    libelle = EXCLUDED.libelle,
    annee_debut = EXCLUDED.annee_debut,
    annee_fin = EXCLUDED.annee_fin,
    taux = EXCLUDED.taux,
    description = EXCLUDED.description,
    ordre = EXCLUDED.ordre,
    actif = EXCLUDED.actif;
