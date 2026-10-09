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

        // 4. Initialisation / Seeding des 15 catégories conventionnelles officielles BPBF
        try {
            String[][] categoriesBdd = {
                {"1", "1ère Catégorie (Agents d'exécution)", "GROUPE I : Agents & Employés", "25.0"},
                {"2", "2ème Catégorie (Agents d'exécution)", "GROUPE I : Agents & Employés", "25.0"},
                {"3", "3ème Catégorie (Employés)", "GROUPE I : Agents & Employés", "25.0"},
                {"4", "4ème Catégorie (Employés qualifiés)", "GROUPE I : Agents & Employés", "25.0"},
                {"5", "5ème Catégorie (Employés qualifiés)", "GROUPE I : Agents & Employés", "25.0"},
                {"6", "6ème Catégorie (Employés très qualifiés)", "GROUPE I : Agents & Employés", "25.0"},
                {"7", "7ème Catégorie (Employés très qualifiés)", "GROUPE I : Agents & Employés", "25.0"},
                {"I", "Classe I (Agents de Maîtrise)", "GROUPE II : Maîtrise & Cadres Moyens", "25.0"},
                {"II", "Classe II (Maîtrise & Cadres Moyens)", "GROUPE II : Maîtrise & Cadres Moyens", "20.0"},
                {"III", "Classe III (Maîtrise & Cadres Moyens)", "GROUPE II : Maîtrise & Cadres Moyens", "20.0"},
                {"IV", "Classe IV (Cadres Moyens confirmés)", "GROUPE II : Maîtrise & Cadres Moyens", "20.0"},
                {"V", "Classe V (Cadres)", "GROUPE III : Cadres & Cadres Supérieurs", "20.0"},
                {"VI", "Classe VI (Cadres Supérieurs)", "GROUPE III : Cadres & Cadres Supérieurs", "20.0"},
                {"VII", "Classe VII (Cadres Supérieurs)", "GROUPE III : Cadres & Cadres Supérieurs", "20.0"},
                {"VIII", "Classe VIII (Cadres Dirigeants)", "GROUPE III : Cadres & Cadres Supérieurs", "20.0"}
            };

            for (String[] cat : categoriesBdd) {
                String code = cat[0];
                String libelle = cat[1];
                String description = cat[2];
                Double taux = Double.parseDouble(cat[3]);

                Integer count = jdbcTemplate.queryForObject(
                    "SELECT count(*) FROM categorie WHERE UPPER(TRIM(code)) = ?",
                    Integer.class,
                    code
                );

                if (count == null || count == 0) {
                    jdbcTemplate.update(
                        "INSERT INTO categorie (code, libelle, description, actif, taux_abattement) VALUES (?, ?, ?, true, ?)",
                        code, libelle, description, taux
                    );
                } else {
                    jdbcTemplate.update(
                        "UPDATE categorie SET description = ?, libelle = COALESCE(NULLIF(libelle, ''), ?) WHERE UPPER(TRIM(code)) = ?",
                        description, libelle, code
                    );
                }
            }
            log.info("15 catégories conventionnelles officielles BPBF consolidées dans la table categorie.");
        } catch (Exception e) {
            log.warn("Seeding catégories conventionnelles (non bloquant): {}", e.getMessage());
        }
    }
}
