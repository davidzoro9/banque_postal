package com.bpbf.sirh_backend.dtos.paie;

import java.math.BigDecimal;

public class SalaryElementRequestDto {
    private String code;
    private String name;
    private Long salaryCategoryId;
    private BigDecimal rate;
    private Boolean isCotisable;
    private Boolean isImposable;
    private String methodCalcul;
    private String formule;
    private Integer ordre;
    private String statut;

    public SalaryElementRequestDto() {}

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getSalaryCategoryId() { return salaryCategoryId; }
    public void setSalaryCategoryId(Long salaryCategoryId) { this.salaryCategoryId = salaryCategoryId; }

    public BigDecimal getRate() { return rate; }
    public void setRate(BigDecimal rate) { this.rate = rate; }

    public Boolean getIsCotisable() { return isCotisable; }
    public void setIsCotisable(Boolean isCotisable) { this.isCotisable = isCotisable; }

    public Boolean getIsImposable() { return isImposable; }
    public void setIsImposable(Boolean isImposable) { this.isImposable = isImposable; }

    public String getMethodCalcul() { return methodCalcul; }
    public void setMethodCalcul(String methodCalcul) { this.methodCalcul = methodCalcul; }

    public String getFormule() { return formule; }
    public void setFormule(String formule) { this.formule = formule; }

    public Integer getOrdre() { return ordre; }
    public void setOrdre(Integer ordre) { this.ordre = ordre; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
}
