-- ==============================================================================
-- TABLE D'AUDIT BANCAIRE (AUDIT TRAIL) — SIGRH BPBF
-- ==============================================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    date_heure TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    utilisateur VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    entite VARCHAR(100),
    entite_id BIGINT,
    details TEXT,
    ip_adresse VARCHAR(50),
    statut VARCHAR(20) DEFAULT 'SUCCES'
);

CREATE INDEX IF NOT EXISTS idx_audit_log_date ON audit_log (date_heure DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log (action);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log (utilisateur);
