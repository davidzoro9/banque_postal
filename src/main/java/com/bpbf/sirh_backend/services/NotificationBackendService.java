package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.NotificationItemDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationBackendService {

    private final JdbcTemplate jdbcTemplate;

    public List<NotificationItemDto> getActiveNotifications() {
        List<NotificationItemDto> list = new ArrayList<>();
        String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);

        // 1. Demandes de congés en attente de workflow (Intérim, Visa N+1 ou Contrôle DRH)
        try {
            Long congesCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM conge WHERE UPPER(statut) LIKE '%EN_ATTENTE%' OR UPPER(statut) = 'SOUMIS'",
                Long.class
            );
            if (congesCount != null && congesCount > 0) {
                list.add(NotificationItemDto.builder()
                    .id("notif-conges-" + congesCount)
                    .title(congesCount + " demande" + (congesCount > 1 ? "s" : "") + " de congés en attente")
                    .message("Vous avez " + congesCount + " demande" + (congesCount > 1 ? "s" : "") + " de congé dans le workflow de validation")
                    .type("warning")
                    .read(false)
                    .date(today)
                    .icon("event_available")
                    .route("/grh/conges")
                    .build());
            }
        } catch (Exception e) {
            log.warn("Erreur comptage congés en attente : {}", e.getMessage());
        }

        // 1.b Alerte Règle BCEAO : Suspension accès SI la veille du départ
        try {
            Long siCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM conge WHERE poste_sensible_bceao = true AND statut_si = 'A_SUSPENDRE' " +
                "AND statut = 'APPROUVE' AND CAST(date_debut AS DATE) <= (CURRENT_DATE + INTERVAL '2 days') " +
                "AND CAST(date_fin AS DATE) >= CURRENT_DATE",
                Long.class
            );
            if (siCount != null && siCount > 0) {
                list.add(NotificationItemDto.builder()
                    .id("notif-bceao-si-" + siCount)
                    .title("Sécurité SI (BCEAO) : Suspension d'accès requise")
                    .message(siCount + " collaborateur(s) sur poste sensible partent en congé. Suspension des accès requise la veille.")
                    .type("warning")
                    .read(false)
                    .date(today)
                    .icon("security")
                    .route("/grh/conges")
                    .build());
            }
        } catch (Exception e) {
            log.debug("Comptage alertes SI BCEAO ignoré: {}", e.getMessage());
        }

        // 1.c Demandes de bulletins RH formulées depuis Mon Espace
        try {
            Long demBullCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM demande_bulletin WHERE UPPER(statut) LIKE '%EN_ATTENTE%'",
                Long.class
            );
            if (demBullCount != null && demBullCount > 0) {
                list.add(NotificationItemDto.builder()
                    .id("notif-dem-bulletin-" + demBullCount)
                    .title(demBullCount + " demande" + (demBullCount > 1 ? "s" : "") + " de bulletin RH")
                    .message(demBullCount + " collaborateur(s) ont formulé une demande de bulletin dans leur espace")
                    .type("info")
                    .read(false)
                    .date(today)
                    .icon("mark_email_unread")
                    .route("/paie/bulletins")
                    .build());
            }
        } catch (Exception e) {
            log.debug("Comptage demandes bulletins ignoré : {}", e.getMessage());
        }

        // 2. Contrats arrivant à échéance sous 30 jours
        try {
            Long contratsCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM contrat WHERE date_fin IS NOT NULL AND date_fin <> '' " +
                "AND CAST(date_fin AS DATE) >= CURRENT_DATE AND CAST(date_fin AS DATE) <= (CURRENT_DATE + INTERVAL '30 days')",
                Long.class
            );
            if (contratsCount != null && contratsCount > 0) {
                list.add(NotificationItemDto.builder()
                    .id("notif-contrats-" + contratsCount)
                    .title(contratsCount + " contrat" + (contratsCount > 1 ? "s" : "") + " arrivant à échéance")
                    .message(contratsCount + " contrat" + (contratsCount > 1 ? "s" : "") + " expire" + (contratsCount > 1 ? "nt" : "") + " dans les 30 prochains jours")
                    .type("warning")
                    .read(false)
                    .date(today)
                    .icon("article")
                    .route("/grh/contrats")
                    .build());
            }
        } catch (Exception e) {
            // Si le cast de date_fin échoue sur un format custom, fallback sans crash
            log.debug("Comptage contrats échéance ignoré ou format non standard: {}", e.getMessage());
        }

        // 3. Bulletins de paie générés pour la dernière session
        try {
            Long bulletinsCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM bulletin WHERE session_paie_id = (SELECT MAX(session_paie_id) FROM bulletin)",
                Long.class
            );
            if (bulletinsCount != null && bulletinsCount > 0) {
                list.add(NotificationItemDto.builder()
                    .id("notif-bulletins-" + bulletinsCount)
                    .title("Bulletins de paie générés")
                    .message(bulletinsCount + " bulletin" + (bulletinsCount > 1 ? "s" : "") + " de paie calculé" + (bulletinsCount > 1 ? "s" : "") + " pour la dernière session")
                    .type("success")
                    .read(false)
                    .date(today)
                    .icon("receipt_long")
                    .route("/paie/bulletins")
                    .build());
            }
        } catch (Exception e) {
            log.debug("Comptage bulletins ignoré : {}", e.getMessage());
        }

        // Si aucune notification urgente active, afficher un message d'état normal
        if (list.isEmpty()) {
            list.add(NotificationItemDto.builder()
                .id("notif-all-clear")
                .title("Système à jour")
                .message("Aucune demande de congé urgente ni contrat à échéance")
                .type("info")
                .read(true)
                .date(today)
                .icon("task_alt")
                .route("/grh/grh-overview")
                .build());
        }

        return list;
    }
}
