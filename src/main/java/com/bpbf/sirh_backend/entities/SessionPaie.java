package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "session_paie", uniqueConstraints = @UniqueConstraint(columnNames = {"mois", "annee"}))
public class SessionPaie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String codeSession;

    @Column(nullable = false, length = 20)
    private String mois;

    @Column(nullable = false)
    private Integer annee;

    @Column(nullable = false, length = 50)
    private String periode;

    @Column(length = 50)
    private String typeSession; // PAIE_NORMALE, RAPPEL, GRATIFICATION

    @Column(nullable = false, length = 20)
    private String statut; // BROUILLON, GENERE, VALIDE, CLOTURE

    private Integer nombreEmployes;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalMasseSalariale;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalBrut;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalNet;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalRetenues;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalCotisationsPatronales;

    private LocalDateTime dateCreation;
    private LocalDateTime dateValidation;
    private LocalDateTime dateCloture;

    private String creePar;
    private String cloturePar;

    @PrePersist
    public void onCreate() {
        if (this.dateCreation == null) {
            this.dateCreation = LocalDateTime.now();
        }
        if (this.statut == null) {
            this.statut = "BROUILLON";
        }
    }
}
