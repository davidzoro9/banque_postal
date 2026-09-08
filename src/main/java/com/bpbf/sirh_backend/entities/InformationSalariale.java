package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "information_salariale", uniqueConstraints = @UniqueConstraint(columnNames = "employee_id"))
public class InformationSalariale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private String modePaiement;
    private String banque;
    private String iban;
    private String intituleCompte;
    @Column(precision = 19, scale = 2)
    private BigDecimal salaireBase;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalIndemnites;

    @Column(precision = 19, scale = 2)
    private BigDecimal remunerationBrute;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalExonerations;

    @Column(precision = 19, scale = 2)
    private BigDecimal baseImposable;

    @Column(precision = 19, scale = 2)
    private BigDecimal abattementForfaitaire;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalRetenuesAgent;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalRetenuesEmployeur;

    private Integer nombrePersonnesCharge;

    @Column(precision = 19, scale = 2)
    private BigDecimal iutsSansCharge;

    @Column(precision = 5, scale = 2)
    private BigDecimal tauxReductionCharge;

    @Column(precision = 19, scale = 2)
    private BigDecimal reductionIutsCharge;

    @Column(precision = 19, scale = 2)
    private BigDecimal iutsAvecCharge;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalDeduitEmploye;

    @Column(precision = 19, scale = 2)
    private BigDecimal salaireNet;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getModePaiement() { return modePaiement; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }

    public String getBanque() { return banque; }
    public void setBanque(String banque) { this.banque = banque; }

    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }

    public String getIntituleCompte() { return intituleCompte; }
    public void setIntituleCompte(String intituleCompte) { this.intituleCompte = intituleCompte; }

    public BigDecimal getSalaireBase() { return salaireBase; }
    public void setSalaireBase(BigDecimal salaireBase) { this.salaireBase = salaireBase; }

    public BigDecimal getTotalIndemnites() { return totalIndemnites; }
    public void setTotalIndemnites(BigDecimal totalIndemnites) { this.totalIndemnites = totalIndemnites; }

    public BigDecimal getRemunerationBrute() { return remunerationBrute; }
    public void setRemunerationBrute(BigDecimal remunerationBrute) { this.remunerationBrute = remunerationBrute; }

    public BigDecimal getTotalExonerations() { return totalExonerations; }
    public void setTotalExonerations(BigDecimal totalExonerations) { this.totalExonerations = totalExonerations; }

    public BigDecimal getBaseImposable() { return baseImposable; }
    public void setBaseImposable(BigDecimal baseImposable) { this.baseImposable = baseImposable; }

    public BigDecimal getAbattementForfaitaire() { return abattementForfaitaire; }
    public void setAbattementForfaitaire(BigDecimal abattementForfaitaire) { this.abattementForfaitaire = abattementForfaitaire; }

    public BigDecimal getTotalRetenuesAgent() { return totalRetenuesAgent; }
    public void setTotalRetenuesAgent(BigDecimal totalRetenuesAgent) { this.totalRetenuesAgent = totalRetenuesAgent; }

    public BigDecimal getTotalRetenuesEmployeur() { return totalRetenuesEmployeur; }
    public void setTotalRetenuesEmployeur(BigDecimal totalRetenuesEmployeur) { this.totalRetenuesEmployeur = totalRetenuesEmployeur; }

    public Integer getNombrePersonnesCharge() { return nombrePersonnesCharge; }
    public void setNombrePersonnesCharge(Integer nombrePersonnesCharge) { this.nombrePersonnesCharge = nombrePersonnesCharge; }

    public BigDecimal getIutsSansCharge() { return iutsSansCharge; }
    public void setIutsSansCharge(BigDecimal iutsSansCharge) { this.iutsSansCharge = iutsSansCharge; }

    public BigDecimal getTauxReductionCharge() { return tauxReductionCharge; }
    public void setTauxReductionCharge(BigDecimal tauxReductionCharge) { this.tauxReductionCharge = tauxReductionCharge; }

    public BigDecimal getReductionIutsCharge() { return reductionIutsCharge; }
    public void setReductionIutsCharge(BigDecimal reductionIutsCharge) { this.reductionIutsCharge = reductionIutsCharge; }

    public BigDecimal getIutsAvecCharge() { return iutsAvecCharge; }
    public void setIutsAvecCharge(BigDecimal iutsAvecCharge) { this.iutsAvecCharge = iutsAvecCharge; }

    public BigDecimal getTotalDeduitEmploye() { return totalDeduitEmploye; }
    public void setTotalDeduitEmploye(BigDecimal totalDeduitEmploye) { this.totalDeduitEmploye = totalDeduitEmploye; }

    public BigDecimal getSalaireNet() { return salaireNet; }
    public void setSalaireNet(BigDecimal salaireNet) { this.salaireNet = salaireNet; }
}

