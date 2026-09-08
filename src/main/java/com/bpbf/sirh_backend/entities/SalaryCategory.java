package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "element_salary_category")
public class SalaryCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 150)
    private String name;

    @OneToMany(mappedBy = "salaryCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<SalaryElement> salaryElements = new ArrayList<>();

    public SalaryCategory() {}

    public SalaryCategory(Long id, String code, String name) {
        this.id = id;
        this.code = code;
        this.name = name;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<SalaryElement> getSalaryElements() { return salaryElements; }
    public void setSalaryElements(List<SalaryElement> salaryElements) { this.salaryElements = salaryElements; }
}
