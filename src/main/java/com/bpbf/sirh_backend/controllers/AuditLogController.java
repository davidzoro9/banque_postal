package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.AuditLog;
import com.bpbf.sirh_backend.services.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping("/derniers")
    public ResponseEntity<List<AuditLog>> getDerniersLogs() {
        return ResponseEntity.ok(auditLogService.getDerniersLogs());
    }

    @GetMapping
    public ResponseEntity<Page<AuditLog>> searchLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String utilisateur,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        return ResponseEntity.ok(auditLogService.searchLogs(action, utilisateur, dateDebut, dateFin, page, size));
    }
}
