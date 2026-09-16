package com.bpbf.sirh_backend.dtos.paie;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SalaryElementRequestDto {
    private String code;
    private String name;
    private Long salaryCategoryId;
    private String categoryName;
    private BigDecimal rate;
    private Boolean isCotisable;
    private Boolean isImposable;
    private String methodCalcul;
    private String formule;
    private String formula;
    private Integer ordre;
    private String statut;
    private String type;

    public SalaryElementRequestDto() {}

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getSalaryCategoryId() { return salaryCategoryId; }
    public void setSalaryCategoryId(Long salaryCategoryId) { this.salaryCategoryId = salaryCategoryId; }

    // Support both categoryId and salaryCategoryId
    public Long getCategoryId() { return salaryCategoryId; }
    public void setCategoryId(Long categoryId) { this.salaryCategoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public BigDecimal getRate() { return rate; }
    public void setRate(BigDecimal rate) { this.rate = rate; }

    public Boolean getIsCotisable() { return isCotisable; }
    public void setIsCotisable(Boolean isCotisable) { this.isCotisable = isCotisable; }

    public Boolean getIsImposable() { return isImposable; }
    public void setIsImposable(Boolean isImposable) { this.isImposable = isImposable; }

    public String getMethodCalcul() { return methodCalcul; }
    public void setMethodCalcul(String methodCalcul) { this.methodCalcul = methodCalcul; }

    public String getFormule() { return formule != null ? formule : formula; }
    public void setFormule(String formule) { 
        this.formule = formule; 
        if (this.formula == null) this.formula = formule;
    }

    public String getFormula() { return formula != null ? formula : formule; }
    public void setFormula(String formula) { 
        this.formula = formula; 
        if (this.formule == null) this.formule = formula;
    }

    public Integer getOrdre() { return ordre; }
    public void setOrdre(Integer ordre) { this.ordre = ordre; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}

