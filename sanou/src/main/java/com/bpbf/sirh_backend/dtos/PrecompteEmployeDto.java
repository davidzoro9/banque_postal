package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrecompteEmployeDto {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String matricule;
    private Long rubriquePaieId;
    private String rubriquePaieLibelle;
    private String libelle;
    private BigDecimal montantInitial;
    private BigDecimal montantMensuel;
    private BigDecimal montantRestant;
    private Integer echeancesTotal;
    private Integer echeancesRestantes;
    private LocalDate dateDebut;
    private LocalDate dateFinPrevue;
    private String statut;
    private String motif;
    private LocalDateTime dateCreation;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

    public Long getRubriquePaieId() { return rubriquePaieId; }
    public void setRubriquePaieId(Long rubriquePaieId) { this.rubriquePaieId = rubriquePaieId; }

    public String getRubriquePaieLibelle() { return rubriquePaieLibelle; }
    public void setRubriquePaieLibelle(String rubriquePaieLibelle) { this.rubriquePaieLibelle = rubriquePaieLibelle; }

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

