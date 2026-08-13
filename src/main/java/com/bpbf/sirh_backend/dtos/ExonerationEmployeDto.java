package com.bpbf.sirh_backend.dtos;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ExonerationEmployeDto {
    private Long id;
    private Long typeIndemniteId;
    private String typeIndemniteCode;
    private String libelle;
    private Long employeeId;
    private Long indemniteEmployeId;
    private Double montant;
    private Double tauxExonere;
    private Double plafondExonere;
}
