package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.BulletinDto;
import com.bpbf.sirh_backend.dtos.BulletinLineDto;
import com.bpbf.sirh_backend.entities.*;
import com.bpbf.sirh_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BulletinService {

    private static final BigDecimal CENT = new BigDecimal("100");

    private final BulletinRepository bulletinRepository;
    private final BulletinLineRepository bulletinLineRepository;
    private final SessionPaieRepository sessionPaieRepository;
    private final EmployeeRepository employeeRepository;
    private final SituationSalarialeRepository situationRepository;
    private final IndemniteEmployeRepository indemniteRepository;
    private final ExonerationEmployeRepository exonerationRepository;
    private final FamilleEmployeRepository familleRepository;
    private final RetenueRepository retenueRepository;
    private final PrecompteEmployeRepository precompteRepository;
    private final AvoirEmployeRepository avoirRepository;
    private final ContratRepository contratRepository;

    @Transactional
    public List<BulletinDto> generateBulletinsForSession(Long sessionPaieId) {
        SessionPaie session = sessionPaieRepository.findById(sessionPaieId)
                .orElseThrow(() -> new RuntimeException("Session de paie non trouvée: #" + sessionPaieId));

        List<Employee> employees = employeeRepository.findAll();
        List<Bulletin> createdBulletins = new ArrayList<>();

        BigDecimal totalBrut = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;
        BigDecimal totalRetenues = BigDecimal.ZERO;
        BigDecimal totalCotisPatronales = BigDecimal.ZERO;

        for (Employee emp : employees) {
            // Check if bulletin already exists for this session & employee, if so remove/regenerate
            bulletinRepository.findBySessionPaieIdAndEmployeeId(session.getId(), emp.getId())
                    .ifPresent(existing -> {
                        bulletinRepository.delete(existing);
                        bulletinRepository.flush();
                    });

            Bulletin bulletin = computeAndSaveBulletin(session, emp);
            createdBulletins.add(bulletin);

            if (bulletin.getSalaireBrut() != null) totalBrut = totalBrut.add(bulletin.getSalaireBrut());
            if (bulletin.getSalaireNet() != null) totalNet = totalNet.add(bulletin.getSalaireNet());
            if (bulletin.getTotalRetenues() != null) totalRetenues = totalRetenues.add(bulletin.getTotalRetenues());
            if (bulletin.getTotalCotisationsPatronales() != null) totalCotisPatronales = totalCotisPatronales.add(bulletin.getTotalCotisationsPatronales());
        }

        session.setNombreEmployes(createdBulletins.size());
        session.setTotalBrut(totalBrut.setScale(2, RoundingMode.HALF_UP));
        session.setTotalNet(totalNet.setScale(2, RoundingMode.HALF_UP));
        session.setTotalRetenues(totalRetenues.setScale(2, RoundingMode.HALF_UP));
        session.setTotalCotisationsPatronales(totalCotisPatronales.setScale(2, RoundingMode.HALF_UP));
        session.setTotalMasseSalariale(totalBrut.add(totalCotisPatronales).setScale(2, RoundingMode.HALF_UP));
        session.setStatut("GENERE");
        sessionPaieRepository.save(session);

        return createdBulletins.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public Bulletin computeAndSaveBulletin(SessionPaie session, Employee emp) {
        SituationSalariale situation = situationRepository.findByEmployeeId(emp.getId()).orElse(null);
        BigDecimal salaireBase = (situation != null && situation.getSalaireBase() != null && situation.getSalaireBase() > 0)
                ? money(new BigDecimal(situation.getSalaireBase()))
                : money(new BigDecimal("95945"));

        // Indemnités
        List<IndemniteEmploye> indemnites = indemniteRepository.findByEmployeeId(emp.getId()).stream()
                .filter(row -> !Boolean.FALSE.equals(row.getActif()))
                .toList();

        BigDecimal totalIndemnites = indemnites.stream()
                .map(row -> money(row.getMontant()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Avoirs (Gains périodiques / rappels échelonnés)
        List<AvoirEmploye> avoirs = avoirRepository.findByEmployeeIdAndStatut(emp.getId(), "ACTIF");
        BigDecimal totalAvoirs = avoirs.stream()
                .map(AvoirEmploye::getMontantMensuel)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal remunerationBrute = money(salaireBase.add(totalIndemnites).add(totalAvoirs));

        // Exonérations fiscales
        BigDecimal totalExonerations = exonerationRepository.findByEmployeeId(emp.getId()).stream()
                .map(row -> money(row.getMontant()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Abattement forfaitaire
        Categorie cat = situation != null ? situation.getCategorie() : null;
        if (cat == null && situation != null && situation.getGrilleSalariale() != null) {
            cat = situation.getGrilleSalariale().getCategorieObj();
        }
        if (cat == null && emp.getCategorieObj() != null) {
            cat = emp.getCategorieObj();
        }
        BigDecimal tauxAbattement = (cat == null || cat.getTauxAbattement() == null) ? BigDecimal.ZERO : money(cat.getTauxAbattement());
        BigDecimal abattementForfaitaire = calculatePercentage(salaireBase, tauxAbattement);
        BigDecimal baseImposable = money(remunerationBrute.subtract(totalExonerations).subtract(abattementForfaitaire).max(BigDecimal.ZERO));

        // Retenues sociales / Cotisations
        List<Retenue> applicableRetenues = findApplicableRetenues(emp);
        BigDecimal totalRetenuesSociales = BigDecimal.ZERO;
        BigDecimal totalCotisationsPatronales = BigDecimal.ZERO;
        BigDecimal cotisationCnss = BigDecimal.ZERO;

        List<BulletinLine> lines = new ArrayList<>();
        int ordre = 1;

        // Ligne Salaire de Base
        lines.add(BulletinLine.builder()
                .code("SAL_BASE")
                .libelle("Salaire de Base")
                .typeLigne("GAIN")
                .baseCalcul(salaireBase)
                .taux(new BigDecimal("100.00"))
                .montant(salaireBase)
                .ordre(ordre++)
                .build());

        // Lignes Indemnités
        for (IndemniteEmploye ind : indemnites) {
            lines.add(BulletinLine.builder()
                    .code(ind.getTypeIndemnite() != null ? ind.getTypeIndemnite().getCode() : "INDEMNITE")
                    .libelle(ind.getLibelle() != null ? ind.getLibelle() : "Indemnité")
                    .typeLigne("GAIN")
                    .baseCalcul(salaireBase)
                    .montant(money(ind.getMontant()))
                    .ordre(ordre++)
                    .build());
        }

        // Lignes Avoirs
        for (AvoirEmploye av : avoirs) {
            lines.add(BulletinLine.builder()
                    .rubriquePaie(av.getRubriquePaie())
                    .code("AVOIR_" + av.getId())
                    .libelle(av.getLibelle() + " (Échéance " + (av.getEcheancesTotal() - av.getEcheancesRestantes() + 1) + "/" + av.getEcheancesTotal() + ")")
                    .typeLigne("GAIN")
                    .baseCalcul(av.getMontantInitial())
                    .montant(av.getMontantMensuel())
                    .ordre(ordre++)
                    .build());
        }

        // Lignes Retenues Sociales & Patronales
        for (Retenue ret : applicableRetenues) {
            if (ret == null || isIuts(ret)) continue;

            BigDecimal base = resolveBase(ret.getBaseCalcul(), salaireBase, remunerationBrute, baseImposable);
            BigDecimal taux = money(ret.getTaux());
            BigDecimal montant = calculatePercentage(base, taux);
            boolean employeur = isEmployeur(ret);

            if (ret.getCode() != null && ret.getCode().toUpperCase(Locale.ROOT).contains("CNSS") && !employeur) {
                cotisationCnss = cotisationCnss.add(montant);
            }

            if (employeur) {
                totalCotisationsPatronales = totalCotisationsPatronales.add(montant);
                lines.add(BulletinLine.builder()
                        .code(ret.getCode())
                        .libelle(ret.getLibelle())
                        .typeLigne("COTISATION_PATRONALE")
                        .baseCalcul(base)
                        .taux(taux)
                        .montant(BigDecimal.ZERO)
                        .partPatronale(montant)
                        .ordre(ordre++)
                        .build());
            } else {
                totalRetenuesSociales = totalRetenuesSociales.add(montant);
                lines.add(BulletinLine.builder()
                        .code(ret.getCode())
                        .libelle(ret.getLibelle())
                        .typeLigne("RETENUE_SOCIALE")
                        .baseCalcul(base)
                        .taux(taux)
                        .montant(montant)
                        .ordre(ordre++)
                        .build());
            }
        }

        // IUTS avec charges de famille
        int nbCharges = Math.toIntExact(familleRepository.countByEmployeeIdAndEstChargeTrue(emp.getId()));
        BigDecimal iutsSansCharge = calculateIuts(baseImposable);
        BigDecimal tauxReduction = reductionRate(nbCharges);
        BigDecimal reductionIuts = money(iutsSansCharge.multiply(tauxReduction).divide(CENT, 8, RoundingMode.HALF_UP));
        BigDecimal impotIuts = money(iutsSansCharge.subtract(reductionIuts).max(BigDecimal.ZERO));

        if (impotIuts.compareTo(BigDecimal.ZERO) > 0) {
            lines.add(BulletinLine.builder()
                    .code("IUTS")
                    .libelle("Impôt Unique sur Traitements et Salaires (IUTS)")
                    .typeLigne("IMPOT")
                    .baseCalcul(baseImposable)
                    .taux(tauxReduction)
                    .montant(impotIuts)
                    .ordre(ordre++)
                    .build());
        }

        // Précomptes (Retenues sur salaire, prêts, avances)
        List<PrecompteEmploye> precomptes = precompteRepository.findByEmployeeIdAndStatut(emp.getId(), "ACTIF");
        BigDecimal totalPrecomptes = BigDecimal.ZERO;
        for (PrecompteEmploye prec : precomptes) {
            BigDecimal mPrelev = prec.getMontantMensuel().min(prec.getMontantRestant());
            totalPrecomptes = totalPrecomptes.add(mPrelev);

            lines.add(BulletinLine.builder()
                    .rubriquePaie(prec.getRubriquePaie())
                    .code("PREC_" + prec.getId())
                    .libelle(prec.getLibelle() + " (Échéance " + (prec.getEcheancesTotal() - prec.getEcheancesRestantes() + 1) + "/" + prec.getEcheancesTotal() + ")")
                    .typeLigne("PRECOMPTE")
                    .baseCalcul(prec.getMontantInitial())
                    .montant(mPrelev)
                    .ordre(ordre++)
                    .build());
        }

        BigDecimal totalRetenues = money(totalRetenuesSociales.add(impotIuts).add(totalPrecomptes));
        BigDecimal salaireNet = money(remunerationBrute.subtract(totalRetenues).max(BigDecimal.ZERO));

        Contrat contrat = contratRepository.findFirstByEmployeeIdOrderByIdDesc(emp.getId()).orElse(null);
        Grade grade = emp.getGradeObj();

        String codeBulletin = String.format("BLT-%s-%s-%04d",
                session.getMois() != null ? session.getMois() : "M",
                session.getAnnee() != null ? session.getAnnee() : LocalDate.now().getYear(),
                emp.getId());

        Bulletin bulletin = Bulletin.builder()
                .code(codeBulletin)
                .employee(emp)
                .sessionPaie(session)
                .grade(grade)
                .contrat(contrat)
                .typeSession(session.getTypeSession())
                .scheduledWorkingDays(new BigDecimal("30.00"))
                .workedDays(new BigDecimal("30.00"))
                .salaireBase(salaireBase)
                .totalIndemnites(totalIndemnites)
                .totalAvoirs(totalAvoirs)
                .salaireBrut(remunerationBrute)
                .totalExonerations(totalExonerations)
                .abattementForfaitaire(abattementForfaitaire)
                .baseImposable(baseImposable)
                .cotisationCnss(cotisationCnss)
                .impotIutsSansCharge(iutsSansCharge)
                .reductionIutsCharge(reductionIuts)
                .impotIuts(impotIuts)
                .totalRetenuesSociales(totalRetenuesSociales)
                .totalPrecomptes(totalPrecomptes)
                .totalRetenues(totalRetenues)
                .totalCotisationsPatronales(totalCotisationsPatronales)
                .salaireNet(salaireNet)
                .statut("GENERE")
                .dateCalcul(LocalDateTime.now())
                .build();

        bulletin = bulletinRepository.save(bulletin);

        for (BulletinLine line : lines) {
            line.setBulletin(bulletin);
            bulletinLineRepository.save(line);
        }

        bulletin.setLines(lines);
        return bulletin;
    }

    @Transactional(readOnly = true)
    public List<BulletinDto> getBulletinsBySession(Long sessionPaieId) {
        return bulletinRepository.findBySessionPaieId(sessionPaieId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BulletinDto> getBulletinsByEmployee(Long employeeId) {
        return bulletinRepository.findByEmployeeIdOrderByDateCalculDesc(employeeId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BulletinDto getBulletinById(Long id) {
        return bulletinRepository.findByIdWithLines(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Bulletin introuvable: #" + id));
    }

    @Transactional
    public void validateSession(Long sessionPaieId) {
        SessionPaie session = sessionPaieRepository.findById(sessionPaieId)
                .orElseThrow(() -> new RuntimeException("Session non trouvée: #" + sessionPaieId));

        List<Bulletin> bulletins = bulletinRepository.findBySessionPaieId(sessionPaieId);
        for (Bulletin b : bulletins) {
            b.setStatut("VALIDE");
            b.setDateValidation(LocalDateTime.now());
            bulletinRepository.save(b);

            // Mettre à jour les précomptes de l'employé
            List<PrecompteEmploye> precomptes = precompteRepository.findByEmployeeIdAndStatut(b.getEmployee().getId(), "ACTIF");
            for (PrecompteEmploye p : precomptes) {
                BigDecimal m = p.getMontantMensuel().min(p.getMontantRestant());
                BigDecimal newRestant = p.getMontantRestant().subtract(m).max(BigDecimal.ZERO);
                p.setMontantRestant(newRestant);
                p.setEcheancesRestantes(Math.max(0, (p.getEcheancesRestantes() != null ? p.getEcheancesRestantes() : 1) - 1));
                if (newRestant.compareTo(BigDecimal.ZERO) <= 0 || (p.getEcheancesRestantes() != null && p.getEcheancesRestantes() <= 0)) {
                    p.setStatut("SOLDE");
                }
                precompteRepository.save(p);
            }

            // Mettre à jour les avoirs de l'employé
            List<AvoirEmploye> avoirs = avoirRepository.findByEmployeeIdAndStatut(b.getEmployee().getId(), "ACTIF");
            for (AvoirEmploye a : avoirs) {
                BigDecimal m = a.getMontantMensuel().min(a.getMontantRestant());
                BigDecimal newRestant = a.getMontantRestant().subtract(m).max(BigDecimal.ZERO);
                a.setMontantRestant(newRestant);
                a.setEcheancesRestantes(Math.max(0, (a.getEcheancesRestantes() != null ? a.getEcheancesRestantes() : 1) - 1));
                if (newRestant.compareTo(BigDecimal.ZERO) <= 0 || (a.getEcheancesRestantes() != null && a.getEcheancesRestantes() <= 0)) {
                    a.setStatut("SOLDE");
                }
                avoirRepository.save(a);
            }
        }

        session.setStatut("VALIDE");
        session.setDateValidation(LocalDateTime.now());
        sessionPaieRepository.save(session);
    }

    public BulletinDto toDto(Bulletin b) {
        String empName = b.getEmployee() != null
                ? (b.getEmployee().getPrenom() != null ? b.getEmployee().getPrenom() + " " + b.getEmployee().getNom() : b.getEmployee().getName())
                : null;
        String matricule = b.getEmployee() != null ? b.getEmployee().getMatricule() : null;
        String fonctionStr = (b.getEmployee() != null && b.getEmployee().getFonction() != null)
                ? b.getEmployee().getFonction().getName()
                : null;
        String gradeStr = b.getGrade() != null ? b.getGrade().getLibelle() : null;

        List<BulletinLineDto> lineDtos = b.getLines() != null
                ? b.getLines().stream().map(l -> BulletinLineDto.builder()
                        .id(l.getId())
                        .bulletinId(b.getId())
                        .rubriquePaieId(l.getRubriquePaie() != null ? l.getRubriquePaie().getId() : null)
                        .code(l.getCode())
                        .libelle(l.getLibelle())
                        .typeLigne(l.getTypeLigne())
                        .baseCalcul(l.getBaseCalcul())
                        .taux(l.getTaux())
                        .montant(l.getMontant())
                        .partPatronale(l.getPartPatronale())
                        .ordre(l.getOrdre())
                        .build()).collect(Collectors.toList())
                : new ArrayList<>();

        return BulletinDto.builder()
                .id(b.getId())
                .code(b.getCode())
                .employeeId(b.getEmployee() != null ? b.getEmployee().getId() : null)
                .employeeName(empName)
                .matricule(matricule)
                .fonction(fonctionStr)
                .sessionPaieId(b.getSessionPaie() != null ? b.getSessionPaie().getId() : null)
                .sessionPaieCode(b.getSessionPaie() != null ? b.getSessionPaie().getCodeSession() : null)
                .sessionPeriode(b.getSessionPaie() != null ? b.getSessionPaie().getPeriode() : null)
                .gradeId(b.getGrade() != null ? b.getGrade().getId() : null)
                .gradeLibelle(gradeStr)
                .contratId(b.getContrat() != null ? b.getContrat().getId() : null)
                .typeSession(b.getTypeSession())
                .dateFrom(b.getDateFrom())
                .dateTo(b.getDateTo())
                .scheduledWorkingDays(b.getScheduledWorkingDays())
                .workedDays(b.getWorkedDays())
                .salaireBase(b.getSalaireBase())
                .totalIndemnites(b.getTotalIndemnites())
                .totalAvoirs(b.getTotalAvoirs())
                .salaireBrut(b.getSalaireBrut())
                .totalExonerations(b.getTotalExonerations())
                .abattementForfaitaire(b.getAbattementForfaitaire())
                .baseImposable(b.getBaseImposable())
                .cotisationCnss(b.getCotisationCnss())
                .impotIutsSansCharge(b.getImpotIutsSansCharge())
                .reductionIutsCharge(b.getReductionIutsCharge())
                .impotIuts(b.getImpotIuts())
                .totalRetenuesSociales(b.getTotalRetenuesSociales())
                .totalPrecomptes(b.getTotalPrecomptes())
                .totalRetenues(b.getTotalRetenues())
                .totalCotisationsPatronales(b.getTotalCotisationsPatronales())
                .salaireNet(b.getSalaireNet())
                .statut(b.getStatut())
                .dateCalcul(b.getDateCalcul())
                .dateValidation(b.getDateValidation())
                .lines(lineDtos)
                .build();
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

    private static BigDecimal calculateIuts(BigDecimal base) {
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

    private static BigDecimal reductionRate(int charges) {
        if (charges == 1) return new BigDecimal("8.00");
        if (charges == 2) return new BigDecimal("10.00");
        if (charges == 3) return new BigDecimal("12.00");
        if (charges >= 4) return new BigDecimal("14.00");
        return BigDecimal.ZERO;
    }

    private static BigDecimal calculatePercentage(BigDecimal base, BigDecimal rate) {
        return money(base.multiply(rate).divide(CENT, 8, RoundingMode.HALF_UP));
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
