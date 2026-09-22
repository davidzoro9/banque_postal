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
import java.util.Comparator;
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
    private final AvoirRepository avoirVariableRepository;
    private final PrecompteRepository precompteVariableRepository;
    private final TropPercuRepository tropPercuRepository;
    private final ContratRepository contratRepository;
    private final EmployeeProcessService employeeProcessService;
    private final CongeWorkflowService congeWorkflowService;

    @Transactional
    public List<BulletinDto> generateBulletinsForSession(Long sessionPaieId) {
        return generateBulletinsForSession(sessionPaieId, null);
    }

    @Transactional
    public List<BulletinDto> generateBulletinsForSession(Long sessionPaieId, List<Long> employeeIds) {
        SessionPaie session = sessionPaieRepository.findById(sessionPaieId)
                .orElseThrow(() -> new RuntimeException("Session de paie non trouvée: #" + sessionPaieId));

        List<Employee> employees;
        if (employeeIds != null && !employeeIds.isEmpty()) {
            employees = employeeRepository.findAllById(employeeIds);
        } else {
            employees = employeeRepository.findAll();
        }

        List<Bulletin> createdBulletins = new ArrayList<>();

        for (Employee emp : employees) {
            List<Bulletin> existingList = bulletinRepository.findBySessionPaieIdAndEmployeeId(session.getId(), emp.getId());
            BigDecimal customWorkedDays = null;
            BigDecimal customScheduledDays = null;
            if (!existingList.isEmpty()) {
                for (Bulletin existing : existingList) {
                    if (existing.getWorkedDays() != null) {
                        customWorkedDays = existing.getWorkedDays();
                    }
                    if (existing.getScheduledWorkingDays() != null) {
                        customScheduledDays = existing.getScheduledWorkingDays();
                    }
                    bulletinRepository.delete(existing);
                }
                bulletinRepository.flush();
            }

            Bulletin bulletin = computeAndSaveBulletin(session, emp, customWorkedDays, customScheduledDays);
            createdBulletins.add(bulletin);
        }

        // Recalculer les totaux de la session pour TOUS les bulletins existants dans la session (gestion par tranches / petits groupes)
        recalculerTotauxSession(session);
        List<Bulletin> allSessionBulletins = bulletinRepository.findBySessionPaieId(session.getId());
        return allSessionBulletins.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public void recalculerTotauxSession(SessionPaie session) {
        if (session == null) return;
        List<Bulletin> allSessionBulletins = bulletinRepository.findBySessionPaieId(session.getId());
        BigDecimal totalBrut = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;
        BigDecimal totalRetenues = BigDecimal.ZERO;
        BigDecimal totalCotisPatronales = BigDecimal.ZERO;

        for (Bulletin b : allSessionBulletins) {
            if (b.getSalaireBrut() != null) totalBrut = totalBrut.add(b.getSalaireBrut());
            if (b.getSalaireNet() != null) totalNet = totalNet.add(b.getSalaireNet());
            if (b.getTotalRetenues() != null) totalRetenues = totalRetenues.add(b.getTotalRetenues());
            if (b.getTotalCotisationsPatronales() != null) totalCotisPatronales = totalCotisPatronales.add(b.getTotalCotisationsPatronales());
        }

        session.setNombreEmployes(allSessionBulletins.size());
        session.setTotalBrut(totalBrut.setScale(2, RoundingMode.HALF_UP));
        session.setTotalNet(totalNet.setScale(2, RoundingMode.HALF_UP));
        session.setTotalRetenues(totalRetenues.setScale(2, RoundingMode.HALF_UP));
        session.setTotalCotisationsPatronales(totalCotisPatronales.setScale(2, RoundingMode.HALF_UP));
        session.setTotalMasseSalariale(totalBrut.add(totalCotisPatronales).setScale(2, RoundingMode.HALF_UP));
        sessionPaieRepository.save(session);
    }

    @Transactional
    public BulletinDto recalculerBulletin(Long bulletinId) {
        Bulletin existing = bulletinRepository.findById(bulletinId)
                .orElseThrow(() -> new RuntimeException("Bulletin introuvable #" + bulletinId));
        Employee emp = existing.getEmployee();
        SessionPaie session = existing.getSessionPaie();
        BigDecimal workedDays = existing.getWorkedDays();
        BigDecimal scheduledDays = existing.getScheduledWorkingDays();

        bulletinRepository.delete(existing);
        bulletinRepository.flush();

        Bulletin newBlt = computeAndSaveBulletin(session, emp, workedDays, scheduledDays);
        if (session != null) {
            recalculerTotauxSession(session);
        }
        return toDto(newBlt);
    }

    @Transactional
    public List<BulletinDto> recalculerBulletinsSession(Long sessionPaieId) {
        SessionPaie session = sessionPaieRepository.findById(sessionPaieId)
                .orElseThrow(() -> new RuntimeException("Session de paie non trouvée #" + sessionPaieId));
        List<Bulletin> bulletins = bulletinRepository.findBySessionPaieId(sessionPaieId);
        List<Long> empIds = bulletins.stream()
                .map(b -> b.getEmployee().getId())
                .distinct()
                .collect(Collectors.toList());
        return generateBulletinsForSession(sessionPaieId, empIds);
    }

    @Transactional
    public List<BulletinDto> recalculerTousLesBulletins() {
        List<SessionPaie> sessions = sessionPaieRepository.findAll();
        for (SessionPaie s : sessions) {
            List<Bulletin> bulletins = bulletinRepository.findBySessionPaieId(s.getId());
            if (!bulletins.isEmpty()) {
                List<Long> empIds = bulletins.stream()
                        .map(b -> b.getEmployee().getId())
                        .distinct()
                        .collect(Collectors.toList());
                generateBulletinsForSession(s.getId(), empIds);
            }
        }
        List<Bulletin> all = bulletinRepository.findAll();
        for (Bulletin b : all) {
            if (b.getSessionPaie() == null) {
                try {
                    recalculerBulletin(b.getId());
                } catch (Exception ignored) {}
            }
        }
        return getAllBulletins();
    }

    @Transactional
    public Bulletin computeAndSaveBulletin(SessionPaie session, Employee emp) {
        return computeAndSaveBulletin(session, emp, null, null);
    }

    @Transactional
    public Bulletin computeAndSaveBulletin(SessionPaie session, Employee emp, BigDecimal customWorkedDays, BigDecimal customScheduledDays) {
        SituationSalariale situation = situationRepository.findByEmployeeId(emp.getId()).orElse(null);
        BigDecimal salaireBase = BigDecimal.ZERO;
        if (situation != null && situation.getSalaireBase() != null && situation.getSalaireBase() > 0) {
            salaireBase = money(new BigDecimal(situation.getSalaireBase()));
        } else if (situation != null && situation.getGrilleSalariale() != null && situation.getGrilleSalariale().getBasicSalary() != null) {
            salaireBase = money(situation.getGrilleSalariale().getBasicSalary());
        } else if (emp.getGrilleSalariale() != null && emp.getGrilleSalariale().getBasicSalary() != null) {
            salaireBase = money(emp.getGrilleSalariale().getBasicSalary());
        }

        BigDecimal surSalaire = BigDecimal.ZERO;
        if (situation != null && situation.getSurSalaire() != null && situation.getSurSalaire() > 0) {
            surSalaire = money(new BigDecimal(situation.getSurSalaire()));
        } else if (emp.getSurSalaire() != null && emp.getSurSalaire() > 0) {
            surSalaire = money(new BigDecimal(emp.getSurSalaire()));
        }

        boolean is13eme = is13emeMois(session);
        boolean isStc = isStc(session);
        boolean isGratif = !is13eme && !isStc && isGratification(session != null ? session.getTypeSession() : null);
        boolean isExtra = isExtraordinaire(session != null ? session.getTypeSession() : null) || is13eme || isStc;

        // Calcul automatique du nombre de jours travaillés selon dateEmbauche (prorata temporis)
        BigDecimal scheduledDays = customScheduledDays != null ? customScheduledDays : new BigDecimal("30.00");
        BigDecimal workedDays = customWorkedDays != null ? customWorkedDays : new BigDecimal("30.00");

        LocalDate debutPeriode = session != null ? session.getDateFrom() : null;
        LocalDate finPeriode = session != null ? session.getDateTo() : null;
        if (debutPeriode == null && session != null) {
            int an = session.getAnnee() != null ? session.getAnnee() : LocalDate.now().getYear();
            int mo = 1;
            try { mo = Integer.parseInt(session.getMois()); } catch (Exception ignored) {}
            debutPeriode = LocalDate.of(an, mo, 1);
            finPeriode = debutPeriode.withDayOfMonth(debutPeriode.lengthOfMonth());
        }

        if (customWorkedDays == null && emp.getDateEmbauche() != null && !emp.getDateEmbauche().isBlank() && debutPeriode != null) {
            try {
                LocalDate dEmbauche = LocalDate.parse(emp.getDateEmbauche().trim());
                if (dEmbauche.isAfter(debutPeriode)) {
                    if (finPeriode != null && dEmbauche.isAfter(finPeriode)) {
                        workedDays = BigDecimal.ZERO;
                    } else {
                        int jourArrivee = dEmbauche.getDayOfMonth();
                        int joursPresents = Math.max(1, Math.min(30, 30 - jourArrivee + 1));
                        workedDays = new BigDecimal(joursPresents).setScale(2, RoundingMode.HALF_UP);
                    }
                }
            } catch (Exception ignored) {}
        }

        BigDecimal computedRatio = workedDays.divide(scheduledDays, 6, RoundingMode.HALF_UP);
        if (computedRatio.compareTo(BigDecimal.ONE) > 0) computedRatio = BigDecimal.ONE;
        if (computedRatio.compareTo(BigDecimal.ZERO) < 0) computedRatio = BigDecimal.ZERO;
        final BigDecimal ratio = computedRatio;

        BigDecimal salaireBasePlein = salaireBase;
        salaireBase = money(salaireBasePlein.multiply(ratio));

        BigDecimal surSalairePlein = surSalaire;
        surSalaire = money(surSalairePlein.multiply(ratio));

        if (isGratif) {
            BulletinLine gratLine = new BulletinLine();
            gratLine.setCode("GRAT_ANN");
            gratLine.setLibelle("Gratification Annuelle 13ème Mois");
            gratLine.setTypeLigne("GAIN");
            gratLine.setBaseCalcul(salaireBase.add(surSalaire));
            gratLine.setTaux(new BigDecimal("100.00"));
            gratLine.setMontant(salaireBase.add(surSalaire));
            gratLine.setOrdre(1);

            List<BulletinLine> lines = new ArrayList<>();
            lines.add(gratLine);

            Contrat contrat = contratRepository.findFirstByEmployeeIdOrderByIdDesc(emp.getId()).orElse(null);
            Grade grade = emp.getGradeObj();

            String codeBulletin = String.format("BLT-%s-%s-%04d",
                    session.getMois() != null ? session.getMois() : "M",
                    session.getAnnee() != null ? session.getAnnee() : LocalDate.now().getYear(),
                    emp.getId());
            if (codeBulletin.length() > 60) codeBulletin = codeBulletin.substring(0, 60);
            String finalCode = codeBulletin;
            if (bulletinRepository.findByCode(finalCode).isPresent()) {
                long count = bulletinRepository.countByEmployeeId(emp.getId()) + 1;
                finalCode = String.format("%s-%d", codeBulletin, count);
                while (bulletinRepository.findByCode(finalCode).isPresent()) {
                    finalCode = String.format("%s-%d", codeBulletin, ++count);
                }
            }

            Bulletin bulletin = new Bulletin();
            bulletin.setCode(finalCode);
            bulletin.setEmployee(emp);
            bulletin.setSessionPaie(session);
            bulletin.setGrade(grade);
            bulletin.setContrat(contrat);
            bulletin.setTypeSession("GRATIFICATION");
            bulletin.setDateFrom(debutPeriode);
            bulletin.setDateTo(finPeriode);
            bulletin.setScheduledWorkingDays(scheduledDays);
            bulletin.setWorkedDays(workedDays);
            bulletin.setSalaireBase(salaireBase);
            bulletin.setSurSalaire(surSalaire);
            bulletin.setTotalIndemnites(BigDecimal.ZERO);
            bulletin.setTotalAvoirs(BigDecimal.ZERO);
            bulletin.setSalaireBrut(salaireBase.add(surSalaire));
            bulletin.setTotalExonerations(BigDecimal.ZERO);
            bulletin.setAbattementForfaitaire(BigDecimal.ZERO);
            bulletin.setBaseImposable(BigDecimal.ZERO);
            bulletin.setCotisationCnss(BigDecimal.ZERO);
            bulletin.setImpotIutsSansCharge(BigDecimal.ZERO);
            bulletin.setReductionIutsCharge(BigDecimal.ZERO);
            bulletin.setImpotIuts(BigDecimal.ZERO);
            bulletin.setTotalRetenuesSociales(BigDecimal.ZERO);
            bulletin.setTotalPrecomptes(BigDecimal.ZERO);
            bulletin.setTotalRetenues(BigDecimal.ZERO);
            bulletin.setTotalCotisationsPatronales(BigDecimal.ZERO);
            bulletin.setSalaireNet(salaireBase.add(surSalaire));
            bulletin.setStatut("GENERE");
            bulletin.setDateCalcul(LocalDateTime.now());

            bulletin.addLine(gratLine);
            bulletin = bulletinRepository.save(bulletin);
            return bulletin;
        }

        // Indemnités - synchronisation dynamique automatique avec le poste, la fonction et le grade de l'agent
        try {
            employeeProcessService.sync(emp, null);
        } catch (Exception e) {
            System.err.println("Warn: Erreur synchronisation indemnités pour employé " + emp.getId() + ": " + e.getMessage());
        }
        List<IndemniteEmploye> rawIndemnites = indemniteRepository.findByEmployeeId(emp.getId());

        List<IndemniteEmploye> indemnites = rawIndemnites.stream()
                .filter(row -> !Boolean.FALSE.equals(row.getActif()))
                .filter(row -> {
                    String code = (row.getTypeIndemnite() != null && row.getTypeIndemnite().getCode() != null)
                            ? row.getTypeIndemnite().getCode().toUpperCase(Locale.ROOT) : "";
                    String lib = row.getLibelle() != null ? row.getLibelle().toUpperCase(Locale.ROOT) : "";
                    if (Boolean.TRUE.equals(emp.getVehiculeFourni()) && (code.contains("TRP") || code.contains("TRANS") || lib.contains("TRANSPORT") || lib.contains("DEPLACEMENT"))) {
                        return false;
                    }
                    if (Boolean.TRUE.equals(emp.getLogementFourni()) && (code.contains("LOG") || code.contains("MAISON") || lib.contains("LOGEMENT"))) {
                        return false;
                    }
                    return true;
                })
                .sorted((a, b) -> {
                    String la = (a.getLibelle() != null ? a.getLibelle() : "").toUpperCase(Locale.ROOT);
                    String lb = (b.getLibelle() != null ? b.getLibelle() : "").toUpperCase(Locale.ROOT);
                    return Integer.compare(getIndemniteSortWeight(la), getIndemniteSortWeight(lb));
                })
                .toList();

        BigDecimal totalIndemnites = indemnites.stream()
                .map(row -> money(row.getMontant()).multiply(ratio))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Prime d'ancienneté : 5% sur le SB à 3 ans, puis +1% par année supplémentaire
        BigDecimal tauxAnciennete = BigDecimal.ZERO;
        int anneesAnciennete = (emp.getAncienneteReprise() != null && emp.getAncienneteReprise() > 0) ? emp.getAncienneteReprise() : 0;
        if (emp.getDateEmbauche() != null && !emp.getDateEmbauche().isBlank()) {
            try {
                LocalDate dateEmb = LocalDate.parse(emp.getDateEmbauche().trim());
                LocalDate dateRefAnciennete = debutPeriode != null ? debutPeriode : LocalDate.now();
                anneesAnciennete += Math.max(0, java.time.Period.between(dateEmb, dateRefAnciennete).getYears());
            } catch (Exception ignored) {}
        }
        if (anneesAnciennete == 3) {
            tauxAnciennete = new BigDecimal("5.00");
        } else if (anneesAnciennete > 3) {
            tauxAnciennete = new BigDecimal(5 + (anneesAnciennete - 3)).setScale(2, RoundingMode.HALF_UP);
        }
        BigDecimal primeAnciennete = money(calculatePercentage(salaireBase, tauxAnciennete));

        // Avoirs (Gains périodiques / rappels échelonnés / Primes variables)
        List<AvoirEmploye> avoirs = avoirRepository.findByEmployeeIdAndStatut(emp.getId(), "ACTIF");
        BigDecimal totalAvoirs = avoirs.stream()
                .map(AvoirEmploye::getMontantMensuel)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Avoirs créés via le module Variables Paie
        List<Avoir> avoirsVariables = avoirVariableRepository.findByEmployeeIdAndStatut(emp.getId(), "ACTIF");
        for (Avoir av : avoirsVariables) {
            if (av.getAmount() != null && av.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal m = av.getAmount();
                if (av.getEcheance() != null && av.getEcheance() > 1 && av.getMontantRestant() != null) {
                    m = av.getAmount().divide(new BigDecimal(av.getEcheance()), 0, RoundingMode.HALF_UP);
                }
                if (av.getMontantRestant() != null && av.getMontantRestant().compareTo(BigDecimal.ZERO) > 0) {
                    m = m.min(av.getMontantRestant());
                }
                totalAvoirs = totalAvoirs.add(m);
            }
        }

        if (is13eme) {
            indemnites = new ArrayList<>();
            totalIndemnites = BigDecimal.ZERO;
            avoirs = new ArrayList<>();
            avoirsVariables = new ArrayList<>();
            totalAvoirs = BigDecimal.ZERO;
        }

        BigDecimal montantIccp = BigDecimal.ZERO;
        BigDecimal joursIccp = BigDecimal.ZERO;
        if (isStc) {
            try {
                com.bpbf.sirh_backend.dtos.SoldeCongeDto soldeConge = congeWorkflowService.getSoldeForEmployee(emp.getId());
                if (soldeConge != null && soldeConge.getSoldeRestant() != null && soldeConge.getSoldeRestant() > 0) {
                    joursIccp = new BigDecimal(soldeConge.getSoldeRestant()).setScale(1, RoundingMode.HALF_UP);
                    BigDecimal baseJournaliere = salaireBase.add(surSalaire).divide(new BigDecimal("30"), 4, RoundingMode.HALF_UP);
                    montantIccp = money(baseJournaliere.multiply(joursIccp));
                }
            } catch (Exception e) {
                System.err.println("Notice calcul ICCP pour STC: " + e.getMessage());
            }
        }

        BigDecimal remunerationBrute = money(salaireBase.add(surSalaire).add(primeAnciennete).add(totalIndemnites).add(totalAvoirs).add(montantIccp));

        // Vérification plafond CNSS pour session extraordinaire
        boolean cnssPlafondAtteint = false;
        BigDecimal baseCnssDejaCotisee = BigDecimal.ZERO;
        BigDecimal totalCnssDejaCotisee = BigDecimal.ZERO;
        if (isExtra && session != null) {
            int targetAnnee = session.getAnnee() != null ? session.getAnnee() : (session.getDateFrom() != null ? session.getDateFrom().getYear() : LocalDate.now().getYear());
            int targetMois = 0;
            if (session.getMois() != null) {
                try { targetMois = Integer.parseInt(session.getMois().trim()); } catch (Exception ignored) {}
            }
            if (targetMois == 0 && session.getDateFrom() != null) {
                targetMois = session.getDateFrom().getMonthValue();
            }
            final int fTargetAnnee = targetAnnee;
            final int fTargetMois = targetMois;

            List<Bulletin> bulletinsMois = bulletinRepository.findByEmployeeId(emp.getId()).stream()
                    .filter(b -> b.getSessionPaie() != null && !b.getSessionPaie().getId().equals(session.getId()))
                    .filter(b -> {
                        int bAnnee = b.getSessionPaie().getAnnee() != null ? b.getSessionPaie().getAnnee() : (b.getDateFrom() != null ? b.getDateFrom().getYear() : 0);
                        int bMois = 0;
                        if (b.getSessionPaie().getMois() != null) {
                            try { bMois = Integer.parseInt(b.getSessionPaie().getMois().trim()); } catch (Exception ignored) {}
                        }
                        if (bMois == 0 && b.getDateFrom() != null) {
                            bMois = b.getDateFrom().getMonthValue();
                        }
                        return bAnnee == fTargetAnnee && bMois == fTargetMois;
                    })
                    .toList();

            totalCnssDejaCotisee = bulletinsMois.stream()
                    .map(b -> {
                        if (b.getCotisationCnss() != null && b.getCotisationCnss().compareTo(BigDecimal.ZERO) > 0) {
                            return b.getCotisationCnss();
                        }
                        if (b.getLines() != null) {
                            return b.getLines().stream()
                                    .filter(l -> l.getCode() != null && l.getCode().contains("CNSS") && !l.getCode().contains("PATRON"))
                                    .map(BulletinLine::getMontant)
                                    .filter(m -> m != null && m.compareTo(BigDecimal.ZERO) > 0)
                                    .findFirst()
                                    .orElse(BigDecimal.ZERO);
                        }
                        return BigDecimal.ZERO;
                    })
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            baseCnssDejaCotisee = bulletinsMois.stream()
                    .map(b -> b.getSalaireBrut() != null ? b.getSalaireBrut() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            if (totalCnssDejaCotisee.compareTo(new BigDecimal("44000")) >= 0 || baseCnssDejaCotisee.compareTo(new BigDecimal("800000")) >= 0) {
                cnssPlafondAtteint = true;
            }
        }

        // Retenues sociales obligatoires : CNSS (5.5% plafonné à 800 000 FCFA)
        BigDecimal baseCnss;
        BigDecimal cotisationCnss;
        if (isExtra && cnssPlafondAtteint) {
            baseCnss = BigDecimal.ZERO;
            cotisationCnss = BigDecimal.ZERO;
        } else if (isExtra && baseCnssDejaCotisee.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal plafondRestant = new BigDecimal("800000.00").subtract(baseCnssDejaCotisee).max(BigDecimal.ZERO);
            baseCnss = remunerationBrute.min(plafondRestant);
            cotisationCnss = money(calculatePercentage(baseCnss, new BigDecimal("5.50")));
        } else {
            baseCnss = remunerationBrute.min(new BigDecimal("800000.00"));
            cotisationCnss = money(calculatePercentage(baseCnss, new BigDecimal("5.50")));
        }

        // Base CRRAE = Salaire de Base + Sur-salaire + Prime d'ancienneté
        BigDecimal baseCrrae = money(salaireBase.add(surSalaire).add(primeAnciennete));

        // Salaire Brut fiscal (SB = Rémunération Brute - Cotisation CNSS) selon circulaire d'application du CGI BF
        BigDecimal brutApresCnss = money(remunerationBrute.subtract(cotisationCnss).max(BigDecimal.ZERO));

        // Exonérations fiscales : prioritaires depuis la persistance PostgreSQL (exoneration_employe)
        List<ExonerationEmploye> exosEmploye = exonerationRepository.findByEmployeeId(emp.getId());
        BigDecimal totalExonerations = BigDecimal.ZERO;
        if (exosEmploye != null && !exosEmploye.isEmpty()) {
            for (ExonerationEmploye exo : exosEmploye) {
                if (exo.getMontant() != null && exo.getMontant() > 0) {
                    BigDecimal mExo = money(BigDecimal.valueOf(exo.getMontant())).multiply(ratio);
                    totalExonerations = totalExonerations.add(money(mExo));
                }
            }
        } else {
            for (IndemniteEmploye ind : indemnites) {
                BigDecimal mIndem = money(ind.getMontant()).multiply(ratio);
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
        Categorie cat = situation != null ? situation.getCategorie() : null;
        if (cat == null && situation != null && situation.getGrilleSalariale() != null) {
            cat = situation.getGrilleSalariale().getCategorieObj();
        }
        if (cat == null && emp.getCategorieObj() != null) {
            cat = emp.getCategorieObj();
        }
        BigDecimal rawAbat = new BigDecimal("20.00");
        if (cat != null && cat.getTauxAbattement() != null && cat.getTauxAbattement() > 0) {
            rawAbat = BigDecimal.valueOf(cat.getTauxAbattement());
            if (rawAbat.compareTo(BigDecimal.ONE) <= 0) {
                rawAbat = rawAbat.multiply(CENT);
            }
        }
        BigDecimal abattementCalcule = calculatePercentage(brutApresCnss, rawAbat);
        BigDecimal abattementForfaitaire = money(abattementCalcule.min(new BigDecimal("75000.00")));

        // Base Imposable IUTS conforme au CGI Burkina Faso : Brut - Cotisation CNSS - Exonérations - Abattement forfaitaire
        BigDecimal baseImposable = money(brutApresCnss.subtract(totalExonerations).subtract(abattementForfaitaire).max(BigDecimal.ZERO));

        // Calcul de l'IUTS avec charges de famille
        int nbCharges = Math.toIntExact(familleRepository.countByEmployeeIdAndEstChargeTrue(emp.getId()));
        BigDecimal iutsSansCharge = calculateIuts(baseImposable);
        BigDecimal tauxReduction = reductionRate(nbCharges);
        BigDecimal reductionIuts = money(iutsSansCharge.multiply(tauxReduction).divide(CENT, 8, RoundingMode.HALF_UP));
        BigDecimal impotIuts = money(iutsSansCharge.subtract(reductionIuts).max(BigDecimal.ZERO));

        // Base Fonds de Solidarité Patriotique (FSP) : Net Cédulaire = Brut - CNSS - IUTS
        BigDecimal baseSolidarite = money(remunerationBrute.subtract(cotisationCnss).subtract(impotIuts).max(BigDecimal.ZERO));

        // Retenues sociales / Cotisations
        List<Retenue> applicableRetenues = findApplicableRetenues(emp);
        BigDecimal totalRetenuesSociales = BigDecimal.ZERO;
        BigDecimal totalCotisationsPatronales = BigDecimal.ZERO;

        List<BulletinLine> lines = new ArrayList<>();
        int ordre = 1;

        // Ligne Salaire de Base
        BulletinLine salBaseLine = new BulletinLine();
        salBaseLine.setCode("SAL_BASE");
        salBaseLine.setLibelle("Salaire de Base");
        salBaseLine.setTypeLigne("GAIN");
        salBaseLine.setBaseCalcul(salaireBasePlein);
        salBaseLine.setTaux(workedDays != null ? workedDays : new BigDecimal("30.00"));
        salBaseLine.setMontant(salaireBase);
        salBaseLine.setOrdre(ordre++);
        lines.add(salBaseLine);

        // Ligne Sur-salaire
        if (surSalaire.compareTo(BigDecimal.ZERO) > 0) {
            BulletinLine surSalLine = new BulletinLine();
            surSalLine.setCode("SUR_SALAIRE");
            surSalLine.setLibelle("Sur-salaire");
            surSalLine.setTypeLigne("GAIN");
            surSalLine.setBaseCalcul(surSalairePlein);
            surSalLine.setTaux(workedDays != null ? workedDays : new BigDecimal("30.00"));
            surSalLine.setMontant(surSalaire);
            surSalLine.setOrdre(ordre++);
            lines.add(surSalLine);
        }

        // Ligne Prime d'ancienneté : figure uniquement si supérieure à 0
        if (primeAnciennete != null && primeAnciennete.compareTo(BigDecimal.ZERO) > 0) {
            BulletinLine ancLine = new BulletinLine();
            ancLine.setCode("PRIME_ANC");
            ancLine.setLibelle("PRIME D'ANCIENNETE");
            ancLine.setTypeLigne("GAIN");
            ancLine.setBaseCalcul(salaireBase);
            ancLine.setTaux(tauxAnciennete != null ? tauxAnciennete : BigDecimal.ZERO);
            ancLine.setMontant(primeAnciennete);
            ancLine.setOrdre(ordre++);
            lines.add(ancLine);
        }

        // Lignes Indemnités avec gestion plafond congé maternité
        for (IndemniteEmploye ind : indemnites) {
            BigDecimal mIndem = money(ind.getMontant()).multiply(ratio);
            String indCode = ind.getTypeIndemnite() != null ? ind.getTypeIndemnite().getCode() : "INDEMNITE";
            String rawLib = ind.getLibelle() != null ? ind.getLibelle() : (ind.getTypeIndemnite() != null ? ind.getTypeIndemnite().getName() : "Indemnité");
            String indLib = rawLib.toUpperCase(Locale.ROOT).trim();
            boolean isMaternite = (indCode != null && indCode.toUpperCase(Locale.ROOT).contains("MATERN")) ||
                                  (indLib.contains("MATERN"));

            if (isMaternite && mIndem.compareTo(new BigDecimal("800000")) > 0) {
                BulletinLine matLine = new BulletinLine();
                matLine.setCode("CONGE_MATERNITE");
                matLine.setLibelle("Congé de maternité - Plafond 800 000");
                matLine.setTypeLigne("GAIN");
                matLine.setBaseCalcul(mIndem);
                matLine.setMontant(new BigDecimal("800000.00"));
                matLine.setOrdre(ordre++);
                lines.add(matLine);

                BulletinLine diffLine = new BulletinLine();
                diffLine.setCode("DIFF_MATERNITE");
                diffLine.setLibelle("Différence congé maternité");
                diffLine.setTypeLigne("GAIN");
                diffLine.setBaseCalcul(mIndem);
                diffLine.setMontant(money(mIndem.subtract(new BigDecimal("800000.00"))));
                diffLine.setOrdre(ordre++);
                lines.add(diffLine);
            } else {
                BulletinLine indLine = new BulletinLine();
                indLine.setCode(indCode);
                indLine.setLibelle(indLib);
                indLine.setTypeLigne("GAIN");
                indLine.setBaseCalcul(money(mIndem));
                BigDecimal tauxAffichage;
                String c = indCode != null ? indCode.toUpperCase(Locale.ROOT) : "";
                String l = indLib != null ? indLib.toUpperCase(Locale.ROOT) : "";
                if (c.contains("LOG") || l.contains("LOGEMENT")) {
                    tauxAffichage = new BigDecimal("20.00");
                } else if (c.contains("TRP") || l.contains("TRANSPORT")) {
                    tauxAffichage = new BigDecimal("5.00");
                } else if (c.contains("CS") || l.contains("CAISSE")) {
                    tauxAffichage = new BigDecimal("5.00");
                } else if (c.contains("SUJ") || l.contains("SUJETION")) {
                    tauxAffichage = new BigDecimal("5.00");
                } else if (c.contains("CP") || l.contains("CASH")) {
                    tauxAffichage = workedDays != null ? workedDays : new BigDecimal("30.00");
                } else if (ind.getTypeIndemnite() != null && ind.getTypeIndemnite().getTauxExoneration() != null && ind.getTypeIndemnite().getTauxExoneration() > 0) {
                    tauxAffichage = money(BigDecimal.valueOf(ind.getTypeIndemnite().getTauxExoneration()));
                } else {
                    tauxAffichage = new BigDecimal("100.00");
                }
                indLine.setTaux(tauxAffichage);
                indLine.setMontant(money(mIndem));
                indLine.setOrdre(ordre++);
                lines.add(indLine);
            }
        }

        if (montantIccp != null && montantIccp.compareTo(BigDecimal.ZERO) > 0) {
            BulletinLine iccpLine = new BulletinLine();
            iccpLine.setCode("ICCP");
            iccpLine.setLibelle("Indemnité Compensatrice de Congés Payés");
            iccpLine.setTypeLigne("GAIN");
            iccpLine.setBaseCalcul(salaireBase.add(surSalaire));
            iccpLine.setTaux(joursIccp);
            iccpLine.setMontant(montantIccp);
            iccpLine.setOrdre(ordre++);
            lines.add(iccpLine);
        }

        // Lignes Avoirs
        for (AvoirEmploye av : avoirs) {
            BulletinLine avLine = new BulletinLine();
            avLine.setRubriquePaie(av.getRubriquePaie());
            avLine.setCode("AVOIR_" + av.getId());
            avLine.setLibelle(av.getLibelle() + " - Échéance " + (av.getEcheancesTotal() - av.getEcheancesRestantes() + 1) + "/" + av.getEcheancesTotal());
            avLine.setTypeLigne("GAIN");
            avLine.setBaseCalcul(av.getMontantInitial());
            avLine.setMontant(av.getMontantMensuel());
            avLine.setOrdre(ordre++);
            lines.add(avLine);
        }

        for (Avoir av : avoirsVariables) {
            if (av.getAmount() != null && av.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal m = av.getAmount();
                if (av.getEcheance() != null && av.getEcheance() > 1 && av.getMontantRestant() != null) {
                    m = av.getAmount().divide(new BigDecimal(av.getEcheance()), 0, RoundingMode.HALF_UP);
                }
                if (av.getMontantRestant() != null && av.getMontantRestant().compareTo(BigDecimal.ZERO) > 0) {
                    m = m.min(av.getMontantRestant());
                }
                String rawName = av.getSalaryElement() != null ? av.getSalaryElement().getName() : "Rappel salaire";
                String finalLibelle;
                if (rawName != null && rawName.toUpperCase(Locale.ROOT).contains("RAPPEL")) {
                    finalLibelle = rawName;
                } else {
                    finalLibelle = "Rappel " + (rawName != null ? rawName : "salaire");
                }
                BulletinLine avLine = new BulletinLine();
                avLine.setCode(av.getSalaryElement() != null ? av.getSalaryElement().getCode() : "RAPPEL_" + av.getId());
                avLine.setLibelle(finalLibelle);
                avLine.setTypeLigne("GAIN");
                avLine.setBaseCalcul(av.getAmount());
                avLine.setTaux(new BigDecimal("100.00"));
                avLine.setMontant(m);
                avLine.setOrdre(ordre++);
                lines.add(avLine);
            }
        }

        // Lignes Retenues Sociales & Patronales
        for (Retenue ret : applicableRetenues) {
            if (ret == null || isIuts(ret)) continue;

            String rCode = ret.getCode() != null ? ret.getCode().toUpperCase(Locale.ROOT) : "";
            String rLib = ret.getLibelle() != null ? ret.getLibelle().toUpperCase(Locale.ROOT) : "";

            // CRRAE désactivée en session extraordinaire
            if (isExtra && (rCode.contains("CRRAE") || rLib.contains("CRRAE"))) {
                continue;
            }

            // CNSS désactivée si plafond atteint en session extraordinaire
            if (isExtra && cnssPlafondAtteint && (rCode.contains("CNSS") || rLib.contains("CNSS"))) {
                continue;
            }

            boolean employeur = isEmployeur(ret);
            BigDecimal base;
            BigDecimal taux = money(ret.getTaux());
            String customLibelle = null;
            if (rCode.contains("CRRAE") || rLib.contains("CRRAE")) {
                base = baseCrrae;
                if (taux.compareTo(BigDecimal.ZERO) == 0) taux = new BigDecimal("6.00");
                customLibelle = "COTISATION CRRAE/RCPNC";
            } else if (rCode.contains("SOLIDAR") || rLib.contains("SOLIDAR") || rCode.contains("FSP") || rLib.contains("FSP")) {
                base = baseSolidarite;
                if (taux.compareTo(BigDecimal.ZERO) == 0) taux = new BigDecimal("1.00");
                customLibelle = "RETENUE FONDS DE SOLIDARITE";
            } else if (rCode.contains("CNSS") || rLib.contains("CNSS") || rCode.contains("SECU") || rLib.contains("SECURITE")) {
                base = baseCnss;
                if (!employeur) {
                    taux = new BigDecimal("5.50");
                } else if (taux.compareTo(BigDecimal.ZERO) == 0) {
                    taux = new BigDecimal("16.00");
                }
                customLibelle = "COTISATION CNSS";
            } else {
                base = resolveBase(ret.getBaseCalcul(), salaireBase, surSalaire, primeAnciennete, remunerationBrute, baseImposable);
            }

            BigDecimal montant = money(calculatePercentage(base, taux));
            if (!employeur && (rCode.contains("CNSS") || rLib.contains("CNSS") || rCode.contains("SECU") || rLib.contains("SECURITE"))) {
                montant = cotisationCnss;
            }

            BulletinLine retLine = new BulletinLine();
            retLine.setCode(ret.getCode() != null ? ret.getCode() : "RETENUE");
            retLine.setLibelle(customLibelle != null ? customLibelle : (ret.getLibelle() != null ? ret.getLibelle() : "Retenue"));
            retLine.setBaseCalcul(base);
            retLine.setTaux(taux);

            if (employeur) {
                totalCotisationsPatronales = totalCotisationsPatronales.add(montant);
            } else {
                totalRetenuesSociales = totalRetenuesSociales.add(montant);
                retLine.setTypeLigne("RETENUE_SOCIALE");
                retLine.setMontant(montant);
                retLine.setOrdre(ordre++);
                lines.add(retLine);
            }
        }

        // Vérifier et garantir la présence de la CNSS (5.5% plafonné à 800 000 FCFA sur Salaire Brut)
        boolean hasCnss = lines.stream().anyMatch(l -> l.getCode() != null && (l.getCode().contains("CNSS") || (l.getLibelle() != null && l.getLibelle().toUpperCase(Locale.ROOT).contains("CNSS"))));
        if (!hasCnss && !(isExtra && cnssPlafondAtteint) && cotisationCnss.compareTo(BigDecimal.ZERO) > 0) {
            totalRetenuesSociales = totalRetenuesSociales.add(cotisationCnss);

            BulletinLine cnssLine = new BulletinLine();
            cnssLine.setCode("COTIS_CNSS");
            cnssLine.setLibelle("COTISATION CNSS");
            cnssLine.setTypeLigne("RETENUE_SOCIALE");
            cnssLine.setBaseCalcul(baseCnss);
            cnssLine.setTaux(new BigDecimal("5.50"));
            cnssLine.setMontant(cotisationCnss);
            cnssLine.setOrdre(ordre++);
            lines.add(cnssLine);
        }

        // Vérifier et garantir la présence de la CRRAE (Salarié 6%, Patronale 6%) pour session ordinaire
        boolean hasCrrae = lines.stream().anyMatch(l -> l.getCode() != null && (l.getCode().contains("CRRAE") || (l.getLibelle() != null && l.getLibelle().toUpperCase(Locale.ROOT).contains("CRRAE"))));
        if (!isExtra && !hasCrrae && baseCrrae.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal tauxCrrae = new BigDecimal("6.00");
            BigDecimal montantCrrae = money(calculatePercentage(baseCrrae, tauxCrrae));
            totalRetenuesSociales = totalRetenuesSociales.add(montantCrrae);

            BulletinLine crraeLine = new BulletinLine();
            crraeLine.setCode("COTIS_CRRAE");
            crraeLine.setLibelle("COTISATION CRRAE/RCPNC");
            crraeLine.setTypeLigne("RETENUE_SOCIALE");
            crraeLine.setBaseCalcul(baseCrrae);
            crraeLine.setTaux(tauxCrrae);
            crraeLine.setMontant(montantCrrae);
            crraeLine.setPartPatronale(money(calculatePercentage(baseCrrae, new BigDecimal("6.00"))));
            crraeLine.setOrdre(ordre++);
            lines.add(crraeLine);

            totalCotisationsPatronales = totalCotisationsPatronales.add(money(calculatePercentage(baseCrrae, new BigDecimal("6.00"))));
        }

        // Ligne IUTS
        if (impotIuts.compareTo(BigDecimal.ZERO) > 0) {
            BulletinLine iutsLine = new BulletinLine();
            iutsLine.setCode("IUTS");
            iutsLine.setLibelle("RETENUE IUTS");
            iutsLine.setTypeLigne("IMPOT");
            iutsLine.setBaseCalcul(baseImposable);
            iutsLine.setTaux(BigDecimal.valueOf(nbCharges));
            iutsLine.setMontant(impotIuts);
            iutsLine.setOrdre(ordre++);
            lines.add(iutsLine);
        }

        // Vérifier et garantir la présence du Fonds de Solidarité (1% du Net Cédulaire : Brut - CNSS - IUTS)
        boolean hasSolidarite = lines.stream().anyMatch(l -> l.getCode() != null && (l.getCode().contains("SOLIDAR") || (l.getLibelle() != null && l.getLibelle().toUpperCase(Locale.ROOT).contains("SOLIDAR"))));
        if (!hasSolidarite && baseSolidarite.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal tauxSol = new BigDecimal("1.00");
            BigDecimal montantSol = money(calculatePercentage(baseSolidarite, tauxSol));
            totalRetenuesSociales = totalRetenuesSociales.add(montantSol);

            BulletinLine solLine = new BulletinLine();
            solLine.setCode("RET_SOLIDARITE");
            solLine.setLibelle("RETENUE FONDS DE SOLIDARITE");
            solLine.setTypeLigne("RETENUE_SOCIALE");
            solLine.setBaseCalcul(baseSolidarite);
            solLine.setTaux(tauxSol);
            solLine.setMontant(montantSol);
            solLine.setOrdre(ordre++);
            lines.add(solLine);
        }

        // Précomptes (Retenues sur salaire, prêts, avances)
        List<PrecompteEmploye> precomptes = precompteRepository.findByEmployeeIdAndStatut(emp.getId(), "ACTIF");
        BigDecimal totalPrecomptes = BigDecimal.ZERO;
        for (PrecompteEmploye prec : precomptes) {
            BigDecimal mPrelev = isStc ? prec.getMontantRestant() : prec.getMontantMensuel().min(prec.getMontantRestant());
            totalPrecomptes = totalPrecomptes.add(mPrelev);

            BulletinLine precLine = new BulletinLine();
            precLine.setRubriquePaie(prec.getRubriquePaie());
            precLine.setCode("PREC_" + prec.getId());
            precLine.setLibelle(isStc ? (prec.getLibelle() + " - Solde intégral") : (prec.getLibelle() + " - Échéance " + (prec.getEcheancesTotal() - prec.getEcheancesRestantes() + 1) + "/" + prec.getEcheancesTotal()));
            precLine.setTypeLigne("PRECOMPTE");
            precLine.setBaseCalcul(prec.getMontantInitial());
            precLine.setMontant(mPrelev);
            precLine.setOrdre(ordre++);
            lines.add(precLine);
        }

        List<Precompte> precomptesVariables = precompteVariableRepository.findByEmployeeIdAndStatut(emp.getId(), "EN_COURS");
        if (precomptesVariables.isEmpty()) {
            precomptesVariables = precompteVariableRepository.findByEmployeeIdAndStatut(emp.getId(), "ACTIF");
        }
        for (Precompte prec : precomptesVariables) {
            if (prec.getAmount() != null && prec.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal m = prec.getAmount();
                if (isStc && prec.getMontantRestant() != null && prec.getMontantRestant().compareTo(BigDecimal.ZERO) > 0) {
                    m = prec.getMontantRestant();
                } else if (prec.getRetenueMensuelle() != null && prec.getRetenueMensuelle().compareTo(BigDecimal.ZERO) > 0) {
                    m = prec.getRetenueMensuelle();
                } else if (prec.getEcheance() != null && prec.getEcheance() > 1) {
                    m = prec.getAmount().divide(new BigDecimal(prec.getEcheance()), 0, RoundingMode.HALF_UP);
                }
                if (!isStc && prec.getMontantRestant() != null && prec.getMontantRestant().compareTo(BigDecimal.ZERO) > 0) {
                    m = m.min(prec.getMontantRestant());
                }
                totalPrecomptes = totalPrecomptes.add(m);

                BulletinLine precLine = new BulletinLine();
                precLine.setCode(prec.getSalaryElement() != null ? prec.getSalaryElement().getCode() : "PREC_" + prec.getId());
                precLine.setLibelle(prec.getSalaryElement() != null ? (prec.getSalaryElement().getName() + (isStc ? " - Solde intégral" : "")) : (isStc ? "Précompte - Solde intégral" : "Précompte / Retenue"));
                precLine.setTypeLigne("PRECOMPTE");
                precLine.setBaseCalcul(prec.getAmount());
                precLine.setTaux(null);
                precLine.setMontant(m);
                precLine.setOrdre(ordre++);
                lines.add(precLine);
            }
        }

        // Trop-perçus (Retenue spontanée en 1 seule fois déduite directement du salaire Net)
        List<TropPercu> tropPercus = tropPercuRepository.findByEmployeeIdAndStatut(emp.getId(), "EN_ATTENTE");
        for (TropPercu tp : tropPercus) {
            if (isTropPercuForSession(tp, session) && tp.getAmount() != null && tp.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                totalPrecomptes = totalPrecomptes.add(tp.getAmount());

                BulletinLine tpLine = new BulletinLine();
                tpLine.setCode(tp.getSalaryElement() != null ? tp.getSalaryElement().getCode() : "RET_TROP_PERCU");
                String libelle = "Retenue Trop-perçu";
                if (tp.getMoisOrigine() != null && !tp.getMoisOrigine().isBlank()) {
                    libelle += " - " + tp.getMoisOrigine();
                }
                if (tp.getMotif() != null && !tp.getMotif().isBlank()) {
                    libelle += " - " + tp.getMotif();
                }
                tpLine.setLibelle(libelle);
                tpLine.setTypeLigne("RETENUE");
                tpLine.setBaseCalcul(tp.getAmount());
                tpLine.setTaux(null);
                tpLine.setMontant(tp.getAmount());
                tpLine.setOrdre(ordre++);
                lines.add(tpLine);
            }
        }

        BigDecimal totalRetenues = money(totalRetenuesSociales.add(impotIuts).add(totalPrecomptes));
        BigDecimal salaireNet = money(remunerationBrute.subtract(totalRetenues).max(BigDecimal.ZERO));

        Contrat contrat = contratRepository.findFirstByEmployeeIdOrderByIdDesc(emp.getId()).orElse(null);
        Grade grade = emp.getGradeObj();

        String codeBulletin = String.format("BLT-%s-%s-%04d",
                session.getMois() != null ? session.getMois() : "M",
                session.getAnnee() != null ? session.getAnnee() : LocalDate.now().getYear(),
                emp.getId());
        if (codeBulletin.length() > 60) codeBulletin = codeBulletin.substring(0, 60);
        String finalCode = codeBulletin;
        if (bulletinRepository.findByCode(finalCode).isPresent()) {
            long count = bulletinRepository.countByEmployeeId(emp.getId()) + 1;
            finalCode = String.format("%s-%d", codeBulletin, count);
            while (bulletinRepository.findByCode(finalCode).isPresent()) {
                finalCode = String.format("%s-%d", codeBulletin, ++count);
            }
        }

        Bulletin bulletin = new Bulletin();
        bulletin.setCode(finalCode);
        bulletin.setEmployee(emp);
        bulletin.setSessionPaie(session);
        bulletin.setGrade(grade);
        bulletin.setContrat(contrat);
        bulletin.setTypeSession(session.getTypeSession());
        bulletin.setDateFrom(debutPeriode);
        bulletin.setDateTo(finPeriode);
        bulletin.setScheduledWorkingDays(scheduledDays != null ? scheduledDays : new BigDecimal("30.00"));
        bulletin.setWorkedDays(workedDays != null ? workedDays : new BigDecimal("30.00"));
        bulletin.setSalaireBase(salaireBase);
        bulletin.setSurSalaire(surSalaire);
        bulletin.setTotalIndemnites(totalIndemnites);
        bulletin.setTotalAvoirs(totalAvoirs);
        bulletin.setSalaireBrut(remunerationBrute);
        bulletin.setTotalExonerations(totalExonerations);
        bulletin.setAbattementForfaitaire(abattementForfaitaire);
        bulletin.setBaseImposable(baseImposable);
        bulletin.setCotisationCnss(cotisationCnss);
        bulletin.setImpotIutsSansCharge(iutsSansCharge);
        bulletin.setReductionIutsCharge(reductionIuts);
        bulletin.setImpotIuts(impotIuts);
        bulletin.setTotalRetenuesSociales(totalRetenuesSociales);
        bulletin.setTotalPrecomptes(totalPrecomptes);
        bulletin.setTotalRetenues(totalRetenues);
        bulletin.setTotalCotisationsPatronales(totalCotisationsPatronales);
        bulletin.setSalaireNet(salaireNet);
        bulletin.setStatut("GENERE");
        bulletin.setDateCalcul(LocalDateTime.now());

        lines.removeIf(l -> l.getMontant() == null || l.getMontant().compareTo(BigDecimal.ZERO) <= 0);
        lines.sort(Comparator.comparingInt(l -> getOverallLineSortWeight(l.getCode(), l.getLibelle(), l.getTypeLigne())));
        int seq = 1;
        for (BulletinLine line : lines) {
            line.setOrdre(seq++);
            bulletin.addLine(line);
        }

        bulletin = bulletinRepository.save(bulletin);
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
        Bulletin b = bulletinRepository.findByIdWithLines(id)
                .or(() -> bulletinRepository.findById(id))
                .orElseThrow(() -> new RuntimeException("Bulletin non trouvé: #" + id));
        return toDto(b);
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

            boolean isStcSession = b.getSessionPaie() != null && isStc(b.getSessionPaie());

            // Mettre à jour les précomptes de l'employé
            List<PrecompteEmploye> precomptes = precompteRepository.findByEmployeeIdAndStatut(b.getEmployee().getId(), "ACTIF");
            for (PrecompteEmploye p : precomptes) {
                BigDecimal m = isStcSession ? p.getMontantRestant() : p.getMontantMensuel().min(p.getMontantRestant());
                BigDecimal newRestant = p.getMontantRestant().subtract(m).max(BigDecimal.ZERO);
                p.setMontantRestant(newRestant);
                p.setEcheancesRestantes(Math.max(0, (p.getEcheancesRestantes() != null ? p.getEcheancesRestantes() : 1) - 1));
                if (isStcSession || newRestant.compareTo(BigDecimal.ZERO) <= 0 || (p.getEcheancesRestantes() != null && p.getEcheancesRestantes() <= 0)) {
                    p.setStatut("SOLDE");
                }
                precompteRepository.save(p);
            }

            List<Precompte> precomptesVar = precompteVariableRepository.findByEmployeeIdAndStatut(b.getEmployee().getId(), "EN_COURS");
            if (precomptesVar.isEmpty()) {
                precomptesVar = precompteVariableRepository.findByEmployeeIdAndStatut(b.getEmployee().getId(), "ACTIF");
            }
            for (Precompte p : precomptesVar) {
                BigDecimal m = p.getAmount();
                if (p.getRetenueMensuelle() != null && p.getRetenueMensuelle().compareTo(BigDecimal.ZERO) > 0) {
                    m = p.getRetenueMensuelle();
                } else if (p.getEcheance() != null && p.getEcheance() > 1) {
                    m = p.getAmount().divide(new BigDecimal(p.getEcheance()), 0, RoundingMode.HALF_UP);
                }
                BigDecimal restant = p.getMontantRestant() != null ? p.getMontantRestant() : p.getAmount();
                m = isStcSession ? restant : m.min(restant);
                BigDecimal newRestant = restant.subtract(m).max(BigDecimal.ZERO);
                p.setMontantRestant(newRestant);
                p.setEcheance(Math.max(0, (p.getEcheance() != null ? p.getEcheance() : 1) - 1));
                if (isStcSession || newRestant.compareTo(BigDecimal.ZERO) <= 0 || (p.getEcheance() != null && p.getEcheance() <= 0)) {
                    p.setStatut("SOLDE");
                }
                precompteVariableRepository.save(p);
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

            List<Avoir> avoirsVar = avoirVariableRepository.findByEmployeeIdAndStatut(b.getEmployee().getId(), "ACTIF");
            for (Avoir a : avoirsVar) {
                BigDecimal m = a.getAmount();
                if (a.getEcheance() != null && a.getEcheance() > 1 && a.getMontantRestant() != null) {
                    m = a.getAmount().divide(new BigDecimal(a.getEcheance()), 0, RoundingMode.HALF_UP);
                }
                BigDecimal restant = a.getMontantRestant() != null ? a.getMontantRestant() : a.getAmount();
                BigDecimal newRestant = restant.subtract(m).max(BigDecimal.ZERO);
                a.setMontantRestant(newRestant);
                a.setEcheance(Math.max(0, (a.getEcheance() != null ? a.getEcheance() : 1) - 1));
                if (newRestant.compareTo(BigDecimal.ZERO) <= 0 || (a.getEcheance() != null && a.getEcheance() <= 0)) {
                    a.setStatut("SOLDE");
                }
                avoirVariableRepository.save(a);
            }

            // Mettre à jour les trop-perçus appliqués sur ce bulletin (en 1 seule fois)
            List<TropPercu> tropPercus = tropPercuRepository.findByEmployeeIdAndStatut(b.getEmployee().getId(), "EN_ATTENTE");
            for (TropPercu tp : tropPercus) {
                if (isTropPercuForSession(tp, session)) {
                    tp.setStatut("APPLIQUE");
                    tropPercuRepository.save(tp);
                }
            }
        }

        session.setStatut("VALIDE");
        session.setDateValidation(LocalDateTime.now());
        sessionPaieRepository.save(session);
    }

    @Transactional(readOnly = true)
    public List<BulletinDto> getAllBulletins() {
        return bulletinRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BulletinDto saveIndividualBulletin(BulletinDto dto) {
        return createOrUpdateBulletin(dto);
    }

    @Transactional
    public BulletinDto createOrUpdateBulletin(BulletinDto dto) {
        if (dto.getEmployeeId() == null) {
            throw new IllegalArgumentException("L'identifiant de l'agent est requis pour créer un bulletin.");
        }

        Employee emp = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Agent introuvable avec ID: " + dto.getEmployeeId()));

        SessionPaie session = null;
        if (dto.getSessionPaieId() != null) {
            session = sessionPaieRepository.findById(dto.getSessionPaieId()).orElse(null);
        }

        if (session == null) {
            LocalDate dateRef = dto.getDateFrom() != null ? dto.getDateFrom() : LocalDate.now();
            String mois = String.format("%02d", dateRef.getMonthValue());
            int annee = dateRef.getYear();

            session = sessionPaieRepository.findFirstByMoisAndAnneeOrderByIdDesc(mois, annee).orElse(null);
            if (session == null) {
                session = sessionPaieRepository.findFirstByMoisAndAnneeOrderByIdDesc(String.valueOf(dateRef.getMonthValue()), annee).orElse(null);
            }
            if (session == null) {
                session = sessionPaieRepository.findTopByOrderByAnneeDescMoisDesc().orElse(null);
            }
            if (session == null) {
                String[] moisNoms = {"Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"};
                String nomMois = (dateRef.getMonthValue() >= 1 && dateRef.getMonthValue() <= 12) ? moisNoms[dateRef.getMonthValue() - 1] : "Mois " + mois;

                SessionPaie newSession = SessionPaie.builder()
                        .codeSession(String.format("SESS-%d-%s", annee, mois))
                        .mois(mois)
                        .annee(annee)
                        .periode(nomMois + " " + annee)
                        .typeSession(dto.getTypeSession() != null ? dto.getTypeSession() : "PAIE_NORMALE")
                        .statut("GENERE")
                        .nombreEmployes(1)
                        .nombreValide(1)
                        .build();

                int sessSuffix = 1;
                String baseSessCode = newSession.getCodeSession();
                while (sessionPaieRepository.findByCodeSession(newSession.getCodeSession()).isPresent()) {
                    newSession.setCodeSession(String.format("%s-%d", baseSessCode, sessSuffix++));
                }
                try {
                    session = sessionPaieRepository.save(newSession);
                } catch (Exception ex) {
                    session = sessionPaieRepository.findTopByOrderByAnneeDescMoisDesc().orElse(null);
                }
            }
        }


        String code = dto.getCode();
        String matricule = emp.getMatricule() != null ? emp.getMatricule() : "EMP";
        String moisRef = dto.getDateFrom() != null
                ? String.format("%04d%02d", dto.getDateFrom().getYear(), dto.getDateFrom().getMonthValue())
                : LocalDate.now().toString().replace("-", "");

        if (code == null || code.isBlank() || "BLT-001".equalsIgnoreCase(code.trim())) {
            code = String.format("BLT-%s-%s", moisRef, matricule);
        }

        // Uniquement si un ID existant est expressément fourni, on modifie le bulletin ciblé
        Bulletin b = null;
        if (dto.getId() != null) {
            b = bulletinRepository.findById(dto.getId()).orElse(null);
        }

        if (b == null) {
            // NOUVELLE CRÉATION ILLIMITÉE : On autorise plus de 1000+ bulletins distincts pour un même agent
            String candidateCode = code;
            if (bulletinRepository.findByCode(candidateCode).isPresent()) {
                long count = bulletinRepository.countByEmployeeId(emp.getId()) + 1;
                candidateCode = String.format("%s-%d", code, count);
                while (bulletinRepository.findByCode(candidateCode).isPresent()) {
                    candidateCode = String.format("%s-%d", code, ++count);
                }
            }

            b = new Bulletin();
            b.setCode(candidateCode);
            b.setLines(new ArrayList<>());
        } else {
            // Modification du bulletin existant ciblé par son ID
            if (b.getLines() != null) {
                b.getLines().clear();
            } else {
                b.setLines(new ArrayList<>());
            }
        }

        if (isGratification(dto.getTypeSession())) {
            BigDecimal base = dto.getSalaireBase() != null && dto.getSalaireBase().compareTo(BigDecimal.ZERO) > 0
                    ? dto.getSalaireBase()
                    : (dto.getSalaireBrut() != null ? dto.getSalaireBrut() : BigDecimal.ZERO);
            if (base.compareTo(BigDecimal.ZERO) <= 0) {
                SituationSalariale situation = situationRepository.findByEmployeeId(emp.getId()).orElse(null);
                if (situation != null && situation.getSalaireBase() != null) {
                    base = money(new BigDecimal(situation.getSalaireBase()));
                }
            }

            b.setEmployee(emp);
            b.setSessionPaie(session);
            b.setTypeSession("GRATIFICATION");
            b.setDateFrom(dto.getDateFrom() != null ? dto.getDateFrom() : LocalDate.now().withDayOfMonth(1));
            b.setDateTo(dto.getDateTo() != null ? dto.getDateTo() : LocalDate.now());
            b.setScheduledWorkingDays(dto.getScheduledWorkingDays() != null ? dto.getScheduledWorkingDays() : new BigDecimal("30.00"));
            b.setWorkedDays(dto.getWorkedDays() != null ? dto.getWorkedDays() : new BigDecimal("30.00"));
            b.setSalaireBase(base);
            b.setTotalIndemnites(BigDecimal.ZERO);
            b.setTotalAvoirs(BigDecimal.ZERO);
            b.setSalaireBrut(base);
            b.setTotalExonerations(BigDecimal.ZERO);
            b.setAbattementForfaitaire(BigDecimal.ZERO);
            b.setBaseImposable(BigDecimal.ZERO);
            b.setCotisationCnss(BigDecimal.ZERO);
            b.setImpotIuts(BigDecimal.ZERO);
            b.setTotalRetenuesSociales(BigDecimal.ZERO);
            b.setTotalPrecomptes(BigDecimal.ZERO);
            b.setTotalRetenues(BigDecimal.ZERO);
            b.setTotalCotisationsPatronales(BigDecimal.ZERO);
            b.setSalaireNet(base); // LE NET DEVIENT LE BRUT !
            b.setStatut(dto.getStatut() != null ? dto.getStatut() : "VALIDE");
            b.setDateCalcul(dto.getDateCalcul() != null ? dto.getDateCalcul() : LocalDateTime.now());

            BulletinLine line = new BulletinLine();
            line.setCode("GRAT_ANN");
            line.setLibelle("Gratification Annuelle 13ème Mois");
            line.setTypeLigne("GAIN");
            line.setBaseCalcul(base);
            line.setTaux(new BigDecimal("100.00"));
            line.setMontant(base);
            line.setOrdre(1);
            b.addLine(line);

            Bulletin saved = bulletinRepository.save(b);
            return toDto(saved);
        }

        b.setEmployee(emp);
        b.setSessionPaie(session);
        if (b.getGrade() == null && emp.getGradeObj() != null) {
            b.setGrade(emp.getGradeObj());
        }
        if (b.getContrat() == null) {
            contratRepository.findFirstByEmployeeIdOrderByIdDesc(emp.getId()).ifPresent(b::setContrat);
        }
        b.setTypeSession(dto.getTypeSession() != null ? dto.getTypeSession() : "PAIE_NORMALE");
        b.setDateFrom(dto.getDateFrom() != null ? dto.getDateFrom() : LocalDate.now().withDayOfMonth(1));
        b.setDateTo(dto.getDateTo() != null ? dto.getDateTo() : LocalDate.now());
        b.setScheduledWorkingDays(dto.getScheduledWorkingDays() != null ? dto.getScheduledWorkingDays() : new BigDecimal("30.00"));
        b.setWorkedDays(dto.getWorkedDays() != null ? dto.getWorkedDays() : new BigDecimal("30.00"));
        b.setSalaireBase(dto.getSalaireBase());
        b.setSurSalaire(dto.getSurSalaire());
        b.setJustificationEcart(dto.getJustificationEcart());
        b.setTotalIndemnites(dto.getTotalIndemnites());
        b.setTotalAvoirs(dto.getTotalAvoirs());
        b.setSalaireBrut(dto.getSalaireBrut());
        b.setTotalExonerations(dto.getTotalExonerations());
        b.setAbattementForfaitaire(dto.getAbattementForfaitaire());
        b.setBaseImposable(dto.getBaseImposable());
        b.setCotisationCnss(dto.getCotisationCnss());
        b.setImpotIuts(dto.getImpotIuts());
        b.setTotalRetenuesSociales(dto.getTotalRetenuesSociales());
        b.setTotalPrecomptes(dto.getTotalPrecomptes());
        b.setTotalRetenues(dto.getTotalRetenues());
        b.setTotalCotisationsPatronales(dto.getTotalCotisationsPatronales());
        b.setSalaireNet(dto.getSalaireNet());
        b.setStatut(dto.getStatut() != null ? dto.getStatut() : "VALIDE");
        b.setDateCalcul(dto.getDateCalcul() != null ? dto.getDateCalcul() : LocalDateTime.now());

        if (b.getLines() == null) {
            b.setLines(new ArrayList<>());
        } else {
            b.getLines().clear();
        }

        if (dto.getLines() != null) {
            int ordre = 1;
            for (BulletinLineDto l : dto.getLines()) {
                String rawLib = l.getLibelle() != null ? l.getLibelle() : (l.getName() != null ? l.getName() : "Ligne Bulletin");
                String libelle = rawLib.replaceAll("[()]", "").replaceAll("\\s+", " ").trim();
                String typeLigne = l.getTypeLigne() != null ? l.getTypeLigne() : (l.getCategory() != null ? l.getCategory() : "GAIN");
                BigDecimal taux = l.getTaux() != null ? l.getTaux() : (l.getRate() != null ? BigDecimal.valueOf(l.getRate()) : null);
                BigDecimal montant = l.getMontant() != null ? l.getMontant() : (l.getAmount() != null ? BigDecimal.valueOf(Math.abs(l.getAmount())) : BigDecimal.ZERO);
                String lCode = l.getCode() != null ? l.getCode() : "LINE";

                if (lCode.length() > 50) lCode = lCode.substring(0, 50);
                if (libelle.length() > 150) libelle = libelle.substring(0, 150);
                if (typeLigne.length() > 50) typeLigne = typeLigne.substring(0, 50);

                if ((lCode.contains("CNSS") || libelle.contains("CNSS")) && !typeLigne.contains("PATRON") && !"EMPLOYEUR".equalsIgnoreCase(typeLigne)) {
                    taux = new BigDecimal("5.50");
                }

                BulletinLine line = new BulletinLine();
                line.setCode(lCode);
                line.setLibelle(libelle);
                line.setTypeLigne(typeLigne);
                line.setBaseCalcul(l.getBaseCalcul());
                line.setTaux(taux);
                line.setMontant(montant);
                line.setPartPatronale(l.getPartPatronale());
                line.setOrdre(l.getOrdre() != null ? l.getOrdre() : ordre++);
                b.addLine(line);
            }
        }

        Bulletin saved = bulletinRepository.save(b);

        // Mettre à jour les trop-perçus appliqués sur ce bulletin individuel
        List<TropPercu> tropPercus = tropPercuRepository.findByEmployeeIdAndStatut(emp.getId(), "EN_ATTENTE");
        for (TropPercu tp : tropPercus) {
            boolean matches = false;
            if (session != null && isTropPercuForSession(tp, session)) {
                matches = true;
            } else if (isTropPercuForDates(tp, b.getDateFrom(), b.getDateTo())) {
                matches = true;
            }
            if (matches) {
                tp.setStatut("APPLIQUE");
                tropPercuRepository.save(tp);
            }
        }

        return toDto(saved);
    }

    @Transactional
    public BulletinDto updateBulletin(Long id, BulletinDto dto) {
        Bulletin b = bulletinRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bulletin introuvable avec ID: " + id));

        if (dto.getWorkedDays() != null) b.setWorkedDays(dto.getWorkedDays());
        if (dto.getScheduledWorkingDays() != null) b.setScheduledWorkingDays(dto.getScheduledWorkingDays());
        if (dto.getSalaireBase() != null) b.setSalaireBase(dto.getSalaireBase());
        if (dto.getSurSalaire() != null) b.setSurSalaire(dto.getSurSalaire());
        if (dto.getJustificationEcart() != null) b.setJustificationEcart(dto.getJustificationEcart());
        if (dto.getTotalIndemnites() != null) b.setTotalIndemnites(dto.getTotalIndemnites());
        if (dto.getTotalAvoirs() != null) b.setTotalAvoirs(dto.getTotalAvoirs());
        if (dto.getSalaireBrut() != null) b.setSalaireBrut(dto.getSalaireBrut());
        if (dto.getBaseImposable() != null) b.setBaseImposable(dto.getBaseImposable());
        if (dto.getCotisationCnss() != null) b.setCotisationCnss(dto.getCotisationCnss());
        if (dto.getImpotIuts() != null) b.setImpotIuts(dto.getImpotIuts());
        if (dto.getTotalRetenues() != null) b.setTotalRetenues(dto.getTotalRetenues());
        if (dto.getTotalPrecomptes() != null) b.setTotalPrecomptes(dto.getTotalPrecomptes());
        if (dto.getTotalCotisationsPatronales() != null) b.setTotalCotisationsPatronales(dto.getTotalCotisationsPatronales());
        if (dto.getSalaireNet() != null) b.setSalaireNet(dto.getSalaireNet());
        if (dto.getStatut() != null) {
            b.setStatut(dto.getStatut());
            if ("VALIDE".equalsIgnoreCase(dto.getStatut()) && b.getDateValidation() == null) {
                b.setDateValidation(LocalDateTime.now());
            }
        }

        if (dto.getLines() != null && !dto.getLines().isEmpty()) {
            if (b.getLines() == null) {
                b.setLines(new ArrayList<>());
            } else {
                b.getLines().clear();
            }

            int ordre = 1;
            for (BulletinLineDto l : dto.getLines()) {
                String rawLib = l.getLibelle() != null ? l.getLibelle() : (l.getName() != null ? l.getName() : "Ligne Bulletin");
                String libelle = rawLib.replaceAll("[()]", "").replaceAll("\\s+", " ").trim();
                String typeLigne = l.getTypeLigne() != null ? l.getTypeLigne() : (l.getCategory() != null ? l.getCategory() : "GAIN");
                BigDecimal taux = l.getTaux() != null ? l.getTaux() : (l.getRate() != null ? BigDecimal.valueOf(l.getRate()) : null);
                BigDecimal montant = l.getMontant() != null ? l.getMontant() : (l.getAmount() != null ? BigDecimal.valueOf(Math.abs(l.getAmount())) : BigDecimal.ZERO);
                String lCode = l.getCode() != null ? l.getCode() : "LINE";

                if (lCode.length() > 50) lCode = lCode.substring(0, 50);
                if (libelle.length() > 150) libelle = libelle.substring(0, 150);
                if (typeLigne.length() > 50) typeLigne = typeLigne.substring(0, 50);

                if ((lCode.contains("CNSS") || libelle.contains("CNSS")) && !typeLigne.contains("PATRON") && !"EMPLOYEUR".equalsIgnoreCase(typeLigne)) {
                    taux = new BigDecimal("5.50");
                }

                BulletinLine line = new BulletinLine();
                line.setCode(lCode);
                line.setLibelle(libelle);
                line.setTypeLigne(typeLigne);
                line.setBaseCalcul(l.getBaseCalcul());
                line.setTaux(taux);
                line.setMontant(montant);
                line.setPartPatronale(l.getPartPatronale());
                line.setOrdre(l.getOrdre() != null ? l.getOrdre() : ordre++);
                b.addLine(line);
            }
        }

        Bulletin saved = bulletinRepository.save(b);
        if (saved.getSessionPaie() != null && saved.getSessionPaie().getId() != null) {
            refreshSessionTotals(saved.getSessionPaie().getId());
        }
        return toDto(saved);
    }

    @Transactional
    public void refreshSessionTotals(Long sessionId) {
        if (sessionId == null) return;
        SessionPaie session = sessionPaieRepository.findById(sessionId).orElse(null);
        if (session == null) return;
        List<Bulletin> allSessionBulletins = bulletinRepository.findBySessionPaieId(sessionId);
        BigDecimal totalBrut = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;
        BigDecimal totalRetenues = BigDecimal.ZERO;
        BigDecimal totalCotisPatronales = BigDecimal.ZERO;

        for (Bulletin b : allSessionBulletins) {
            if (b.getSalaireBrut() != null) totalBrut = totalBrut.add(b.getSalaireBrut());
            if (b.getSalaireNet() != null) totalNet = totalNet.add(b.getSalaireNet());
            if (b.getTotalRetenues() != null) totalRetenues = totalRetenues.add(b.getTotalRetenues());
            if (b.getTotalCotisationsPatronales() != null) totalCotisPatronales = totalCotisPatronales.add(b.getTotalCotisationsPatronales());
        }

        session.setNombreEmployes(allSessionBulletins.size());
        session.setTotalBrut(totalBrut.setScale(2, RoundingMode.HALF_UP));
        session.setTotalNet(totalNet.setScale(2, RoundingMode.HALF_UP));
        session.setTotalRetenues(totalRetenues.setScale(2, RoundingMode.HALF_UP));
        session.setTotalCotisationsPatronales(totalCotisPatronales.setScale(2, RoundingMode.HALF_UP));
        session.setTotalMasseSalariale(totalBrut.add(totalCotisPatronales).setScale(2, RoundingMode.HALF_UP));
        sessionPaieRepository.save(session);
    }

    @Transactional
    public void deleteBulletin(Long id) {
        bulletinRepository.deleteById(id);
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

        List<BulletinLineDto> lineDtos = new ArrayList<>();
        if (b.getLines() != null) {
            for (BulletinLine l : b.getLines()) {
                BulletinLineDto ld = new BulletinLineDto();
                ld.setId(l.getId());
                ld.setBulletinId(b.getId());
                ld.setRubriquePaieId(l.getRubriquePaie() != null ? l.getRubriquePaie().getId() : null);
                String rawLib = l.getLibelle() != null ? l.getLibelle() : "";
                String cleanLib = rawLib.replaceAll("[()]", "").replaceAll("\\s+", " ").trim();
                ld.setCode(l.getCode());
                ld.setLibelle(cleanLib);
                ld.setTypeLigne(l.getTypeLigne());
                ld.setBaseCalcul(l.getBaseCalcul());

                BigDecimal taux = l.getTaux();
                String lCode = l.getCode() != null ? l.getCode().toUpperCase(Locale.ROOT) : "";
                String libUpper = cleanLib.toUpperCase(Locale.ROOT);
                if (lCode.contains("SAL_BASE") || lCode.contains("SUR_SALAIRE") || libUpper.contains("SALAIRE DE BASE") || libUpper.contains("SUR-SALAIRE") || libUpper.contains("SURSALAIRE") || lCode.contains("CASH") || libUpper.contains("CASH POINT")) {
                    if (taux == null || taux.compareTo(new BigDecimal("100.00")) == 0) {
                        taux = b.getWorkedDays() != null ? b.getWorkedDays() : new BigDecimal("30.00");
                    }
                } else if (lCode.contains("LOG") || libUpper.contains("LOGEMENT")) {
                    if (taux == null || taux.compareTo(new BigDecimal("100.00")) == 0) taux = new BigDecimal("20.00");
                } else if (lCode.contains("TRP") || libUpper.contains("TRANSPORT") || lCode.contains("CS") || libUpper.contains("CAISSE") || lCode.contains("SUJ") || libUpper.contains("SUJETION")) {
                    if (taux == null || taux.compareTo(new BigDecimal("100.00")) == 0) taux = new BigDecimal("5.00");
                } else if (lCode.contains("CNSS") || libUpper.contains("CNSS")) {
                    if (taux == null || taux.compareTo(new BigDecimal("100.00")) == 0) taux = new BigDecimal("5.50");
                } else if (lCode.contains("CRRAE") || libUpper.contains("CRRAE")) {
                    if (taux == null || taux.compareTo(new BigDecimal("100.00")) == 0) taux = new BigDecimal("6.00");
                } else if (lCode.contains("SOLIDAR") || libUpper.contains("SOLIDAR") || lCode.contains("FSP")) {
                    if (taux == null || taux.compareTo(new BigDecimal("100.00")) == 0) taux = new BigDecimal("1.00");
                }
                ld.setTaux(taux);
                ld.setMontant(l.getMontant());
                ld.setPartPatronale(l.getPartPatronale());
                ld.setOrdre(l.getOrdre());

                boolean isGain = "GAIN".equalsIgnoreCase(l.getTypeLigne()) || "AVOIR".equalsIgnoreCase(l.getTypeLigne());
                boolean isPatronale = "COTISATION_PATRONALE".equalsIgnoreCase(l.getTypeLigne()) || "CHARGE_PATRONALE".equalsIgnoreCase(l.getTypeLigne());
                if (isGain) {
                    ld.setGain(l.getMontant());
                    ld.setRetenue(null);
                } else if (!isPatronale) {
                    ld.setGain(null);
                    ld.setRetenue(l.getMontant());
                }

                ld.setName(cleanLib);
                ld.setCategory(l.getTypeLigne());
                ld.setAmount(l.getMontant() != null ? l.getMontant().doubleValue() : null);
                ld.setRate(taux != null ? taux.doubleValue() : null);

                lineDtos.add(ld);
            }
        }
        lineDtos.removeIf(ld -> (ld.getMontant() == null || ld.getMontant().compareTo(BigDecimal.ZERO) <= 0)
                && (ld.getGain() == null || ld.getGain().compareTo(BigDecimal.ZERO) <= 0)
                && (ld.getRetenue() == null || ld.getRetenue().compareTo(BigDecimal.ZERO) <= 0));
        lineDtos.sort(Comparator.comparingInt(ld -> getOverallLineSortWeight(ld.getCode(), ld.getLibelle(), ld.getTypeLigne())));

        BulletinDto dto = new BulletinDto();
        dto.setId(b.getId());
        dto.setCode(b.getCode());
        dto.setEmployeeId(b.getEmployee() != null ? b.getEmployee().getId() : null);
        dto.setEmployeeName(empName);
        dto.setMatricule(matricule);
        dto.setFonction(fonctionStr);
        dto.setSessionPaieId(b.getSessionPaie() != null ? b.getSessionPaie().getId() : null);
        dto.setSessionPaieCode(b.getSessionPaie() != null ? b.getSessionPaie().getCodeSession() : null);
        dto.setSessionPeriode(b.getSessionPaie() != null ? b.getSessionPaie().getPeriode() : null);
        dto.setGradeId(b.getGrade() != null ? b.getGrade().getId() : null);
        dto.setGradeLibelle(gradeStr);
        dto.setContratId(b.getContrat() != null ? b.getContrat().getId() : null);
        dto.setTypeSession(b.getTypeSession());
        dto.setDateFrom(b.getDateFrom());
        dto.setDateTo(b.getDateTo());
        dto.setScheduledWorkingDays(b.getScheduledWorkingDays());
        dto.setWorkedDays(b.getWorkedDays());
        dto.setSalaireBase(b.getSalaireBase());
        dto.setTotalIndemnites(b.getTotalIndemnites());
        dto.setTotalAvoirs(b.getTotalAvoirs());
        dto.setSalaireBrut(b.getSalaireBrut());
        dto.setTotalExonerations(b.getTotalExonerations());
        dto.setAbattementForfaitaire(b.getAbattementForfaitaire());
        dto.setBaseImposable(b.getBaseImposable());
        dto.setCotisationCnss(b.getCotisationCnss());
        dto.setImpotIutsSansCharge(b.getImpotIutsSansCharge());
        dto.setReductionIutsCharge(b.getReductionIutsCharge());
        dto.setImpotIuts(b.getImpotIuts());
        dto.setTotalRetenuesSociales(b.getTotalRetenuesSociales());
        dto.setTotalPrecomptes(b.getTotalPrecomptes());
        dto.setTotalRetenues(b.getTotalRetenues());
        dto.setTotalCotisationsPatronales(b.getTotalCotisationsPatronales());
        dto.setSalaireNet(b.getSalaireNet());
        dto.setStatut(b.getStatut());
        dto.setDateCalcul(b.getDateCalcul());
        dto.setDateValidation(b.getDateValidation());
        dto.setSurSalaire(b.getSurSalaire());
        dto.setJustificationEcart(b.getJustificationEcart());

        // Données dynamiques employé et session
        Employee emp = b.getEmployee();
        String emploi = null;
        if (emp != null) {
            if (emp.getEmploi() != null && emp.getEmploi().getName() != null && !emp.getEmploi().getName().isBlank()) {
                emploi = emp.getEmploi().getName();
            } else if (emp.getFonction() != null && emp.getFonction().getName() != null && !emp.getFonction().getName().isBlank()) {
                emploi = emp.getFonction().getName();
            }
        }
        if (emploi == null && fonctionStr != null) {
            emploi = fonctionStr;
        }
        dto.setEmploi(emploi != null ? emploi : "—");

        String serviceNom = null;
        if (emp != null) {
            if (emp.getService() != null && emp.getService().getName() != null && !emp.getService().getName().isBlank()) {
                serviceNom = emp.getService().getName();
            } else if (emp.getDepartment() != null && emp.getDepartment().getName() != null && !emp.getDepartment().getName().isBlank()) {
                serviceNom = emp.getDepartment().getName();
            } else if (emp.getDirection() != null && emp.getDirection().getName() != null && !emp.getDirection().getName().isBlank()) {
                serviceNom = emp.getDirection().getName();
            }
        }
        dto.setService(serviceNom != null ? serviceNom : "—");

        String dateEmbauche = emp != null && emp.getDateEmbauche() != null && !emp.getDateEmbauche().isBlank() ? emp.getDateEmbauche() : null;
        dto.setDateEmbauche(dateEmbauche);

        String numCnss = emp != null && emp.getNumeroCnss() != null && !emp.getNumeroCnss().isBlank() ? emp.getNumeroCnss() : null;
        if (numCnss == null && emp != null && emp.getExtraData() != null) {
            try {
                com.fasterxml.jackson.databind.JsonNode node = new com.fasterxml.jackson.databind.ObjectMapper().readTree(emp.getExtraData());
                if (node.hasNonNull("numeroCnss")) {
                    numCnss = node.get("numeroCnss").asText();
                }
            } catch (Exception ignored) {}
        }
        dto.setNumeroCnss(numCnss != null ? numCnss : (emp != null && emp.getNumeroCNI() != null ? emp.getNumeroCNI() : null));

        String sitMat = emp != null && emp.getSituationFamiliale() != null && !emp.getSituationFamiliale().isBlank() 
                ? emp.getSituationFamiliale() 
                : (emp != null && emp.getSituationMatrimoniale() != null && !emp.getSituationMatrimoniale().isBlank() ? emp.getSituationMatrimoniale() : "Célibataire");
        dto.setSituationFamiliale(sitMat);
        dto.setSituationMatrimoniale(sitMat);

        int nbCharges = 0;
        if (emp != null) {
            try {
                nbCharges = Math.toIntExact(familleRepository.countByEmployeeIdAndEstChargeTrue(emp.getId()));
            } catch (Exception ignored) {}
        }
        int partsFiscales = nbCharges;
        dto.setNombreCharges(nbCharges);
        dto.setPartsFiscales(partsFiscales);

        String classification = BulletinPdfService.computeGradeCode(emp);
        if (classification == null || classification.equals("—")) {
            classification = gradeStr != null ? gradeStr : "—";
        }
        dto.setClassification(classification);

        int anciennete = (emp != null && emp.getAncienneteReprise() != null && emp.getAncienneteReprise() > 0) ? emp.getAncienneteReprise() : 0;
        if (emp != null && emp.getDateEmbauche() != null && !emp.getDateEmbauche().isBlank()) {
            try {
                LocalDate dEmb = LocalDate.parse(emp.getDateEmbauche().trim());
                LocalDate dRef = b.getDateFrom() != null ? b.getDateFrom() : (b.getSessionPaie() != null && b.getSessionPaie().getDateFrom() != null ? b.getSessionPaie().getDateFrom() : LocalDate.now());
                anciennete += Math.max(0, java.time.Period.between(dEmb, dRef).getYears());
            } catch (Exception ignored) {}
        }
        dto.setAnciennete(anciennete);
        dto.setAncienneteAnnees(anciennete);

        String banque = emp != null && emp.getBanque() != null && !emp.getBanque().isBlank() ? emp.getBanque() : "BANQUE POSTALE";
        dto.setBanque(banque);
        dto.setNumeroCompteBancaire(emp != null && emp.getIban() != null ? emp.getIban() : null);

        LocalDate dFrom = b.getDateFrom();
        LocalDate dTo = b.getDateTo();
        if (dFrom == null && b.getSessionPaie() != null) {
            dFrom = b.getSessionPaie().getDateFrom();
            dTo = b.getSessionPaie().getDateTo();
            if (dFrom == null) {
                int an = b.getSessionPaie().getAnnee() != null ? b.getSessionPaie().getAnnee() : LocalDate.now().getYear();
                int mo = 1;
                try { mo = Integer.parseInt(b.getSessionPaie().getMois()); } catch (Exception ignored) {}
                dFrom = LocalDate.of(an, mo, 1);
                dTo = dFrom.withDayOfMonth(dFrom.lengthOfMonth());
            }
        }
        dto.setDateFrom(dFrom);
        dto.setDateTo(dTo);

        String periodeStr = b.getSessionPaie() != null ? b.getSessionPaie().getPeriode() : null;
        if (periodeStr == null && dFrom != null) {
            periodeStr = BulletinPdfService.formatPeriode(dFrom, dTo);
        }
        dto.setPeriode(periodeStr);
        dto.setSessionPeriode(periodeStr);

        String sessionType = b.getTypeSession() != null ? b.getTypeSession() : (b.getSessionPaie() != null ? b.getSessionPaie().getTypeSession() : "ORDINAIRE");
        dto.setSessionType(sessionType);
        dto.setTypeSession(sessionType);

        // Calcul des écarts N et N-1
        if (b.getEmployee() != null && b.getSessionPaie() != null) {
            try {
                int annee = b.getSessionPaie().getAnnee() != null ? b.getSessionPaie().getAnnee() : LocalDate.now().getYear();
                int mois = 1;
                try { mois = Integer.parseInt(b.getSessionPaie().getMois()); } catch (Exception ignored) {}
                int prevMois = mois - 1;
                int prevAnnee = annee;
                if (prevMois == 0) {
                    prevMois = 12;
                    prevAnnee = annee - 1;
                }
                final int finalPrevAnnee = prevAnnee;
                final String finalSPrevMois = String.format("%02d", prevMois);
                final String finalSPrevMoisSimple = String.valueOf(prevMois);
                List<Bulletin> prevBulletins = bulletinRepository.findByEmployeeId(b.getEmployee().getId()).stream()
                        .filter(prev -> prev.getSessionPaie() != null &&
                                prev.getSessionPaie().getAnnee() != null && prev.getSessionPaie().getAnnee() == finalPrevAnnee &&
                                (finalSPrevMois.equals(prev.getSessionPaie().getMois()) || finalSPrevMoisSimple.equals(prev.getSessionPaie().getMois())))
                        .toList();
                if (!prevBulletins.isEmpty() && prevBulletins.get(0).getSalaireNet() != null) {
                    BigDecimal prevNet = prevBulletins.get(0).getSalaireNet();
                    dto.setSalaireNetPrecedent(prevNet);
                    if (b.getSalaireNet() != null) {
                        dto.setEcartNet(money(b.getSalaireNet().subtract(prevNet)));
                    }
                }
            } catch (Exception ignored) {}
        }

        // Extraction CRRAE & Solidarité depuis les lignes
        BigDecimal crraeVal = BigDecimal.ZERO;
        BigDecimal solVal = BigDecimal.ZERO;
        BigDecimal cnssFromLines = BigDecimal.ZERO;
        if (b.getLines() != null) {
            for (BulletinLine l : b.getLines()) {
                String c = l.getCode() != null ? l.getCode().toUpperCase() : "";
                String lib = l.getLibelle() != null ? l.getLibelle().toUpperCase() : "";
                if (c.contains("CRRAE") || lib.contains("CRRAE")) {
                    crraeVal = l.getMontant() != null ? l.getMontant() : BigDecimal.ZERO;
                } else if (c.contains("SOLIDARITE") || c.contains("FSP") || lib.contains("SOLIDARITE")) {
                    solVal = l.getMontant() != null ? l.getMontant() : BigDecimal.ZERO;
                } else if ((c.contains("CNSS") || lib.contains("CNSS")) && !c.contains("PATRON") && !lib.contains("PATRON")) {
                    if (l.getMontant() != null && l.getMontant().compareTo(BigDecimal.ZERO) > 0) {
                        cnssFromLines = l.getMontant();
                    }
                }
            }
        }
        boolean bIsExtra = isExtraordinaire(b.getTypeSession()) || (b.getSessionPaie() != null && (isExtraordinaire(b.getSessionPaie().getTypeSession()) || is13emeMois(b.getSessionPaie())));
        if (!bIsExtra && crraeVal.compareTo(BigDecimal.ZERO) == 0 && b.getSalaireBase() != null) {
            BigDecimal baseCrrae = b.getSalaireBase().add(b.getSurSalaire() != null ? b.getSurSalaire() : BigDecimal.ZERO);
            crraeVal = baseCrrae.multiply(new BigDecimal("0.06")).setScale(0, java.math.RoundingMode.HALF_UP);
        }
        if (bIsExtra) {
            crraeVal = BigDecimal.ZERO;
        }
        dto.setCotisationCrrae(crraeVal);
        dto.setCotisationSolidarite(solVal);

        BigDecimal brutMois = b.getSalaireBrut() != null ? b.getSalaireBrut() : (b.getTotalAvoirs() != null ? b.getTotalAvoirs() : BigDecimal.ZERO);
        BigDecimal baseImpMois = b.getBaseImposable() != null ? b.getBaseImposable() : BigDecimal.ZERO;
        BigDecimal cnssMois = (b.getCotisationCnss() != null && b.getCotisationCnss().compareTo(BigDecimal.ZERO) > 0)
                ? b.getCotisationCnss()
                : (cnssFromLines.compareTo(BigDecimal.ZERO) > 0 ? cnssFromLines : BigDecimal.ZERO);
        if (cnssMois.compareTo(BigDecimal.ZERO) == 0 && brutMois.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal baseCnss = brutMois.min(new BigDecimal("800000.00"));
            cnssMois = baseCnss.multiply(new BigDecimal("0.055")).setScale(0, RoundingMode.HALF_UP);
        }
        dto.setCotisationCnss(cnssMois);

        BigDecimal iutsMois = b.getImpotIuts() != null ? b.getImpotIuts() : BigDecimal.ZERO;

        BigDecimal cBrut = brutMois;
        BigDecimal cBaseImp = baseImpMois;
        BigDecimal cCnss = cnssMois;
        BigDecimal cIuts = iutsMois;
        BigDecimal cCrrae = crraeVal;

        if (b.getEmployee() != null && b.getEmployee().getId() != null) {
            try {
                int annee = b.getSessionPaie() != null && b.getSessionPaie().getAnnee() != null ? b.getSessionPaie().getAnnee() : (b.getDateFrom() != null ? b.getDateFrom().getYear() : LocalDate.now().getYear());
                LocalDate targetDate = b.getDateTo() != null ? b.getDateTo() : (b.getDateFrom() != null ? b.getDateFrom() : LocalDate.now());
                List<Bulletin> yearBulletins = bulletinRepository.findByEmployeeId(b.getEmployee().getId());
                BigDecimal sBrut = BigDecimal.ZERO;
                BigDecimal sBase = BigDecimal.ZERO;
                BigDecimal sCnss = BigDecimal.ZERO;
                BigDecimal sIuts = BigDecimal.ZERO;
                BigDecimal sCrrae = BigDecimal.ZERO;
                boolean currentIncluded = false;

                if (yearBulletins != null && !yearBulletins.isEmpty()) {
                    for (Bulletin yb : yearBulletins) {
                        int ybYear = yb.getSessionPaie() != null && yb.getSessionPaie().getAnnee() != null ? yb.getSessionPaie().getAnnee() : (yb.getDateFrom() != null ? yb.getDateFrom().getYear() : 0);
                        if (ybYear == annee) {
                            LocalDate ybDate = yb.getDateTo() != null ? yb.getDateTo() : yb.getDateFrom();
                            if (ybDate == null || !ybDate.isAfter(targetDate)) {
                                if (b.getId() != null && yb.getId() != null && yb.getId().equals(b.getId())) {
                                    currentIncluded = true;
                                }
                                sBrut = sBrut.add(yb.getSalaireBrut() != null ? yb.getSalaireBrut() : (yb.getTotalAvoirs() != null ? yb.getTotalAvoirs() : BigDecimal.ZERO));
                                sBase = sBase.add(yb.getBaseImposable() != null ? yb.getBaseImposable() : BigDecimal.ZERO);

                                BigDecimal ybCnss = (yb.getCotisationCnss() != null && yb.getCotisationCnss().compareTo(BigDecimal.ZERO) > 0)
                                        ? yb.getCotisationCnss() : BigDecimal.ZERO;
                                if (ybCnss.compareTo(BigDecimal.ZERO) == 0 && yb.getLines() != null) {
                                    for (BulletinLine ybl : yb.getLines()) {
                                        String c = ybl.getCode() != null ? ybl.getCode().toUpperCase() : "";
                                        String lib = ybl.getLibelle() != null ? ybl.getLibelle().toUpperCase() : "";
                                        if ((c.contains("CNSS") || lib.contains("CNSS")) && !c.contains("PATRON") && !lib.contains("PATRON")) {
                                            if (ybl.getMontant() != null && ybl.getMontant().compareTo(BigDecimal.ZERO) > 0) {
                                                ybCnss = ybl.getMontant();
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (ybCnss.compareTo(BigDecimal.ZERO) == 0 && yb.getSalaireBrut() != null && yb.getSalaireBrut().compareTo(BigDecimal.ZERO) > 0) {
                                    ybCnss = yb.getSalaireBrut().min(new BigDecimal("800000.00")).multiply(new BigDecimal("0.055")).setScale(0, RoundingMode.HALF_UP);
                                }
                                sCnss = sCnss.add(ybCnss);

                                sIuts = sIuts.add(yb.getImpotIuts() != null ? yb.getImpotIuts() : BigDecimal.ZERO);
                                BigDecimal ybCrrae = BigDecimal.ZERO;
                                if (yb.getLines() != null) {
                                    for (BulletinLine ybl : yb.getLines()) {
                                        String c = ybl.getCode() != null ? ybl.getCode().toUpperCase() : "";
                                        String lib = ybl.getLibelle() != null ? ybl.getLibelle().toUpperCase() : "";
                                        if (c.contains("CRRAE") || lib.contains("CRRAE")) {
                                            ybCrrae = ybl.getMontant() != null ? ybl.getMontant() : BigDecimal.ZERO;
                                            break;
                                        }
                                    }
                                }
                                if (ybCrrae.compareTo(BigDecimal.ZERO) == 0 && yb.getSalaireBase() != null) {
                                    ybCrrae = yb.getSalaireBase().add(yb.getSurSalaire() != null ? yb.getSurSalaire() : BigDecimal.ZERO).multiply(new BigDecimal("0.06")).setScale(0, java.math.RoundingMode.HALF_UP);
                                }
                                sCrrae = sCrrae.add(ybCrrae);
                            }
                        }
                    }
                }

                if (!currentIncluded) {
                    sBrut = sBrut.add(brutMois);
                    sBase = sBase.add(baseImpMois);
                    sCnss = sCnss.add(cnssMois);
                    sIuts = sIuts.add(iutsMois);
                    sCrrae = sCrrae.add(crraeVal);
                }

                if (sBrut.compareTo(BigDecimal.ZERO) > 0) cBrut = sBrut;
                if (sBase.compareTo(BigDecimal.ZERO) > 0) cBaseImp = sBase;
                if (sCnss.compareTo(BigDecimal.ZERO) > 0) cCnss = sCnss;
                if (sIuts.compareTo(BigDecimal.ZERO) > 0) cIuts = sIuts;
                if (sCrrae.compareTo(BigDecimal.ZERO) > 0) cCrrae = sCrrae;
            } catch (Exception ignored) {}
        }
        dto.setCumulBrutExercice(cBrut);
        dto.setCumulBaseImposableExercice(cBaseImp);
        dto.setCumulCnssExercice(cCnss);
        dto.setCumulIutsExercice(cIuts);
        dto.setCumulCrraeExercice(cCrrae);
        if (b.getSalaireNet() != null) {
            dto.setMontantEnLettres(BulletinPdfService.numberToFrenchWords(b.getSalaireNet().longValue()));
        }

        dto.setLines(lineDtos);
        return dto;
    }

    @Transactional
    public BulletinDto updateJustification(Long id, String justification) {
        Bulletin b = bulletinRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bulletin introuvable avec ID: " + id));
        b.setJustificationEcart(justification);
        Bulletin saved = bulletinRepository.save(b);
        return toDto(saved);
    }

    private List<Retenue> findApplicableRetenues(Employee employee) {
        Long regimeId = (employee != null && employee.getRegimeSecuriteSocial() != null)
                ? employee.getRegimeSecuriteSocial().getId() : 1L;
        return retenueRepository.findApplicable(regimeId);
    }

    private static BigDecimal resolveBase(BaseCalculRetenue base, BigDecimal salaireBase,
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

    private static BigDecimal calculateIuts(BigDecimal rawBase) {
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

    private static BigDecimal reductionRate(int charges) {
        if (charges == 1) return new BigDecimal("8.00");
        if (charges == 2) return new BigDecimal("10.00");
        if (charges == 3) return new BigDecimal("12.00");
        if (charges >= 4) return new BigDecimal("14.00");
        return BigDecimal.ZERO;
    }

    private static BigDecimal calculatePercentage(BigDecimal base, BigDecimal rate) {
        // Arrondi HALF_UP à 2 décimales pour les calculs de taux (CNSS, exonérations, retenues)
        return percent(base.multiply(rate).divide(CENT, 8, RoundingMode.HALF_UP));
    }

    private static BigDecimal money(Double value) {
        return value == null ? zero() : money(BigDecimal.valueOf(value));
    }

    private static BigDecimal money(BigDecimal value) {
        if (value == null) return zero();
        // Arrondi par excès (CEILING) à l'entier — règle FCFA : pas de centimes
        return value.setScale(0, RoundingMode.CEILING).setScale(2, RoundingMode.UNNECESSARY);
    }

    /**
     * Arrondi HALF_UP à 2 décimales — pour les calculs intermédiaires de taux/pourcentages
     * (cotisations CNSS, exonérations, taux ancienneté, etc.) avant d'être agrégés en FCFA.
     */
    private static BigDecimal percent(BigDecimal value) {
        if (value == null) return zero();
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private static BigDecimal zero() {
        return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
    }

    private boolean isTropPercuForSession(TropPercu tp, SessionPaie session) {
        if (tp == null || tp.getMoisApplication() == null || session == null) return false;
        String app = tp.getMoisApplication().trim();
        String sMois = session.getMois() != null ? session.getMois().trim() : "";
        Integer sAnnee = session.getAnnee();
        String sPeriode = session.getPeriode() != null ? session.getPeriode().trim() : "";

        if (app.equalsIgnoreCase(sPeriode)) return true;

        try {
            int mNum = Integer.parseInt(sMois);
            String fmt = String.format("%02d/%d", mNum, sAnnee);
            if (app.equalsIgnoreCase(fmt)) return true;
        } catch (Exception ignored) {}

        if (sAnnee != null && app.contains(String.valueOf(sAnnee))) {
            if (app.contains(sMois)) return true;
        }
        return false;
    }

    private boolean isTropPercuForDates(TropPercu tp, LocalDate dateFrom, LocalDate dateTo) {
        if (tp == null || tp.getMoisApplication() == null) return false;
        String app = tp.getMoisApplication().trim();
        if (dateFrom != null) {
            String m1 = String.format("%02d/%d", dateFrom.getMonthValue(), dateFrom.getYear());
            String m2 = String.format("%d-%02d", dateFrom.getYear(), dateFrom.getMonthValue());
            if (app.equalsIgnoreCase(m1) || app.equalsIgnoreCase(m2)) return true;
            if (app.contains(String.format("%02d", dateFrom.getMonthValue())) && app.contains(String.valueOf(dateFrom.getYear()))) return true;
        }
        if (dateTo != null) {
            String m1 = String.format("%02d/%d", dateTo.getMonthValue(), dateTo.getYear());
            String m2 = String.format("%d-%02d", dateTo.getYear(), dateTo.getMonthValue());
            if (app.equalsIgnoreCase(m1) || app.equalsIgnoreCase(m2)) return true;
            if (app.contains(String.format("%02d", dateTo.getMonthValue())) && app.contains(String.valueOf(dateTo.getYear()))) return true;
        }
        return false;
    }

    public static boolean is13emeMois(SessionPaie session) {
        if (session == null) return false;
        String t = (session.getTypeSession() != null ? session.getTypeSession() : "").toUpperCase(Locale.ROOT);
        String n = (session.getName() != null ? session.getName() : "").toUpperCase(Locale.ROOT);
        String c = (session.getCodeSession() != null ? session.getCodeSession() : "").toUpperCase(Locale.ROOT);
        String p = (session.getPeriode() != null ? session.getPeriode() : "").toUpperCase(Locale.ROOT);
        return t.contains("13") || t.contains("GRATIF") || n.contains("13") || n.contains("GRATIF")
                || c.contains("13") || c.contains("GRATIF") || p.contains("13") || p.contains("GRATIF");
    }

    public static boolean is13emeMois(String text) {
        if (text == null) return false;
        String t = text.trim().toUpperCase(Locale.ROOT);
        return t.contains("13") || t.contains("GRATIF") || t.contains("TREIZIEME");
    }

    public static boolean isStc(SessionPaie session) {
        if (session == null) return false;
        String t = (session.getTypeSession() != null ? session.getTypeSession() : "").toUpperCase(Locale.ROOT);
        String n = (session.getName() != null ? session.getName() : "").toUpperCase(Locale.ROOT);
        String c = (session.getCodeSession() != null ? session.getCodeSession() : "").toUpperCase(Locale.ROOT);
        String p = (session.getPeriode() != null ? session.getPeriode() : "").toUpperCase(Locale.ROOT);
        return t.contains("STC") || n.contains("STC") || n.contains("SOLDE DE TOUT COMPTE")
                || c.contains("STC") || p.contains("STC") || p.contains("SOLDE DE TOUT COMPTE");
    }

    public static boolean isStc(String text) {
        if (text == null) return false;
        String t = text.trim().toUpperCase(Locale.ROOT);
        return t.contains("STC") || t.contains("SOLDE DE TOUT COMPTE");
    }

    private static boolean isGratification(String typeSession) {
        if (typeSession == null) return false;
        String t = typeSession.trim().toUpperCase(Locale.ROOT);
        return t.contains("GRATIF") || t.contains("TREIZIEME") || t.contains("13");
    }

    private static boolean isExtraordinaire(String typeSession) {
        if (typeSession == null) return false;
        String t = typeSession.trim().toUpperCase(Locale.ROOT);
        return t.contains("EXTRA");
    }

    private static int getIndemniteSortWeight(String libelle) {
        if (libelle == null) return 99;
        String l = libelle.toUpperCase(Locale.ROOT);
        if (l.contains("CAISSE")) return 1;
        if (l.contains("SUJETION") || l.contains("SUJÉTION")) return 2;
        if (l.contains("TRANSPORT") || l.contains("DEPLACEMENT") || l.contains("DÉPLACEMENT")) return 3;
        if (l.contains("LOGEMENT") || l.contains("MAISON")) return 4;
        if (l.contains("CASH POINT") || l.contains("CASHPOINT") || l.contains("GUICHET")) return 5;
        if (l.contains("RESPONSABILITE") || l.contains("RESPONSABILITÉ")) return 6;
        if (l.contains("FONCTION")) return 7;
        return 10;
    }

    public static int getOverallLineSortWeight(String code, String libelle, String typeLigne) {
        String c = code != null ? code.toUpperCase(Locale.ROOT) : "";
        String l = libelle != null ? libelle.toUpperCase(Locale.ROOT) : "";

        // 1. Précomptes, trop-perçus et retenues diverses (Poids 30 - toujours en bas avec les retenues)
        if (c.startsWith("PREC") || c.contains("AVANCE") || c.contains("TROP") ||
            l.contains("PRÉCOMPTE") || l.contains("PRECOMPTE") || l.contains("AVANCE") || 
            l.contains("TROP-PER") || l.contains("TROP_PER") || l.contains("TROP PER") ||
            "PRECOMPTE".equalsIgnoreCase(typeLigne) || "RETENUE".equalsIgnoreCase(typeLigne)) {
            return 30;
        }

        // 2. Cotisations sociales et impôts légaux
        if (c.contains("CNSS") || l.contains("CNSS")) return 20;
        if (c.contains("IUTS") || l.contains("IUTS")) return 21;
        if (c.contains("CRRAE") || l.contains("CRRAE")) return 22;
        if (c.contains("SOLIDAR") || c.contains("FSP") || l.contains("SOLIDARITE") || l.contains("SOLIDARITÉ")) return 23;

        // 3. Salaire de base, sur-salaire et prime d'ancienneté
        if (c.equals("SAL_BASE") || l.equals("SALAIRE DE BASE") || (l.contains("SALAIRE DE BASE") && !l.contains("TROP"))) return 1;
        if (c.equals("SUR_SALAIRE") || l.contains("SURSALAIRE") || l.contains("SUR-SALAIRE")) return 2;
        if (c.contains("ANC") || l.contains("ANCIENNET")) return 3;
        if (c.contains("CAISSE") || l.contains("CAISSE")) return 4;
        if (c.contains("SUJETION") || c.contains("SUJ") || l.contains("SUJETION") || l.contains("SUJÉTION")) return 5;
        if (c.contains("TRANS") || c.contains("TRP") || l.contains("TRANSPORT") || l.contains("DEPLACEMENT") || l.contains("DÉPLACEMENT")) return 6;
        if (c.contains("LOG") || l.contains("LOGEMENT") || l.contains("MAISON")) return 7;
        if (c.contains("CASH") || c.contains("CP") || l.contains("CASH POINT") || l.contains("CASHPOINT") || l.contains("GUICHET")) return 8;

        if ("GAIN".equalsIgnoreCase(typeLigne) || "AVOIR".equalsIgnoreCase(typeLigne)) {
            return 10;
        }

        return 40;
    }
}
