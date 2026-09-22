package com.bpbf.sirh_backend.services;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EmployeeProcessServiceTest {
    @Test
    void calculatesUncappedExonerationAndDefaultsNullValues() {
        assertEquals(25.0, EmployeeProcessService.calculateExoneration(100.0, 25.0, null));
        assertEquals(0.0, EmployeeProcessService.calculateExoneration(null, null, null));
    }

    @Test
    void capsExonerationWhenPositiveCeilingIsExceeded() {
        assertEquals(30.0, EmployeeProcessService.calculateExoneration(200.0, 25.0, 30.0));
        assertEquals(50.0, EmployeeProcessService.calculateExoneration(200.0, 25.0, 0.0));
    }
}
