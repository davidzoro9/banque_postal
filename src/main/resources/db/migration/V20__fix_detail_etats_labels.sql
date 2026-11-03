-- Mise à jour des libellés des états d'indemnité : Détaille -> Détail
UPDATE etat_synthese_config 
SET libelle = 'Détail Indemnité de Congé' 
WHERE code = 'ETAT_INDEMNITE_CONGE';

UPDATE etat_synthese_config 
SET libelle = 'Détail Indemnité de Licenciement' 
WHERE code = 'ETAT_INDEMNITE_LICENCIEMENT';

UPDATE etat_synthese_config 
SET libelle = 'Détail Indemnité de Préavis' 
WHERE code = 'ETAT_INDEMNITE_PREAVIS';

