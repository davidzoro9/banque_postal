package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "type_retenue_emploi")
public class TypeRetenueEmploi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;
    private String libelle;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_retenue_employe_id")
    private TypeRetenueEmploye typeRetenueEmploye;

    @Transient
    private String typeRetenueStr;

    @JsonProperty("typeRetenue")
    public String getTypeRetenue() {
        if (typeRetenueEmploye != null) {
            return typeRetenueEmploye.getLibelle() != null ? typeRetenueEmploye.getLibelle() : typeRetenueEmploye.getCode();
        }
        return typeRetenueStr;
    }

    @JsonProperty("typeRetenue")
    public void setTypeRetenue(String tr) {
        this.typeRetenueStr = tr;
    }

    private Double taux;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Boolean actif = true;
}
