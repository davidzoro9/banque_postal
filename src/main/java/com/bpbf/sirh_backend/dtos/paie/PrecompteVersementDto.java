package com.bpbf.sirh_backend.dtos.paie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrecompteVersementDto {
    private Long bulletinId;
    private String fichePaie;
    private String periode;
    private LocalDate datePaiement;
    private BigDecimal montant;
    private BigDecimal soldeApres;
}
