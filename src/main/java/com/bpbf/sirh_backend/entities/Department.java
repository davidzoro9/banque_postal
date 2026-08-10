package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="department")
public class Department {
    @Id
    @GeneratedValue
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String code;
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "directeur_id")
    private Employee directeurObj;

    @JsonProperty("directeur")
    public String getDirecteur() {
        if (directeurObj != null) return directeurObj.getName() != null ? directeurObj.getName() : (directeurObj.getPrenom() + " " + directeurObj.getNom());
        return null;
    }
}
