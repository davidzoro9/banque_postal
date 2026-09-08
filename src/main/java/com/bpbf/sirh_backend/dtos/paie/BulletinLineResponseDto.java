package com.bpbf.sirh_backend.dtos.paie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulletinLineResponseDto {
    private Long id;
    private String code;
    private String name;
    private BigDecimal rate;
    private BigDecimal amount;
    private Long categoryId;
}
