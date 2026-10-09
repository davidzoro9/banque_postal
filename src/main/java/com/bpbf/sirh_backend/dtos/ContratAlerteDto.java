package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContratAlerteDto {
    private Long contratId;
    private Long employeeId;
    private String matricule;
    private String nom;
    private String prenom;
    private String nomComplet;
    private String typeContrat;
    private String fonction;
    private String direction;
    private String dateDebut;
    private String dateFin;
    private Long joursRestants;
    private String niveauUrgence; // EXPIRE, CRITIQUE (<=15j), ATTENTION (<=30j), A_PREVOIR (<=60j)
    private String message;
}
