package com.bpbf.sirh_backend.dtos;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SituationSalarialeDto {
    private Long id;
    private Long employeeId;
    private Long grilleSalarialeId;
    private String grilleSalarialeLibelle;
    private Long categorieId;
    private String categorieLibelle;
    private Long echelonId;
    private String echelonLibelle;
    private Long gradeId;
    private String gradeLibelle;
    private Double salaireBase;
    private Double totalIndemnites;
    private Double salaireBrut;
}
