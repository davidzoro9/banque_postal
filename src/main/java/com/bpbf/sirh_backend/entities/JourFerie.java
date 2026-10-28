package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "jour_ferie")
public class JourFerie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String libelle;

    @Column(nullable = false)
    private String date; // Format "YYYY-MM-DD"

    @Column(nullable = false)
    private String type;

    private Boolean chomePaye;
    private String description;

    public JourFerie() {
        this.type = "FIXE";
        this.chomePaye = true;
    }

    public JourFerie(Long id, String libelle, String date, String type, Boolean chomePaye, String description) {
        this.id = id;
        this.libelle = libelle;
        this.date = date;
        this.type = type != null ? type : "FIXE";
        this.chomePaye = chomePaye != null ? chomePaye : true;
        this.description = description;
    }

    public String getType() {
        if ("VARIABLE".equalsIgnoreCase(this.type) || "MOBILE".equalsIgnoreCase(this.type) || "RELIGIEUX".equalsIgnoreCase(this.type)) {
            return "VARIABLE";
        }
        return "FIXE";
    }

    public void setType(String type) {
        if (type == null) {
            this.type = "FIXE";
        } else {
            String trimmed = type.trim().toUpperCase();
            if ("VARIABLE".equals(trimmed) || "MOBILE".equals(trimmed) || "RELIGIEUX".equals(trimmed)) {
                this.type = "VARIABLE";
            } else {
                this.type = "FIXE";
            }
        }
    }
}
