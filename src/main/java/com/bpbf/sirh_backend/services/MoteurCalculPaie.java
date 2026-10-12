package com.bpbf.sirh_backend.services;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * Moteur de calcul de paie unifié BPBF (Architecture V3).
 * Fonction pure sans dépendance d'affichage ni d'I/O.
 * Utilisé à la fois pour le simulateur de rémunération RH et les bulletins officiels.
 */
@Component
public class MoteurCalculPaie {

    public static final BigDecimal CENT = new BigDecimal("100");
    public static final BigDecimal PLAFOND_CNSS = new BigDecimal("800000.00");
    public static final BigDecimal TAUX_CNSS_SALARIE = new BigDecimal("5.50");
    public static final BigDecimal TAUX_CNSS_PATRONAL = new BigDecimal("16.00");
    public static final BigDecimal PLAFOND_ABATTEMENT = new BigDecimal("75000.00");
    public static final BigDecimal TAUX_CRRAE = new BigDecimal("6.00");
    public static final BigDecimal TAUX_FSP = new BigDecimal("1.00");

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EntreePaie {
        private BigDecimal salaireBase;
        private BigDecimal surSalaire;
        private BigDecimal primeAnciennete;
        private BigDecimal indemniteLogement;
        private BigDecimal indemniteTransport;
        private BigDecimal indemniteFonction;
        private BigDecimal indemniteCaisse;
        private BigDecimal indemniteSujetion;
        private BigDecimal indemniteCashPoint;
        private BigDecimal autresIndemnites;
        private int nombreCharges;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResultatPaie {
        private long salaireBase;
        private long surSalaire;
        private long primeAnciennete;
        private long indemniteLogement;
        private long indemniteTransport;
        private long indemniteFonction;
        private long indemniteCaisse;
        private long indemniteSujetion;
        private long indemniteCashPoint;
        private long autresIndemnites;
        private long totalIndemnites;
        private long remunerationBrute;

        // CNSS
        private long baseCnss;
        private double tauxCnssSalarial;
        private long cotisationCnss;
        private double brutApresCnss;

        // IUTS
        private double totalExonerations;
        private double abattementForfaitaire;
        private double baseImposableIuts;
        private long baseIutsTronquee;
        private long iutsBrut;
        private int nombreCharges;
        private double tauxReductionCharges;
        private long reductionIutsCharges;
        private long iutsNet;

        // CRRAE
        private long baseCrrae;
        private double tauxCrrae;
        private long cotisationCrrae;

        // FSP
        private long netCedulaire;
        private double tauxFsp;
        private long cotisationFsp;

        // Synthèse Salarié
        private long totalRetenuesSalariales;
        private long salaireNet;

        // Employeur
        private long cotisationCnssPatronale;
        private long totalChargesPatronales;
        private long coutTotalEmployeur;

        // Lignes détaillées
        private List<LigneDetail> lignes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LigneDetail {
        private String code;
        private String libelle;
        private String type; // "GAIN", "RETENUE_SALARIALE", "RETENUE_PATRONALE"
        private Double base;
        private Double taux;
        private Double montantGain;
        private Double montantRetenue;
    }

    public ResultatPaie calculer(EntreePaie entree) {
        BigDecimal sb = entree.getSalaireBase() != null ? entree.getSalaireBase() : BigDecimal.ZERO;
        BigDecimal ss = entree.getSurSalaire() != null ? entree.getSurSalaire() : BigDecimal.ZERO;
        BigDecimal pa = entree.getPrimeAnciennete() != null ? entree.getPrimeAnciennete() : BigDecimal.ZERO;

        BigDecimal log = entree.getIndemniteLogement() != null ? entree.getIndemniteLogement() : BigDecimal.ZERO;
        BigDecimal trp = entree.getIndemniteTransport() != null ? entree.getIndemniteTransport() : BigDecimal.ZERO;
        BigDecimal fnc = entree.getIndemniteFonction() != null ? entree.getIndemniteFonction() : BigDecimal.ZERO;
        BigDecimal cai = entree.getIndemniteCaisse() != null ? entree.getIndemniteCaisse() : BigDecimal.ZERO;
        BigDecimal suj = entree.getIndemniteSujetion() != null ? entree.getIndemniteSujetion() : BigDecimal.ZERO;
        BigDecimal csh = entree.getIndemniteCashPoint() != null ? entree.getIndemniteCashPoint() : BigDecimal.ZERO;
        BigDecimal aut = entree.getAutresIndemnites() != null ? entree.getAutresIndemnites() : BigDecimal.ZERO;

        int charges = Math.max(0, entree.getNombreCharges());

        BigDecimal totalIndem = log.add(trp).add(fnc).add(cai).add(suj).add(csh).add(aut);
        BigDecimal remunerationBrute = sb.add(ss).add(pa).add(totalIndem);

        // 1. Cotisation CNSS (5.5% plafonnée à 800 000 FCFA)
        BigDecimal baseCnss = remunerationBrute.min(PLAFOND_CNSS);
        BigDecimal cotisCnss = baseCnss.multiply(TAUX_CNSS_SALARIE).divide(CENT, 2, RoundingMode.HALF_UP);
        BigDecimal cotisCnssArrondi = cotisCnss.setScale(0, RoundingMode.CEILING);
        BigDecimal brutApresCnss = remunerationBrute.subtract(cotisCnssArrondi).max(BigDecimal.ZERO);

        // 2. Exonérations fiscales CGI BF Art. 106 (Logement max 20% brut après CNSS plafonné à 75k, Transport max 5% plafonné à 30k)
        BigDecimal limiteLogement = brutApresCnss.multiply(new BigDecimal("0.20")).min(new BigDecimal("75000.00"));
        BigDecimal exoLogement = log.min(limiteLogement);

        BigDecimal limiteTransport = brutApresCnss.multiply(new BigDecimal("0.05")).min(new BigDecimal("30000.00"));
        BigDecimal exoTransport = trp.min(limiteTransport);

        BigDecimal totalExonerations = exoLogement.add(exoTransport).setScale(0, RoundingMode.CEILING);

        // 3. Abattement forfaitaire légal 20% plafonné à 75 000 FCFA
        BigDecimal abattementForfaitaire = brutApresCnss.multiply(new BigDecimal("0.20")).min(PLAFOND_ABATTEMENT).setScale(0, RoundingMode.CEILING);

        // 4. Base imposable IUTS
        BigDecimal baseImposableReelle = brutApresCnss.subtract(totalExonerations).subtract(abattementForfaitaire).max(BigDecimal.ZERO);
        BigDecimal baseIutsTronquee = baseImposableReelle.divideToIntegralValue(CENT).multiply(CENT);

        // 5. Calcul IUTS progressif
        BigDecimal iutsBrut = calculerIutsProgressif(baseIutsTronquee);

        // 6. Réduction pour charges de famille
        BigDecimal tauxReduction = reductionRate(charges);
        BigDecimal reductionCharges = iutsBrut.multiply(tauxReduction).divide(CENT, 0, RoundingMode.HALF_UP);
        BigDecimal iutsNetArrondi = iutsBrut.subtract(reductionCharges).max(BigDecimal.ZERO).setScale(0, RoundingMode.CEILING);

        // 7. Retraite Complémentaire CRRAE (6% sur Salaire Base + Sursalaire + Ancienneté)
        BigDecimal baseCrrae = sb.add(ss).add(pa);
        BigDecimal cotisCrraeArrondi = baseCrrae.multiply(TAUX_CRRAE).divide(CENT, 2, RoundingMode.HALF_UP).setScale(0, RoundingMode.CEILING);

        // 8. Fonds de Soutien Patriotique FSP (1% sur Net Cédulaire)
        BigDecimal netCedulaire = remunerationBrute.setScale(0, RoundingMode.CEILING)
                .subtract(cotisCnssArrondi).subtract(iutsNetArrondi).max(BigDecimal.ZERO);
        BigDecimal cotisFspArrondi = netCedulaire.multiply(TAUX_FSP).divide(CENT, 2, RoundingMode.HALF_UP).setScale(0, RoundingMode.CEILING);

        // 9. Synthèse des retenues salariales totales
        BigDecimal totalRetenues = cotisCnssArrondi.add(cotisCrraeArrondi).add(cotisFspArrondi).add(iutsNetArrondi);
        BigDecimal salaireNet = remunerationBrute.setScale(0, RoundingMode.CEILING).subtract(totalRetenues);

        // 10. Charges patronales CNSS (16% plafonnée)
        BigDecimal cotisPatronale = baseCnss.multiply(TAUX_CNSS_PATRONAL).divide(CENT, 0, RoundingMode.HALF_UP);
        BigDecimal coutTotal = remunerationBrute.setScale(0, RoundingMode.CEILING).add(cotisPatronale);

        // Lignes détaillées
        List<LigneDetail> lignes = new ArrayList<>();
        lignes.add(new LigneDetail("SB", "Salaire de base (Grille)", "GAIN", sb.doubleValue(), null, sb.doubleValue(), 0.0));
        if (ss.compareTo(BigDecimal.ZERO) > 0) {
            lignes.add(new LigneDetail("SS", "Sursalaire proposé", "GAIN", ss.doubleValue(), null, ss.doubleValue(), 0.0));
        }
        if (pa.compareTo(BigDecimal.ZERO) > 0) {
            lignes.add(new LigneDetail("PR_ANC", "Prime d'ancienneté", "GAIN", pa.doubleValue(), null, pa.doubleValue(), 0.0));
        }
        if (log.compareTo(BigDecimal.ZERO) > 0) {
            lignes.add(new LigneDetail("IND_LOG", "Indemnité de logement", "GAIN", log.doubleValue(), null, log.doubleValue(), 0.0));
        }
        if (trp.compareTo(BigDecimal.ZERO) > 0) {
            lignes.add(new LigneDetail("IND_TRP", "Indemnité de transport", "GAIN", trp.doubleValue(), null, trp.doubleValue(), 0.0));
        }
        if (suj.compareTo(BigDecimal.ZERO) > 0) {
            lignes.add(new LigneDetail("IND_SUJ", "Indemnité de sujétion (Statutaire)", "GAIN", suj.doubleValue(), null, suj.doubleValue(), 0.0));
        }
        if (fnc.compareTo(BigDecimal.ZERO) > 0) {
            lignes.add(new LigneDetail("IND_FNC", "Indemnité de fonction", "GAIN", fnc.doubleValue(), null, fnc.doubleValue(), 0.0));
        }
        if (cai.compareTo(BigDecimal.ZERO) > 0) {
            lignes.add(new LigneDetail("IND_CAI", "Indemnité de caisse", "GAIN", cai.doubleValue(), null, cai.doubleValue(), 0.0));
        }
        if (csh.compareTo(BigDecimal.ZERO) > 0) {
            lignes.add(new LigneDetail("IND_CASH", "Prime Cash Point", "GAIN", csh.doubleValue(), null, csh.doubleValue(), 0.0));
        }
        if (aut.compareTo(BigDecimal.ZERO) > 0) {
            lignes.add(new LigneDetail("IND_AUT", "Autres indemnités spécifiques", "GAIN", aut.doubleValue(), null, aut.doubleValue(), 0.0));
        }

        // Retenues salariales
        lignes.add(new LigneDetail("CNSS_SAL", "Cotisation CNSS (Salariale 5.5%)", "RETENUE_SALARIALE", baseCnss.doubleValue(), 5.5, 0.0, cotisCnssArrondi.doubleValue()));
        lignes.add(new LigneDetail("CRRAE_SAL", "Cotisation Retraite Complémentaire CRRAE (6%)", "RETENUE_SALARIALE", baseCrrae.doubleValue(), 6.0, 0.0, cotisCrraeArrondi.doubleValue()));
        lignes.add(new LigneDetail("FSP_SAL", "Fonds de Soutien Patriotique - FSP (1% Net Cédulaire)", "RETENUE_SALARIALE", netCedulaire.doubleValue(), 1.0, 0.0, cotisFspArrondi.doubleValue()));
        lignes.add(new LigneDetail("IUTS_NET", "Impôt IUTS (après " + charges + " chg / -" + tauxReduction + "%)", "RETENUE_SALARIALE", baseIutsTronquee.doubleValue(), null, 0.0, iutsNetArrondi.doubleValue()));

        // Charge patronale
        lignes.add(new LigneDetail("CNSS_PAT", "Cotisation CNSS Patronale (16%)", "RETENUE_PATRONALE", baseCnss.doubleValue(), 16.0, 0.0, cotisPatronale.doubleValue()));

        return ResultatPaie.builder()
                .salaireBase(sb.longValue())
                .surSalaire(ss.longValue())
                .primeAnciennete(pa.longValue())
                .indemniteLogement(log.longValue())
                .indemniteTransport(trp.longValue())
                .indemniteFonction(fnc.longValue())
                .indemniteCaisse(cai.longValue())
                .indemniteSujetion(suj.longValue())
                .indemniteCashPoint(csh.longValue())
                .autresIndemnites(aut.longValue())
                .totalIndemnites(totalIndem.longValue())
                .remunerationBrute(remunerationBrute.longValue())
                .baseCnss(baseCnss.longValue())
                .tauxCnssSalarial(5.5)
                .cotisationCnss(cotisCnssArrondi.longValue())
                .brutApresCnss(brutApresCnss.doubleValue())
                .totalExonerations(totalExonerations.doubleValue())
                .abattementForfaitaire(abattementForfaitaire.doubleValue())
                .baseImposableIuts(baseImposableReelle.doubleValue())
                .baseIutsTronquee(baseIutsTronquee.longValue())
                .iutsBrut(iutsBrut.setScale(0, RoundingMode.CEILING).longValue())
                .nombreCharges(charges)
                .tauxReductionCharges(tauxReduction.doubleValue())
                .reductionIutsCharges(reductionCharges.longValue())
                .iutsNet(iutsNetArrondi.longValue())
                .baseCrrae(baseCrrae.longValue())
                .tauxCrrae(6.0)
                .cotisationCrrae(cotisCrraeArrondi.longValue())
                .netCedulaire(netCedulaire.longValue())
                .tauxFsp(1.0)
                .cotisationFsp(cotisFspArrondi.longValue())
                .totalRetenuesSalariales(totalRetenues.longValue())
                .salaireNet(salaireNet.longValue())
                .cotisationCnssPatronale(cotisPatronale.longValue())
                .totalChargesPatronales(cotisPatronale.longValue())
                .coutTotalEmployeur(coutTotal.longValue())
                .lignes(lignes)
                .build();
    }

    public static BigDecimal calculerIutsProgressif(BigDecimal base) {
        if (base == null || base.compareTo(BigDecimal.ZERO) <= 0) return BigDecimal.ZERO;
        BigDecimal result;
        if (base.compareTo(new BigDecimal("250000")) > 0) {
            result = new BigDecimal("39430").add(base.subtract(new BigDecimal("250000")).multiply(new BigDecimal("0.25")));
        } else if (base.compareTo(new BigDecimal("170000")) > 0) {
            result = new BigDecimal("22070").add(base.subtract(new BigDecimal("170000")).multiply(new BigDecimal("0.217")));
        } else if (base.compareTo(new BigDecimal("120000")) > 0) {
            result = new BigDecimal("12870").add(base.subtract(new BigDecimal("120000")).multiply(new BigDecimal("0.184")));
        } else if (base.compareTo(new BigDecimal("80000")) > 0) {
            result = new BigDecimal("6590").add(base.subtract(new BigDecimal("80000")).multiply(new BigDecimal("0.157")));
        } else if (base.compareTo(new BigDecimal("50000")) > 0) {
            result = new BigDecimal("2420").add(base.subtract(new BigDecimal("50000")).multiply(new BigDecimal("0.139")));
        } else if (base.compareTo(new BigDecimal("30000")) > 0) {
            result = base.subtract(new BigDecimal("30000")).multiply(new BigDecimal("0.121"));
        } else {
            result = BigDecimal.ZERO;
        }
        return result;
    }

    public static BigDecimal reductionRate(int charges) {
        if (charges == 1) return new BigDecimal("8.00");
        if (charges == 2) return new BigDecimal("10.00");
        if (charges == 3) return new BigDecimal("12.00");
        if (charges >= 4) return new BigDecimal("14.00");
        return BigDecimal.ZERO;
    }
}
