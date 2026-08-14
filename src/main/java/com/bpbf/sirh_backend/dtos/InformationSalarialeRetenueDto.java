package com.bpbf.sirh_backend.dtos;

import com.bpbf.sirh_backend.entities.BaseCalculRetenue;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InformationSalarialeRetenueDto {
    private Long id;
    private Long retenueId;
    private String code;
    private String libelle;
    private String typeRetenueCode;
    private BaseCalculRetenue baseCalcul;
    private BigDecimal montantBase;
    private BigDecimal taux;
    private BigDecimal montantCalcule;
}
