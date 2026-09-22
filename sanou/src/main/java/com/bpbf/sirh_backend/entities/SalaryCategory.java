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

    @Column(length = 30)
    private String type = "GAIN";

    @OneToMany(mappedBy = "salaryCategory")
    @JsonIgnore
    private List<SalaryElement> salaryElements = new ArrayList<>();

    public SalaryCategory() {}

    public SalaryCategory(Long id, String code, String name) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.type = "GAIN";
    }

    public SalaryCategory(Long id, String code, String name, String type) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.type = type != null ? type : "GAIN";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public List<SalaryElement> getSalaryElements() { return salaryElements; }
    public void setSalaryElements(List<SalaryElement> salaryElements) { this.salaryElements = salaryElements; }
}
