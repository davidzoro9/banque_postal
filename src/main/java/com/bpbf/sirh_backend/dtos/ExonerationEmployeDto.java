package com.bpbf.sirh_backend.dtos;

public class ExonerationEmployeDto {

    private Long id;
    private Long typeIndemniteId;
    private String typeIndemniteCode;
    private String libelle;
    private Long employeeId;
    private Long indemniteEmployeId;
    private Double montant;          // Exonération réellement accordée = min(montant_servi, autorisee)
    private Double montantAutorise;  // Limite théorique = min(taux%×brutFiscal, plafond)
    private Double tauxExonere;
    private Double plafondExonere;

    public ExonerationEmployeDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTypeIndemniteId() { return typeIndemniteId; }
    public void setTypeIndemniteId(Long typeIndemniteId) { this.typeIndemniteId = typeIndemniteId; }

    public String getTypeIndemniteCode() { return typeIndemniteCode; }
    public void setTypeIndemniteCode(String typeIndemniteCode) { this.typeIndemniteCode = typeIndemniteCode; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Long getIndemniteEmployeId() { return indemniteEmployeId; }
    public void setIndemniteEmployeId(Long indemniteEmployeId) { this.indemniteEmployeId = indemniteEmployeId; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public Double getMontantAutorise() { return montantAutorise; }
    public void setMontantAutorise(Double montantAutorise) { this.montantAutorise = montantAutorise; }

    public Double getTauxExonere() { return tauxExonere; }
    public void setTauxExonere(Double tauxExonere) { this.tauxExonere = tauxExonere; }

    public Double getPlafondExonere() { return plafondExonere; }
    public void setPlafondExonere(Double plafondExonere) { this.plafondExonere = plafondExonere; }
}
