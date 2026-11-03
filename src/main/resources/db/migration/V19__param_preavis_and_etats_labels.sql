-- ====================================================================
-- V19 : PARAMÉTRAGE DES TAUX / DURÉES DE PRÉAVIS & HARMONISATION DES ÉTATS
-- ====================================================================

-- 1. Table de paramétrage officiel des durées de préavis dans Paramètres Généraux
CREATE TABLE IF NOT EXISTS param_preavis (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    libelle VARCHAR(150) NOT NULL,
    type_personnel VARCHAR(50) NOT NULL,
    duree_mois INTEGER NOT NULL DEFAULT 1,
    description TEXT,
    ordre INTEGER DEFAULT 1,
    actif BOOLEAN DEFAULT TRUE
);

-- Insertion des durées réglementaires par défaut
INSERT INTO param_preavis (code, libelle, type_personnel, duree_mois, description, ordre, actif)
VALUES
    ('PREAVIS_CADRE', 'Préavis Cadres et Dirigeants', 'CADRE', 3, 'Cadres, directeurs, assimilés et chefs de service (3 mois)', 1, TRUE),
    ('PREAVIS_MAITRISE', 'Préavis Agents de Maîtrise', 'MAITRISE', 2, 'Agents de maîtrise et techniciens supérieurs (2 mois)', 2, TRUE),
    ('PREAVIS_NON_CADRE', 'Préavis Non-Cadres et Employés', 'NON_CADRE', 1, 'Employés, ouvriers et personnel d''exécution (1 mois)', 3, TRUE)
ON CONFLICT (code) DO UPDATE SET
    libelle = EXCLUDED.libelle,
    type_personnel = EXCLUDED.type_personnel,
    duree_mois = EXCLUDED.duree_mois,
    description = EXCLUDED.description;

-- 2. Harmonisation des libellés officiels des états de synthèse
UPDATE etat_synthese_config SET libelle = 'Virement des Salaires' WHERE code = 'ETAT_BANQUE';
UPDATE etat_synthese_config SET libelle = 'Retenues IUTS' WHERE code = 'ETAT_IUTS';
UPDATE etat_synthese_config SET libelle = 'Retenue Fonds de Solidarité' WHERE code = 'ETAT_FSP';
UPDATE etat_synthese_config SET libelle = 'Détaille Indemnité de Congé' WHERE code = 'ETAT_INDEMNITE_CONGE';
UPDATE etat_synthese_config SET libelle = 'Détaille Indemnité de Licenciement' WHERE code = 'ETAT_INDEMNITE_LICENCIEMENT';
UPDATE etat_synthese_config SET libelle = 'Détaille Indemnité de Préavis' WHERE code = 'ETAT_INDEMNITE_PREAVIS';

-- Si ces 3 derniers états n'existent pas encore dans etat_synthese_config, les insérer
INSERT INTO etat_synthese_config (code, libelle, categorie, icon, ordre, actif, is_system)
VALUES
    ('ETAT_INDEMNITE_CONGE', 'Détaille Indemnité de Congé', 'Indemnités de Rupture', 'beach_access', 9, TRUE, TRUE),
    ('ETAT_INDEMNITE_LICENCIEMENT', 'Détaille Indemnité de Licenciement', 'Indemnités de Rupture', 'work_off', 10, TRUE, TRUE),
    ('ETAT_INDEMNITE_PREAVIS', 'Détaille Indemnité de Préavis', 'Indemnités de Rupture', 'schedule', 11, TRUE, TRUE)
ON CONFLICT (code) DO UPDATE SET
    libelle = EXCLUDED.libelle,
    categorie = EXCLUDED.categorie,
    icon = EXCLUDED.icon;
