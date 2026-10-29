-- ==============================================================================
-- FLYWAY MIGRATION V12 : MISE À NIVEAU DU RÉFÉRENTIEL DES CLASSES COMPTABLES
-- Renseignement systématique des colonnes numero et nom (SYSCOHADA)
-- ==============================================================================

UPDATE param_classe_comptable 
SET numero = '6', nom = 'Charges de personnel' 
WHERE code = 'CLASSE_6';

UPDATE param_classe_comptable 
SET numero = '4', nom = 'Comptes de tiers / Dettes' 
WHERE code = 'CLASSE_4';

UPDATE param_classe_comptable 
SET numero = '1', nom = 'Capitaux & Provisions' 
WHERE code = 'CLASSE_1';

UPDATE param_classe_comptable 
SET numero = '5', nom = 'Trésorerie / Banques' 
WHERE code = 'CLASSE_5';

UPDATE param_classe_comptable 
SET numero = '7', nom = 'Produits' 
WHERE code = 'CLASSE_7';

UPDATE param_classe_comptable 
SET numero = '2', nom = 'Actifs immobilisés' 
WHERE code = 'CLASSE_2';

-- Fallback automatique pour toute classe personnalisée qui aurait numero ou nom vide
UPDATE param_classe_comptable
SET numero = TRIM(REPLACE(code, 'CLASSE_', ''))
WHERE (numero IS NULL OR numero = '') AND code LIKE 'CLASSE_%';

UPDATE param_classe_comptable
SET nom = TRIM(SPLIT_PART(libelle, '—', 2))
WHERE (nom IS NULL OR nom = '') AND libelle LIKE '%—%';
