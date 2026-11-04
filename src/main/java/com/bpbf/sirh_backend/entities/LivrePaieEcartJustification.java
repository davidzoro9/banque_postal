package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "livre_paie_ecart_justification", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"session_id", "code_rubrique"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LivrePaieEcartJustification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    @Column(name = "code_rubrique", nullable = false, length = 100)
    private String codeRubrique;

    @Column(name = "libelle_rubrique", length = 255)
    private String libelleRubrique;

    @Column(name = "categorie_rubrique", length = 100)
    private String categorieRubrique;

    @Column(name = "montant_actuel", precision = 18, scale = 2)
    private BigDecimal montantActuel;

    @Column(name = "montant_precedent", precision = 18, scale = 2)
    private BigDecimal montantPrecedent;

    @Column(name = "ecart", precision = 18, scale = 2)
    private BigDecimal ecart;

    @Column(name = "pourcentage_variation")
    private Double pourcentageVariation;

    @Column(name = "justification", length = 1000)
    private String justification;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
