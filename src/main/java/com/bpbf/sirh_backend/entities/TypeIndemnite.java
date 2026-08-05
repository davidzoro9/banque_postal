package com.bpbf.sirh_backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TypeIndemnite {
    @Id
    @GeneratedValue
    private Long id;
    private String code;
    private String name;
    private String description;
    private Double tauxExoneration;
    private Double plafondExoneration;
}
