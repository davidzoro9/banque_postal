package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TypeIndemniteDto {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Double tauxExoneration;
    private Double plafondExoneration;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getTauxExoneration() { return tauxExoneration; }
    public void setTauxExoneration(Double tauxExoneration) { this.tauxExoneration = tauxExoneration; }

    public Double getPlafondExoneration() { return plafondExoneration; }
    public void setPlafondExoneration(Double plafondExoneration) { this.plafondExoneration = plafondExoneration; }
}

