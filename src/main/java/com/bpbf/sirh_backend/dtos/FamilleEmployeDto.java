package com.bpbf.sirh_backend.dtos;

import lombok.*;

import com.bpbf.sirh_backend.entities.LienParente;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class FamilleEmployeDto {
    private Long id;
    private Long employeeId;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private LienParente lienParente;
    private Boolean estCharge;
    private String statut;
}
