-- Migration : Ajout de la colonne montant_autorise dans exoneration_employe
-- Objectif : Stocker la limite théorique d'exonération (taux% × brut_fiscal, plafond)
--            séparément du montant réellement exonéré (min(montant_servi, autorise))
-- Formule guide ResHum DZ : Exo autorisée = MIN(taux% × Brut_Fiscal, Plafond)
-- Date : 2026-09-20

ALTER TABLE exoneration_employe
    ADD COLUMN IF NOT EXISTS montant_autorise DOUBLE PRECISION;

-- Commentaire sur les colonnes
COMMENT ON COLUMN exoneration_employe.montant IS
    'Montant réellement exonéré = min(montant_servi_indemnité, montant_autorisé)';
COMMENT ON COLUMN exoneration_employe.montant_autorise IS
    'Limite théorique autorisée par le CGI = min(taux% × brut_fiscal_après_CNSS, plafond)';
