package com.bpbf.sirh_backend.services;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class InformationSalarialeCalculServiceTest {
    @Test
    void calculatesPercentageWithTwoDecimalHalfUpRounding() {
        assertEquals(new BigDecimal("0.01"), InformationSalarialeCalculService.calculatePercentage(
                new BigDecimal("1.00"), new BigDecimal("0.50")));
    }

    @Test
    void calculatesProgressiveIuts() {
        assertEquals(new BigDecimal("0.00"),
                InformationSalarialeCalculService.calculateIuts(new BigDecimal("30000.00")));
        assertEquals(new BigDecimal("1210.00"),
                InformationSalarialeCalculService.calculateIuts(new BigDecimal("40000.00")));
        assertEquals(new BigDecimal("5200.00"),
                InformationSalarialeCalculService.calculateIuts(new BigDecimal("70000.00")));
        assertEquals(new BigDecimal("9730.00"),
                InformationSalarialeCalculService.calculateIuts(new BigDecimal("100000.00")));
        assertEquals(new BigDecimal("18390.00"),
                InformationSalarialeCalculService.calculateIuts(new BigDecimal("150000.00")));
        assertEquals(new BigDecimal("28580.00"),
                InformationSalarialeCalculService.calculateIuts(new BigDecimal("200000.00")));
        assertEquals(new BigDecimal("39430.00"),
                InformationSalarialeCalculService.calculateIuts(new BigDecimal("250000.00")));
        assertEquals(new BigDecimal("56930.00"),
                InformationSalarialeCalculService.calculateIuts(new BigDecimal("320000.00")));
    }

    @Test
    void capsFamilyReductionRateAtFourCharges() {
        assertEquals(new BigDecimal("0.00"), InformationSalarialeCalculService.reductionRate(0));
        assertEquals(new BigDecimal("10.00"), InformationSalarialeCalculService.reductionRate(2));
        assertEquals(new BigDecimal("14.00"), InformationSalarialeCalculService.reductionRate(5));
    }

    @Test
    void resolvesBaseCalculRetenueCorrectly() {
        BigDecimal sb = new BigDecimal("224217.00");
        BigDecimal ss = new BigDecimal("28308.00");
        BigDecimal pa = BigDecimal.ZERO;
        BigDecimal brut = new BigDecimal("447525.00");
        BigDecimal baseImp = new BigDecimal("291102.00");

        // SALAIRE_BASE
        assertEquals(new BigDecimal("224217.00"), InformationSalarialeCalculService.resolveBase(
                com.bpbf.sirh_backend.entities.BaseCalculRetenue.SALAIRE_BASE, sb, ss, pa, brut, baseImp));

        // SALAIRE_BASE_SUR_SALAIRE (ex: CRRAE-UMOA: 224 217 + 28 308 = 252 525)
        assertEquals(new BigDecimal("252525.00"), InformationSalarialeCalculService.resolveBase(
                com.bpbf.sirh_backend.entities.BaseCalculRetenue.SALAIRE_BASE_SUR_SALAIRE, sb, ss, pa, brut, baseImp));

        // REMUNERATION_BRUTE
        assertEquals(new BigDecimal("447525.00"), InformationSalarialeCalculService.resolveBase(
                com.bpbf.sirh_backend.entities.BaseCalculRetenue.REMUNERATION_BRUTE, sb, ss, pa, brut, baseImp));

        // BASE_IMPOSABLE
        assertEquals(new BigDecimal("291102.00"), InformationSalarialeCalculService.resolveBase(
                com.bpbf.sirh_backend.entities.BaseCalculRetenue.BASE_IMPOSABLE, sb, ss, pa, brut, baseImp));
    }

    @Test
    void verifiesReferenceBulletinCalculationsExactFrancCfa() {
        // Bulletin réel BPBF Juillet 2026 - NARE Herman Maurice
        BigDecimal salaireBase = new BigDecimal("224217.00");
        BigDecimal surSalaire = new BigDecimal("28308.00");
        BigDecimal indemnites = new BigDecimal("25000.00") // Caisse
                .add(new BigDecimal("30000.00")) // Sujétion
                .add(new BigDecimal("45000.00")) // Transport
                .add(new BigDecimal("45000.00")) // Logement
                .add(new BigDecimal("50000.00")); // Cash Point

        // 1. Salaire Brut = 447 525
        BigDecimal brut = salaireBase.add(surSalaire).add(indemnites);
        assertEquals(new BigDecimal("447525.00"), brut);

        // 2. Cotisation CNSS (5.5%) = 24 614
        BigDecimal baseCnss = brut.min(new BigDecimal("800000.00"));
        BigDecimal cnss = InformationSalarialeCalculService.money(
                InformationSalarialeCalculService.calculatePercentage(baseCnss, new BigDecimal("5.50")));
        assertEquals(new BigDecimal("24614.00"), cnss);

        // 3. Cotisation CRRAE (6%) = 15 152
        BigDecimal baseCrrae = salaireBase.add(surSalaire);
        assertEquals(new BigDecimal("252525.00"), baseCrrae);
        BigDecimal crrae = InformationSalarialeCalculService.money(
                InformationSalarialeCalculService.calculatePercentage(baseCrrae, new BigDecimal("6.00")));
        assertEquals(new BigDecimal("15152.00"), crrae);

        // 4. Retenue IUTS (Base 291 125, 2 parts = 10% réduction) = 44 735
        BigDecimal baseImposable = new BigDecimal("291125.00");
        BigDecimal iutsBrut = InformationSalarialeCalculService.calculateIuts(baseImposable);
        assertEquals(new BigDecimal("49705.00"), iutsBrut);
        BigDecimal reductionIuts = InformationSalarialeCalculService.money(
                iutsBrut.multiply(new BigDecimal("10.00")).divide(new BigDecimal("100.00"), 8, java.math.RoundingMode.HALF_UP));
        assertEquals(new BigDecimal("4971.00"), reductionIuts); // 4970.50 CEILING -> 4971
        BigDecimal iutsNet = InformationSalarialeCalculService.money(
                iutsBrut.subtract(iutsBrut.multiply(new BigDecimal("10.00")).divide(new BigDecimal("100.00"), 8, java.math.RoundingMode.HALF_UP)));
        assertEquals(new BigDecimal("44735.00"), iutsNet);

        // 5. Retenue Fonds de Solidarité / FSP (1%) = 3 782
        BigDecimal baseFsp = brut.subtract(cnss).subtract(iutsNet);
        assertEquals(new BigDecimal("378176.00"), baseFsp);
        BigDecimal fsp = InformationSalarialeCalculService.money(
                InformationSalarialeCalculService.calculatePercentage(baseFsp, new BigDecimal("1.00")));
        assertEquals(new BigDecimal("3782.00"), fsp);

        // 6. Total Retenues et Net à Payer
        BigDecimal totalRetenues = cnss.add(crrae).add(iutsNet).add(fsp);
        assertEquals(new BigDecimal("88283.00"), totalRetenues);

        BigDecimal netAPayer = brut.subtract(totalRetenues);
        assertEquals(new BigDecimal("359242.00"), netAPayer);
    }
}

