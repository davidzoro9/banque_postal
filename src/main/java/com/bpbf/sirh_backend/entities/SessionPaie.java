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
@Table(name = "session_paie", indexes = {
    @Index(name = "idx_sess_code", columnList = "codeSession"),
    @Index(name = "idx_sess_annee_mois", columnList = "annee, mois")
})
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

    @Column(length = 100)
    private String name; // Nom du lot / session

    private java.time.LocalDate dateFrom;

    private java.time.LocalDate dateTo;

    @Column(nullable = false, length = 20)
    private String statut; // BROUILLON, GENERE, VALIDE, CLOTURE

    private Integer nombreEmployes; // nombre_bulletin

    private Integer nombreValide; // nombre_valide

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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodeSession() { return codeSession; }
    public void setCodeSession(String codeSession) { this.codeSession = codeSession; }

    public String getMois() { return mois; }
    public void setMois(String mois) { this.mois = mois; }

    public Integer getAnnee() { return annee; }
    public void setAnnee(Integer annee) { this.annee = annee; }

    public String getPeriode() { return periode; }
    public void setPeriode(String periode) { this.periode = periode; }

    public String getTypeSession() { return typeSession; }
    public void setTypeSession(String typeSession) { this.typeSession = typeSession; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public java.time.LocalDate getDateFrom() { return dateFrom; }
    public void setDateFrom(java.time.LocalDate dateFrom) { this.dateFrom = dateFrom; }

    public java.time.LocalDate getDateTo() { return dateTo; }
    public void setDateTo(java.time.LocalDate dateTo) { this.dateTo = dateTo; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public Integer getNombreEmployes() { return nombreEmployes; }
    public void setNombreEmployes(Integer nombreEmployes) { this.nombreEmployes = nombreEmployes; }

    public Integer getNombreValide() { return nombreValide; }
    public void setNombreValide(Integer nombreValide) { this.nombreValide = nombreValide; }

    public BigDecimal getTotalMasseSalariale() { return totalMasseSalariale; }
    public void setTotalMasseSalariale(BigDecimal totalMasseSalariale) { this.totalMasseSalariale = totalMasseSalariale; }

    public BigDecimal getTotalBrut() { return totalBrut; }
    public void setTotalBrut(BigDecimal totalBrut) { this.totalBrut = totalBrut; }

    public BigDecimal getTotalNet() { return totalNet; }
    public void setTotalNet(BigDecimal totalNet) { this.totalNet = totalNet; }

    public BigDecimal getTotalRetenues() { return totalRetenues; }
    public void setTotalRetenues(BigDecimal totalRetenues) { this.totalRetenues = totalRetenues; }

    public BigDecimal getTotalCotisationsPatronales() { return totalCotisationsPatronales; }
    public void setTotalCotisationsPatronales(BigDecimal totalCotisationsPatronales) { this.totalCotisationsPatronales = totalCotisationsPatronales; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public LocalDateTime getDateValidation() { return dateValidation; }
    public void setDateValidation(LocalDateTime dateValidation) { this.dateValidation = dateValidation; }

    public LocalDateTime getDateCloture() { return dateCloture; }
    public void setDateCloture(LocalDateTime dateCloture) { this.dateCloture = dateCloture; }

    public String getCreePar() { return creePar; }
    public void setCreePar(String creePar) { this.creePar = creePar; }

    public String getCloturePar() { return cloturePar; }
    public void setCloturePar(String cloturePar) { this.cloturePar = cloturePar; }
}

