package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.entities.SessionPaie;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class BulletinServiceProrataTest {

    private BulletinService createService() {
        return new BulletinService(
                null, null, null, null, null,
                null, null, null, null, null,
                null, null, null, null, null,
                null, null, null, null, null
        );
    }

    @Test
    void testParseLocalDateSafe() {
        assertEquals(LocalDate.of(2026, 10, 15), BulletinService.parseLocalDateSafe("2026-10-15"));
        assertEquals(LocalDate.of(2026, 10, 15), BulletinService.parseLocalDateSafe("15/10/2026"));
        assertEquals(LocalDate.of(2026, 10, 15), BulletinService.parseLocalDateSafe("15-10-2026"));
        assertNull(BulletinService.parseLocalDateSafe(null));
        assertNull(BulletinService.parseLocalDateSafe(""));
        assertNull(BulletinService.parseLocalDateSafe("date_invalide"));
    }

    @Test
    void testGetSessionDates() {
        SessionPaie session = new SessionPaie();
        session.setMois("10");
        session.setAnnee(2026);

        assertEquals(LocalDate.of(2026, 10, 1), BulletinService.getSessionDebutPeriode(session));
        assertEquals(LocalDate.of(2026, 10, 31), BulletinService.getSessionFinPeriode(session));

        session.setDateFrom(LocalDate.of(2026, 10, 5));
        session.setDateTo(LocalDate.of(2026, 10, 25));
        assertEquals(LocalDate.of(2026, 10, 5), BulletinService.getSessionDebutPeriode(session));
        assertEquals(LocalDate.of(2026, 10, 25), BulletinService.getSessionFinPeriode(session));
    }

    @Test
    void testAssertEmployeeEligibleForSession_ThrowsWhenHiredAfterPeriod() {
        Employee emp = new Employee();
        emp.setId(100L);
        emp.setMatricule("EMP-999");
        emp.setName("Test Agent");
        emp.setDateEmbauche("2026-10-15");

        SessionPaie session = new SessionPaie();
        session.setPeriode("Septembre 2026");
        session.setDateFrom(LocalDate.of(2026, 9, 1));
        session.setDateTo(LocalDate.of(2026, 9, 30));

        BulletinService service = createService();

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            service.assertEmployeeEligibleForSession(emp, session, session.getDateFrom(), session.getDateTo(), false);
        });

        assertTrue(ex.getReason().contains("est postérieure à la période"));
    }

    @Test
    void testAssertEmployeeEligibleForSession_AllowsWhenHiredDuringPeriod() {
        Employee emp = new Employee();
        emp.setId(100L);
        emp.setMatricule("EMP-999");
        emp.setName("Test Agent");
        emp.setDateEmbauche("2026-10-15");

        SessionPaie session = new SessionPaie();
        session.setPeriode("Octobre 2026");
        session.setDateFrom(LocalDate.of(2026, 10, 1));
        session.setDateTo(LocalDate.of(2026, 10, 31));

        BulletinService service = createService();

        // Doit passer sans lever d'exception
        assertDoesNotThrow(() -> {
            service.assertEmployeeEligibleForSession(emp, session, session.getDateFrom(), session.getDateTo(), false);
        });
    }

    @Test
    void testToDto_MapsStcFieldsCorrectly() {
        com.bpbf.sirh_backend.entities.Bulletin b = new com.bpbf.sirh_backend.entities.Bulletin();
        b.setId(123L);
        b.setCode("BLT-STC-001");
        b.setMotifRupture("LICENCIEMENT_SIMPLE");
        b.setStatutPreavis("DISPENSE_PAYE");
        b.setMontantIndemniteLicenciement(new java.math.BigDecimal("1500000.00"));
        b.setMontantIndemnitePreavis(new java.math.BigDecimal("900000.00"));
        b.setMontantIndemniteConges(new java.math.BigDecimal("450000.00"));

        BulletinService service = createService();
        com.bpbf.sirh_backend.dtos.BulletinDto dto = service.toDto(b);

        assertEquals("LICENCIEMENT_SIMPLE", dto.getMotifRupture());
        assertEquals("DISPENSE_PAYE", dto.getStatutPreavis());
        assertEquals(new java.math.BigDecimal("1500000.00"), dto.getMontantIndemniteLicenciement());
        assertEquals(new java.math.BigDecimal("900000.00"), dto.getMontantIndemnitePreavis());
        assertEquals(new java.math.BigDecimal("450000.00"), dto.getMontantIndemniteConges());
    }

    @Test
    void testEvaluateComplexFormula_WithDirectElements() {
        java.math.BigDecimal salBase = new java.math.BigDecimal("200000");
        java.math.BigDecimal surSalaire = new java.math.BigDecimal("50000");
        java.math.BigDecimal primeAnc = new java.math.BigDecimal("10000");
        java.math.BigDecimal brut = new java.math.BigDecimal("300000");

        // (SAL_BASE + SUR_SALAIRE) * 0.10 = 250000 * 0.10 = 25000.00
        java.math.BigDecimal res1 = BulletinService.evaluateComplexFormula("(SAL_BASE + SUR_SALAIRE)*0.10", salBase, surSalaire, primeAnc, brut);
        assertEquals(new java.math.BigDecimal("25000.00"), res1);

        // SUM(CAT_SAL_BASE) * 0.05 = 250000 * 0.05 = 12500.00
        java.math.BigDecimal res2 = BulletinService.evaluateComplexFormula("SUM(CAT_SAL_BASE)*0.05", salBase, surSalaire, primeAnc, brut);
        assertEquals(new java.math.BigDecimal("12500.00"), res2);
    }

    @Test
    void testResolveInformationSalarialeField() {
        com.bpbf.sirh_backend.entities.InformationSalariale info = new com.bpbf.sirh_backend.entities.InformationSalariale();
        info.setSalaireBase(new java.math.BigDecimal("350000.00"));
        info.setSurSalaire(new java.math.BigDecimal("50000.00"));
        info.setRemunerationBrute(new java.math.BigDecimal("500000.00"));

        assertEquals(new java.math.BigDecimal("350000.00"), BulletinService.resolveInformationSalarialeField(info, "salaire_base"));
        assertEquals(new java.math.BigDecimal("350000.00"), BulletinService.resolveInformationSalarialeField(info, "sal_base"));
        assertEquals(new java.math.BigDecimal("50000.00"), BulletinService.resolveInformationSalarialeField(info, "sur_salaire"));
        assertEquals(new java.math.BigDecimal("500000.00"), BulletinService.resolveInformationSalarialeField(info, "remuneration_brute"));
        assertNull(BulletinService.resolveInformationSalarialeField(info, "inconnu"));
    }
}
