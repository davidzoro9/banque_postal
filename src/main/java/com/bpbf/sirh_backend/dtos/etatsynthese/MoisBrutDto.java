package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoisBrutDto {
    private String mois;
    private BigDecimal salaireBrut;
}

