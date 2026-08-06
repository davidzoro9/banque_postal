package com.bpbf.sirh_backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin/sql")
@CrossOrigin(origins = "*")
public class SqlQueryController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping
    public ResponseEntity<Map<String, Object>> executeSql(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        String sql = body.get("query");

        if (sql == null || sql.trim().isEmpty()) {
            response.put("error", "La requête SQL ne peut pas être vide.");
            return ResponseEntity.badRequest().body(response);
        }

        String trimmedSql = sql.trim();
        long startTime = System.currentTimeMillis();

        try {
            boolean isSelect = trimmedSql.toUpperCase().startsWith("SELECT") 
                    || trimmedSql.toUpperCase().startsWith("WITH")
                    || trimmedSql.toUpperCase().startsWith("SHOW")
                    || trimmedSql.toUpperCase().startsWith("EXPLAIN");

            if (isSelect) {
                List<Map<String, Object>> rows = jdbcTemplate.queryForList(trimmedSql);
                long duration = System.currentTimeMillis() - startTime;

                Set<String> columns = new LinkedHashSet<>();
                if (!rows.isEmpty()) {
                    columns = rows.get(0).keySet();
                }

                response.put("type", "SELECT");
                response.put("rowCount", rows.size());
                response.put("columns", columns);
                response.put("data", rows);
                response.put("executionTimeMs", duration);
            } else {
                int affectedRows = jdbcTemplate.update(trimmedSql);
                long duration = System.currentTimeMillis() - startTime;

                response.put("type", "MUTATION");
                response.put("affectedRows", affectedRows);
                response.put("message", "Requête exécutée avec succès (" + affectedRows + " ligne(s) modifiée(s)).");
                response.put("executionTimeMs", duration);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            response.put("error", e.getMessage());
            response.put("executionTimeMs", duration);
            return ResponseEntity.badRequest().body(response);
        }
    }
}
