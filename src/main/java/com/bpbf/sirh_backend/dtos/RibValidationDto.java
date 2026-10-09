package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RibValidationDto {
    private boolean valide;
    private String codeBanque;
    private String codeGuichet;
    private String numeroCompte;
    private String cleFournie;
    private String cleCalculee;
    private String ribFormate;
    private String ibanUemoa;
    private String nomBanque;
    private String message;
}
