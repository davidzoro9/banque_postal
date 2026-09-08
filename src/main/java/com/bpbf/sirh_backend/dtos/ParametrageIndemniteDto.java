package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParametrageIndemniteDto {
    private Long id;
    private String code;
    private Long typeIndemniteId;
    private String typeIndemniteLibelle;
    private Long fonctionId;
    private String fonctionLibelle;
    private Long gradeId;
    private String gradeLibelle;
    private Long categorieId;
    private String categorieLibelle;

    private Double taux;
    private Boolean actif;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Long getTypeIndemniteId() { return typeIndemniteId; }
    public void setTypeIndemniteId(Long typeIndemniteId) { this.typeIndemniteId = typeIndemniteId; }

    public String getTypeIndemniteLibelle() { return typeIndemniteLibelle; }
    public void setTypeIndemniteLibelle(String typeIndemniteLibelle) { this.typeIndemniteLibelle = typeIndemniteLibelle; }

    public Long getFonctionId() { return fonctionId; }
    public void setFonctionId(Long fonctionId) { this.fonctionId = fonctionId; }

    public String getFonctionLibelle() { return fonctionLibelle; }
    public void setFonctionLibelle(String fonctionLibelle) { this.fonctionLibelle = fonctionLibelle; }

    public Long getGradeId() { return gradeId; }
    public void setGradeId(Long gradeId) { this.gradeId = gradeId; }

    public String getGradeLibelle() { return gradeLibelle; }
    public void setGradeLibelle(String gradeLibelle) { this.gradeLibelle = gradeLibelle; }

    public Long getCategorieId() { return categorieId; }
    public void setCategorieId(Long categorieId) { this.categorieId = categorieId; }

    public String getCategorieLibelle() { return categorieLibelle; }
    public void setCategorieLibelle(String categorieLibelle) { this.categorieLibelle = categorieLibelle; }

    public Double getTaux() { return taux; }
    public void setTaux(Double taux) { this.taux = taux; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }
}

