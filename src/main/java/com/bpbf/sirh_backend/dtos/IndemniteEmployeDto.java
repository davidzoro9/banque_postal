package com.bpbf.sirh_backend.dtos;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class IndemniteEmployeDto {
    private Long id;
    private Long typeIndemniteId;
    private String typeIndemniteCode;
    private String libelle;
    private Long employeeId;
    private Long parametrageIndemniteId;
    private Double montant;
    private Boolean actif;
}
