-- Migration : Ajout de SALAIRE_BASE_SUR_SALAIRE pour les retenues (ex: CRRAE-UMOA)
ALTER TABLE retenue DROP CONSTRAINT IF EXISTS retenue_base_calcul_check;
ALTER TABLE retenue ADD CONSTRAINT retenue_base_calcul_check CHECK (base_calcul::text = ANY (ARRAY['SALAIRE_BASE'::character varying, 'SALAIRE_BASE_SUR_SALAIRE'::character varying, 'REMUNERATION_BRUTE'::character varying, 'BASE_IMPOSABLE'::character varying]::text[]));

ALTER TABLE information_salariale_retenue DROP CONSTRAINT IF EXISTS information_salariale_retenue_base_calcul_check;
ALTER TABLE information_salariale_retenue ADD CONSTRAINT information_salariale_retenue_base_calcul_check CHECK (base_calcul::text = ANY (ARRAY['SALAIRE_BASE'::character varying, 'SALAIRE_BASE_SUR_SALAIRE'::character varying, 'REMUNERATION_BRUTE'::character varying, 'BASE_IMPOSABLE'::character varying]::text[]));

-- Positionner la CRRAE-UMOA sur Salaire de base + Sur-salaire
UPDATE retenue SET base_calcul = 'SALAIRE_BASE_SUR_SALAIRE' WHERE code = 'RET-005';
