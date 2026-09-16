package com.bpbf.sirh_backend.dtos.paie;

import java.math.BigDecimal;

public class SalaryElementResponseDto {
    private Long id;
    private String code;
    private String name;
    private Long categoryId;
    private String categoryName;
    private String type;
    private BigDecimal rate;
    private Boolean isCotisable;
    private Boolean isImposable;
    private String methodCalcul;
    private String formule;
    private Integer ordre;
    private String statut;

    public SalaryElementResponseDto() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String code;
        private String name;
        private Long categoryId;
        private String categoryName;
        private String type;
        private BigDecimal rate;
        private Boolean isCotisable;
        private Boolean isImposable;
        private String methodCalcul;
        private String formule;
        private Integer ordre;
        private String statut;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder code(String code) { this.code = code; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public Builder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder rate(BigDecimal rate) { this.rate = rate; return this; }
        public Builder isCotisable(Boolean isCotisable) { this.isCotisable = isCotisable; return this; }
        public Builder isImposable(Boolean isImposable) { this.isImposable = isImposable; return this; }
        public Builder methodCalcul(String methodCalcul) { this.methodCalcul = methodCalcul; return this; }
        public Builder formule(String formule) { this.formule = formule; return this; }
        public Builder ordre(Integer ordre) { this.ordre = ordre; return this; }
        public Builder statut(String statut) { this.statut = statut; return this; }

        public SalaryElementResponseDto build() {
            SalaryElementResponseDto dto = new SalaryElementResponseDto();
            dto.id = this.id;
            dto.code = this.code;
            dto.name = this.name;
            dto.categoryId = this.categoryId;
            dto.categoryName = this.categoryName;
            dto.type = this.type != null ? this.type : "GAIN";
            dto.rate = this.rate;
            dto.isCotisable = this.isCotisable;
            dto.isImposable = this.isImposable;
            dto.methodCalcul = this.methodCalcul;
            dto.formule = this.formule;
            dto.ordre = this.ordre;
            dto.statut = this.statut;
            return dto;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

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
