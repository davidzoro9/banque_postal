package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignatairesEtatDto {
    private String titreSignataire1;
    private String nomSignataire1;
    private Long employeeId1;
    private String titreSignataire2;
    private String nomSignataire2;
    private Long employeeId2;
}
