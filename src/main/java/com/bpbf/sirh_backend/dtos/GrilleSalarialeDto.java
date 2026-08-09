package com.bpbf.sirh_backend.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GrilleSalarialeDto {
    private Long id;
    private String classe;
    private String category;
    private String echelle;
    private String echellon;

    private String grade;
    private Long categorieId;
    private Long echelonId;
    private Long gradeId;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal basicSalary;
}

