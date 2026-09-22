package com.bpbf.sirh_backend.dtos;

import lombok.*;

public class IndemniteEmployeDto {

    private Long id;
    private Long typeIndemniteId;
    private String typeIndemniteCode;
    private String libelle;
    private Long employeeId;
    private Long parametrageIndemniteId;
    private Double montant;
    private Boolean actif;

    public IndemniteEmployeDto() {}

    public IndemniteEmployeDto(Long id, Long typeIndemniteId, String typeIndemniteCode, String libelle, Long employeeId, Long parametrageIndemniteId, Double montant, Boolean actif) {
        this.id = id;
        this.typeIndemniteId = typeIndemniteId;
        this.typeIndemniteCode = typeIndemniteCode;
        this.libelle = libelle;
        this.employeeId = employeeId;
        this.parametrageIndemniteId = parametrageIndemniteId;
        this.montant = montant;
        this.actif = actif;
    }

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

    public Long getParametrageIndemniteId() { return parametrageIndemniteId; }
    public void setParametrageIndemniteId(Long parametrageIndemniteId) { this.parametrageIndemniteId = parametrageIndemniteId; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }
}

