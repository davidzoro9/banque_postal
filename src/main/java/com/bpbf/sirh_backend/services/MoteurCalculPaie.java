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

        // Cascade BPBF (Calculatrice de paie)
        private double rabattementSecu;
        private double baseDeductions;
        private long exoLogement;
        private long exoTransport;
        private long exoFonction;
        private long totalExoIndemnites;
        private long rabattementSalaireBase;
        private double totalRabattements;
        private double salairesImposable;
        private double avantagesImposables;

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
        private long cotisationTpaPatronale;
        private long totalChargesPatronales;
        private long masseSalariale;
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

        // 1. Cotisation CNSS Salariale (5.5% plafonnée à 800 000 FCFA)
        BigDecimal baseCnss = remunerationBrute.min(PLAFOND_CNSS);
        BigDecimal cotisCnss = baseCnss.multiply(TAUX_CNSS_SALARIE).divide(CENT, 2, RoundingMode.HALF_UP);
        BigDecimal cotisCnssArrondi = cotisCnss.setScale(0, RoundingMode.CEILING);
        BigDecimal brutApresCnss = remunerationBrute.subtract(cotisCnssArrondi).max(BigDecimal.ZERO);

        // 2. Cotisation CNSS Patronale (16% plafonnée)
        BigDecimal cotisPatronale = baseCnss.multiply(TAUX_CNSS_PATRONAL).divide(CENT, 0, RoundingMode.HALF_UP);

        // 3. Rabattement Sécu (8% du Salaire de Base selon Circulaire BPBF / Calculatrice de paie)
        BigDecimal rabattementSecu = sb.multiply(new BigDecimal("0.08")).setScale(2, RoundingMode.HALF_UP);

        // 4. Base de déductions (Total Brut - Rabattement Sécu)
        BigDecimal baseDeductions = remunerationBrute.subtract(rabattementSecu).max(BigDecimal.ZERO);

        // 5. Exonérations des indemnités (calculées sur Base de déductions)
        BigDecimal limiteTransport = baseDeductions.multiply(new BigDecimal("0.05")).min(new BigDecimal("30000.00"));
        BigDecimal exoTransport = trp.min(limiteTransport).setScale(0, RoundingMode.HALF_UP);

        BigDecimal limiteFonction = baseDeductions.multiply(new BigDecimal("0.05")).min(new BigDecimal("50000.00"));
        BigDecimal exoFonction = fnc.min(limiteFonction).setScale(0, RoundingMode.HALF_UP);

        BigDecimal limiteLogement = new BigDecimal("75000.00");
        BigDecimal exoLogement = log.min(limiteLogement).setScale(0, RoundingMode.HALF_UP);

        BigDecimal totalExoIndemnites = exoTransport.add(exoFonction).add(exoLogement);

        // 6. Rabattement Salaire de Base (Abattement forfaitaire 20% sur salaire base + sursalaire + prime ancienneté, plafonné à 75 000 FCFA)
        BigDecimal baseSalaireFixe = sb.add(ss).add(pa);
        BigDecimal rabattementSalaireBase = baseSalaireFixe.multiply(new BigDecimal("0.20")).min(PLAFOND_ABATTEMENT).setScale(0, RoundingMode.CEILING);

        // 7. Total des rabattements déductibles
        BigDecimal totalRabattements = rabattementSecu.add(totalExoIndemnites).add(rabattementSalaireBase);

        // 8. Base imposable IUTS et arrondi
        BigDecimal baseImposableReelle = remunerationBrute.subtract(totalRabattements).max(BigDecimal.ZERO);
        BigDecimal netImposable = baseImposableReelle.setScale(0, RoundingMode.HALF_UP);
        BigDecimal baseIutsTronquee = netImposable.divideToIntegralValue(CENT).multiply(CENT);

        // 9. Ventilation Salaires imposable et Avantages imposables
        BigDecimal salairesImposable = baseSalaireFixe.subtract(rabattementSalaireBase).subtract(rabattementSecu).max(BigDecimal.ZERO);
        BigDecimal avantagesImposables = totalIndem.subtract(totalExoIndemnites).max(BigDecimal.ZERO);

        // 10. Calcul IUTS progressif
        BigDecimal iutsBrut = calculerIutsProgressif(baseIutsTronquee);

        // 11. Réduction pour charges de famille
        BigDecimal tauxReduction = reductionRate(charges);
        BigDecimal reductionChargesExacte = iutsBrut.multiply(tauxReduction).divide(CENT, 8, RoundingMode.HALF_UP);
        BigDecimal iutsNetArrondi = iutsBrut.subtract(reductionChargesExacte).max(BigDecimal.ZERO).setScale(0, RoundingMode.CEILING);
        BigDecimal reductionCharges = iutsBrut.subtract(iutsNetArrondi);

        // 12. Retraite Complémentaire CRRAE (6% sur Salaire Base + Sursalaire + Ancienneté)
        BigDecimal baseCrrae = sb.add(ss).add(pa);
        BigDecimal cotisCrraeArrondi = baseCrrae.multiply(TAUX_CRRAE).divide(CENT, 2, RoundingMode.HALF_UP).setScale(0, RoundingMode.CEILING);

        // 13. Fonds de Soutien Patriotique FSP (1% sur Net Cédulaire = Brut - CNSS - IUTS)
        BigDecimal netCedulaire = remunerationBrute.setScale(0, RoundingMode.CEILING)
                .subtract(cotisCnssArrondi).subtract(iutsNetArrondi).max(BigDecimal.ZERO);
        BigDecimal cotisFspArrondi = netCedulaire.multiply(TAUX_FSP).divide(CENT, 2, RoundingMode.HALF_UP).setScale(0, RoundingMode.CEILING);

        // 14. Synthèse des retenues salariales totales et Net à payer
        BigDecimal totalRetenues = cotisCnssArrondi.add(cotisCrraeArrondi).add(cotisFspArrondi).add(iutsNetArrondi);
        BigDecimal salaireNet = remunerationBrute.setScale(0, RoundingMode.CEILING).subtract(totalRetenues);

        // 15. TPA (3%) et Masse Salariale Employeur
        BigDecimal tpaPatronale = remunerationBrute.multiply(new BigDecimal("0.03")).setScale(0, RoundingMode.HALF_UP);
        BigDecimal totalChargesPatronales = cotisPatronale.add(tpaPatronale);
        BigDecimal masseSalariale = remunerationBrute.setScale(0, RoundingMode.CEILING).add(totalChargesPatronales);

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

        // Charges patronales
        lignes.add(new LigneDetail("CNSS_PAT", "Cotisation CNSS Patronale (16%)", "RETENUE_PATRONALE", baseCnss.doubleValue(), 16.0, 0.0, cotisPatronale.doubleValue()));
        lignes.add(new LigneDetail("TPA_PAT", "Taxe Patronale d'Apprentissage - TPA (3%)", "RETENUE_PATRONALE", remunerationBrute.doubleValue(), 3.0, 0.0, tpaPatronale.doubleValue()));

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
                .rabattementSecu(rabattementSecu.doubleValue())
                .baseDeductions(baseDeductions.doubleValue())
                .exoLogement(exoLogement.longValue())
                .exoTransport(exoTransport.longValue())
                .exoFonction(exoFonction.longValue())
                .totalExoIndemnites(totalExoIndemnites.longValue())
                .rabattementSalaireBase(rabattementSalaireBase.longValue())
                .totalRabattements(totalRabattements.doubleValue())
                .salairesImposable(salairesImposable.doubleValue())
                .avantagesImposables(avantagesImposables.doubleValue())
                .totalExonerations(totalExoIndemnites.doubleValue())
                .abattementForfaitaire(rabattementSalaireBase.doubleValue())
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
                .cotisationTpaPatronale(tpaPatronale.longValue())
                .totalChargesPatronales(totalChargesPatronales.longValue())
                .masseSalariale(masseSalariale.longValue())
                .coutTotalEmployeur(masseSalariale.longValue())
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
