package com.bpbf.sirh_backend.dtos;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class InformationSalarialeDto {
    private Long id;
    private Long employeeId;
    private String modePaiement;
    private String banque;
    private String iban;
    private String intituleCompte;
    private BigDecimal salaireBase;
    private BigDecimal surSalaire;
    private List<IndemniteEmployeDto> indemnites;
    private BigDecimal totalIndemnites;
    private BigDecimal remunerationBrute;
    private BigDecimal totalExonerations;
    private BigDecimal baseImposable;
    private BigDecimal abattementForfaitaire;
    private List<InformationSalarialeRetenueDto> retenuesAgent;
    private BigDecimal totalRetenuesAgent;
    private List<InformationSalarialeRetenueDto> retenuesEmployeur;
    private BigDecimal totalRetenuesEmployeur;
    private Integer nombrePersonnesCharge;
    private BigDecimal iutsSansCharge;
    private BigDecimal tauxReductionCharge;
    private BigDecimal reductionIutsCharge;
    private BigDecimal iutsAvecCharge;
    private BigDecimal totalDeduitEmploye;
    private BigDecimal salaireNet;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

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

    public BigDecimal getSurSalaire() { return surSalaire; }
    public void setSurSalaire(BigDecimal surSalaire) { this.surSalaire = surSalaire; }

    public List<IndemniteEmployeDto> getIndemnites() { return indemnites; }
    public void setIndemnites(List<IndemniteEmployeDto> indemnites) { this.indemnites = indemnites; }

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

    public List<InformationSalarialeRetenueDto> getRetenuesAgent() { return retenuesAgent; }
    public void setRetenuesAgent(List<InformationSalarialeRetenueDto> retenuesAgent) { this.retenuesAgent = retenuesAgent; }

    public BigDecimal getTotalRetenuesAgent() { return totalRetenuesAgent; }
    public void setTotalRetenuesAgent(BigDecimal totalRetenuesAgent) { this.totalRetenuesAgent = totalRetenuesAgent; }

    public List<InformationSalarialeRetenueDto> getRetenuesEmployeur() { return retenuesEmployeur; }
    public void setRetenuesEmployeur(List<InformationSalarialeRetenueDto> retenuesEmployeur) { this.retenuesEmployeur = retenuesEmployeur; }

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

