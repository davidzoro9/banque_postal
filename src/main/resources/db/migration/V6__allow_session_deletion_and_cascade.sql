-- ==============================================================================
-- FLYWAY MIGRATION V6 : INTÉGRITÉ CASCADE POUR LA SUPPRESSION DE SESSION ET BULLETINS
-- ==============================================================================

-- 1. Index pour accélérer la recherche et suppression des bulletins par session
CREATE INDEX IF NOT EXISTS idx_bulletin_session_paie_id ON bulletin(session_paie_id);
CREATE INDEX IF NOT EXISTS idx_bulletin_line_bulletin_id ON bulletin_line(bulletin_id);

-- 2. Mise à jour des contraintes de clés étrangères pour supporter ON DELETE CASCADE
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Ajustement des FK de bulletin_line pointant vers bulletin pour ajouter ON DELETE CASCADE
    FOR r IN (
        SELECT tc.constraint_name, tc.table_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'bulletin_line'
          AND kcu.column_name = 'bulletin_id'
          AND ccu.table_name = 'bulletin'
    ) LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' DROP CONSTRAINT ' || quote_ident(r.constraint_name);
        EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' ADD CONSTRAINT ' || quote_ident(r.constraint_name) || ' FOREIGN KEY (bulletin_id) REFERENCES bulletin(id) ON DELETE CASCADE';
    END LOOP;

    -- Ajustement des FK de bulletin pointant vers session_paie pour ajouter ON DELETE CASCADE
    FOR r IN (
        SELECT tc.constraint_name, tc.table_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'bulletin'
          AND kcu.column_name = 'session_paie_id'
          AND ccu.table_name = 'session_paie'
    ) LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' DROP CONSTRAINT ' || quote_ident(r.constraint_name);
        EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' ADD CONSTRAINT ' || quote_ident(r.constraint_name) || ' FOREIGN KEY (session_paie_id) REFERENCES session_paie(id) ON DELETE CASCADE';
    END LOOP;
END $$;
