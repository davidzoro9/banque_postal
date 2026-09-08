package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulletinLineDto {
    private Long id;
    private Long bulletinId;
    private Long rubriquePaieId;
    private String code;
    private String libelle;
    private String typeLigne; // GAIN, RETENUE_SOCIALE, IMPOT, PRECOMPTE, COTISATION_PATRONALE
    private BigDecimal baseCalcul;
    private BigDecimal taux;
    private BigDecimal montant;
    private BigDecimal partPatronale;
    private Integer ordre;
    
    // Champs de compatibilité frontend
    private String name;
    private String category;
    private Double rate;
    private Double amount;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBulletinId() { return bulletinId; }
    public void setBulletinId(Long bulletinId) { this.bulletinId = bulletinId; }

    public Long getRubriquePaieId() { return rubriquePaieId; }
    public void setRubriquePaieId(Long rubriquePaieId) { this.rubriquePaieId = rubriquePaieId; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public String getTypeLigne() { return typeLigne; }
    public void setTypeLigne(String typeLigne) { this.typeLigne = typeLigne; }

    public BigDecimal getBaseCalcul() { return baseCalcul; }
    public void setBaseCalcul(BigDecimal baseCalcul) { this.baseCalcul = baseCalcul; }

    public BigDecimal getTaux() { return taux; }
    public void setTaux(BigDecimal taux) { this.taux = taux; }

    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }

    public BigDecimal getPartPatronale() { return partPatronale; }
    public void setPartPatronale(BigDecimal partPatronale) { this.partPatronale = partPatronale; }

    public Integer getOrdre() { return ordre; }
    public void setOrdre(Integer ordre) { this.ordre = ordre; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getRate() { return rate; }
    public void setRate(Double rate) { this.rate = rate; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}

