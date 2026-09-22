package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "avoir_employe")
public class AvoirEmploye {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rubrique_paie_id")
    private RubriquePaie rubriquePaie;

    @Column(nullable = false, length = 100)
    private String libelle;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal montantInitial;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal montantMensuel;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal montantRestant;

    private Integer echeancesTotal;

    private Integer echeancesRestantes;

    private LocalDate dateDebut;

    private LocalDate dateFinPrevue;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String statut = "ACTIF"; // ACTIF, SOLDE, SUSPENDU

    private String motif;

    private LocalDateTime dateCreation;

    @PrePersist
    public void onCreate() {
        if (this.dateCreation == null) {
            this.dateCreation = LocalDateTime.now();
        }
        if (this.statut == null) {
            this.statut = "ACTIF";
        }
        if (this.montantRestant == null) {
            this.montantRestant = this.montantInitial;
        }
        if (this.echeancesRestantes == null) {
            this.echeancesRestantes = this.echeancesTotal;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public RubriquePaie getRubriquePaie() { return rubriquePaie; }
    public void setRubriquePaie(RubriquePaie rubriquePaie) { this.rubriquePaie = rubriquePaie; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public BigDecimal getMontantInitial() { return montantInitial; }
    public void setMontantInitial(BigDecimal montantInitial) { this.montantInitial = montantInitial; }

    public BigDecimal getMontantMensuel() { return montantMensuel; }
    public void setMontantMensuel(BigDecimal montantMensuel) { this.montantMensuel = montantMensuel; }

    public BigDecimal getMontantRestant() { return montantRestant; }
    public void setMontantRestant(BigDecimal montantRestant) { this.montantRestant = montantRestant; }

    public Integer getEcheancesTotal() { return echeancesTotal; }
    public void setEcheancesTotal(Integer echeancesTotal) { this.echeancesTotal = echeancesTotal; }

    public Integer getEcheancesRestantes() { return echeancesRestantes; }
    public void setEcheancesRestantes(Integer echeancesRestantes) { this.echeancesRestantes = echeancesRestantes; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFinPrevue() { return dateFinPrevue; }
    public void setDateFinPrevue(LocalDate dateFinPrevue) { this.dateFinPrevue = dateFinPrevue; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
}

