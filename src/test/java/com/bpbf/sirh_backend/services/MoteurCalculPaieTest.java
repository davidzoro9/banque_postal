package com.bpbf.sirh_backend.services;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class MoteurCalculPaieTest {

    @Test
    void verifiesExactCalculatricePaieBanquePostaleBurkinaFaso() {
        // Données officielles de la "Calculatrice de paie" Banque Postale du Burkina Faso (BPBF)
        // Total brut = 447 525 FCFA composé de :
        // - Salaire de base : 224 217 FCFA
        // - Sursalaire : 28 308 FCFA
        // - Indemnité de caisse : 25 000 FCFA
        // - Indemnité de sujétion : 30 000 FCFA
        // - Indemnité de transport : 45 000 FCFA
        // - Indemnité de logement : 45 000 FCFA
        // - Indemnité de fonction / Cash Point : 50 000 FCFA
        // Total indemnités = 25 000 + 30 000 + 45 000 + 45 000 + 50 000 = 195 000 FCFA
        // Rémunération brute = 224 217 + 28 308 + 195 000 = 447 525 FCFA
        // Nombre de charges de famille : 2 (réduction IUTS = 10%)

        MoteurCalculPaie moteur = new MoteurCalculPaie();
        MoteurCalculPaie.EntreePaie entree = MoteurCalculPaie.EntreePaie.builder()
                .salaireBase(new BigDecimal("224217"))
                .surSalaire(new BigDecimal("28308"))
                .primeAnciennete(BigDecimal.ZERO)
                .indemniteCaisse(new BigDecimal("25000"))
                .indemniteSujetion(new BigDecimal("30000"))
                .indemniteTransport(new BigDecimal("45000"))
                .indemniteLogement(new BigDecimal("45000"))
                .indemniteFonction(new BigDecimal("50000"))
                .nombreCharges(2)
                .build();

        MoteurCalculPaie.ResultatPaie res = moteur.calculer(entree);
        assertNotNull(res);

        // 1. Total brut = 447 525 FCFA
        assertEquals(447525L, res.getRemunerationBrute());

        // 2. Base sécu = 447 525 FCFA
        assertEquals(447525L, res.getBaseCnss());

        // 3. Cotisation sécu (5.5%) = 24 614 FCFA
        assertEquals(24614L, res.getCotisationCnss());

        // 4. Part patronale (16%) = 71 604 FCFA
        assertEquals(71604L, res.getCotisationCnssPatronale());

        // 5. Rabattement sécu (8% sur salaire de base 224 217) = 17 937.36 FCFA
        assertEquals(17937.36, res.getRabattementSecu(), 0.01);

        // 6. Base de déductions (Total brut - Rabattement sécu) = 429 587.64 FCFA
        assertEquals(429587.64, res.getBaseDeductions(), 0.01);

        // 7. Rabattement transport = MIN(45 000 ; 5% * 429 587.64 = 21 479) = 21 479 FCFA
        assertEquals(21479L, res.getExoTransport());

        // 8. Rabattement fonction = MIN(50 000 ; 5% * 429 587.64 = 21 479) = 21 479 FCFA
        assertEquals(21479L, res.getExoFonction());

        // 9. Rabattement logement = MIN(45 000 ; 75 000) = 45 000 FCFA
        assertEquals(45000L, res.getExoLogement());

        // 10. Rabattement salaire de base (20% * (224 217 + 28 308) = 50 505) = 50 505 FCFA
        assertEquals(50505L, res.getRabattementSalaireBase());

        // 11. Total des rabattements = 17 937.36 + 21 479 + 21 479 + 45 000 + 50 505 = 156 400.36 FCFA
        assertEquals(156400.36, res.getTotalRabattements(), 0.01);

        // 12. Base imposable = 447 525 - 156 400.36 = 291 124.64 FCFA
        assertEquals(291124.64, res.getBaseImposableIuts(), 0.01);

        // 13. Net imposable = 291 125 FCFA
        assertEquals(291125L, Math.round(res.getBaseImposableIuts()));

        // 14. Salaires imposable = 252 525 - 50 505 - 17 937.36 = 184 082.64 FCFA
        assertEquals(184082.64, res.getSalairesImposable(), 0.01);

        // 15. Avantages imposables = 195 000 - 87 958 = 107 042 FCFA
        assertEquals(107042.0, res.getAvantagesImposables(), 0.01);

        // Invariant comptable : Salaires imposable + Avantages imposables == Base imposable
        assertEquals(res.getBaseImposableIuts(), res.getSalairesImposable() + res.getAvantagesImposables(), 0.01);

        // 16. IUTS progressif avec 2 charges = 44 735 FCFA
        assertEquals(44735L, res.getIutsNet());

        // 17. Cotisation Retraite Complémentaire CRRAE (6% sur 252 525) = 15 152 FCFA
        assertEquals(15152L, res.getCotisationCrrae());

        // 18. Cotisation TPA Patronale (3% sur 447 525) = 13 426 FCFA
        assertEquals(13426L, res.getCotisationTpaPatronale());

        // 19. Masse salariale totale employeur = 447 525 + 71 604 + 13 426 = 532 555 FCFA
        assertEquals(532555L, res.getMasseSalariale());
    }
}
