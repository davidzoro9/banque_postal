-- ==============================================================================
-- FLYWAY MIGRATION V5 : INTÉGRITÉ STRICTE & PRÉVENTION DES DOUBLONS DE BULLETINS
-- ==============================================================================
-- 1. Nettoyage préventif des éventuels doublons résiduels (bulletin_line puis bulletin)
-- 2. Création de la contrainte UNIQUE physique sur (session_paie_id, employee_id)
-- ==============================================================================

-- 1. Supprimer les lignes des bulletins en doublon s'il en reste (en ne gardant que le premier ID)
DELETE FROM bulletin_line
WHERE bulletin_id IN (
    SELECT id FROM bulletin
    WHERE id NOT IN (
        SELECT MIN(id)
        FROM bulletin
        WHERE session_paie_id IS NOT NULL AND employee_id IS NOT NULL
        GROUP BY session_paie_id, employee_id
    )
    AND session_paie_id IS NOT NULL AND employee_id IS NOT NULL
);

-- 2. Supprimer les bulletins en doublon
DELETE FROM bulletin
WHERE id NOT IN (
    SELECT MIN(id)
    FROM bulletin
    WHERE session_paie_id IS NOT NULL AND employee_id IS NOT NULL
    GROUP BY session_paie_id, employee_id
)
AND session_paie_id IS NOT NULL AND employee_id IS NOT NULL;

-- 3. Poser la contrainte d'intégrité UNIQUE
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_bulletin_session_employee'
    ) THEN
        ALTER TABLE bulletin
        ADD CONSTRAINT uk_bulletin_session_employee UNIQUE (session_paie_id, employee_id);
    END IF;
END $$;
