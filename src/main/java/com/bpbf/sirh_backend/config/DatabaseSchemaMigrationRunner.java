package com.bpbf.sirh_backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class DatabaseSchemaMigrationRunner implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        log.info("Vérification et élargissement automatique des colonnes de session_paie...");
        try {
            jdbcTemplate.execute("ALTER TABLE session_paie ALTER COLUMN periode TYPE VARCHAR(255)");
            jdbcTemplate.execute("ALTER TABLE session_paie ALTER COLUMN name TYPE VARCHAR(255)");
            jdbcTemplate.execute("ALTER TABLE session_paie ALTER COLUMN code_session TYPE VARCHAR(100)");
            jdbcTemplate.execute("ALTER TABLE session_paie ALTER COLUMN type_session TYPE VARCHAR(100)");
            jdbcTemplate.execute("ALTER TABLE session_paie ALTER COLUMN nature_session TYPE VARCHAR(100)");
            log.info("Colonnes session_paie élargies avec succès (VARCHAR 255/100).");
        } catch (Exception e) {
            log.warn("Migration colonnes session_paie (non bloquant): {}", e.getMessage());
        }

        try {
            jdbcTemplate.execute("ALTER TABLE bulletin ALTER COLUMN type_session TYPE VARCHAR(100)");
            jdbcTemplate.execute("ALTER TABLE bulletin ALTER COLUMN nature_session TYPE VARCHAR(100)");
        } catch (Exception e) {
            log.debug("Migration colonnes bulletin (non bloquant): {}", e.getMessage());
        }

        try {
            jdbcTemplate.execute("ALTER TABLE type_absence_conge ADD COLUMN IF NOT EXISTS categorie VARCHAR(50)");
            jdbcTemplate.execute("ALTER TABLE type_absence_conge ADD COLUMN IF NOT EXISTS sexe_requis VARCHAR(20)");
            jdbcTemplate.execute("ALTER TABLE type_absence_conge ADD COLUMN IF NOT EXISTS description VARCHAR(500)");
            
            jdbcTemplate.execute("INSERT INTO type_absence_conge (code, name, deductible_du_solde, duree_max_legale_jours, categorie, sexe_requis) " +
                    "SELECT 'ACCIDENT_TRAVAIL', 'Accident de travail / de trajet', false, 90, 'ABSENCE', 'TOUS' " +
                    "WHERE NOT EXISTS (SELECT 1 FROM type_absence_conge WHERE code = 'ACCIDENT_TRAVAIL')");
            jdbcTemplate.execute("INSERT INTO type_absence_conge (code, name, deductible_du_solde, duree_max_legale_jours, categorie, sexe_requis) " +
                    "SELECT 'FORCE_MAJEURE', 'Cas de force majeure / Urgence familiale', false, 5, 'ABSENCE', 'TOUS' " +
                    "WHERE NOT EXISTS (SELECT 1 FROM type_absence_conge WHERE code = 'FORCE_MAJEURE')");
        } catch (Exception e) {
            log.warn("Seeding types urgence absence: {}", e.getMessage());
        }

        try {
            jdbcTemplate.execute("ALTER TABLE conge ALTER COLUMN justificatif TYPE TEXT");
            jdbcTemplate.execute("ALTER TABLE conge ADD COLUMN IF NOT EXISTS justificatif_nom VARCHAR(255)");
            log.info("Colonnes conge.justificatif (TEXT) et justificatif_nom vérifiées.");
        } catch (Exception e) {
            log.warn("Migration colonnes conge justificatif (non bloquant): {}", e.getMessage());
        }
    }
}
