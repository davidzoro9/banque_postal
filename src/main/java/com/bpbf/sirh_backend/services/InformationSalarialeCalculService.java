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

    @Transactional
    public InformationSalariale recalculate(Employee employee) {
        InformationSalariale information = informationRepository.findByEmployeeId(employee.getId())
                .orElseGet(InformationSalariale::new);
        information.setEmployee(employee);

        SituationSalariale situation = situationRepository.findByEmployeeId(employee.getId()).orElse(null);
        BigDecimal salaireBase = situation == null ? zero() : money(situation.getSalaireBase());
        BigDecimal totalIndemnites = indemniteRepository.findByEmployeeId(employee.getId()).stream()
                .filter(row -> !Boolean.FALSE.equals(row.getActif()))
                .map(row -> money(row.getMontant()))
                .reduce(zero(), BigDecimal::add);
        BigDecimal remunerationBrute = money(salaireBase.add(totalIndemnites));
        BigDecimal totalExonerations = exonerationRepository.findByEmployeeId(employee.getId()).stream()
                .map(row -> money(row.getMontant()))
                .reduce(zero(), BigDecimal::add);
        BigDecimal tauxAbattement = situation == null || situation.getCategorie() == null || situation.getCategorie().getTauxAbattement() == null
            ? zero()
            : money(
                situation
                    .getCategorie()
                    .getTauxAbattement()
            );
        BigDecimal abattementForfaitaire = calculatePercentage(salaireBase, tauxAbattement);
        BigDecimal baseImposable = money(remunerationBrute.subtract(totalExonerations).subtract(abattementForfaitaire).max(BigDecimal.ZERO));

        information.setSalaireBase(salaireBase);
        information.setTotalIndemnites(totalIndemnites);
        information.setRemunerationBrute(remunerationBrute);
        information.setTotalExonerations(totalExonerations);
        information.setAbattementForfaitaire(abattementForfaitaire);
        information.setBaseImposable(baseImposable);
        information = informationRepository.save(information);

        informationRetenueRepository.deleteByInformationSalarialeId(information.getId());
        informationRetenueRepository.flush();

        BigDecimal totalAgent = zero();
        BigDecimal totalEmployeur = zero();
        for (Retenue retenue : findApplicableRetenues(employee)) {
            if (retenue == null || isIuts(retenue)) continue;

            BigDecimal montantBase = resolveBase(retenue.getBaseCalcul(), salaireBase, remunerationBrute, baseImposable);
            BigDecimal taux = money(retenue.getTaux());
            BigDecimal montant = calculatePercentage(montantBase, taux);
            boolean employeur = isEmployeur(retenue);

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

        int nombreCharges = Math.toIntExact(familleRepository.countByEmployeeIdAndEstChargeTrue(employee.getId()));
        BigDecimal iutsSansCharge = calculateIuts(baseImposable);
        BigDecimal tauxReduction = reductionRate(nombreCharges);
        BigDecimal reduction = money(iutsSansCharge.multiply(tauxReduction).divide(CENT, 8, RoundingMode.HALF_UP));
        BigDecimal iutsAvecCharge = money(iutsSansCharge.subtract(reduction).max(BigDecimal.ZERO));
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

    static BigDecimal calculateIuts(BigDecimal base) {
        BigDecimal result;
        if (base.compareTo(new BigDecimal("250000")) > 0) {
            result = new BigDecimal("39430").add(base.subtract(new BigDecimal("250000")).multiply(new BigDecimal("0.25")));
        } else if (base.compareTo(new BigDecimal("170000")) > 0) {
            result = new BigDecimal("24200").add(base.subtract(new BigDecimal("170000")).multiply(new BigDecimal("0.23")));
        } else if (base.compareTo(new BigDecimal("120000")) > 0) {
            result = new BigDecimal("13700").add(base.subtract(new BigDecimal("120000")).multiply(new BigDecimal("0.21")));
        } else if (base.compareTo(new BigDecimal("80000")) > 0) {
            result = new BigDecimal("6500").add(base.subtract(new BigDecimal("80000")).multiply(new BigDecimal("0.18")));
        } else if (base.compareTo(new BigDecimal("50000")) > 0) {
            result = new BigDecimal("2000").add(base.subtract(new BigDecimal("50000")).multiply(new BigDecimal("0.15")));
        } else if (base.compareTo(new BigDecimal("30000")) > 0) {
            result = base.subtract(new BigDecimal("30000")).multiply(new BigDecimal("0.10"));
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
        return money(base.multiply(rate).divide(CENT, 8, RoundingMode.HALF_UP));
    }

    private List<Retenue> findApplicableRetenues(Employee employee) {
        return employee.getRegimeSecuriteSocial() == null
                ? retenueRepository.findGeneralRetenues()
                : retenueRepository.findApplicable(employee.getRegimeSecuriteSocial().getId());
    }

    private static BigDecimal resolveBase(BaseCalculRetenue base, BigDecimal salaireBase,
                                          BigDecimal remunerationBrute, BigDecimal baseImposable) {
        if (base == BaseCalculRetenue.SALAIRE_BASE) return salaireBase;
        if (base == BaseCalculRetenue.BASE_IMPOSABLE) return baseImposable;
        return remunerationBrute;
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
        return retenue.getCode() != null && retenue.getCode().toUpperCase(Locale.ROOT).contains("IUTS");
    }

    private static BigDecimal money(Double value) {
        return value == null ? zero() : money(BigDecimal.valueOf(value));
    }

    private static BigDecimal money(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private static BigDecimal zero() {
        return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
    }
}
