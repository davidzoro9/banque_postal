-- ============================================================================
-- V10 : Ajout de l'état de synthèse officiel du Solde de Tout Compte (STC)
-- Indemnités légales de rupture : Congés acquis (ICCP), Licenciement, Préavis, etc.
-- ============================================================================

DELETE FROM etat_synthese_config WHERE code = 'ETAT_STC';

INSERT INTO etat_synthese_config (
    code,
    libelle,
    categorie,
    description,
    icon,
    ordre,
    actif,
    is_system,
    filtre_type
) VALUES (
    'ETAT_STC',
    'État du Solde de Tout Compte',
    'Indemnités de Rupture',
    'Récapitulatif officiel des indemnités de fin de contrat : indemnité compensatrice de congés payés, indemnité de licenciement ou départ à la retraite, préavis, proratas de gratifications et solde des créances.',
    'gavel',
    18,
    true,
    true,
    'ALL'
);
