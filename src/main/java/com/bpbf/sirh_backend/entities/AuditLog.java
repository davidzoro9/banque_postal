package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "date_heure", nullable = false, updatable = false)
    private LocalDateTime dateHeure;

    @Column(name = "utilisateur", length = 100)
    private String utilisateur;

    @Column(name = "action", nullable = false, length = 100)
    private String action; // ex: CALCUL_PAIE, VALIDATION_SESSION, CLOTURE_SESSION, MODIF_SALAIRE, MODIF_RIB, EXPORT_ETAT

    @Column(name = "entite", length = 100)
    private String entite; // ex: SessionPaie, Bulletin, Employee, GrilleSalariale

    @Column(name = "entite_id")
    private Long entiteId;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "ip_adresse", length = 50)
    private String ipAdresse;

    @Column(name = "statut", length = 20)
    @Builder.Default
    private String statut = "SUCCES"; // SUCCES, ECHEC, ATTENTION
}
