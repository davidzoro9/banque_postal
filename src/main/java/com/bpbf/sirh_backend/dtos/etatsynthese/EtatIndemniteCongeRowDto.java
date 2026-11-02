package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatIndemniteCongeRowDto {
    private Integer numeroOrdre;
    private Long employeeId;
    private String matricule;
    private String nomPrenom;
    private String emploi;
    private String direction;

    @Builder.Default
    private List<MoisBrutDto> detailsMois = new ArrayList<>();
    private String detailsMoisTexte;

    private BigDecimal totalBrutPeriode;
    private BigDecimal salaireMoyenJournalier;
    private BigDecimal nombreJoursConge;
    private BigDecimal totalIndemniteConge;
}

