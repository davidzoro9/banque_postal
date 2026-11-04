package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LivrePaieEcartResponseDto {
    private Long sessionId;
    private String sessionCode;
    private String sessionPeriode;

    private Long previousSessionId;
    private String previousSessionCode;
    private String previousSessionPeriode;

    private BigDecimal totalBrutActuel;
    private BigDecimal totalBrutPrecedent;
    private BigDecimal ecartBrut;

    private BigDecimal totalRetenuesActuel;
    private BigDecimal totalRetenuesPrecedent;
    private BigDecimal ecartRetenues;

    private BigDecimal totalNetActuel;
    private BigDecimal totalNetPrecedent;
    private BigDecimal ecartNet;

    private Integer nbRubriquesEnEcart;
    private List<LivrePaieEcartDto> items;
}
