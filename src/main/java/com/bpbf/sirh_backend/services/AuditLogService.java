package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.entities.AuditLog;
import com.bpbf.sirh_backend.repositories.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Enregistre une entrée d'audit dans une transaction indépendante
     * pour garantir que la traçabilité est sauvegardée même en cas d'erreur métier.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public AuditLog logAction(String utilisateur, String action, String entite, Long entiteId, String details, String ipAdresse, String statut) {
        try {
            AuditLog logEntry = AuditLog.builder()
                    .dateHeure(LocalDateTime.now())
                    .utilisateur(utilisateur != null && !utilisateur.isBlank() ? utilisateur : "SYSTEM")
                    .action(action)
                    .entite(entite)
                    .entiteId(entiteId)
                    .details(details)
                    .ipAdresse(ipAdresse != null ? ipAdresse : "127.0.0.1")
                    .statut(statut != null ? statut : "SUCCES")
                    .build();

            AuditLog saved = auditLogRepository.save(logEntry);
            log.info("[AUDIT-TRAIL] Action: {} | Utilisateur: {} | Entité: {}#{} | Statut: {}",
                    action, utilisateur, entite, entiteId, statut);
            return saved;
        } catch (Exception e) {
            log.error("Erreur lors de l'enregistrement de l'audit log : {}", e.getMessage());
            return null;
        }
    }

    public AuditLog logAction(String utilisateur, String action, String entite, Long entiteId, String details) {
        return logAction(utilisateur, action, entite, entiteId, details, "127.0.0.1", "SUCCES");
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getDerniersLogs() {
        return auditLogRepository.findTop100ByOrderByDateHeureDesc();
    }

    @Transactional(readOnly = true)
    public Page<AuditLog> searchLogs(String action, String utilisateur, LocalDateTime dateDebut, LocalDateTime dateFin, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size));
        boolean hasAction = action != null && !action.isBlank();
        boolean hasUser = utilisateur != null && !utilisateur.isBlank();
        boolean hasDebut = dateDebut != null;
        boolean hasFin = dateFin != null;

        if (!hasAction && !hasUser && !hasDebut && !hasFin) {
            return auditLogRepository.findAllByOrderByDateHeureDesc(pageable);
        }

        return auditLogRepository.searchAuditLogs(
                hasAction ? action.trim() : null,
                hasUser ? utilisateur.trim() : null,
                dateDebut,
                dateFin,
                pageable
        );
    }
}
