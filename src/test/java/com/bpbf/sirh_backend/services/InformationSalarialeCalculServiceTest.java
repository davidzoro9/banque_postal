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
        assertEquals(new BigDecimal("56930.00"),
                InformationSalarialeCalculService.calculateIuts(new BigDecimal("320000.00")));
        assertEquals(new BigDecimal("0.00"),
                InformationSalarialeCalculService.calculateIuts(new BigDecimal("30000.00")));
    }

    @Test
    void capsFamilyReductionRateAtFourCharges() {
        assertEquals(new BigDecimal("0.00"), InformationSalarialeCalculService.reductionRate(0));
        assertEquals(new BigDecimal("10.00"), InformationSalarialeCalculService.reductionRate(2));
        assertEquals(new BigDecimal("14.00"), InformationSalarialeCalculService.reductionRate(5));
    }
}
