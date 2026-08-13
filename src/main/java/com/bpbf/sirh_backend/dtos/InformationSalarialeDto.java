package com.bpbf.sirh_backend.dtos;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class InformationSalarialeDto {
    private Long id;
    private Long employeeId;
    private String modePaiement;
    private String banque;
    private String iban;
    private String intituleCompte;
    private Double salaireBrut;
}
