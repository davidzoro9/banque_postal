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
@Table(name = "trop_percu")
public class TropPercu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salary_element_id")
    private SalaryElement salaryElement;

    @Column(name = "mois_origine", length = 30)
    private String moisOrigine; // Ex: "01/2026" ou "2026-01"

    @Column(name = "mois_application", length = 30, nullable = false)
    private String moisApplication; // Ex: "02/2026" ou "2026-02"

    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(length = 255)
    private String motif;

    @Column(length = 30, nullable = false)
    @Builder.Default
    private String statut = "EN_ATTENTE"; // EN_ATTENTE, APPLIQUE, ANNULE

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @PrePersist
    public void prePersist() {
        if (this.dateCreation == null) {
            this.dateCreation = LocalDateTime.now();
        }
        if (this.statut == null || this.statut.isBlank()) {
            this.statut = "EN_ATTENTE";
        }
    }
}
