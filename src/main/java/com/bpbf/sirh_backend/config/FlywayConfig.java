package com.bpbf.sirh_backend.config;

import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            // Répare automatiquement les checksums de flyway_schema_history en cas d'évolution de script
            flyway.repair();
            // Applique les migrations en attente
            flyway.migrate();
        };
    }
}
