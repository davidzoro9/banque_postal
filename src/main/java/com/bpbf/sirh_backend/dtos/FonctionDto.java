package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FonctionDto {
    private Long id;
    private String code;
    private String name;
    private String description;
    /** "NOMMEE" ou "NON_NOMMEE" */
    private String typeNomination;
    private Boolean actif = true;
    private java.util.List<FonctionIndemniteDto> indemnites = new java.util.ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTypeNomination() { return typeNomination; }
    public void setTypeNomination(String typeNomination) { this.typeNomination = typeNomination; }
    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }

    public java.util.List<FonctionIndemniteDto> getIndemnites() { return indemnites; }
    public void setIndemnites(java.util.List<FonctionIndemniteDto> indemnites) { this.indemnites = indemnites; }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FonctionIndemniteDto {
        private String typeIndemnite;
        private Double montant;

        public String getTypeIndemnite() { return typeIndemnite; }
        public void setTypeIndemnite(String typeIndemnite) { this.typeIndemnite = typeIndemnite; }
        public Double getMontant() { return montant; }
        public void setMontant(Double montant) { this.montant = montant; }
    }
}
