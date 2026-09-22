package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatNominatifRowDto {
    private Long bulletinId;
    private String matricule;
    private String nomPrenom;
    private String poste;
    private String direction;
    private String classification;
    private BigDecimal salaireBase;
    private List<Map<String, Object>> gains;
    private List<Map<String, Object>> retenues;
    private BigDecimal salaireBrut;
    private BigDecimal totalRetenues;
    private BigDecimal salaireNet;
}
