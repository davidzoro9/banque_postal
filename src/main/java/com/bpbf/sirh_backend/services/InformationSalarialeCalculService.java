package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.InformationSalarialeDto;
import com.bpbf.sirh_backend.dtos.InformationSalarialeRetenueDto;
import com.bpbf.sirh_backend.entities.*;
import com.bpbf.sirh_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class InformationSalarialeCalculService {
    private static final BigDecimal CENT = new BigDecimal("100");

    private final InformationSalarialeRepository informationRepository;
    private final InformationSalarialeRetenueRepository informationRetenueRepository;
    private final SituationSalarialeRepository situationRepository;
    private final IndemniteEmployeRepository indemniteRepository;
    private final ExonerationEmployeRepository exonerationRepository;
    private final FamilleEmployeRepository familleRepository;
    private final RetenueRepository retenueRepository;
    private final com.bpbf.sirh_backend.repositories.EmployeeRepository employeeRepository;

    @Transactional
    public void recalculateAll() {
        List<Employee> all = employeeRepository.findAll();
        for (Employee e : all) {
            try {
                recalculate(e);
            } catch (Exception ignored) {}
        }
    }

    @Transactional
    public InformationSalariale recalculate(Employee employee) {
        InformationSalariale information = informationRepository.findByEmployeeId(employee.getId())
                .orElseGet(InformationSalariale::new);
        information.setEmployee(employee);

        SituationSalariale situation = situationRepository.findByEmployeeId(employee.getId()).orElse(null);
        BigDecimal salaireBase = BigDecimal.ZERO;
        if (situation != null && situation.getSalaireBase() != null && situation.getSalaireBase() > 0) {
            salaireBase = money(new BigDecimal(situation.getSalaireBase()));
        } else if (situation != null && situation.getGrilleSalariale() != null && situation.getGrilleSalariale().getBasicSalary() != null) {
            salaireBase = money(situation.getGrilleSalariale().getBasicSalary());
        } else if (employee.getGrilleSalariale() != null && employee.getGrilleSalariale().getBasicSalary() != null) {
            salaireBase = money(employee.getGrilleSalariale().getBasicSalary());
        }

        BigDecimal surSalaire = BigDecimal.ZERO;
        if (situation != null && situation.getSurSalaire() != null && situation.getSurSalaire() > 0) {
            surSalaire = money(new BigDecimal(situation.getSurSalaire()));
        } else if (employee.getSurSalaire() != null && employee.getSurSalaire() > 0) {
            surSalaire = money(new BigDecimal(employee.getSurSalaire()));
        }
        information.setSurSalaire(surSalaire);

        // Retrait des indemnités si l'agent a déjà un avantage (véhicule, maison/logement)
        List<IndemniteEmploye> indemnites = indemniteRepository.findByEmployeeId(employee.getId()).stream()
                .filter(row -> !Boolean.FALSE.equals(row.getActif()))
                .filter(row -> {
                    String code = (row.getTypeIndemnite() != null && row.getTypeIndemnite().getCode() != null)
                            ? row.getTypeIndemnite().getCode().toUpperCase() : "";
                    String lib = row.getLibelle() != null ? row.getLibelle().toUpperCase() : "";
                    if (Boolean.TRUE.equals(employee.getVehiculeFourni()) && (code.contains("TRP") || code.contains("TRANS") || lib.contains("TRANSPORT") || lib.contains("DEPLACEMENT"))) {
                        return false;
                    }
                    if (Boolean.TRUE.equals(employee.getLogementFourni()) && (code.contains("LOG") || code.contains("MAISON") || lib.contains("LOGEMENT"))) {
                        return false;
                    }
                    return true;
                })
                .toList();

        BigDecimal totalIndemnites = indemnites.stream()
                .map(row -> money(row.getMontant()))
                .reduce(zero(), BigDecimal::add);

        // Prime d'ancienneté : 5% sur le SB à 3 ans, puis +1% par année supplémentaire
        BigDecimal tauxAnciennete = BigDecimal.ZERO;
        int anneesAnciennete = (employee.getAncienneteReprise() != null && employee.getAncienneteReprise() > 0) ? employee.getAncienneteReprise() : 0;
        if (employee.getDateEmbauche() != null && !employee.getDateEmbauche().isBlank()) {
            try {
                java.time.LocalDate dateEmb = java.time.LocalDate.parse(employee.getDateEmbauche().trim());
                anneesAnciennete += Math.max(0, java.time.Period.between(dateEmb, java.time.LocalDate.now()).getYears());
            } catch (Exception ignored) {}
        }
        if (anneesAnciennete == 3) {
            tauxAnciennete = new BigDecimal("5.00");
        } else if (anneesAnciennete > 3) {
            tauxAnciennete = new BigDecimal(5 + (anneesAnciennete - 3)).setScale(2, RoundingMode.HALF_UP);
        }
        BigDecimal primeAnciennete = money(calculatePercentage(salaireBase, tauxAnciennete));

        BigDecimal remunerationBrute = money(salaireBase.add(surSalaire).add(totalIndemnites).add(primeAnciennete));
        BigDecimal baseCnss = remunerationBrute.min(new BigDecimal("800000.00"));
        BigDecimal cotisCnssAgent = money(calculatePercentage(baseCnss, new BigDecimal("5.50")));
        BigDecimal brutApresCnss = money(remunerationBrute.subtract(cotisCnssAgent).max(BigDecimal.ZERO));

        // Exonérations fiscales : prioritaires depuis la persistance PostgreSQL (exoneration_employe)
        List<ExonerationEmploye> exosEmploye = exonerationRepository.findByEmployeeId(employee.getId());
        BigDecimal totalExonerations = BigDecimal.ZERO;
        if (exosEmploye != null && !exosEmploye.isEmpty()) {
            for (ExonerationEmploye exo : exosEmploye) {
                if (exo.getMontant() != null && exo.getMontant() > 0) {
                    totalExonerations = totalExonerations.add(money(BigDecimal.valueOf(exo.getMontant())));
                }
            }
        } else {
            for (IndemniteEmploye ind : indemnites) {
                BigDecimal mIndem = money(ind.getMontant());
                if (mIndem.compareTo(BigDecimal.ZERO) <= 0) continue;

                TypeIndemnite type = ind.getTypeIndemnite();
                if (type == null) continue;

                BigDecimal tauxExo = (type.getTauxExoneration() != null && type.getTauxExoneration() > 0)
                        ? BigDecimal.valueOf(type.getTauxExoneration()) : BigDecimal.ZERO;
                BigDecimal plafondExo = (type.getPlafondExoneration() != null && type.getPlafondExoneration() > 0)
                        ? BigDecimal.valueOf(type.getPlafondExoneration()) : BigDecimal.ZERO;

                if (tauxExo.compareTo(BigDecimal.ZERO) > 0 || plafondExo.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal premiereLimite = (tauxExo.compareTo(BigDecimal.ZERO) > 0)
                            ? calculatePercentage(brutApresCnss, tauxExo)
                            : mIndem;
                    BigDecimal exo = mIndem.min(premiereLimite);
                    if (plafondExo.compareTo(BigDecimal.ZERO) > 0) {
                        exo = exo.min(plafondExo);
                    }
                    totalExonerations = totalExonerations.add(money(exo));
                }
            }
        }

        // Abattement forfaitaire légal : 20% du brut après CNSS plafonné à 75 000 FCFA
        Categorie cat = situation != null ? situation.getCategorie() : null;
        if (cat == null && situation != null && situation.getGrilleSalariale() != null) {
            cat = situation.getGrilleSalariale().getCategorieObj();
        }
        if (cat == null && employee.getCategorieObj() != null) {
            cat = employee.getCategorieObj();
        }
        BigDecimal tauxAbattement = new BigDecimal("20.00");
        if (cat != null && cat.getTauxAbattement() != null && cat.getTauxAbattement() > 0) {
            tauxAbattement = money(cat.getTauxAbattement());
            if (tauxAbattement.compareTo(BigDecimal.ONE) <= 0) {
                tauxAbattement = tauxAbattement.multiply(CENT);
            }
        }
        BigDecimal abattementCalcule = calculatePercentage(brutApresCnss, tauxAbattement);
        BigDecimal abattementForfaitaire = money(abattementCalcule.min(new BigDecimal("75000.00")));

        // Base Imposable IUTS = Brut (après CNSS) - Total Exonérations - Abattement Forfaitaire
        BigDecimal baseImposable = money(brutApresCnss.subtract(totalExonerations).subtract(abattementForfaitaire).max(BigDecimal.ZERO));

        information.setSalaireBase(salaireBase);
        information.setTotalIndemnites(totalIndemnites);
        information.setRemunerationBrute(remunerationBrute);
        information.setTotalExonerations(totalExonerations);
        information.setAbattementForfaitaire(abattementForfaitaire);
        information.setBaseImposable(baseImposable);
        information = informationRepository.save(information);

        informationRetenueRepository.deleteByInformationSalarialeId(information.getId());
        informationRetenueRepository.flush();

        // Calcul IUTS et Net Cédulaire avant la boucle des retenues
        int nombreCharges = Math.toIntExact(familleRepository.countByEmployeeIdAndEstChargeTrue(employee.getId()));
        BigDecimal iutsSansCharge = calculateIuts(baseImposable);
        BigDecimal tauxReduction = reductionRate(nombreCharges);
        BigDecimal reduction = money(iutsSansCharge.multiply(tauxReduction).divide(CENT, 8, RoundingMode.HALF_UP));
        BigDecimal iutsAvecCharge = money(iutsSansCharge.subtract(reduction).max(BigDecimal.ZERO));
        BigDecimal netCedulaire = money(remunerationBrute.subtract(cotisCnssAgent).subtract(iutsAvecCharge).max(BigDecimal.ZERO));

        // Base CRRAE = SB + SS + Prime Ancienneté
        BigDecimal baseCrrae = money(salaireBase.add(surSalaire).add(primeAnciennete));

        BigDecimal totalAgent = zero();
        BigDecimal totalEmployeur = zero();
        for (Retenue retenue : findApplicableRetenues(employee)) {
            if (retenue == null || isIuts(retenue)) continue;

            String retCode = retenue.getCode() != null ? retenue.getCode().toUpperCase() : "";
            String retLib = retenue.getLibelle() != null ? retenue.getLibelle().toUpperCase() : "";
            BigDecimal montantBase;
            BigDecimal taux = money(retenue.getTaux());
            boolean employeur = isEmployeur(retenue);
            BigDecimal montant;

            if (retCode.contains("CNSS") || retLib.contains("CNSS")) {
                montantBase = baseCnss;
                if (!employeur) {
                    taux = new BigDecimal("5.50");
                }
                montant = employeur ? money(calculatePercentage(baseCnss, taux)) : cotisCnssAgent;
            } else if (retCode.contains("CRRAE") || retLib.contains("CRRAE")) {
                montantBase = baseCrrae;
                montant = money(calculatePercentage(montantBase, taux));
            } else if (retCode.contains("SOLIDAR") || retLib.contains("SOLIDAR") || retCode.contains("FSP")) {
                montantBase = netCedulaire;
                montant = money(calculatePercentage(montantBase, taux));
            } else {
                montantBase = resolveBase(retenue.getBaseCalcul(), salaireBase, surSalaire, primeAnciennete, remunerationBrute, baseImposable);
                montant = money(calculatePercentage(montantBase, taux));
            }

            InformationSalarialeRetenue line = new InformationSalarialeRetenue();
            line.setInformationSalariale(information);
            line.setRetenue(retenue);
            line.setCode(retenue.getCode());
            line.setLibelle(retenue.getLibelle());
            line.setTypeRetenueCode(retenue.getTypeRetenue() != null && retenue.getTypeRetenue().getCode() != null
                    ? retenue.getTypeRetenue().getCode() : (employeur ? "EMPLOYEUR" : "AGENT"));
            line.setBaseCalcul(retenue.getBaseCalcul() == null
                    ? BaseCalculRetenue.REMUNERATION_BRUTE : retenue.getBaseCalcul());
            line.setMontantBase(montantBase);
            line.setTaux(taux);
            line.setMontantCalcule(montant);
            informationRetenueRepository.save(line);

            if (employeur) totalEmployeur = totalEmployeur.add(montant);
            else totalAgent = totalAgent.add(montant);
        }

        BigDecimal totalDeduit = money(totalAgent.add(iutsAvecCharge));
        BigDecimal salaireNet = money(remunerationBrute.subtract(totalDeduit).max(BigDecimal.ZERO));

        information.setTotalRetenuesAgent(money(totalAgent));
        information.setTotalRetenuesEmployeur(money(totalEmployeur));
        information.setNombrePersonnesCharge(nombreCharges);
        information.setIutsSansCharge(iutsSansCharge);
        information.setTauxReductionCharge(tauxReduction);
        information.setReductionIutsCharge(reduction);
        information.setIutsAvecCharge(iutsAvecCharge);
        information.setTotalDeduitEmploye(totalDeduit);
        information.setSalaireNet(salaireNet);
        return informationRepository.save(information);
    }

    @Transactional(readOnly = true)
    public InformationSalarialeDto toDto(InformationSalariale information) {
        List<InformationSalarialeRetenueDto> agent = new ArrayList<>();
        List<InformationSalarialeRetenueDto> employeur = new ArrayList<>();
        for (InformationSalarialeRetenue line : informationRetenueRepository
                .findByInformationSalarialeIdOrderByLibelleAsc(information.getId())) {
            InformationSalarialeRetenueDto dto = new InformationSalarialeRetenueDto(
                    line.getId(), line.getRetenue().getId(), line.getCode(), line.getLibelle(),
                    line.getTypeRetenueCode(), line.getBaseCalcul(), line.getMontantBase(),
                    line.getTaux(), line.getMontantCalcule());
            if (isEmployeur(line.getRetenue())) employeur.add(dto);
            else agent.add(dto);
        }

        InformationSalarialeDto dto = new InformationSalarialeDto();
        dto.setId(information.getId());
        dto.setEmployeeId(information.getEmployee().getId());
        dto.setModePaiement(information.getModePaiement());
        dto.setBanque(information.getBanque());
        dto.setIban(information.getIban());
        dto.setIntituleCompte(information.getIntituleCompte());
        dto.setSalaireBase(information.getSalaireBase());
        dto.setSurSalaire(information.getSurSalaire());
        dto.setIndemnites(indemniteRepository.findByEmployeeId(information.getEmployee().getId()).stream()
                .filter(row -> !Boolean.FALSE.equals(row.getActif()))
                .map(row -> new com.bpbf.sirh_backend.dtos.IndemniteEmployeDto(
                        row.getId(), row.getTypeIndemnite().getId(), row.getTypeIndemnite().getCode(),
                        row.getLibelle(), row.getEmployee().getId(),
                        row.getParametrageIndemnite() == null ? null : row.getParametrageIndemnite().getId(),
                        row.getMontant(), row.getActif()))
                .toList());
        dto.setTotalIndemnites(information.getTotalIndemnites());
        dto.setRemunerationBrute(information.getRemunerationBrute());
        dto.setTotalExonerations(information.getTotalExonerations());
        dto.setAbattementForfaitaire(information.getAbattementForfaitaire());
        dto.setBaseImposable(information.getBaseImposable());
        dto.setRetenuesAgent(agent);
        dto.setTotalRetenuesAgent(information.getTotalRetenuesAgent());
        dto.setRetenuesEmployeur(employeur);
        dto.setTotalRetenuesEmployeur(information.getTotalRetenuesEmployeur());
        dto.setNombrePersonnesCharge(information.getNombrePersonnesCharge());
        dto.setIutsSansCharge(information.getIutsSansCharge());
        dto.setTauxReductionCharge(information.getTauxReductionCharge());
        dto.setReductionIutsCharge(information.getReductionIutsCharge());
        dto.setIutsAvecCharge(information.getIutsAvecCharge());
        dto.setTotalDeduitEmploye(information.getTotalDeduitEmploye());
        dto.setSalaireNet(information.getSalaireNet());
        return dto;
    }

    @Transactional(readOnly = true)
    public InformationSalarialeDto simulate(Employee employee, Double customSalaireBase, Double customSurSalaire) {
        return simulate(employee, customSalaireBase, customSurSalaire, null);
    }

    @Transactional(readOnly = true)
    public InformationSalarialeDto simulate(Employee employee, Double customSalaireBase, Double customSurSalaire, Integer customAncienneteReprise) {
        SituationSalariale situation = situationRepository.findByEmployeeId(employee.getId()).orElse(null);
        BigDecimal salaireBase = BigDecimal.ZERO;
        if (customSalaireBase != null && customSalaireBase > 0) {
            salaireBase = money(new BigDecimal(customSalaireBase));
        } else if (situation != null && situation.getSalaireBase() != null && situation.getSalaireBase() > 0) {
            salaireBase = money(new BigDecimal(situation.getSalaireBase()));
        } else if (situation != null && situation.getGrilleSalariale() != null && situation.getGrilleSalariale().getBasicSalary() != null) {
            salaireBase = money(situation.getGrilleSalariale().getBasicSalary());
        } else if (employee.getGrilleSalariale() != null && employee.getGrilleSalariale().getBasicSalary() != null) {
            salaireBase = money(employee.getGrilleSalariale().getBasicSalary());
        }

        BigDecimal surSalaire = BigDecimal.ZERO;
        if (customSurSalaire != null) {
            surSalaire = money(new BigDecimal(Math.max(0.0, customSurSalaire)));
        } else if (situation != null && situation.getSurSalaire() != null && situation.getSurSalaire() > 0) {
            surSalaire = money(new BigDecimal(situation.getSurSalaire()));
        } else if (employee.getSurSalaire() != null && employee.getSurSalaire() > 0) {
            surSalaire = money(new BigDecimal(employee.getSurSalaire()));
        }

        List<IndemniteEmploye> simulateIndemnites = indemniteRepository.findByEmployeeId(employee.getId()).stream()
                .filter(row -> !Boolean.FALSE.equals(row.getActif()))
                .filter(row -> {
                    String code = (row.getTypeIndemnite() != null && row.getTypeIndemnite().getCode() != null)
                            ? row.getTypeIndemnite().getCode().toUpperCase() : "";
                    String lib = row.getLibelle() != null ? row.getLibelle().toUpperCase() : "";
                    if (Boolean.TRUE.equals(employee.getVehiculeFourni()) && (code.contains("TRP") || code.contains("TRANS") || lib.contains("TRANSPORT") || lib.contains("DEPLACEMENT"))) {
                        return false;
                    }
                    if (Boolean.TRUE.equals(employee.getLogementFourni()) && (code.contains("LOG") || code.contains("MAISON") || lib.contains("LOGEMENT"))) {
                        return false;
                    }
                    return true;
                })
                .toList();

        BigDecimal totalIndemnites = simulateIndemnites.stream()
                .map(row -> money(row.getMontant()))
                .reduce(zero(), BigDecimal::add);

        BigDecimal tauxAnciennete = BigDecimal.ZERO;
        int anneesAnciennete = (customAncienneteReprise != null && customAncienneteReprise >= 0)
                ? customAncienneteReprise
                : ((employee.getAncienneteReprise() != null && employee.getAncienneteReprise() > 0) ? employee.getAncienneteReprise() : 0);
        if (employee.getDateEmbauche() != null && !employee.getDateEmbauche().isBlank()) {
            try {
                java.time.LocalDate dateEmb = java.time.LocalDate.parse(employee.getDateEmbauche().trim());
                anneesAnciennete += Math.max(0, java.time.Period.between(dateEmb, java.time.LocalDate.now()).getYears());
            } catch (Exception ignored) {}
        }
        if (anneesAnciennete == 3) {
            tauxAnciennete = new BigDecimal("5.00");
        } else if (anneesAnciennete > 3) {
            tauxAnciennete = new BigDecimal(5 + (anneesAnciennete - 3)).setScale(2, RoundingMode.HALF_UP);
        }
        BigDecimal primeAnciennete = money(calculatePercentage(salaireBase, tauxAnciennete));

        BigDecimal remunerationBrute = money(salaireBase.add(surSalaire).add(totalIndemnites).add(primeAnciennete));
        BigDecimal baseCnss = remunerationBrute.min(new BigDecimal("800000.00"));
        BigDecimal cotisCnssAgent = money(calculatePercentage(baseCnss, new BigDecimal("5.50")));
        BigDecimal brutApresCnss = money(remunerationBrute.subtract(cotisCnssAgent).max(BigDecimal.ZERO));

        // Exonérations fiscales : prioritaires depuis la persistance PostgreSQL (exoneration_employe)
        List<ExonerationEmploye> simExosEmploye = exonerationRepository.findByEmployeeId(employee.getId());
        BigDecimal totalExonerations = BigDecimal.ZERO;
        if (simExosEmploye != null && !simExosEmploye.isEmpty()) {
            for (ExonerationEmploye exo : simExosEmploye) {
                if (exo.getMontant() != null && exo.getMontant() > 0) {
                    totalExonerations = totalExonerations.add(money(BigDecimal.valueOf(exo.getMontant())));
                }
            }
        } else {
            for (IndemniteEmploye ind : simulateIndemnites) {
                BigDecimal mIndem = money(ind.getMontant());
                if (mIndem.compareTo(BigDecimal.ZERO) <= 0) continue;

                TypeIndemnite simType = ind.getTypeIndemnite();
                if (simType == null) continue;

                BigDecimal tauxExo = (simType.getTauxExoneration() != null && simType.getTauxExoneration() > 0)
                        ? BigDecimal.valueOf(simType.getTauxExoneration()) : BigDecimal.ZERO;
                BigDecimal plafondExo = (simType.getPlafondExoneration() != null && simType.getPlafondExoneration() > 0)
                        ? BigDecimal.valueOf(simType.getPlafondExoneration()) : BigDecimal.ZERO;

                if (tauxExo.compareTo(BigDecimal.ZERO) > 0 || plafondExo.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal premiereLimite = (tauxExo.compareTo(BigDecimal.ZERO) > 0)
                            ? calculatePercentage(brutApresCnss, tauxExo)
                            : mIndem;
                    BigDecimal exo = mIndem.min(premiereLimite);
                    if (plafondExo.compareTo(BigDecimal.ZERO) > 0) {
                        exo = exo.min(plafondExo);
                    }
                    totalExonerations = totalExonerations.add(money(exo));
                }
            }
        }

        // Abattement forfaitaire légal : 20% du brut après CNSS plafonné à 75 000 FCFA
        Categorie cat = situation != null ? situation.getCategorie() : null;
        if (cat == null && situation != null && situation.getGrilleSalariale() != null) {
            cat = situation.getGrilleSalariale().getCategorieObj();
        }
        if (cat == null && employee.getCategorieObj() != null) {
            cat = employee.getCategorieObj();
        }
        BigDecimal tauxAbattement = new BigDecimal("20.00");
        if (cat != null && cat.getTauxAbattement() != null && cat.getTauxAbattement() > 0) {
            tauxAbattement = money(cat.getTauxAbattement());
            if (tauxAbattement.compareTo(BigDecimal.ONE) <= 0) {
                tauxAbattement = tauxAbattement.multiply(CENT);
            }
        }
        BigDecimal abattementCalcule = calculatePercentage(brutApresCnss, tauxAbattement);
        BigDecimal abattementForfaitaire = money(abattementCalcule.min(new BigDecimal("75000.00")));

        // Base Imposable IUTS = Brut (après CNSS) - Total Exonérations - Abattement Forfaitaire
        BigDecimal baseImposable = money(brutApresCnss.subtract(totalExonerations).subtract(abattementForfaitaire).max(BigDecimal.ZERO));

        int nombreCharges = Math.toIntExact(familleRepository.countByEmployeeIdAndEstChargeTrue(employee.getId()));
        BigDecimal iutsSansCharge = calculateIuts(baseImposable);
        BigDecimal tauxReduction = reductionRate(nombreCharges);
        BigDecimal reduction = money(iutsSansCharge.multiply(tauxReduction).divide(CENT, 8, RoundingMode.HALF_UP));
        BigDecimal iutsAvecCharge = money(iutsSansCharge.subtract(reduction).max(BigDecimal.ZERO));
        BigDecimal netCedulaire = money(remunerationBrute.subtract(cotisCnssAgent).subtract(iutsAvecCharge).max(BigDecimal.ZERO));

        BigDecimal baseCrrae = money(salaireBase.add(surSalaire).add(primeAnciennete));

        BigDecimal totalAgent = zero();
        BigDecimal totalEmployeur = zero();
        List<InformationSalarialeRetenueDto> agentRetenues = new ArrayList<>();
        List<InformationSalarialeRetenueDto> employeurRetenues = new ArrayList<>();

        for (Retenue retenue : findApplicableRetenues(employee)) {
            if (retenue == null || isIuts(retenue)) continue;

            String retCode = retenue.getCode() != null ? retenue.getCode().toUpperCase() : "";
            String retLib = retenue.getLibelle() != null ? retenue.getLibelle().toUpperCase() : "";
            BigDecimal montantBase;
            BigDecimal taux = money(retenue.getTaux());
            boolean employeur = isEmployeur(retenue);
            BigDecimal montant;

            if (retCode.contains("CNSS") || retLib.contains("CNSS")) {
                montantBase = baseCnss;
                if (!employeur) {
                    taux = new BigDecimal("5.50");
                }
                montant = employeur ? money(calculatePercentage(baseCnss, taux)) : cotisCnssAgent;
            } else if (retCode.contains("CRRAE") || retLib.contains("CRRAE")) {
                montantBase = baseCrrae;
                montant = money(calculatePercentage(montantBase, taux));
            } else if (retCode.contains("SOLIDAR") || retLib.contains("SOLIDAR") || retCode.contains("FSP")) {
                montantBase = netCedulaire;
                montant = money(calculatePercentage(montantBase, taux));
            } else {
                montantBase = resolveBase(retenue.getBaseCalcul(), salaireBase, surSalaire, primeAnciennete, remunerationBrute, baseImposable);
                montant = money(calculatePercentage(montantBase, taux));
            }

            InformationSalarialeRetenueDto lineDto = new InformationSalarialeRetenueDto(
                    null, retenue.getId(), retenue.getCode(), retenue.getLibelle(),
                    retenue.getTypeRetenue() != null && retenue.getTypeRetenue().getCode() != null
                            ? retenue.getTypeRetenue().getCode() : (employeur ? "EMPLOYEUR" : "AGENT"),
                    retenue.getBaseCalcul() == null ? BaseCalculRetenue.REMUNERATION_BRUTE : retenue.getBaseCalcul(),
                    montantBase, taux, montant);

            if (employeur) {
                totalEmployeur = totalEmployeur.add(montant);
                employeurRetenues.add(lineDto);
            } else {
                totalAgent = totalAgent.add(montant);
                agentRetenues.add(lineDto);
            }
        }

        BigDecimal totalDeduit = money(totalAgent.add(iutsAvecCharge));
        BigDecimal salaireNet = money(remunerationBrute.subtract(totalDeduit).max(BigDecimal.ZERO));

        InformationSalarialeDto dto = new InformationSalarialeDto();
        dto.setEmployeeId(employee.getId());
        dto.setSalaireBase(salaireBase);
        dto.setSurSalaire(surSalaire);
        dto.setTotalIndemnites(totalIndemnites);
        dto.setRemunerationBrute(remunerationBrute);
        dto.setTotalExonerations(totalExonerations);
        dto.setAbattementForfaitaire(abattementForfaitaire);
        dto.setBaseImposable(baseImposable);
        dto.setRetenuesAgent(agentRetenues);
        dto.setTotalRetenuesAgent(money(totalAgent));
        dto.setRetenuesEmployeur(employeurRetenues);
        dto.setTotalRetenuesEmployeur(money(totalEmployeur));
        dto.setNombrePersonnesCharge(nombreCharges);
        dto.setIutsSansCharge(iutsSansCharge);
        dto.setTauxReductionCharge(tauxReduction);
        dto.setReductionIutsCharge(reduction);
        dto.setIutsAvecCharge(iutsAvecCharge);
        dto.setTotalDeduitEmploye(totalDeduit);
        dto.setSalaireNet(salaireNet);
        return dto;
    }

    static BigDecimal calculateIuts(BigDecimal rawBase) {
        if (rawBase == null || rawBase.compareTo(BigDecimal.ZERO) <= 0) return BigDecimal.ZERO;
        // Troncature à la centaine inférieure légale (CGI Burkina Faso)
        BigDecimal base = rawBase.divideToIntegralValue(new BigDecimal("100")).multiply(new BigDecimal("100"));
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
        return money(result);
    }

    static BigDecimal reductionRate(int charges) {
        if (charges == 1) return new BigDecimal("8.00");
        if (charges == 2) return new BigDecimal("10.00");
        if (charges == 3) return new BigDecimal("12.00");
        if (charges >= 4) return new BigDecimal("14.00");
        return zero();
    }

    static BigDecimal calculatePercentage(BigDecimal base, BigDecimal rate) {
        // Arrondi HALF_UP à 2 décimales pour les calculs de taux (CNSS, exonérations, retenues)
        return percent(base.multiply(rate).divide(CENT, 8, RoundingMode.HALF_UP));
    }

    private List<Retenue> findApplicableRetenues(Employee employee) {
        Long regimeId = (employee != null && employee.getRegimeSecuriteSocial() != null)
                ? employee.getRegimeSecuriteSocial().getId() : 1L;
        return retenueRepository.findApplicable(regimeId);
    }

    public static BigDecimal resolveBase(BaseCalculRetenue base, BigDecimal salaireBase,
                                         BigDecimal surSalaire, BigDecimal primeAnciennete,
                                         BigDecimal remunerationBrute, BigDecimal baseImposable) {
        if (base == BaseCalculRetenue.SALAIRE_BASE) {
            return salaireBase != null ? salaireBase : BigDecimal.ZERO;
        }
        if (base == BaseCalculRetenue.SALAIRE_BASE_SUR_SALAIRE) {
            BigDecimal sb = salaireBase != null ? salaireBase : BigDecimal.ZERO;
            BigDecimal ss = surSalaire != null ? surSalaire : BigDecimal.ZERO;
            BigDecimal pa = primeAnciennete != null ? primeAnciennete : BigDecimal.ZERO;
            return sb.add(ss).add(pa);
        }
        if (base == BaseCalculRetenue.BASE_IMPOSABLE) {
            return baseImposable != null ? baseImposable : BigDecimal.ZERO;
        }
        return remunerationBrute != null ? remunerationBrute : BigDecimal.ZERO;
    }

    private boolean isEmployeur(Retenue retenue) {
        if (retenue == null) return false;
        String typeVal = "";
        if (retenue.getTypeRetenue() != null) {
            typeVal = (retenue.getTypeRetenue().getCode() == null ? "" : retenue.getTypeRetenue().getCode()) + " "
                    + (retenue.getTypeRetenue().getLibelle() == null ? "" : retenue.getTypeRetenue().getLibelle());
        }
        String full = (typeVal + " " + (retenue.getCode() != null ? retenue.getCode() : "") + " "
                + (retenue.getLibelle() != null ? retenue.getLibelle() : "")).toUpperCase(Locale.ROOT);
        return full.contains("EMPLOYEUR") || full.contains("PATRON");
    }

    private static boolean isIuts(Retenue retenue) {
        if (retenue == null) return false;
        String c = retenue.getCode() != null ? retenue.getCode().toUpperCase(Locale.ROOT) : "";
        String l = retenue.getLibelle() != null ? retenue.getLibelle().toUpperCase(Locale.ROOT) : "";
        return c.contains("IUTS") || l.contains("IUTS");
    }

    static BigDecimal money(Double value) {
        return value == null ? zero() : money(BigDecimal.valueOf(value));
    }

    static BigDecimal money(BigDecimal value) {
        if (value == null) return zero();
        // Arrondi par excès (CEILING) à l'entier — règle FCFA : pas de centimes
        // Utilisé pour les montants finaux : IUTS, brut, net, retenues en FCFA
        return value.setScale(0, RoundingMode.CEILING).setScale(2, RoundingMode.UNNECESSARY);
    }

    /**
     * Arrondi HALF_UP à 2 décimales — pour les calculs intermédiaires de taux/pourcentages
     * (cotisations CNSS, exonérations, taux ancienneté, etc.) avant d'être agrégés en FCFA.
     */
    static BigDecimal percent(BigDecimal value) {
        if (value == null) return zero();
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    static BigDecimal zero() {
        return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
    }
}
