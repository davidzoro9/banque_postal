package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "demande_bulletin")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandeBulletin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "employee_name")
    private String employeeName;

    private String matricule;

    private String periode;

    private String motif;

    private String urgence;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    private String statut; // EN_ATTENTE_RH, TRAITEE, REJETEE

    @Column(name = "date_demande")
    private LocalDateTime dateDemande;

    @Column(name = "date_traitement")
    private LocalDateTime dateTraitement;

    @Column(name = "traite_par")
    private String traitePar;

    @Column(name = "bulletin_id")
    private Long bulletinId;

    @Column(name = "session_id")
    private Long sessionId;

    @PrePersist
    public void prePersist() {
        if (dateDemande == null) {
            dateDemande = LocalDateTime.now();
        }
        if (statut == null || statut.isBlank()) {
            statut = "EN_ATTENTE_RH";
        }
        if (urgence == null || urgence.isBlank()) {
            urgence = "NORMALE";
        }
    }
}
