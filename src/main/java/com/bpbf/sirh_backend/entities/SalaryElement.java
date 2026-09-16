package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "salary_element")
public class SalaryElement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(precision = 10, scale = 4)
    private BigDecimal rate;

    private Boolean isCotisable = true;

    private Boolean isImposable = true;

    @Column(length = 50)
    private String methodCalcul; // MONTANT_FIXE, POURCENTAGE, FORMULE, etc.

    @Column(columnDefinition = "TEXT")
    private String formule;

    private Integer ordre = 1;

    private String statut = "ACTIF";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salary_category_id")
    private SalaryCategory salaryCategory;

    @OneToMany(mappedBy = "salaryElement")
    @JsonIgnore
    private List<Avoir> avoirs = new ArrayList<>();

    @OneToMany(mappedBy = "salaryElement")
    @JsonIgnore
    private List<Precompte> precomptes = new ArrayList<>();

    public SalaryElement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getRate() { return rate; }
    public void setRate(BigDecimal rate) { this.rate = rate; }

    public Boolean getIsCotisable() { return isCotisable; }
    public void setIsCotisable(Boolean cotisable) { isCotisable = cotisable; }

    public Boolean getIsImposable() { return isImposable; }
    public void setIsImposable(Boolean imposable) { isImposable = imposable; }

    public String getMethodCalcul() { return methodCalcul; }
    public void setMethodCalcul(String methodCalcul) { this.methodCalcul = methodCalcul; }

    public String getFormule() { return formule; }
    public void setFormule(String formule) { this.formule = formule; }

    public Integer getOrdre() { return ordre; }
    public void setOrdre(Integer ordre) { this.ordre = ordre; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public SalaryCategory getSalaryCategory() { return salaryCategory; }
    public void setSalaryCategory(SalaryCategory salaryCategory) { this.salaryCategory = salaryCategory; }

    public List<Avoir> getAvoirs() { return avoirs; }
    public void setAvoirs(List<Avoir> avoirs) { this.avoirs = avoirs; }

    public List<Precompte> getPrecomptes() { return precomptes; }
    public void setPrecomptes(List<Precompte> precomptes) { this.precomptes = precomptes; }
}
