-- =========================================================================
-- SEED OFFICIEL BPBF : 28 POSTES (EMPLOIS) ET 37 FONCTIONS DE NOMINATION
-- Ordre conforme à l'organigramme et au fichier officiel POSTES.xlsx (65 lignes)
-- =========================================================================

-- 1. Réparation des séquences PostgreSQL
CREATE SEQUENCE IF NOT EXISTS emploi_id_seq;
ALTER TABLE emploi ALTER COLUMN id SET DEFAULT nextval('emploi_id_seq');
SELECT setval('emploi_id_seq', COALESCE((SELECT MAX(id) FROM emploi), 0) + 1, false);

CREATE SEQUENCE IF NOT EXISTS fonction_id_seq;
ALTER TABLE fonction ALTER COLUMN id SET DEFAULT nextval('fonction_id_seq');
SELECT setval('fonction_id_seq', COALESCE((SELECT MAX(id) FROM fonction), 0) + 1, false);

-- 2. Ajout des colonnes si inexistantes
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='emploi' AND column_name='ordre') THEN
        ALTER TABLE emploi ADD COLUMN ordre INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='emploi' AND column_name='description') THEN
        ALTER TABLE emploi ADD COLUMN description VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='fonction' AND column_name='ordre') THEN
        ALTER TABLE fonction ADD COLUMN ordre INTEGER;
    END IF;
END $$;

-- 3. Insertion / Mise à jour des 28 Postes Métiers (Emplois)
INSERT INTO emploi (code, name, description, ordre) VALUES
('P-01', 'Agent Chargé de la Monétique et Digitalisation', 'Exploitation monétique et services digitaux', 1),
('P-02', 'Agent de Liaison', 'Courrier, transmission et liaisons administratives', 2),
('P-03', 'Assistant Moyens Généraux', 'Logistique, entretien et fournitures', 3),
('P-04', 'Assistant Trésorerie', 'Suivi des flux et opérations de trésorerie', 4),
('P-05', 'Assistante Cash point', 'Gestion des points de cash et proximité', 5),
('P-06', 'Assistante de Direction', 'Secrétariat et appui à la direction', 6),
('P-07', 'Assistante Juridique', 'Appui contentieux et secrétariat juridique', 7),
('P-08', 'Auditeur Interne', 'Missions de contrôle et audit des opérations', 8),
('P-09', 'Auditeur Junior', 'Contrôles opérationnels et assistance audit', 9),
('P-10', 'Caissier', 'Opérations de guichet, encaissements et décaissements', 10),
('P-11', 'Caissier principal', 'Supervision de la caisse centrale et coffre', 11),
('P-12', 'Chargé clientèle', 'Gestion de portefeuille clients et souscriptions', 12),
('P-13', 'Chargé d''Affaires', 'Développement commercial et crédits entreprises', 13),
('P-14', 'Chargé de la Monétique et Digitalisation', 'Conception et suivi des produits digitaux', 14),
('P-15', 'Chargé de Système Réseau et Sécurité', 'Administration réseau, télécoms et cybersécurité', 15),
('P-16', 'Chargé Marketing et Communication', 'Campagnes, communication interne et externe', 16),
('P-17', 'Chargé Réseau Cash points', 'Déploiement et animation des points cash', 17),
('P-18', 'Chargé Support IT', 'Support helpdesk et maintenance du parc', 18),
('P-19', 'Chargée de la Conformité', 'Contrôle conformité, LAB/FT et éthique', 19),
('P-20', 'Chargée des Opérations Bancaire', 'Back-office et traitement des opérations', 20),
('P-21', 'Chargée des Ressources Humaines', 'Administration du personnel, paie et formation', 21),
('P-22', 'Chargée du Précontentieux', 'Recouvrement amiable et suivi des impayés', 22),
('P-23', 'Chauffeur', 'Transport du personnel et courriers sécurisés', 23),
('P-45', 'Comptable', 'Comptabilité générale, pointage et rapprochements', 45),
('P-46', 'Contrôleur de Gestion', 'Contrôle budgétaire, rentabilité et reporting', 46),
('P-47', 'Contrôleur Permanent', 'Contrôles de second niveau et conformité', 47),
('P-59', 'Gestionnaire Cash point', 'Gestion et approvisionnement des points cash', 59),
('P-65', 'Standardiste', 'Accueil physique, téléphonique et orientation', 65)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  ordre = EXCLUDED.ordre;

-- 4. Insertion / Mise à jour des 37 Fonctions de Direction et Responsabilité
INSERT INTO fonction (code, name, description, type_nomination, actif, ordre) VALUES
('FCT-24', 'Chef d''Agence', 'Direction et animation d''agence bancaire', 'NOMMEE', true, 24),
('FCT-25', 'Chef de service Bases de Données et Applications', 'Pilotage des bases de données et progiciels bancaires', 'NOMMEE', true, 25),
('FCT-26', 'Chef de service Agences', 'Supervision et coordination du réseau d''agences', 'NOMMEE', true, 26),
('FCT-27', 'Chef de service Analyse de Risque de crédit', 'Analyse, étude et notation des risques de crédit', 'NOMMEE', true, 27),
('FCT-28', 'Chef de service Base de Données et Applications', 'Administration et exploitation applicative', 'NOMMEE', true, 28),
('FCT-29', 'Chef de service Capital Humain', 'Pilotage RH, compétences et gestion des carrières', 'NOMMEE', true, 29),
('FCT-30', 'Chef de service Comptabilité et Fiscalité', 'Supervision comptable, états financiers et fiscalité', 'NOMMEE', true, 30),
('FCT-31', 'Chef de service Conformité', 'Surveillance conformité, réglementations et déontologie', 'NOMMEE', true, 31),
('FCT-32', 'Chef de service Controle Permanent', 'Pilotage du dispositif de contrôle permanent', 'NOMMEE', true, 32),
('FCT-33', 'Chef de service Grandes Entreprises', 'Animation commerciale du segment Grandes Entreprises', 'NOMMEE', true, 33),
('FCT-34', 'Chef de service Institutionnels', 'Gestion et développement des relations institutionnelles (1)', 'NOMMEE', true, 34),
('FCT-35', 'Chef de service Institutionnels', 'Gestion et développement des relations institutionnelles (2)', 'NOMMEE', true, 35),
('FCT-36', 'Chef de service Monétique et Digitalisation', 'Supervision des produits électroniques et digitaux', 'NOMMEE', true, 36),
('FCT-37', 'Chef de service Moyens Généraux', 'Gestion logistique, approvisionnements et patrimoine', 'NOMMEE', true, 37),
('FCT-38', 'Chef de service Opérations avec l''Extérieur', 'Supervision des transferts et commerce international', 'NOMMEE', true, 38),
('FCT-39', 'Chef de service Opérations Domestiques', 'Supervision des compensations et opérations locales', 'NOMMEE', true, 39),
('FCT-40', 'Chef de service suivi des Engagements et du Précontentieux', 'Monitoring des encours et recouvrement amiable', 'NOMMEE', true, 40),
('FCT-41', 'Chef de service Supports', 'Supervision du support utilisateur et maintenance', 'NOMMEE', true, 41),
('FCT-42', 'Chef de service Système et Réseau', 'Infrastructures serveurs, télécoms et réseaux', 'NOMMEE', true, 42),
('FCT-43', 'Chef de service TPE-PME/PMI', 'Financement et animation commerciale TPE / PME-PMI', 'NOMMEE', true, 43),
('FCT-44', 'Chef de Zone', 'Supervision d''une zone géographique ou pôle d''agences', 'NOMMEE', true, 44),
('FCT-48', 'Directeur Financier et Comptable', 'Direction des finances, trésorerie et comptabilité', 'NOMMEE', true, 48),
('FCT-49', 'Directeur Administration et Moyens Généraux', 'Direction administrative, patrimoine et RH', 'NOMMEE', true, 49),
('FCT-50', 'Directeur de l''Audit Interne', 'Direction de l''audit interne et contrôle périodique', 'NOMMEE', true, 50),
('FCT-51', 'Directeur des Engagements', 'Direction des crédits, analyse et recouvrement', 'NOMMEE', true, 51),
('FCT-52', 'Directeur des Entreprises et Institutionnels', 'Direction commerciale entreprises et institutionnels', 'NOMMEE', true, 52),
('FCT-53', 'Directeur des Opérations Bancaires', 'Direction du traitement des opérations bancaires', 'NOMMEE', true, 53),
('FCT-54', 'Directeur des Risques et de la Conformité', 'Direction globale de la gestion des risques et conformité', 'NOMMEE', true, 54),
('FCT-55', 'Directeur des Systèmes d''Information', 'Direction générale des technologies et systèmes d''information', 'NOMMEE', true, 55),
('FCT-56', 'Directeur du Réseau', 'Direction du réseau d''agences et points de vente', 'NOMMEE', true, 56),
('FCT-57', 'Directeur Général', 'Direction générale de la banque BPBF', 'NOMMEE', true, 57),
('FCT-58', 'Directeur Général Adjoint', 'Direction générale adjointe et coordination des opérations', 'NOMMEE', true, 58),
('FCT-60', 'Responsable de la Trésorerie', 'Pilotage du département Trésorerie', 'NOMMEE', true, 60),
('FCT-61', 'Responsable des Affaires Juridiques et Contentieux', 'Pilotage de la direction juridique et contentieux', 'NOMMEE', true, 61),
('FCT-62', 'Responsable des Engagements', 'Coordination des engagements et comités de crédit', 'NOMMEE', true, 62),
('FCT-63', 'Chef de service Risques', 'Supervision de l''analyse et surveillance des risques', 'NOMMEE', true, 63),
('FCT-64', 'Responsable Marketing et Communication', 'Pilotage du département Marketing et communication', 'NOMMEE', true, 64)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  type_nomination = EXCLUDED.type_nomination,
  actif = EXCLUDED.actif,
  ordre = EXCLUDED.ordre;

-- 5. Mise à jour finale de la séquence pour éviter les conflits d'auto-incrément
SELECT setval('emploi_id_seq', COALESCE((SELECT MAX(id) FROM emploi), 0) + 1, false);
SELECT setval('fonction_id_seq', COALESCE((SELECT MAX(id) FROM fonction), 0) + 1, false);
