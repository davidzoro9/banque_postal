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
    private Long categorieId;
    private Long echelonId;
    private Long gradeId;

    private String categorieCode;
    private String categorieLibelle;
    private String echelonCode;
    private String echelonLibelle;
    private String gradeCode;
    private String gradeLibelle;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal basicSalary;
}
