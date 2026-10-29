package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.BulletinDto;
import com.bpbf.sirh_backend.dtos.BulletinLineDto;
import com.bpbf.sirh_backend.entities.*;
import com.bpbf.sirh_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BulletinService {

    private static final Logger log = LoggerFactory.getLogger(BulletinService.class);
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
    private final TypeIndemniteRepository typeIndemniteRepository;
    private final SalaryElementRepository salaryElementRepository;

    /**
     * Garde-fou d'intégrité V3 : interdit toute modification sur un bulletin ou une session validée/clôturée.
     */
    public void assertModifiable(Bulletin b) {
        if (b == null) return;
        SessionPaie session = b.getSessionPaie();
        String sessionStatut = session != null ? session.getStatut() : null;
        String bulletinStatut = b.getStatut();
        if ("CLOTURE".equalsIgnoreCase(sessionStatut)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Action refusée : la session de paie #" + (session != null ? session.getId() : "") + " est CLÔTURÉE et verrouillée.");
        }
        if ("CLOTURE".equalsIgnoreCase(bulletinStatut)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Action refusée : le bulletin #" + b.getId() + " est CLÔTURÉ et verrouillé.");
        }
    }

    /**
     * Garde-fou d'intégrité V3 : interdit toute modification sur une session clôturée.
     */
    public void assertSessionModifiable(SessionPaie session) {
        if (session == null) return;
        String statut = session.getStatut();
        if ("CLOTURE".equalsIgnoreCase(statut)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Action refusée : la session de paie #" + session.getId() + " est CLÔTURÉE et verrouillée.");
        }
    }

    /**
     * Détermine si un employé est actif et éligible au calcul de paie.
     */
    public boolean isEmployeeEligiblePaie(Employee emp) {
        if (emp == null) return false;
        String st = emp.getStatut();
        if (st == null || st.isBlank()) return true;
        st = st.trim().toLowerCase(Locale.ROOT);
        return !st.contains("inactif")
                && !st.contains("suspendu")
                && !st.contains("détach")
                && !st.contains("detach")
                && !st.contains("sorti")
                && !st.contains("licenci")
                && !st.contains("demission");
    }

    /**
     * Vérifie si un employé dispose d'un salaire de base défini.
     */
    public boolean hasSalaireBase(Employee emp) {
        if (emp == null) return false;
        SituationSalariale situation = situationRepository.findByEmployeeId(emp.getId()).orElse(null);
        if (situation != null && situation.getSalaireBase() != null && situation.getSalaireBase() > 0) {
            return true;
        }
        if (situation != null && situation.getGrilleSalariale() != null && situation.getGrilleSalariale().getBasicSalary() != null
                && situation.getGrilleSalariale().getBasicSalary().compareTo(BigDecimal.ZERO) > 0) {
            return true;
        }
        if (emp.getGrilleSalariale() != null && emp.getGrilleSalariale().getBasicSalary() != null
                && emp.getGrilleSalariale().getBasicSalary().compareTo(BigDecimal.ZERO) > 0) {
            return true;
        }
        return false;
    }

    /**
     * Parse une date de façon sécurisée (YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY).
     */
    public static LocalDate parseLocalDateSafe(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        try {
            return LocalDate.parse(dateStr.trim());
        } catch (Exception e) {
            try {
                return LocalDate.parse(dateStr.trim(), java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            } catch (Exception e2) {
                try {
                    return LocalDate.parse(dateStr.trim(), java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy"));
                } catch (Exception e3) {
                    return null;
                }
            }
        }
    }

    /**
     * Valide et convertit la chaîne représentant le mois de session (1 à 12).
     */
    public static int parseMois(String moisStr) {
        if (moisStr == null || moisStr.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le mois de la session de paie est obligatoire.");
        }
        try {
            int mo = Integer.parseInt(moisStr.trim());
            if (mo < 1 || mo > 12) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le mois doit être compris entre 1 et 12 (reçu: " + moisStr + ").");
            }
            return mo;
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Format de mois invalide: '" + moisStr + "'. Doit être un entier entre 1 et 12.");
        }
    }

    public static int parseMoisSafe(String moisStr) {
        if (moisStr == null || moisStr.isBlank()) return 1;
        try {
            int m = Integer.parseInt(moisStr.trim());
            return (m >= 1 && m <= 12) ? m : 1;
        } catch (NumberFormatException e) {
            String s = moisStr.trim().toLowerCase(Locale.ROOT);
            if (s.contains("janv")) return 1;
            if (s.contains("fev") || s.contains("fév")) return 2;
            if (s.contains("mar")) return 3;
            if (s.contains("avr")) return 4;
            if (s.contains("mai")) return 5;
            if (s.contains("juin")) return 6;
            if (s.contains("juil")) return 7;
            if (s.contains("aou") || s.contains("aoû")) return 8;
            if (s.contains("sep")) return 9;
            if (s.contains("oct")) return 10;
            if (s.contains("nov")) return 11;
            if (s.contains("dec") || s.contains("déc")) return 12;
            return 1;
        }
    }

    public static LocalDate getSessionDebutPeriode(SessionPaie session) {
        if (session == null) return null;
        if (session.getDateFrom() != null) return session.getDateFrom();
        int mo = parseMoisSafe(session.getMois());
        int an = session.getAnnee() != null ? session.getAnnee() : LocalDate.now().getYear();
        return LocalDate.of(an, mo, 1);
    }

    public static LocalDate getSessionFinPeriode(SessionPaie session) {
        if (session == null) return null;
        if (session.getDateTo() != null) return session.getDateTo();
        LocalDate deb = getSessionDebutPeriode(session);
        if (deb == null) return null;
        return deb.withDayOfMonth(deb.lengthOfMonth());
    }

    /**
     * RÈGLE CODE DU TRAVAIL & CONVENTIONS :
     * Valide de manière stricte qu'un employé peut faire l'objet d'un bulletin pour la période de paie donnée.
     * Interdiction absolue de générer un bulletin si la date d'embauche est postérieure à la fin de la période,
     * ou si le contrat a expiré avant le début de la période (sauf session STC).
     */
    public void assertEmployeeEligibleForSession(Employee emp, SessionPaie session, LocalDate debutPeriode, LocalDate finPeriode, boolean isStc) {
        if (emp == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employé introuvable ou null.");
        }
        if (finPeriode == null) return;

        LocalDate dEmbauche = parseLocalDateSafe(emp.getDateEmbauche());
        if (dEmbauche != null && dEmbauche.isAfter(finPeriode)) {
            String nomPeriode = session != null && session.getPeriode() != null ? session.getPeriode() : ("finissant le " + finPeriode);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Impossible de générer le bulletin pour l'employé " + emp.getMatricule() + " (" + emp.getName() + ") : sa date d'embauche (" + emp.getDateEmbauche() + ") est postérieure à la période de paie (" + nomPeriode + ").");
        }

        if (!isStc && debutPeriode != null && contratRepository != null) {
            Contrat contrat = contratRepository.findFirstByEmployeeIdOrderByIdDesc(emp.getId()).orElse(null);
            if (contrat != null && contrat.getDateFin() != null && !contrat.getDateFin().isBlank()) {
                LocalDate dFin = parseLocalDateSafe(contrat.getDateFin());
                if (dFin != null && dFin.isBefore(debutPeriode)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Impossible de générer un bulletin ordinaire pour l'employé " + emp.getMatricule() + " (" + emp.getName() + ") : son contrat a expiré le " + contrat.getDateFin() + " (avant le début de la période " + debutPeriode + "). Veuillez utiliser une session STC ou régulariser le contrat.");
                }
            }
        }
    }

    @Transactional
    public List<BulletinDto> generateBulletinsForSession(Long sessionPaieId) {
        return generateBulletinsForSession(sessionPaieId, null);
    }

    @Transactional
    public List<BulletinDto> generateBulletinsForSession(Long sessionPaieId, List<Long> employeeIds) {
        SessionPaie session = sessionPaieRepository.findById(sessionPaieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session de paie non trouvée: #" + sessionPaieId));

        // RÈGLE V3 : Verrouillage strict de session
        assertSessionModifiable(session);

        List<Employee> employees;
        if (employeeIds != null && !employeeIds.isEmpty()) {
            employees = employeeRepository.findAllById(employeeIds);
        } else {
            employees = employeeRepository.findAll();
        }

        // 1. Filtrer les employés éligibles (actifs uniquement)
        employees = employees.stream()
                .filter(this::isEmployeeEligiblePaie)
                .collect(Collectors.toList());

        // Valider le mois de façon stricte (rejet d'erreur au lieu de forcer silencieusement à janvier)
        int mo = parseMois(session.getMois());
        int an = session.getAnnee() != null ? session.getAnnee() : LocalDate.now().getYear();

        LocalDate debutPeriode = session.getDateFrom();
        LocalDate finPeriode = session.getDateTo();
        if (debutPeriode == null) {
            debutPeriode = LocalDate.of(an, mo, 1);
            finPeriode = debutPeriode.withDayOfMonth(debutPeriode.lengthOfMonth());
        }

        final LocalDate dP = debutPeriode;
        final LocalDate fP = finPeriode;

        boolean isDiffMat = isDifferentielMaternite(session);
        boolean isStc = isStc(session);
        boolean isOrdinaire = !isDiffMat && !is13Ou14emeMois(session) && !isCongePaye(session) && !isIndemniteRetraite(session) && !isStc && !isExtraordinaire(session.getTypeSession());

        // 2. RÈGLE CODE DU TRAVAIL & CONTRATS : Restriction stricte sur la date d'embauche et fin de contrat
        if (employeeIds != null && !employeeIds.isEmpty()) {
            // Demande ciblée : lever une erreur explicite pour chaque employé non éligible
            for (Employee emp : employees) {
                assertEmployeeEligibleForSession(emp, session, dP, fP, isStc);
            }
        } else {
            // Génération globale : filtrer automatiquement les employés non encore embauchés ou dont le contrat a pris fin
            employees = employees.stream()
                    .filter(emp -> {
                        LocalDate dEmb = parseLocalDateSafe(emp.getDateEmbauche());
                        if (dEmb != null && fP != null && dEmb.isAfter(fP)) {
                            log.info("Agent {} (matricule: {}) exclu de la session #{} : date d'embauche ({}) postérieure à la fin de session ({})",
                                    emp.getName(), emp.getMatricule(), session.getId(), emp.getDateEmbauche(), fP);
                            return false;
                        }
                        if (!isStc && dP != null) {
                            Contrat c = contratRepository.findFirstByEmployeeIdOrderByIdDesc(emp.getId()).orElse(null);
                            if (c != null && c.getDateFin() != null && !c.getDateFin().isBlank()) {
                                LocalDate dFin = parseLocalDateSafe(c.getDateFin());
                                if (dFin != null && dFin.isBefore(dP)) {
                                    log.info("Agent {} (matricule: {}) exclu de la session #{} : contrat terminé le {} (avant {})",
                                            emp.getName(), emp.getMatricule(), session.getId(), c.getDateFin(), dP);
                                    return false;
                                }
                            }
                        }
                        return true;
                    })
                    .collect(Collectors.toList());
        }

        if (isDiffMat) {
            // Seules les salariées de sexe féminin avec un congé de maternité approuvé/actif durant la période
            employees = employees.stream()
                    .filter(congeWorkflowService::isFeminin)
                    .filter(emp -> congeWorkflowService.isEmployeeOnApprovedMaternite(emp.getId(), dP, fP))
                    .collect(Collectors.toList());
        } else if (isOrdinaire) {
            // RÈGLE CODE DU TRAVAIL & CONVENTION BANCAIRE BF :
            // Les collaboratrices en congé de maternité durant la session ordinaire sont indemnisées par la CNSS
            // et sont automatiquement exclues de la session de paie ordinaire.
            employees = employees.stream()
                    .filter(emp -> {
                        boolean onMaternite = congeWorkflowService.isFeminin(emp) && congeWorkflowService.isEmployeeOnApprovedMaternite(emp.getId(), dP, fP);
                        if (onMaternite) {
                            List<Bulletin> prev = bulletinRepository.findBySessionPaieIdAndEmployeeId(session.getId(), emp.getId());
                            if (!prev.isEmpty()) {
                                prev.removeIf(b -> "VALIDE".equalsIgnoreCase(b.getStatut()) || "CLOTURE".equalsIgnoreCase(b.getStatut()));
                                if (!prev.isEmpty()) {
                                    bulletinRepository.deleteAll(prev);
                                    bulletinRepository.flush();
                                }
                            }
                            return false;
                        }
                        return true;
                    })
                    .collect(Collectors.toList());
        }

        List<Bulletin> createdBulletins = new ArrayList<>();

        for (Employee emp : employees) {
            // Pour une session ordinaire, vérifier que l'agent dispose d'un salaire de base valide
            if (isOrdinaire && !hasSalaireBase(emp)) {
                log.warn("L'agent {} (matricule: {}) n'a aucun salaire de base configuré. Bulletin ignoré pour la session ordinaire #{}",
                        emp.getName(), emp.getMatricule(), session.getId());
                if (employeeIds != null && employeeIds.contains(emp.getId())) {
                    throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                            "L'agent " + emp.getName() + " (" + emp.getMatricule() + ") n'a aucun salaire de base configuré dans sa situation ou sa grille salariale.");
                }
                continue;
            }

            List<Bulletin> existingList = bulletinRepository.findBySessionPaieIdAndEmployeeId(session.getId(), emp.getId());
            BigDecimal customWorkedDays = null;
            BigDecimal customScheduledDays = null;
            Bulletin existingBulletin = null;

            if (!existingList.isEmpty()) {
                existingBulletin = existingList.get(0);
                // Si le bulletin existant est validé ou clôturé, ne pas le modifier
                if ("VALIDE".equalsIgnoreCase(existingBulletin.getStatut()) || "CLOTURE".equalsIgnoreCase(existingBulletin.getStatut())) {
                    createdBulletins.add(existingBulletin);
                    continue;
                }
                if (existingBulletin.getWorkedDays() != null && existingBulletin.getWorkedDays().compareTo(BigDecimal.ZERO) > 0) {
                    customWorkedDays = existingBulletin.getWorkedDays();
                }
                if (existingBulletin.getScheduledWorkingDays() != null && existingBulletin.getScheduledWorkingDays().compareTo(BigDecimal.ZERO) > 0) {
                    customScheduledDays = existingBulletin.getScheduledWorkingDays();
                }
                // Si des doublons existent, supprimer les orphelins non validés
                if (existingList.size() > 1) {
                    for (int i = 1; i < existingList.size(); i++) {
                        Bulletin extra = existingList.get(i);
                        if (!"VALIDE".equalsIgnoreCase(extra.getStatut()) && !"CLOTURE".equalsIgnoreCase(extra.getStatut())) {
                            bulletinRepository.delete(extra);
                        }
                    }
                    bulletinRepository.flush();
                }
            }

            // Stabilité des identifiants : réutilisation de l'entité existante sans changer l'ID
            Bulletin bulletin = computeAndSaveBulletin(session, emp, customWorkedDays, customScheduledDays, existingBulletin);
            if (bulletin != null) {
                createdBulletins.add(bulletin);
            }
        }

        // Machine à états : BROUILLON ou NON_TRAITE -> GENERE
        if ("BROUILLON".equalsIgnoreCase(session.getStatut()) || "NON_TRAITE".equalsIgnoreCase(session.getStatut())) {
            session.setStatut("GENERE");
            sessionPaieRepository.save(session);
        }

        // Recalculer les totaux de la session pour TOUS les bulletins existants dans la session
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
        return recalculerBulletin(bulletinId, null, null);
    }

    private Bulletin prepareBulletinTarget(Bulletin existing, String fallbackCode) {
        Bulletin b = (existing != null) ? existing : new Bulletin();
        if (b.getLines() != null) {
            b.getLines().clear();
        } else {
            b.setLines(new ArrayList<>());
        }
        if (b.getCode() == null || b.getCode().isBlank()) {
            b.setCode(fallbackCode);
        }
        return b;
    }

    @Transactional
    public BulletinDto recalculerBulletin(Long bulletinId, BigDecimal customWorkedDays, BigDecimal customScheduledDays) {
        return recalculerBulletin(bulletinId, customWorkedDays, customScheduledDays, null, null);
    }

    @Transactional
    public BulletinDto recalculerBulletin(Long bulletinId, BigDecimal customWorkedDays, BigDecimal customScheduledDays, String motifRupture, String statutPreavis) {
        Bulletin existing = bulletinRepository.findById(bulletinId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bulletin introuvable #" + bulletinId));
        assertModifiable(existing);

        if (motifRupture != null && !motifRupture.isBlank()) {
            existing.setMotifRupture(motifRupture.trim().toUpperCase(Locale.ROOT));
        }
        if (statutPreavis != null && !statutPreavis.isBlank()) {
            existing.setStatutPreavis(statutPreavis.trim().toUpperCase(Locale.ROOT));
        }

        Employee emp = existing.getEmployee();
        SessionPaie session = existing.getSessionPaie();
        BigDecimal workedDays = (customWorkedDays != null && customWorkedDays.compareTo(BigDecimal.ZERO) > 0)
                ? customWorkedDays
                : ((existing.getWorkedDays() != null && existing.getWorkedDays().compareTo(BigDecimal.ZERO) > 0) ? existing.getWorkedDays() : null);
        BigDecimal scheduledDays = (customScheduledDays != null && customScheduledDays.compareTo(BigDecimal.ZERO) > 0)
                ? customScheduledDays
                : ((existing.getScheduledWorkingDays() != null && existing.getScheduledWorkingDays().compareTo(BigDecimal.ZERO) > 0) ? existing.getScheduledWorkingDays() : null);

        // Réutilisation de l'entité sans suppression afin de préserver l'ID et tous les liens
        Bulletin updatedBlt = computeAndSaveBulletin(session, emp, workedDays, scheduledDays, existing);
        if (session != null) {
            recalculerTotauxSession(session);
        }
        return toDto(updatedBlt);
    }

    @Transactional
    public List<BulletinDto> recalculerBulletinsSession(Long sessionPaieId) {
        SessionPaie session = sessionPaieRepository.findById(sessionPaieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session de paie non trouvée #" + sessionPaieId));
        assertSessionModifiable(session);

        List<Bulletin> bulletins = bulletinRepository.findBySessionPaieId(sessionPaieId);
        List<Long> empIds = bulletins.stream()
                .map(b -> b.getEmployee().getId())
                .distinct()
                .collect(Collectors.toList());
        return generateBulletinsForSession(sessionPaieId, empIds);
    }

    @Transactional
    public BulletinDto updateStatut(Long id, String statut) {
        Bulletin b = bulletinRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bulletin introuvable #" + id));
        if ("CLOTURE".equalsIgnoreCase(b.getStatut()) || (b.getSessionPaie() != null && "CLOTURE".equalsIgnoreCase(b.getSessionPaie().getStatut()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Impossible de modifier le statut d'un bulletin ou d'une session clôturée.");
        }
        b.setStatut(statut);
        if ("VALIDE".equalsIgnoreCase(statut)) {
            b.setDateValidation(LocalDateTime.now());
        } else if ("GENERE".equalsIgnoreCase(statut)) {
            b.setDateValidation(null);
        }
        b = bulletinRepository.save(b);
        return toDto(b);
    }

    @Transactional
    public List<BulletinDto> recalculerTousLesBulletins() {
        // RÈGLE V3 : Seules les sessions non validées et non clôturées peuvent être recalculées.
        // Interdiction absolue de réécrire l'historique des sessions VALIDE ou CLOTURE.
        List<SessionPaie> sessions = sessionPaieRepository.findAll().stream()
                .filter(s -> !"VALIDE".equalsIgnoreCase(s.getStatut()) && !"CLOTURE".equalsIgnoreCase(s.getStatut()))
                .collect(Collectors.toList());

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
            if (b.getSessionPaie() == null && !"VALIDE".equalsIgnoreCase(b.getStatut()) && !"CLOTURE".equalsIgnoreCase(b.getStatut())) {
                try {
                    recalculerBulletin(b.getId());
                } catch (Exception ignored) {}
            }
        }
        return getAllBulletins();
    }

    @Transactional
    public Bulletin computeAndSaveBulletin(SessionPaie session, Employee emp) {
        return computeAndSaveBulletin(session, emp, null, null, null);
    }

    @Transactional
    public Bulletin computeAndSaveBulletin(SessionPaie session, Employee emp, BigDecimal customWorkedDays, BigDecimal customScheduledDays) {
        return computeAndSaveBulletin(session, emp, customWorkedDays, customScheduledDays, null);
    }

    @Transactional
    public Bulletin computeAndSaveBulletin(SessionPaie session, Employee emp, BigDecimal customWorkedDays, BigDecimal customScheduledDays, Bulletin existingBulletin) {
        // RÈGLE V3 : Prévention stricte des doublons physiques & logique
        if (existingBulletin == null && session != null && session.getId() != null && emp != null && emp.getId() != null) {
            List<Bulletin> found = bulletinRepository.findBySessionPaieIdAndEmployeeId(session.getId(), emp.getId());
            if (found != null && !found.isEmpty()) {
                existingBulletin = found.get(0);
                log.info("Bulletin existant #{} réutilisé pour l'employé #{} dans la session #{}.",
                        existingBulletin.getId(), emp.getId(), session.getId());
            }
        }
        if (customWorkedDays == null && existingBulletin != null && existingBulletin.getWorkedDays() != null) {
            customWorkedDays = existingBulletin.getWorkedDays();
        }
        if (customScheduledDays == null && existingBulletin != null && existingBulletin.getScheduledWorkingDays() != null) {
            customScheduledDays = existingBulletin.getScheduledWorkingDays();
        }

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

        boolean is13 = is13emeMois(session);
        boolean is14 = is14emeMois(session);
        boolean isConge = isCongePaye(session);
        boolean isRetraite = isIndemniteRetraite(session);
        boolean isStc = isStc(session);
        boolean isDiffMat = isDifferentielMaternite(session);
        boolean isGratif = !is13 && !is14 && !isConge && !isRetraite && !isStc && !isDiffMat && isGratification(session != null ? session.getTypeSession() : null);
        boolean isExtra = isExtraordinaire(session != null ? session.getTypeSession() : null) || is13 || is14 || isConge || isRetraite || isStc || isDiffMat;
        boolean is13Ou14eme = is13 || is14;

        // Calcul automatique du nombre de jours travaillés selon dateEmbauche & contrat (prorata temporis)
        LocalDate debutPeriode = session != null ? session.getDateFrom() : null;
        LocalDate finPeriode = session != null ? session.getDateTo() : null;
        if (is13 || is14) {
            int an = session != null && session.getAnnee() != null ? session.getAnnee() : LocalDate.now().getYear();
            debutPeriode = LocalDate.of(an, 1, 1);
            finPeriode = LocalDate.of(an, 12, 31);
        } else if (debutPeriode == null && session != null) {
            int an = session.getAnnee() != null ? session.getAnnee() : LocalDate.now().getYear();
            int mo = parseMoisSafe(session.getMois());
            debutPeriode = LocalDate.of(an, mo, 1);
            finPeriode = debutPeriode.withDayOfMonth(debutPeriode.lengthOfMonth());
        }

        // RÈGLE V3 : Restriction stricte sur la date d'embauche
        LocalDate dEmbauche = parseLocalDateSafe(emp.getDateEmbauche());
        if (dEmbauche != null && finPeriode != null && dEmbauche.isAfter(finPeriode)) {
            String nomPeriode = session != null && session.getPeriode() != null ? session.getPeriode() : ("finissant le " + finPeriode);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Impossible de générer le bulletin pour l'employé " + emp.getMatricule() + " (" + emp.getName() + ") : sa date d'embauche (" + emp.getDateEmbauche() + ") est postérieure à la période de paie (" + nomPeriode + ").");
        }

        Contrat dernierContrat = contratRepository.findFirstByEmployeeIdOrderByIdDesc(emp.getId()).orElse(null);
        LocalDate dFinContrat = (dernierContrat != null && dernierContrat.getDateFin() != null && !dernierContrat.getDateFin().isBlank())
                ? parseLocalDateSafe(dernierContrat.getDateFin()) : null;

        BigDecimal scheduledDays = (customScheduledDays != null && customScheduledDays.compareTo(BigDecimal.ZERO) > 0)
                ? customScheduledDays : new BigDecimal("30.00");
        BigDecimal workedDays;

        if (customWorkedDays != null && customWorkedDays.compareTo(BigDecimal.ZERO) > 0) {
            workedDays = customWorkedDays;
        } else {
            // Mois commercial légal de 30 jours (Convention Collective des Banques & Code du Travail BF)
            int joursPresents = 30;

            boolean arriveeCeMois = dEmbauche != null && debutPeriode != null && finPeriode != null
                    && !dEmbauche.isBefore(debutPeriode) && !dEmbauche.isAfter(finPeriode);
            boolean departCeMois = dFinContrat != null && debutPeriode != null && finPeriode != null
                    && !dFinContrat.isBefore(debutPeriode) && !dFinContrat.isAfter(finPeriode);

            if (arriveeCeMois && departCeMois) {
                int jArr = dEmbauche.getDayOfMonth();
                int jDep = dFinContrat.getDayOfMonth();
                joursPresents = Math.max(1, Math.min(30, jDep - jArr + 1));
            } else if (arriveeCeMois) {
                int jArr = dEmbauche.getDayOfMonth();
                joursPresents = Math.max(1, Math.min(30, 30 - jArr + 1));
            } else if (departCeMois) {
                int jDep = dFinContrat.getDayOfMonth();
                joursPresents = Math.max(1, Math.min(30, jDep));
            }

            workedDays = new BigDecimal(joursPresents).setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal computedRatio = workedDays.divide(scheduledDays, 6, RoundingMode.HALF_UP);
        if (computedRatio.compareTo(BigDecimal.ONE) > 0) computedRatio = BigDecimal.ONE;
        if (computedRatio.compareTo(BigDecimal.ZERO) < 0) computedRatio = BigDecimal.ZERO;
        final BigDecimal ratio = computedRatio;

        BigDecimal salaireBasePlein = salaireBase;
        salaireBase = money(salaireBasePlein.multiply(ratio));

        BigDecimal surSalairePlein = surSalaire;
        surSalaire = money(surSalairePlein.multiply(ratio));

        // ====================================================================
        // 1. SESSION EXTRAORDINAIRE : 13ème MOIS & 14ème MOIS (Au Prorata, Brut = Net, avec Avoirs)
        // ====================================================================
        if (is13 || isGratif || is14) {
            String nature = is14 ? "14EME_MOIS" : "13EME_MOIS";
            String codePrefix = is14 ? "GRAT_14EME" : "GRAT_13EME";
            String labelPrefix = is14 ? "14ème Mois" : "13ème Mois (Gratification)";

            // 1. Base pleine mensuelle de référence (Salaire de base + Sursalaire pleins non proratisés sur le mois)
            BigDecimal basePleineReference = money(salaireBasePlein.add(surSalairePlein));

            // 2. Année de référence du 13ème / 14ème mois
            int anneeRef = (session != null && session.getAnnee() != null)
                    ? session.getAnnee()
                    : (finPeriode != null ? finPeriode.getYear() : LocalDate.now().getYear());
            LocalDate debutAnneeRef = LocalDate.of(anneeRef, 1, 1);
            LocalDate finAnneeRef = LocalDate.of(anneeRef, 12, 31);
            // La gratification 13è / 14è mois couvre l'année civile complète (31 décembre) :
            // Tout agent en contrat actif toute l'année a droit à 100% (360 jours / 12 mois).
            LocalDate dateFinEvaluation = finAnneeRef;

            // 3. Prorata temporis annuel
            BigDecimal ratioProrata;
            BigDecimal tauxProrataPourcentage;
            String prorataVariableStr;
            BigDecimal joursTravaillesAnnuels;
            BigDecimal joursPrevusAnnuels;

            if (customWorkedDays != null && customWorkedDays.compareTo(BigDecimal.ZERO) > 0) {
                // Saisie personnalisée des jours ou mois par l'utilisateur
                if (customScheduledDays != null && customScheduledDays.compareTo(BigDecimal.ZERO) > 0) {
                    joursPrevusAnnuels = customScheduledDays;
                    joursTravaillesAnnuels = customWorkedDays;
                } else if (customWorkedDays.compareTo(new BigDecimal("12.00")) <= 0) {
                    joursPrevusAnnuels = new BigDecimal("12.00");
                    joursTravaillesAnnuels = customWorkedDays;
                } else {
                    joursPrevusAnnuels = new BigDecimal("360.00");
                    joursTravaillesAnnuels = customWorkedDays;
                }
                ratioProrata = joursTravaillesAnnuels.divide(joursPrevusAnnuels, 6, RoundingMode.HALF_UP);
                if (ratioProrata.compareTo(BigDecimal.ONE) > 0) ratioProrata = BigDecimal.ONE;
                if (ratioProrata.compareTo(BigDecimal.ZERO) < 0) ratioProrata = BigDecimal.ZERO;
                tauxProrataPourcentage = ratioProrata.multiply(new BigDecimal("100.00")).setScale(2, RoundingMode.HALF_UP);

                if (joursPrevusAnnuels.compareTo(new BigDecimal("12.00")) == 0) {
                    prorataVariableStr = joursTravaillesAnnuels.stripTrailingZeros().toPlainString() + "/12 mois (" + tauxProrataPourcentage.toPlainString() + "%)";
                } else {
                    prorataVariableStr = joursTravaillesAnnuels.stripTrailingZeros().toPlainString() + "/" + joursPrevusAnnuels.stripTrailingZeros().toPlainString() + " j (" + tauxProrataPourcentage.toPlainString() + "%)";
                }
            } else {
                // Calcul automatique selon date d'embauche et date de fin de contrat dans l'année de référence
                joursPrevusAnnuels = new BigDecimal("360.00");
                LocalDate debutEffectif = (dEmbauche != null && dEmbauche.isAfter(debutAnneeRef)) ? dEmbauche : debutAnneeRef;
                LocalDate finEffective = (dFinContrat != null && dFinContrat.isBefore(dateFinEvaluation)) ? dFinContrat : dateFinEvaluation;

                if (debutEffectif.isAfter(finEffective)) {
                    ratioProrata = BigDecimal.ZERO;
                    tauxProrataPourcentage = BigDecimal.ZERO;
                    joursTravaillesAnnuels = BigDecimal.ZERO;
                    prorataVariableStr = "0/12 mois (0.00%)";
                } else {
                    int arrMonth = debutEffectif.getMonthValue();
                    int arrDay = debutEffectif.getDayOfMonth();
                    int depMonth = finEffective.getMonthValue();
                    int depDay = Math.min(30, finEffective.getDayOfMonth());

                    int totalJoursComptables;
                    if (arrMonth == depMonth) {
                        totalJoursComptables = Math.max(1, Math.min(30, depDay - arrDay + 1));
                    } else {
                        int moisEntiersIntermediaires = Math.max(0, depMonth - arrMonth - 1);
                        int joursPremierMois = Math.max(1, Math.min(30, 30 - arrDay + 1));
                        int joursDernierMois = Math.max(1, Math.min(30, depDay));
                        totalJoursComptables = (moisEntiersIntermediaires * 30) + joursPremierMois + joursDernierMois;
                    }
                    if (totalJoursComptables > 360) totalJoursComptables = 360;

                    joursTravaillesAnnuels = BigDecimal.valueOf(totalJoursComptables).setScale(2, RoundingMode.HALF_UP);
                    ratioProrata = joursTravaillesAnnuels.divide(new BigDecimal("360.00"), 6, RoundingMode.HALF_UP);
                    if (ratioProrata.compareTo(BigDecimal.ONE) > 0) ratioProrata = BigDecimal.ONE;
                    if (ratioProrata.compareTo(BigDecimal.ZERO) < 0) ratioProrata = BigDecimal.ZERO;
                    tauxProrataPourcentage = ratioProrata.multiply(new BigDecimal("100.00")).setScale(2, RoundingMode.HALF_UP);

                    if (totalJoursComptables == 360) {
                        prorataVariableStr = "12/12 mois (100.00%)";
                    } else if (totalJoursComptables % 30 == 0) {
                        int m = totalJoursComptables / 30;
                        prorataVariableStr = m + "/12 mois (" + tauxProrataPourcentage.toPlainString() + "%)";
                    } else {
                        prorataVariableStr = totalJoursComptables + "/360 jours (" + tauxProrataPourcentage.toPlainString() + "%)";
                    }
                }
            }

            // 4. Ventilation détaillée de toutes les composantes du salaire brut au prorata
            List<BulletinLine> linesGratification = new ArrayList<>();
            int ordreLigne = 1;

            // A. Composante 1 : Salaire de Base (au prorata temporis)
            SalaryElement salBaseElemGrat = findSalaryElement("CAT_SAL_BASE", "BASE", "sal_base", "salaire_base", "sal_mensuel", "salbase");
            String salBaseCodeGrat = (salBaseElemGrat != null && salBaseElemGrat.getCode() != null) ? salBaseElemGrat.getCode() : "sal_base";
            String salBaseLibelleGrat = (salBaseElemGrat != null && salBaseElemGrat.getName() != null && !salBaseElemGrat.getName().isBlank())
                    ? salBaseElemGrat.getName()
                    : "SALAIRE DE BASE";
            Integer salBaseOrdreGrat = (salBaseElemGrat != null && salBaseElemGrat.getOrdre() != null) ? salBaseElemGrat.getOrdre() : ordreLigne++;

            BigDecimal montantSalaireBaseProratise = money(salaireBasePlein.multiply(ratioProrata));
            BulletinLine salBaseLine = new BulletinLine();
            salBaseLine.setCode(salBaseCodeGrat);
            salBaseLine.setLibelle(salBaseLibelleGrat);
            salBaseLine.setTypeLigne("GAIN");
            salBaseLine.setBaseCalcul(salaireBasePlein);
            salBaseLine.setTaux(tauxProrataPourcentage);
            salBaseLine.setMontant(montantSalaireBaseProratise);
            salBaseLine.setOrdre(salBaseOrdreGrat);
            linesGratification.add(salBaseLine);

            // B. Composante 2 : Sur-salaire (au prorata si existant)
            SalaryElement surSalElemGrat = findSalaryElement(null, "SURSALAIRE", "SUR_SALAIRE", "SURSALAIRE");
            String surSalCodeGrat = (surSalElemGrat != null && surSalElemGrat.getCode() != null) ? surSalElemGrat.getCode() : "SUR_SALAIRE";
            String surSalLibelleGrat = (surSalElemGrat != null && surSalElemGrat.getName() != null && !surSalElemGrat.getName().isBlank())
                    ? surSalElemGrat.getName()
                    : "Sur-salaire";
            Integer surSalOrdreGrat = (surSalElemGrat != null && surSalElemGrat.getOrdre() != null) ? surSalElemGrat.getOrdre() : ordreLigne++;

            BigDecimal montantSurSalaireProratise = BigDecimal.ZERO;
            if (surSalairePlein != null && surSalairePlein.compareTo(BigDecimal.ZERO) > 0) {
                montantSurSalaireProratise = money(surSalairePlein.multiply(ratioProrata));
                if (montantSurSalaireProratise.compareTo(BigDecimal.ZERO) > 0) {
                    BulletinLine surSalLine = new BulletinLine();
                    surSalLine.setCode(surSalCodeGrat);
                    surSalLine.setLibelle(surSalLibelleGrat);
                    surSalLine.setTypeLigne("GAIN");
                    surSalLine.setBaseCalcul(surSalairePlein);
                    surSalLine.setTaux(tauxProrataPourcentage);
                    surSalLine.setMontant(montantSurSalaireProratise);
                    surSalLine.setOrdre(surSalOrdreGrat);
                    linesGratification.add(surSalLine);
                }
            }

            // C. Composante 3 : Prime d'ancienneté (au prorata si applicable)
            SalaryElement ancElemGrat = findSalaryElement("CAT_PRIMES", "ANCIENNETE", "PRIME_ANC", "PRIME_ANCIENNETE");
            String ancCodeGrat = (ancElemGrat != null && ancElemGrat.getCode() != null) ? ancElemGrat.getCode() : "PRIME_ANC";
            String ancLibelleGrat = (ancElemGrat != null && ancElemGrat.getName() != null && !ancElemGrat.getName().isBlank())
                    ? ancElemGrat.getName()
                    : "PRIME D'ANCIENNETE";
            Integer ancOrdreGrat = (ancElemGrat != null && ancElemGrat.getOrdre() != null) ? ancElemGrat.getOrdre() : ordreLigne++;

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
            BigDecimal montantPrimeAncienneteProratisee = BigDecimal.ZERO;
            if (tauxAnciennete.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal pAncPleine = money(calculatePercentage(salaireBasePlein, tauxAnciennete));
                montantPrimeAncienneteProratisee = money(pAncPleine.multiply(ratioProrata));
                if (montantPrimeAncienneteProratisee.compareTo(BigDecimal.ZERO) > 0) {
                    BulletinLine ancLine = new BulletinLine();
                    ancLine.setCode(ancCodeGrat);
                    ancLine.setLibelle(ancLibelleGrat);
                    ancLine.setTypeLigne("GAIN");
                    ancLine.setBaseCalcul(montantSalaireBaseProratise);
                    ancLine.setTaux(tauxAnciennete);
                    ancLine.setMontant(montantPrimeAncienneteProratisee);
                    ancLine.setOrdre(ancOrdreGrat);
                    linesGratification.add(ancLine);
                }
            }

            // D. Composante 4 : Indemnités conventionnelles et contractuelles de l'agent (au prorata)
            try {
                employeeProcessService.sync(emp, null, false);
            } catch (Exception e) {
                log.warn("Warn: Erreur synchronisation indemnités employé #{}: {}", emp.getId(), e.getMessage());
            }
            List<IndemniteEmploye> rawIndemnites = indemniteRepository.findByEmployeeId(emp.getId());
            List<IndemniteEmploye> activeIndemnites = rawIndemnites.stream()
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

            BigDecimal totalIndemnitesProratisees = BigDecimal.ZERO;
            for (IndemniteEmploye ind : activeIndemnites) {
                BigDecimal mPlein = money(ind.getMontant());
                if (mPlein.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal mProratise = money(mPlein.multiply(ratioProrata));
                    if (mProratise.compareTo(BigDecimal.ZERO) > 0) {
                        totalIndemnitesProratisees = totalIndemnitesProratisees.add(mProratise);
                        String indCode = ind.getTypeIndemnite() != null ? ind.getTypeIndemnite().getCode() : "INDEMNITE";
                        String rawLib = ind.getLibelle() != null ? ind.getLibelle() : (ind.getTypeIndemnite() != null ? ind.getTypeIndemnite().getName() : "Indemnité");
                        String indLib = rawLib.toUpperCase(Locale.ROOT).trim();

                        BulletinLine indLine = new BulletinLine();
                        indLine.setCode(indCode);
                        indLine.setLibelle(indLib);
                        indLine.setTypeLigne("GAIN");
                        indLine.setBaseCalcul(mPlein);
                        indLine.setTaux(tauxProrataPourcentage);
                        indLine.setMontant(mProratise);
                        indLine.setOrdre(ordreLigne++);
                        linesGratification.add(indLine);
                    }
                }
            }

            // E. Composante 5 : Avoirs actifs et rappels
            List<BulletinLine> linesAvoirs = new ArrayList<>();
            BigDecimal totalAvoirs = BigDecimal.ZERO;

            List<AvoirEmploye> avoirsEmploye = avoirRepository.findByEmployeeIdAndStatut(emp.getId(), "ACTIF");
            for (AvoirEmploye av : avoirsEmploye) {
                if (av.getMontantMensuel() != null && av.getMontantMensuel().compareTo(BigDecimal.ZERO) > 0) {
                    totalAvoirs = totalAvoirs.add(av.getMontantMensuel());
                    BulletinLine avLine = new BulletinLine();
                    avLine.setRubriquePaie(av.getRubriquePaie());
                    avLine.setCode("AVOIR_" + av.getId());
                    String echStr = (av.getEcheancesTotal() != null && av.getEcheancesRestantes() != null)
                            ? (" - Échéance " + (av.getEcheancesTotal() - av.getEcheancesRestantes() + 1) + "/" + av.getEcheancesTotal())
                            : "";
                    avLine.setLibelle(av.getLibelle() + echStr);
                    avLine.setTypeLigne("GAIN");
                    avLine.setBaseCalcul(av.getMontantInitial());
                    avLine.setTaux(null);
                    avLine.setMontant(av.getMontantMensuel());
                    avLine.setOrdre(ordreLigne++);
                    linesAvoirs.add(avLine);
                }
            }

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
                    if (m.compareTo(BigDecimal.ZERO) > 0) {
                        totalAvoirs = totalAvoirs.add(m);
                        String rawName = av.getSalaryElement() != null ? av.getSalaryElement().getName() : "Rappel salaire";
                        String finalLibelle = (rawName != null && rawName.toUpperCase(Locale.ROOT).contains("RAPPEL"))
                                ? rawName : ("Rappel " + (rawName != null ? rawName : "salaire"));
                        BulletinLine avLine = new BulletinLine();
                        avLine.setCode(av.getSalaryElement() != null ? av.getSalaryElement().getCode() : "RAPPEL_" + av.getId());
                        avLine.setLibelle(finalLibelle);
                        avLine.setTypeLigne("GAIN");
                        avLine.setBaseCalcul(av.getAmount());
                        avLine.setTaux(null);
                        avLine.setMontant(m);
                        avLine.setOrdre(ordreLigne++);
                        linesAvoirs.add(avLine);
                    }
                }
            }
            linesGratification.addAll(linesAvoirs);

            // 6. RÈGLE V3 : BRUT = NET (Exonération totale des retenues sociales et fiscales pour la gratification)
            BigDecimal totalBrut = money(montantSalaireBaseProratise
                    .add(montantSurSalaireProratise)
                    .add(montantPrimeAncienneteProratisee)
                    .add(totalIndemnitesProratisees)
                    .add(totalAvoirs));
            BigDecimal totalNet = totalBrut; // Le brut devient le net à payer !

            Contrat contrat = contratRepository.findFirstByEmployeeIdOrderByIdDesc(emp.getId()).orElse(null);
            Grade grade = emp.getGradeObj();
            String finalCode = generateBulletinCode(session, emp);

            Bulletin bulletin = prepareBulletinTarget(existingBulletin, finalCode);
            bulletin.setEmployee(emp);
            bulletin.setSessionPaie(session);
            bulletin.setGrade(grade);
            bulletin.setContrat(contrat);
            bulletin.setTypeSession("EXTRAORDINAIRE");
            bulletin.setNatureSession(nature);
            bulletin.setDateFrom(debutPeriode);
            bulletin.setDateTo(finPeriode);
            bulletin.setScheduledWorkingDays(joursPrevusAnnuels);
            bulletin.setWorkedDays(joursTravaillesAnnuels);
            bulletin.setSalaireBase(montantSalaireBaseProratise);
            bulletin.setSurSalaire(montantSurSalaireProratise);
            bulletin.setTotalIndemnites(totalIndemnitesProratisees);
            bulletin.setTotalAvoirs(totalAvoirs);
            bulletin.setSalaireBrut(totalBrut);
            bulletin.setTotalExonerations(totalBrut);
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
            bulletin.setSalaireNet(totalNet);
            bulletin.setStatut("GENERE");
            bulletin.setDateCalcul(LocalDateTime.now());

            for (BulletinLine l : linesGratification) {
                bulletin.addLine(l);
            }
            bulletin = bulletinRepository.save(bulletin);
            return bulletin;
        }

        // ====================================================================
        // 3. SESSION EXTRAORDINAIRE : LE CONGÉ PAYÉ
        // Formule : Somme revenus 12 derniers mois / 360 * Jours acquis
        // ====================================================================
        if (isConge) {
            BigDecimal defMonthlyBrut = salaireBase.add(surSalaire);
            BigDecimal somme12 = getSommeRevenus12DerniersMois(emp.getId(), defMonthlyBrut);
            BigDecimal smj = somme12.divide(new BigDecimal("360"), 2, RoundingMode.HALF_UP);
            BigDecimal joursAcquis = getJoursCongeAcquis(emp.getId());
            BigDecimal montantConge = money(smj.multiply(joursAcquis));

            BulletinLine cpLine = new BulletinLine();
            cpLine.setCode("IND_CONGE_PAYE");
            cpLine.setLibelle("Indemnité de Congé Payé - " + formatMoneyNoDec(joursAcquis) + " j");
            cpLine.setTypeLigne("GAIN");
            cpLine.setBaseCalcul(smj);
            cpLine.setTaux(joursAcquis);
            cpLine.setMontant(montantConge);
            cpLine.setOrdre(1);

            // Cotisation CNSS (5.5% plafonné à 800 000 FCFA => max 44 000 FCFA)
            BigDecimal baseCnss = montantConge.min(new BigDecimal("800000.00"));
            BigDecimal cnssEmploye = money(baseCnss.multiply(new BigDecimal("0.055"))).min(new BigDecimal("44000.00"));
            BigDecimal cnssPatronale = money(baseCnss.multiply(new BigDecimal("0.16")));

            // IUTS sur congé payé avec abattement de 20%
            BigDecimal abattement = money(montantConge.multiply(new BigDecimal("0.20")).min(new BigDecimal("75000.00")));
            BigDecimal baseImposable = money(montantConge.subtract(cnssEmploye).subtract(abattement).max(BigDecimal.ZERO));

            int nbCharges = 0;
            try {
                nbCharges = Math.toIntExact(familleRepository.countByEmployeeIdAndEstChargeTrue(emp.getId()));
            } catch (Exception ignored) {}
            BigDecimal iutsSansCharge = calculateIuts(baseImposable);
            BigDecimal tauxReduction = reductionRate(nbCharges);
            BigDecimal reductionIuts = money(iutsSansCharge.multiply(tauxReduction).divide(CENT, 8, RoundingMode.HALF_UP));
            BigDecimal impotIuts = money(iutsSansCharge.subtract(reductionIuts).max(BigDecimal.ZERO));

            BigDecimal totalRetenues = money(cnssEmploye.add(impotIuts));
            BigDecimal salaireNet = money(montantConge.subtract(totalRetenues));

            Contrat contrat = contratRepository.findFirstByEmployeeIdOrderByIdDesc(emp.getId()).orElse(null);
            Grade grade = emp.getGradeObj();
            String finalCode = generateBulletinCode(session, emp);

            Bulletin bulletin = prepareBulletinTarget(existingBulletin, finalCode);
            bulletin.setEmployee(emp);
            bulletin.setSessionPaie(session);
            bulletin.setGrade(grade);
            bulletin.setContrat(contrat);
            bulletin.setTypeSession("EXTRAORDINAIRE");
            bulletin.setNatureSession("CONGE_PAYE");
            bulletin.setDateFrom(debutPeriode);
            bulletin.setDateTo(finPeriode);
            bulletin.setScheduledWorkingDays(scheduledDays);
            bulletin.setWorkedDays(workedDays);
            bulletin.setSalaireBase(salaireBase);
            bulletin.setSurSalaire(surSalaire);
            bulletin.setTotalIndemnites(montantConge);
            bulletin.setTotalAvoirs(BigDecimal.ZERO);
            bulletin.setSalaireBrut(montantConge);
            bulletin.setTotalExonerations(BigDecimal.ZERO);
            bulletin.setAbattementForfaitaire(abattement);
            bulletin.setBaseImposable(baseImposable);
            bulletin.setCotisationCnss(cnssEmploye);
            bulletin.setImpotIutsSansCharge(iutsSansCharge);
            bulletin.setReductionIutsCharge(reductionIuts);
            bulletin.setImpotIuts(impotIuts);
            bulletin.setTotalRetenuesSociales(cnssEmploye);
            bulletin.setTotalPrecomptes(BigDecimal.ZERO);
            BigDecimal tpaConge = money(montantConge.multiply(new BigDecimal("0.03")));
            BigDecimal totalPatronaleConge = cnssPatronale.add(tpaConge);
            bulletin.setTotalRetenues(totalRetenues);
            bulletin.setTotalCotisationsPatronales(totalPatronaleConge);
            bulletin.setSalaireNet(salaireNet);
            bulletin.setStatut("GENERE");
            bulletin.setDateCalcul(LocalDateTime.now());

            bulletin.addLine(cpLine);

            if (cnssEmploye.compareTo(BigDecimal.ZERO) > 0 || cnssPatronale.compareTo(BigDecimal.ZERO) > 0) {
                BulletinLine cnssLine = new BulletinLine();
                cnssLine.setCode("COT_CNSS");
                cnssLine.setLibelle("Cotisation CNSS 5.5%");
                cnssLine.setTypeLigne("RETENUE_SOCIALE");
                cnssLine.setBaseCalcul(baseCnss);
                cnssLine.setTaux(new BigDecimal("5.50"));
                cnssLine.setMontant(cnssEmploye);
                cnssLine.setPartPatronale(cnssPatronale);
                cnssLine.setOrdre(20);
                bulletin.addLine(cnssLine);
            }

            if (tpaConge.compareTo(BigDecimal.ZERO) > 0) {
                BulletinLine tpaLine = new BulletinLine();
                tpaLine.setCode("TPA_PAT");
                tpaLine.setLibelle("TAXE PATRONALE D'APPRENTISSAGE (TPA 3%)");
                tpaLine.setTypeLigne("COTISATION_PATRONALE");
                tpaLine.setBaseCalcul(montantConge);
                tpaLine.setTaux(new BigDecimal("3.00"));
                tpaLine.setMontant(BigDecimal.ZERO);
                tpaLine.setPartPatronale(tpaConge);
                tpaLine.setOrdre(22);
                bulletin.addLine(tpaLine);
            }

            if (impotIuts.compareTo(BigDecimal.ZERO) > 0) {
                BulletinLine iutsLine = new BulletinLine();
                iutsLine.setCode("IUTS");
                iutsLine.setLibelle("RETENUE IUTS");
                iutsLine.setTypeLigne("IMPOT");
                iutsLine.setBaseCalcul(baseImposable);
                iutsLine.setTaux(BigDecimal.valueOf(nbCharges));
                iutsLine.setMontant(impotIuts);
                iutsLine.setOrdre(21);
                bulletin.addLine(iutsLine);
            }

            bulletin = bulletinRepository.save(bulletin);
            return bulletin;
        }

        // ====================================================================
        // 4. SESSION EXTRAORDINAIRE : INDEMNITÉS DE DÉPART À LA RETRAITE
        // Tranches : 30% (ans 1 à 5), 35% (ans 6 à 10), 45% (au-delà) sur SGM 12 mois
        // ====================================================================
        if (isRetraite) {
            try {
                employeeProcessService.sync(emp, null, false);
            } catch (Exception e) {
                log.warn("Avertissement : échec synchronisation indemnités employé #{}: {}", emp.getId(), e.getMessage());
            }
            List<IndemniteEmploye> rawIndemnites = indemniteRepository.findByEmployeeId(emp.getId());

            BigDecimal sgm = getSalaireGlobalMensuelMoyen(emp.getId(), salaireBase, surSalaire, BigDecimal.ZERO, rawIndemnites);
            double ancienneteAns = getAncienneteExacte(emp, session);

            double t1Ans = Math.min(ancienneteAns, 5.0);
            double t2Ans = Math.max(0.0, Math.min(ancienneteAns - 5.0, 5.0));
            double t3Ans = Math.max(0.0, ancienneteAns - 10.0);

            BigDecimal part1 = money(sgm.multiply(BigDecimal.valueOf(t1Ans)).multiply(new BigDecimal("0.30")));
            BigDecimal part2 = money(sgm.multiply(BigDecimal.valueOf(t2Ans)).multiply(new BigDecimal("0.35")));
            BigDecimal part3 = money(sgm.multiply(BigDecimal.valueOf(t3Ans)).multiply(new BigDecimal("0.45")));
            BigDecimal totalRetraite = money(part1.add(part2).add(part3));

            BulletinLine retLine = new BulletinLine();
            retLine.setCode("IND_RETRAITE");
            retLine.setLibelle("Indemnité de Départ à la Retraite - " + String.format(Locale.US, "%.1f", ancienneteAns) + " ans");
            retLine.setTypeLigne("GAIN");
            retLine.setBaseCalcul(sgm);
            retLine.setTaux(BigDecimal.valueOf(ancienneteAns));
            retLine.setMontant(totalRetraite);
            retLine.setOrdre(1);

            Contrat contrat = contratRepository.findFirstByEmployeeIdOrderByIdDesc(emp.getId()).orElse(null);
            Grade grade = emp.getGradeObj();
            String finalCode = generateBulletinCode(session, emp);

            Bulletin bulletin = prepareBulletinTarget(existingBulletin, finalCode);
            bulletin.setEmployee(emp);
            bulletin.setSessionPaie(session);
            bulletin.setGrade(grade);
            bulletin.setContrat(contrat);
            bulletin.setTypeSession("EXTRAORDINAIRE");
            bulletin.setNatureSession("INDEMNITE_RETRAITE");
            bulletin.setDateFrom(debutPeriode);
            bulletin.setDateTo(finPeriode);
            bulletin.setScheduledWorkingDays(scheduledDays);
            bulletin.setWorkedDays(workedDays);
            bulletin.setSalaireBase(salaireBase);
            bulletin.setSurSalaire(surSalaire);
            bulletin.setTotalIndemnites(totalRetraite);
            bulletin.setTotalAvoirs(BigDecimal.ZERO);
            bulletin.setSalaireBrut(totalRetraite);
            bulletin.setTotalExonerations(totalRetraite); // Exonéré de retenues fiscales/sociales
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
            bulletin.setSalaireNet(totalRetraite);
            bulletin.setStatut("GENERE");
            bulletin.setDateCalcul(LocalDateTime.now());

            bulletin.addLine(retLine);
            bulletin = bulletinRepository.save(bulletin);
            return bulletin;
        }

        // ====================================================================
        // 4.bis SESSION EXTRAORDINAIRE : DIFFÉRENTIEL / COMPLÉMENT MATERNITÉ
        // Prise en charge CNSS à 100% jusqu'à 800 000 F / mois.
        // La banque verse le complément uniquement sur la part excédant 800 000 F.
        // ====================================================================
        if (isDiffMat) {
            try {
                employeeProcessService.sync(emp, null, false);
            } catch (Exception e) {
                log.warn("Avertissement : échec synchronisation indemnités employé #{}: {}", emp.getId(), e.getMessage());
            }
            List<IndemniteEmploye> rawIndemnites = indemniteRepository.findByEmployeeId(emp.getId()).stream()
                    .filter(row -> !Boolean.FALSE.equals(row.getActif()))
                    .filter(row -> {
                        String code = (row.getTypeIndemnite() != null && row.getTypeIndemnite().getCode() != null)
                                ? row.getTypeIndemnite().getCode().toUpperCase(Locale.ROOT) : "";
                        String lib = row.getLibelle() != null ? row.getLibelle().toUpperCase(Locale.ROOT) : "";
                        if (Boolean.TRUE.equals(emp.getVehiculeFourni()) && (code.contains("TRP") || code.contains("TRANS") || lib.contains("TRANSPORT"))) return false;
                        if (Boolean.TRUE.equals(emp.getLogementFourni()) && (code.contains("LOG") || code.contains("MAISON") || lib.contains("LOGEMENT"))) return false;
                        return true;
                    })
                    .toList();
            BigDecimal totIndem = rawIndemnites.stream()
                    .map(i -> i.getMontant() != null ? money(new BigDecimal(String.valueOf(i.getMontant()))) : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Prime ancienneté
            BigDecimal txAnc = BigDecimal.ZERO;
            int ansAnc = (emp.getAncienneteReprise() != null && emp.getAncienneteReprise() > 0) ? emp.getAncienneteReprise() : 0;
            if (emp.getDateEmbauche() != null && !emp.getDateEmbauche().isBlank()) {
                try {
                    LocalDate dateEmb = LocalDate.parse(emp.getDateEmbauche().trim());
                    LocalDate dateRef = debutPeriode != null ? debutPeriode : LocalDate.now();
                    ansAnc += Math.max(0, java.time.Period.between(dateEmb, dateRef).getYears());
                } catch (Exception ignored) {}
            }
            if (ansAnc == 3) txAnc = new BigDecimal("5.00");
            else if (ansAnc > 3) txAnc = new BigDecimal(5 + (ansAnc - 3)).setScale(2, RoundingMode.HALF_UP);
            BigDecimal pAnc = money(calculatePercentage(salaireBase, txAnc));

            BigDecimal remuBruteNormale = money(salaireBase.add(surSalaire).add(pAnc).add(totIndem));
            BigDecimal plafondCnss = new BigDecimal("800000.00");

            if (remuBruteNormale.compareTo(plafondCnss) <= 0) {
                // Salaire entièrement couvert par la CNSS (0 FCFA de charge employeur banque)
                return null;
            }

            BigDecimal complementBrut = money(remuBruteNormale.subtract(plafondCnss));

            BulletinLine compLine = new BulletinLine();
            compLine.setCode("COMPL_MATERNITE");
            compLine.setLibelle("Complément Maternité - Dépassement Plafond CNSS 800 000 FCFA");
            compLine.setTypeLigne("GAIN");
            compLine.setBaseCalcul(remuBruteNormale);
            compLine.setTaux(new BigDecimal("100.00"));
            compLine.setMontant(complementBrut);
            compLine.setOrdre(1);

            int nbCharges = 0;
            try {
                nbCharges = Math.toIntExact(familleRepository.countByEmployeeIdAndEstChargeTrue(emp.getId()));
            } catch (Exception ignored) {}

            BigDecimal abattementForfaitaire = money(calculatePercentage(complementBrut, new BigDecimal("20.00")).min(new BigDecimal("75000.00")));
            BigDecimal baseImposable = money(complementBrut.subtract(abattementForfaitaire).max(BigDecimal.ZERO));
            BigDecimal iutsSansCharge = calculateIuts(baseImposable);
            BigDecimal tauxReduction = reductionRate(nbCharges);
            BigDecimal reductionIuts = money(iutsSansCharge.multiply(tauxReduction).divide(CENT, 8, RoundingMode.HALF_UP));
            BigDecimal impotIuts = money(iutsSansCharge.subtract(reductionIuts).max(BigDecimal.ZERO));

            BigDecimal netPayer = money(complementBrut.subtract(impotIuts));

            Contrat contrat = contratRepository.findFirstByEmployeeIdOrderByIdDesc(emp.getId()).orElse(null);
            Grade grade = emp.getGradeObj();
            String finalCode = generateBulletinCode(session, emp);

            Bulletin bulletin = prepareBulletinTarget(existingBulletin, finalCode);
            bulletin.setEmployee(emp);
            bulletin.setSessionPaie(session);
            bulletin.setGrade(grade);
            bulletin.setContrat(contrat);
            bulletin.setTypeSession("EXTRAORDINAIRE");
            bulletin.setNatureSession("DIFFERENTIEL_MATERNITE");
            bulletin.setDateFrom(debutPeriode);
            bulletin.setDateTo(finPeriode);
            bulletin.setScheduledWorkingDays(scheduledDays);
            bulletin.setWorkedDays(workedDays);
            bulletin.setSalaireBase(salaireBase);
            bulletin.setSurSalaire(surSalaire);
            bulletin.setTotalIndemnites(BigDecimal.ZERO);
            bulletin.setTotalAvoirs(BigDecimal.ZERO);
            bulletin.setSalaireBrut(complementBrut);
            bulletin.setTotalExonerations(BigDecimal.ZERO);
            bulletin.setAbattementForfaitaire(abattementForfaitaire);
            bulletin.setBaseImposable(baseImposable);
            bulletin.setCotisationCnss(BigDecimal.ZERO); // Plafond 800k déjà couvert par CNSS
            bulletin.setImpotIutsSansCharge(iutsSansCharge);
            bulletin.setReductionIutsCharge(reductionIuts);
            bulletin.setImpotIuts(impotIuts);
            bulletin.setTotalRetenuesSociales(BigDecimal.ZERO);
            bulletin.setTotalPrecomptes(BigDecimal.ZERO);
            bulletin.setTotalRetenues(impotIuts);
            bulletin.setTotalCotisationsPatronales(BigDecimal.ZERO);
            bulletin.setSalaireNet(netPayer);
            bulletin.setStatut("GENERE");
            bulletin.setDateCalcul(LocalDateTime.now());

            bulletin.addLine(compLine);
            if (impotIuts.compareTo(BigDecimal.ZERO) > 0) {
                BulletinLine iutsLine = new BulletinLine();
                iutsLine.setCode("IUTS");
                iutsLine.setLibelle("RETENUE IUTS");
                iutsLine.setTypeLigne("IMPOT");
                iutsLine.setBaseCalcul(baseImposable);
                iutsLine.setTaux(BigDecimal.valueOf(nbCharges));
                iutsLine.setMontant(impotIuts);
                iutsLine.setOrdre(21);
                bulletin.addLine(iutsLine);
            }

            bulletin = bulletinRepository.save(bulletin);
            return bulletin;
        }

        // ====================================================================
        // 5. SESSION EXTRAORDINAIRE : SOLDE DE TOUT COMPTE (STC)
        // Licenciement + Préavis + Congés acquis + 13e & 14e prorata - Prêts/Trop-perçus
        // ====================================================================
        if (isStc) {
            try {
                employeeProcessService.sync(emp, null, false);
            } catch (Exception e) {
                log.warn("Avertissement : échec synchronisation indemnités employé #{}: {}", emp.getId(), e.getMessage());
            }
            List<IndemniteEmploye> rawIndemnites = indemniteRepository.findByEmployeeId(emp.getId());

            BigDecimal sgm = getSalaireGlobalMensuelMoyen(emp.getId(), salaireBase, surSalaire, BigDecimal.ZERO, rawIndemnites);
            double ancienneteAns = getAncienneteExacte(emp, session);

            // 1. Détermination du Motif de Rupture
            String motifRupture = (existingBulletin != null && existingBulletin.getMotifRupture() != null && !existingBulletin.getMotifRupture().isBlank())
                    ? existingBulletin.getMotifRupture().trim().toUpperCase(Locale.ROOT)
                    : null;
            if (motifRupture == null && emp.getStatut() != null) {
                String st = emp.getStatut().trim().toUpperCase(Locale.ROOT);
                if (st.contains("RETRAITE")) motifRupture = "RETRAITE";
                else if (st.contains("DEMISSION")) motifRupture = "DEMISSION";
                else if (st.contains("CDD")) motifRupture = "FIN_CDD";
            }
            if (motifRupture == null) {
                motifRupture = "LICENCIEMENT_SIMPLE";
            }

            // 2. Détermination du Statut du Préavis
            String statutPreavis = (existingBulletin != null && existingBulletin.getStatutPreavis() != null && !existingBulletin.getStatutPreavis().isBlank())
                    ? existingBulletin.getStatutPreavis().trim().toUpperCase(Locale.ROOT)
                    : null;
            if (statutPreavis == null) {
                switch (motifRupture) {
                    case "LICENCIEMENT_FAUTE_LOURDE":
                    case "FIN_CDD":
                        statutPreavis = "NON_APPLICABLE";
                        break;
                    case "DEMISSION":
                        statutPreavis = "EFFECTUE";
                        break;
                    case "RETRAITE":
                        statutPreavis = "NON_APPLICABLE";
                        break;
                    case "LICENCIEMENT_SIMPLE":
                    case "LICENCIEMENT_ECONOMIQUE":
                    default:
                        statutPreavis = "DISPENSE_PAYE";
                        break;
                }
            }

            // 3. Indemnité de Rupture (Licenciement légal / Départ à la retraite)
            // Éligibilité : Ancienneté >= 1 an pour licenciement simple, économique ou retraite
            boolean ouvreDroitIndemniteRupture = "LICENCIEMENT_SIMPLE".equals(motifRupture)
                    || "LICENCIEMENT_ECONOMIQUE".equals(motifRupture)
                    || "RETRAITE".equals(motifRupture);

            BigDecimal indemniteLicenciement = BigDecimal.ZERO;
            if (ouvreDroitIndemniteRupture && ancienneteAns >= 1.0) {
                double t1Ans = Math.min(ancienneteAns, 5.0);
                double t2Ans = Math.max(0.0, Math.min(ancienneteAns - 5.0, 5.0));
                double t3Ans = Math.max(0.0, ancienneteAns - 10.0);

                BigDecimal part1 = money(sgm.multiply(BigDecimal.valueOf(t1Ans)).multiply(new BigDecimal("0.30")));
                BigDecimal part2 = money(sgm.multiply(BigDecimal.valueOf(t2Ans)).multiply(new BigDecimal("0.35")));
                BigDecimal part3 = money(sgm.multiply(BigDecimal.valueOf(t3Ans)).multiply(new BigDecimal("0.45")));
                indemniteLicenciement = money(part1.add(part2).add(part3));
            }

            // 4. Indemnité ou Retenue de Préavis
            boolean isCadre = false;
            if (emp.getCategorieObj() != null && emp.getCategorieObj().getLibelle() != null) {
                String cLib = emp.getCategorieObj().getLibelle().toUpperCase(Locale.ROOT);
                isCadre = cLib.contains("CADRE") || cLib.contains("DIRECTION");
            }
            if (!isCadre && emp.getGradeObj() != null && emp.getGradeObj().getLibelle() != null) {
                String gLib = emp.getGradeObj().getLibelle().toUpperCase(Locale.ROOT);
                isCadre = gLib.contains("CADRE") || gLib.contains("DIRECTEUR") || gLib.contains("CHEF");
            }
            int moisPreavis = isCadre ? 3 : 1;
            BigDecimal montantPreavisCalcul = money(sgm.multiply(BigDecimal.valueOf(moisPreavis)));

            BigDecimal indemnitePreavis = BigDecimal.ZERO;
            BigDecimal retenuePreavis = BigDecimal.ZERO;

            if ("DISPENSE_PAYE".equalsIgnoreCase(statutPreavis)) {
                indemnitePreavis = montantPreavisCalcul;
            } else if ("NON_EFFECTUE_SALARIE".equalsIgnoreCase(statutPreavis)) {
                retenuePreavis = montantPreavisCalcul;
            }

            // 5. Indemnité Compensatrice de Congés Acquis (ICCP)
            // Due dans tous les cas y compris faute lourde
            BigDecimal somme12 = getSommeRevenus12DerniersMois(emp.getId(), salaireBase.add(surSalaire));
            BigDecimal smj = somme12.divide(new BigDecimal("360"), 2, RoundingMode.HALF_UP);
            BigDecimal joursCongeAcquis = getJoursCongeAcquis(emp.getId());
            BigDecimal indemniteCongesAcquis = money(smj.multiply(joursCongeAcquis));

            // 6. 13ème et 14ème mois au prorata
            // Non dus en cas de faute lourde
            BigDecimal prorata13eme = BigDecimal.ZERO;
            BigDecimal prorata14eme = BigDecimal.ZERO;
            int moisDepart = 12;
            if (!"LICENCIEMENT_FAUTE_LOURDE".equalsIgnoreCase(motifRupture)) {
                if (emp.getId() != null) {
                    try {
                        List<Contrat> contrats = contratRepository.findByEmployeeId(emp.getId());
                        if (contrats != null && !contrats.isEmpty()) {
                            for (Contrat c : contrats) {
                                if (c.getDateFin() != null && !c.getDateFin().trim().isEmpty()) {
                                    LocalDate df = LocalDate.parse(c.getDateFin().trim());
                                    moisDepart = df.getMonthValue();
                                    break;
                                }
                            }
                        }
                    } catch (Exception ignored) {}
                }
                if (moisDepart == 12 && session != null && session.getDateTo() != null) {
                    moisDepart = session.getDateTo().getMonthValue();
                } else if (moisDepart == 12 && session != null && session.getMois() != null) {
                    try { moisDepart = parseMois(session.getMois()); } catch (Exception ignored) { moisDepart = 12; }
                }
                BigDecimal prorataMois = new BigDecimal(moisDepart).divide(new BigDecimal("12"), 6, RoundingMode.HALF_UP);
                prorata13eme = money((salaireBase.add(surSalaire)).multiply(prorataMois));
                prorata14eme = money((salaireBase.add(surSalaire)).multiply(prorataMois));
            }

            BigDecimal totalBrutStc = money(indemniteLicenciement
                    .add(indemnitePreavis)
                    .add(indemniteCongesAcquis)
                    .add(prorata13eme)
                    .add(prorata14eme));

            // 7. RÈGLES FISCALES & SOCIALES BURKINA FASO V3 :
            // Exonération totale (100%) IUTS et CNSS sur l'indemnité de licenciement ou de retraite !
            BigDecimal totalExonerations = indemniteLicenciement;

            // Éléments imposables / assujettis (Préavis versé + Congés payés + Prorata 13è/14è)
            BigDecimal brutSoumis = money(indemnitePreavis.add(indemniteCongesAcquis).add(prorata13eme).add(prorata14eme));
            BigDecimal baseCnss = BigDecimal.ZERO;
            BigDecimal cnssEmploye = BigDecimal.ZERO;
            BigDecimal cnssPatronale = BigDecimal.ZERO;
            BigDecimal abattement = BigDecimal.ZERO;
            BigDecimal baseImposable = BigDecimal.ZERO;
            BigDecimal iutsSansCharge = BigDecimal.ZERO;
            BigDecimal reductionIuts = BigDecimal.ZERO;
            BigDecimal impotIuts = BigDecimal.ZERO;

            if (brutSoumis.compareTo(BigDecimal.ZERO) > 0) {
                baseCnss = brutSoumis.min(new BigDecimal("800000.00"));
                cnssEmploye = money(baseCnss.multiply(new BigDecimal("0.055"))).min(new BigDecimal("44000.00"));
                cnssPatronale = money(baseCnss.multiply(new BigDecimal("0.16")));

                abattement = money(brutSoumis.multiply(new BigDecimal("0.20")).min(new BigDecimal("75000.00")));
                baseImposable = money(brutSoumis.subtract(cnssEmploye).subtract(abattement).max(BigDecimal.ZERO));

                int nbCharges = 0;
                try {
                    nbCharges = Math.toIntExact(familleRepository.countByEmployeeIdAndEstChargeTrue(emp.getId()));
                } catch (Exception ignored) {}
                iutsSansCharge = calculateIuts(baseImposable);
                BigDecimal tauxReduction = reductionRate(nbCharges);
                reductionIuts = money(iutsSansCharge.multiply(tauxReduction).divide(CENT, 8, RoundingMode.HALF_UP));
                impotIuts = money(iutsSansCharge.subtract(reductionIuts).max(BigDecimal.ZERO));
            }

            List<BulletinLine> lines = new ArrayList<>();
            int ordre = 1;

            // Gains
            if (indemniteLicenciement.compareTo(BigDecimal.ZERO) > 0) {
                BulletinLine lLic = new BulletinLine();
                if ("RETRAITE".equalsIgnoreCase(motifRupture)) {
                    lLic.setCode("IND_RETRAITE");
                    lLic.setLibelle("Indemnité de Départ à la Retraite - " + String.format(Locale.US, "%.1f", ancienneteAns) + " ans");
                } else {
                    lLic.setCode("IND_LICENC");
                    lLic.setLibelle("Indemnité de Licenciement - " + String.format(Locale.US, "%.1f", ancienneteAns) + " ans");
                }
                lLic.setTypeLigne("GAIN");
                lLic.setBaseCalcul(sgm);
                lLic.setTaux(BigDecimal.valueOf(ancienneteAns));
                lLic.setMontant(indemniteLicenciement);
                lLic.setOrdre(ordre++);
                lines.add(lLic);
            }

            if (indemnitePreavis.compareTo(BigDecimal.ZERO) > 0) {
                BulletinLine lPreav = new BulletinLine();
                lPreav.setCode("IND_PREAVIS");
                lPreav.setLibelle("Indemnité Compensatrice de Préavis - " + moisPreavis + " mois");
                lPreav.setTypeLigne("GAIN");
                lPreav.setBaseCalcul(sgm);
                lPreav.setTaux(BigDecimal.valueOf(moisPreavis));
                lPreav.setMontant(indemnitePreavis);
                lPreav.setOrdre(ordre++);
                lines.add(lPreav);
            }

            if (indemniteCongesAcquis.compareTo(BigDecimal.ZERO) > 0) {
                BulletinLine lCp = new BulletinLine();
                lCp.setCode("IND_CP_ACQUIS");
                lCp.setLibelle("Indemnité Compensatrice de Congés Acquis - " + formatMoneyNoDec(joursCongeAcquis) + " j");
                lCp.setTypeLigne("GAIN");
                lCp.setBaseCalcul(smj);
                lCp.setTaux(joursCongeAcquis);
                lCp.setMontant(indemniteCongesAcquis);
                lCp.setOrdre(ordre++);
                lines.add(lCp);
            }

            if (prorata13eme.compareTo(BigDecimal.ZERO) > 0) {
                BulletinLine l13P = new BulletinLine();
                l13P.setCode("PRORATA_13EME");
                l13P.setLibelle("13ème Mois au Prorata " + moisDepart + "/12");
                l13P.setTypeLigne("GAIN");
                l13P.setBaseCalcul(salaireBase.add(surSalaire));
                BigDecimal prorataMois = new BigDecimal(moisDepart).divide(new BigDecimal("12"), 6, RoundingMode.HALF_UP);
                l13P.setTaux(prorataMois.multiply(CENT));
                l13P.setMontant(prorata13eme);
                l13P.setOrdre(ordre++);
                lines.add(l13P);
            }

            if (prorata14eme.compareTo(BigDecimal.ZERO) > 0) {
                BulletinLine l14P = new BulletinLine();
                l14P.setCode("PRORATA_14EME");
                l14P.setLibelle("14ème Mois au Prorata " + moisDepart + "/12");
                l14P.setTypeLigne("GAIN");
                l14P.setBaseCalcul(salaireBase.add(surSalaire));
                BigDecimal prorataMois = new BigDecimal(moisDepart).divide(new BigDecimal("12"), 6, RoundingMode.HALF_UP);
                l14P.setTaux(prorataMois.multiply(CENT));
                l14P.setMontant(prorata14eme);
                l14P.setOrdre(ordre++);
                lines.add(l14P);
            }

            // Cotisations & Impôts
            if (cnssEmploye.compareTo(BigDecimal.ZERO) > 0 || cnssPatronale.compareTo(BigDecimal.ZERO) > 0) {
                BulletinLine cnssLine = new BulletinLine();
                cnssLine.setCode("COT_CNSS");
                cnssLine.setLibelle("Cotisation CNSS 5.5%");
                cnssLine.setTypeLigne("RETENUE_SOCIALE");
                cnssLine.setBaseCalcul(baseCnss);
                cnssLine.setTaux(new BigDecimal("5.50"));
                cnssLine.setMontant(cnssEmploye);
                cnssLine.setPartPatronale(cnssPatronale);
                cnssLine.setOrdre(ordre++);
                lines.add(cnssLine);
            }

            BigDecimal baseTpaStc = brutSoumis != null && brutSoumis.compareTo(BigDecimal.ZERO) > 0 ? brutSoumis : totalBrutStc;
            BigDecimal tpaPatronale = money(baseTpaStc.multiply(new BigDecimal("0.03")));
            if (tpaPatronale.compareTo(BigDecimal.ZERO) > 0) {
                BulletinLine tpaLine = new BulletinLine();
                tpaLine.setCode("TPA_PAT");
                tpaLine.setLibelle("TAXE PATRONALE D'APPRENTISSAGE (TPA 3%)");
                tpaLine.setTypeLigne("COTISATION_PATRONALE");
                tpaLine.setBaseCalcul(baseTpaStc);
                tpaLine.setTaux(new BigDecimal("3.00"));
                tpaLine.setMontant(BigDecimal.ZERO);
                tpaLine.setPartPatronale(tpaPatronale);
                tpaLine.setOrdre(ordre++);
                lines.add(tpaLine);
            }

            if (impotIuts.compareTo(BigDecimal.ZERO) > 0) {
                int nbCharges = 0;
                try {
                    nbCharges = Math.toIntExact(familleRepository.countByEmployeeIdAndEstChargeTrue(emp.getId()));
                } catch (Exception ignored) {}
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

            // 7.bis Retenue Fonds de Soutien Patriotique (FSP 1% sur le net imposable / cédulaire)
            BigDecimal baseFsp = money(brutSoumis.subtract(cnssEmploye).subtract(impotIuts).max(BigDecimal.ZERO));
            if (baseFsp.compareTo(BigDecimal.ZERO) == 0 && totalBrutStc.compareTo(BigDecimal.ZERO) > 0) {
                baseFsp = money(totalBrutStc.subtract(cnssEmploye).subtract(impotIuts).max(BigDecimal.ZERO));
            }
            BigDecimal fspMontant = BigDecimal.ZERO;
            if (baseFsp.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal tauxFsp = new BigDecimal("1.00");
                fspMontant = money(calculatePercentage(baseFsp, tauxFsp));
                BulletinLine fspLine = new BulletinLine();
                fspLine.setCode("RET_FSP");
                fspLine.setLibelle("Fonds de Soutien Patriotique - FSP 1%");
                fspLine.setTypeLigne("RETENUE_SOCIALE");
                fspLine.setBaseCalcul(baseFsp);
                fspLine.setTaux(tauxFsp);
                fspLine.setMontant(fspMontant);
                fspLine.setOrdre(ordre++);
                lines.add(fspLine);
            }

            // Retenue Préavis non effectué par le salarié
            if (retenuePreavis.compareTo(BigDecimal.ZERO) > 0) {
                BulletinLine retPreavLine = new BulletinLine();
                retPreavLine.setCode("RET_PREAVIS");
                retPreavLine.setLibelle("Préavis non effectué par le salarié - " + moisPreavis + " mois");
                retPreavLine.setTypeLigne("RETENUE");
                retPreavLine.setBaseCalcul(sgm);
                retPreavLine.setTaux(BigDecimal.valueOf(moisPreavis));
                retPreavLine.setMontant(retenuePreavis);
                retPreavLine.setOrdre(ordre++);
                lines.add(retPreavLine);
            }

            // Déduction intégrale des prêts et précomptes
            BigDecimal totalPrecomptesStc = BigDecimal.ZERO;
            List<PrecompteEmploye> precomptes = precompteRepository.findByEmployeeIdAndStatut(emp.getId(), "ACTIF");
            for (PrecompteEmploye prec : precomptes) {
                BigDecimal soldePret = prec.getMontantRestant() != null ? prec.getMontantRestant() : BigDecimal.ZERO;
                if (soldePret.compareTo(BigDecimal.ZERO) > 0) {
                    totalPrecomptesStc = totalPrecomptesStc.add(soldePret);
                    BulletinLine pLine = new BulletinLine();
                    pLine.setRubriquePaie(prec.getRubriquePaie());
                    pLine.setCode("PREC_" + prec.getId());
                    pLine.setLibelle(prec.getLibelle() + " - Solde Intégral STC");
                    pLine.setTypeLigne("PRECOMPTE");
                    pLine.setBaseCalcul(prec.getMontantInitial());
                    pLine.setMontant(soldePret);
                    pLine.setOrdre(ordre++);
                    lines.add(pLine);
                }
            }

            List<Precompte> precomptesVariables = precompteVariableRepository.findByEmployeeIdAndStatutIn(emp.getId(), java.util.List.of("EN_COURS", "ACTIF"));
            for (Precompte prec : precomptesVariables) {
                BigDecimal solde = prec.getMontantRestant() != null ? prec.getMontantRestant() : prec.getAmount();
                if (solde != null && solde.compareTo(BigDecimal.ZERO) > 0) {
                    totalPrecomptesStc = totalPrecomptesStc.add(solde);
                    BulletinLine pLine = new BulletinLine();
                    pLine.setCode(prec.getSalaryElement() != null ? prec.getSalaryElement().getCode() : "PREC_" + prec.getId());
                    pLine.setLibelle((prec.getSalaryElement() != null ? prec.getSalaryElement().getName() : "Précompte") + " - Solde Intégral STC");
                    pLine.setTypeLigne("PRECOMPTE");
                    pLine.setBaseCalcul(prec.getAmount());
                    pLine.setMontant(solde);
                    pLine.setOrdre(ordre++);
                    lines.add(pLine);
                }
            }

            // Déduction des Trop-perçus
            List<TropPercu> tropPercus = tropPercuRepository.findByEmployeeIdAndStatut(emp.getId(), "EN_ATTENTE");
            for (TropPercu tp : tropPercus) {
                if (tp.getAmount() != null && tp.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                    totalPrecomptesStc = totalPrecomptesStc.add(tp.getAmount());
                    BulletinLine tpLine = new BulletinLine();
                    tpLine.setCode(tp.getSalaryElement() != null ? tp.getSalaryElement().getCode() : "RET_TROP_PERCU");
                    tpLine.setLibelle("Régularisation Trop-Perçu STC");
                    tpLine.setTypeLigne("RETENUE");
                    tpLine.setBaseCalcul(tp.getAmount());
                    tpLine.setMontant(tp.getAmount());
                    tpLine.setOrdre(ordre++);
                    lines.add(tpLine);
                }
            }

            BigDecimal totalRetenues = money(cnssEmploye.add(impotIuts).add(fspMontant).add(totalPrecomptesStc).add(retenuePreavis));
            BigDecimal salaireNet = money(totalBrutStc.subtract(totalRetenues));

            Contrat contrat = contratRepository.findFirstByEmployeeIdOrderByIdDesc(emp.getId()).orElse(null);
            Grade grade = emp.getGradeObj();
            String finalCode = generateBulletinCode(session, emp);

            Bulletin bulletin = prepareBulletinTarget(existingBulletin, finalCode);
            bulletin.setEmployee(emp);
            bulletin.setSessionPaie(session);
            bulletin.setGrade(grade);
            bulletin.setContrat(contrat);
            bulletin.setTypeSession("EXTRAORDINAIRE");
            bulletin.setNatureSession("STC");
            bulletin.setDateFrom(debutPeriode);
            bulletin.setDateTo(finPeriode);
            bulletin.setScheduledWorkingDays(scheduledDays);
            bulletin.setWorkedDays(workedDays);
            bulletin.setSalaireBase(salaireBase);
            bulletin.setSurSalaire(surSalaire);
            bulletin.setTotalIndemnites(money(totalBrutStc.subtract(prorata13eme).subtract(prorata14eme)));
            bulletin.setTotalAvoirs(BigDecimal.ZERO);
            bulletin.setSalaireBrut(totalBrutStc);
            bulletin.setTotalExonerations(indemniteLicenciement);
            bulletin.setAbattementForfaitaire(abattement);
            bulletin.setBaseImposable(baseImposable);
            bulletin.setCotisationCnss(cnssEmploye);
            bulletin.setImpotIutsSansCharge(iutsSansCharge);
            bulletin.setReductionIutsCharge(reductionIuts);
            bulletin.setImpotIuts(impotIuts);
            bulletin.setTotalRetenuesSociales(money(cnssEmploye.add(fspMontant)));
            bulletin.setTotalPrecomptes(money(totalPrecomptesStc.add(retenuePreavis)));
            bulletin.setTotalRetenues(totalRetenues);
            bulletin.setTotalCotisationsPatronales(cnssPatronale.add(tpaPatronale));
            bulletin.setSalaireNet(salaireNet);
            bulletin.setStatut("GENERE");
            bulletin.setDateCalcul(LocalDateTime.now());

            bulletin.setMotifRupture(motifRupture);
            bulletin.setStatutPreavis(statutPreavis);
            bulletin.setMontantIndemniteLicenciement(indemniteLicenciement);
            bulletin.setMontantIndemnitePreavis(indemnitePreavis);
            bulletin.setMontantIndemniteConges(indemniteCongesAcquis);

            for (BulletinLine l : lines) {
                bulletin.addLine(l);
            }
            bulletin = bulletinRepository.save(bulletin);
            return bulletin;
        }

        // Indemnités - synchronisation dynamique automatique avec le poste, la fonction et le grade de l'agent
        try {
            employeeProcessService.sync(emp, null, false);
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

        if (is13Ou14eme) {
            indemnites = new ArrayList<>();
            totalIndemnites = BigDecimal.ZERO;
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
        // Règle formelle : les 13ème et 14ème mois ne cotisent JAMAIS à la CNSS (0 FCFA d'office)
        BigDecimal baseCnss;
        BigDecimal cotisationCnss;
        if (is13Ou14eme) {
            baseCnss = BigDecimal.ZERO;
            cotisationCnss = BigDecimal.ZERO;
            cnssPlafondAtteint = true;
        } else if (isExtra && cnssPlafondAtteint) {
            baseCnss = BigDecimal.ZERO;
            cotisationCnss = BigDecimal.ZERO;
        } else if (isExtra && baseCnssDejaCotisee.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal plafondRestant = new BigDecimal("800000.00").subtract(baseCnssDejaCotisee).max(BigDecimal.ZERO);
            baseCnss = remunerationBrute.min(plafondRestant);
            BigDecimal plafondCotisRestant = new BigDecimal("44000.00").subtract(totalCnssDejaCotisee).max(BigDecimal.ZERO);
            cotisationCnss = money(calculatePercentage(baseCnss, new BigDecimal("5.50"))).min(plafondCotisRestant);
        } else {
            baseCnss = remunerationBrute.min(new BigDecimal("800000.00"));
            cotisationCnss = money(calculatePercentage(baseCnss, new BigDecimal("5.50"))).min(new BigDecimal("44000.00"));
        }

        // Base CRRAE = Salaire de Base + Sur-salaire + Prime d'ancienneté
        BigDecimal baseCrrae = money(salaireBase.add(surSalaire).add(primeAnciennete));

        // Cascade BPBF (Calculatrice de paie officielle)
        // 1. Rabattement Sécurité Sociale = 8% du Salaire de Base
        BigDecimal rabattementSecu = money(salaireBase.multiply(new BigDecimal("0.08")));
        // 2. Base de déductions pour exonérations = Total Brut - Rabattement Sécu
        BigDecimal baseDeductions = money(remunerationBrute.subtract(rabattementSecu).max(BigDecimal.ZERO));

        // Exonérations fiscales : calcul dynamique sur Base de déductions (CGI BF Art. 106 / Circulaire BPBF)
        BigDecimal totalExonerations = BigDecimal.ZERO;
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
                // Taux appliqué sur la Base de déductions (Total Brut - Rabattement Sécu 8%), plafonné par le plafond et le montant de l'indemnité
                BigDecimal limiteTheorique = (tauxExo.compareTo(BigDecimal.ZERO) > 0)
                        ? calculatePercentage(baseDeductions, tauxExo)
                        : mIndem;
                if (plafondExo.compareTo(BigDecimal.ZERO) > 0) {
                    limiteTheorique = limiteTheorique.min(plafondExo);
                }
                BigDecimal exo = mIndem.min(limiteTheorique);
                totalExonerations = totalExonerations.add(money(exo));

                // Alignement automatique de la table de persistance exoneration_employe
                try {
                    ExonerationEmploye exoEntity = exonerationRepository.findByIndemniteEmployeId(ind.getId())
                            .orElseGet(ExonerationEmploye::new);
                    exoEntity.setEmployee(emp);
                    exoEntity.setTypeIndemnite(type);
                    exoEntity.setIndemniteEmploye(ind);
                    exoEntity.setLibelle(type.getName());
                    exoEntity.setTauxExonere(tauxExo.doubleValue());
                    exoEntity.setPlafondExonere(plafondExo.doubleValue());
                    exoEntity.setMontantAutorise(limiteTheorique.doubleValue());
                    exoEntity.setMontant(exo.doubleValue());
                    exonerationRepository.save(exoEntity);
                } catch (Exception ignored) {}
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
        BigDecimal baseAbattement = money(salaireBase.add(surSalaire).add(primeAnciennete));
        BigDecimal abattementCalcule = calculatePercentage(baseAbattement, rawAbat);
        BigDecimal abattementForfaitaire = money(abattementCalcule.min(new BigDecimal("75000.00")));

        // Base Imposable IUTS conforme au CGI Burkina Faso / Circulaire BPBF : Brut - (Rabattement Sécu + Exonérations + Abattement forfaitaire)
        BigDecimal totalRabattements = rabattementSecu.add(totalExonerations).add(abattementForfaitaire);
        BigDecimal baseImposable = money(remunerationBrute.subtract(totalRabattements).max(BigDecimal.ZERO));

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

        // Ligne Salaire de Base : résolution dynamique depuis salary_element (stocké en base)
        SalaryElement salBaseElem = findSalaryElement("CAT_SAL_BASE", "BASE", "sal_base", "salaire_base", "sal_mensuel", "salbase");
        String salBaseCode = (salBaseElem != null && salBaseElem.getCode() != null) ? salBaseElem.getCode() : "sal_base";
        String salBaseLibelle = (salBaseElem != null && salBaseElem.getName() != null && !salBaseElem.getName().isBlank())
                ? salBaseElem.getName()
                : "SALAIRE DE BASE";
        Integer salBaseOrdre = (salBaseElem != null && salBaseElem.getOrdre() != null) ? salBaseElem.getOrdre() : ordre++;

        BulletinLine salBaseLine = new BulletinLine();
        salBaseLine.setCode(salBaseCode);
        salBaseLine.setLibelle(salBaseLibelle);
        salBaseLine.setTypeLigne("GAIN");
        salBaseLine.setBaseCalcul(salaireBasePlein);
        salBaseLine.setTaux(workedDays != null ? workedDays : new BigDecimal("30.00"));
        salBaseLine.setMontant(salaireBase);
        salBaseLine.setOrdre(salBaseOrdre);
        lines.add(salBaseLine);

        // Ligne Sur-salaire : résolution dynamique depuis salary_element
        SalaryElement surSalElem = findSalaryElement(null, "SURSALAIRE", "SUR_SALAIRE", "SURSALAIRE");
        String surSalCode = (surSalElem != null && surSalElem.getCode() != null) ? surSalElem.getCode() : "SUR_SALAIRE";
        String surSalLibelle = (surSalElem != null && surSalElem.getName() != null && !surSalElem.getName().isBlank())
                ? surSalElem.getName()
                : "Sur-salaire";
        Integer surSalOrdre = (surSalElem != null && surSalElem.getOrdre() != null) ? surSalElem.getOrdre() : ordre++;

        if (surSalaire.compareTo(BigDecimal.ZERO) > 0 || (surSalairePlein != null && surSalairePlein.compareTo(BigDecimal.ZERO) > 0 && workedDays != null && workedDays.compareTo(BigDecimal.ZERO) > 0)) {
            BulletinLine surSalLine = new BulletinLine();
            surSalLine.setCode(surSalCode);
            surSalLine.setLibelle(surSalLibelle);
            surSalLine.setTypeLigne("GAIN");
            surSalLine.setBaseCalcul(surSalairePlein);
            surSalLine.setTaux(workedDays != null ? workedDays : new BigDecimal("30.00"));
            surSalLine.setMontant(surSalaire);
            surSalLine.setOrdre(surSalOrdre);
            lines.add(surSalLine);
        }

        // Ligne Prime d'ancienneté : résolution dynamique depuis salary_element
        SalaryElement ancElem = findSalaryElement("CAT_PRIMES", "ANCIENNETE", "PRIME_ANC", "PRIME_ANCIENNETE");
        String ancCode = (ancElem != null && ancElem.getCode() != null) ? ancElem.getCode() : "PRIME_ANC";
        String ancLibelle = (ancElem != null && ancElem.getName() != null && !ancElem.getName().isBlank())
                ? ancElem.getName()
                : "PRIME D'ANCIENNETE";
        Integer ancOrdre = (ancElem != null && ancElem.getOrdre() != null) ? ancElem.getOrdre() : ordre++;

        if (primeAnciennete != null && primeAnciennete.compareTo(BigDecimal.ZERO) > 0) {
            BulletinLine ancLine = new BulletinLine();
            ancLine.setCode(ancCode);
            ancLine.setLibelle(ancLibelle);
            ancLine.setTypeLigne("GAIN");
            ancLine.setBaseCalcul(salaireBase);
            ancLine.setTaux(tauxAnciennete != null ? tauxAnciennete : BigDecimal.ZERO);
            ancLine.setMontant(primeAnciennete);
            ancLine.setOrdre(ancOrdre);
            lines.add(ancLine);
        }

        // Lignes Indemnités avec gestion plafond congé maternité
        for (IndemniteEmploye ind : indemnites) {
            BigDecimal mIndem = money(ind.getMontant()).multiply(ratio);
            String indCode = ind.getTypeIndemnite() != null ? ind.getTypeIndemnite().getCode() : "INDEMNITE";
            String rawLib = ind.getLibelle() != null ? ind.getLibelle() : (ind.getTypeIndemnite() != null ? ind.getTypeIndemnite().getName() : "Indemnité");
            String indLib = rawLib.toUpperCase(Locale.ROOT).trim();

            // Résolution dynamique depuis salary_element (paie/parametrage/elements)
            SalaryElement indElem = findSalaryElement("CAT_INDEMNITES", rawLib, indCode);
            if (indElem != null) {
                if (indElem.getCode() != null && !indElem.getCode().isBlank()) {
                    indCode = indElem.getCode();
                }
                if (indElem.getName() != null && !indElem.getName().isBlank()) {
                    indLib = indElem.getName();
                }
            }

            boolean isMaternite = (indCode != null && indCode.toUpperCase(Locale.ROOT).contains("MATERN")) ||
                                  (indLib.toUpperCase(Locale.ROOT).contains("MATERN"));

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
                BigDecimal tauxAffichage = null;
                String c = indCode != null ? indCode.toUpperCase(Locale.ROOT) : "";
                String l = indLib != null ? indLib.toUpperCase(Locale.ROOT) : "";
                if (c.contains("CP") || l.contains("CASH") || c.contains("SAL_BASE") || c.contains("SUR_SALAIRE")) {
                    tauxAffichage = workedDays != null ? workedDays : new BigDecimal("30.00");
                } else if (c.contains("LOG") || l.contains("LOGEMENT")) {
                    TypeIndemnite ti = ind.getTypeIndemnite();
                    tauxAffichage = (ti != null && ti.getTauxExoneration() != null && ti.getTauxExoneration() > 0)
                            ? money(BigDecimal.valueOf(ti.getTauxExoneration()))
                            : new BigDecimal("20.00");
                } else if (c.contains("TRP") || l.contains("TRANSPORT")) {
                    TypeIndemnite ti = ind.getTypeIndemnite();
                    tauxAffichage = (ti != null && ti.getTauxExoneration() != null && ti.getTauxExoneration() > 0)
                            ? money(BigDecimal.valueOf(ti.getTauxExoneration()))
                            : new BigDecimal("5.00");
                } else if (c.contains("CAISSE") || l.contains("CAISSE")) {
                    TypeIndemnite ti = ind.getTypeIndemnite();
                    tauxAffichage = (ti != null && ti.getTauxExoneration() != null && ti.getTauxExoneration() > 0)
                            ? money(BigDecimal.valueOf(ti.getTauxExoneration()))
                            : new BigDecimal("5.00");
                } else if (c.contains("SUJ") || l.contains("SUJ") || l.contains("SUJETION") || l.contains("SUJÉTION")) {
                    TypeIndemnite ti = ind.getTypeIndemnite();
                    tauxAffichage = (ti != null && ti.getTauxExoneration() != null && ti.getTauxExoneration() > 0)
                            ? money(BigDecimal.valueOf(ti.getTauxExoneration()))
                            : new BigDecimal("5.00");
                } else {
                    TypeIndemnite ti = ind.getTypeIndemnite();
                    if (ti == null && typeIndemniteRepository != null) {
                        ti = findTypeIndemniteDynamic(indCode, indLib);
                    }
                    if (ti != null && ti.getTauxExoneration() != null && ti.getTauxExoneration() > 0) {
                        tauxAffichage = money(BigDecimal.valueOf(ti.getTauxExoneration()));
                    }
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

        // Lignes Avoirs (Rappels) : uniquement si configuré et montant > 0 pour l'employé
        for (AvoirEmploye av : avoirs) {
            if (av.getMontantMensuel() != null && av.getMontantMensuel().compareTo(BigDecimal.ZERO) > 0) {
                BulletinLine avLine = new BulletinLine();
                avLine.setRubriquePaie(av.getRubriquePaie());
                avLine.setCode("AVOIR_" + av.getId());
                avLine.setLibelle(av.getLibelle());
                avLine.setTypeLigne("GAIN");
                avLine.setBaseCalcul(av.getMontantInitial());
                avLine.setMontant(av.getMontantMensuel());
                avLine.setOrdre(ordre++);
                lines.add(avLine);
            }
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
                avLine.setTaux(null);
                avLine.setMontant(m);
                avLine.setOrdre(ordre++);
                lines.add(avLine);
            }
        }

        // Lignes Retenues Sociales & Patronales contractuelles / autres (hors éléments standardisés)
        for (Retenue ret : applicableRetenues) {
            if (ret == null || isIuts(ret)) continue;

            String rCode = ret.getCode() != null ? ret.getCode().toUpperCase(Locale.ROOT) : "";
            String rLib = ret.getLibelle() != null ? ret.getLibelle().toUpperCase(Locale.ROOT) : "";

            // Les éléments standardisés (CRRAE, CNSS, FSP, TPA, IUTS) sont gérés de manière dynamique et unique via salary_element ci-dessous
            if (rCode.contains("CRRAE") || rLib.contains("CRRAE")
                    || rCode.contains("CNSS") || rLib.contains("CNSS") || rCode.contains("SECU") || rLib.contains("SECURITE")
                    || rCode.contains("SOLIDAR") || rLib.contains("SOLIDAR") || rCode.contains("FSP") || rLib.contains("FSP")
                    || rCode.contains("TPA") || rLib.contains("TPA")) {
                continue;
            }

            boolean employeur = isEmployeur(ret);
            BigDecimal base = resolveBase(ret.getBaseCalcul(), salaireBase, surSalaire, primeAnciennete, remunerationBrute, baseImposable);
            BigDecimal taux = money(ret.getTaux());
            BigDecimal montant = money(calculatePercentage(base, taux));

            BulletinLine retLine = new BulletinLine();
            retLine.setCode(ret.getCode() != null ? ret.getCode() : "RETENUE");
            retLine.setLibelle(ret.getLibelle() != null ? ret.getLibelle() : "Retenue");
            retLine.setBaseCalcul(base);
            retLine.setTaux(taux);

            if (employeur) {
                retLine.setTypeLigne("COTISATION_PATRONALE");
                retLine.setMontant(BigDecimal.ZERO);
                retLine.setPartPatronale(montant);
                retLine.setOrdre(ordre++);
                lines.add(retLine);
                totalCotisationsPatronales = totalCotisationsPatronales.add(montant);
            } else {
                totalRetenuesSociales = totalRetenuesSociales.add(montant);
                retLine.setTypeLigne("RETENUE_SOCIALE");
                retLine.setMontant(montant);
                retLine.setPartPatronale(BigDecimal.ZERO);
                retLine.setOrdre(ordre++);
                lines.add(retLine);
            }
        }

        // ====================================================================
        // GESTION DYNAMIQUE DES COTISATIONS & RETENUES DEPUIS SALARY_ELEMENT
        // (Lecture directe des enregistrements stockés en base, sans redondance)
        // ====================================================================

        // 1. COTISATION CNSS SALARIALE (5.5% plafonnée à 800 000 FCFA sur Salaire Brut)
        SalaryElement cnssSalParam = findSalaryElement("CAT_COTIS_SOC", "CNSS", "COTIS_CNSS", "RET-001");
        String cnssSalCode = (cnssSalParam != null && cnssSalParam.getCode() != null) ? cnssSalParam.getCode() : "COTIS_CNSS";
        String cnssSalLibelle = (cnssSalParam != null && cnssSalParam.getName() != null && !cnssSalParam.getName().isBlank())
                ? cnssSalParam.getName()
                : "COTISATION CNSS";
        BigDecimal tauxCnssSal = (cnssSalParam != null && cnssSalParam.getRate() != null && cnssSalParam.getRate().compareTo(BigDecimal.ZERO) > 0)
                ? cnssSalParam.getRate()
                : new BigDecimal("5.50");
        Integer cnssSalOrdre = (cnssSalParam != null && cnssSalParam.getOrdre() != null) ? cnssSalParam.getOrdre() : ordre++;

        if (!is13Ou14eme && !(isExtra && cnssPlafondAtteint) && cotisationCnss.compareTo(BigDecimal.ZERO) > 0) {
            BulletinLine cnssLine = new BulletinLine();
            cnssLine.setCode(cnssSalCode);
            cnssLine.setLibelle(cnssSalLibelle);
            cnssLine.setTypeLigne("RETENUE_SOCIALE");
            cnssLine.setBaseCalcul(baseCnss);
            cnssLine.setTaux(tauxCnssSal);
            cnssLine.setMontant(cotisationCnss);
            cnssLine.setPartPatronale(BigDecimal.ZERO);
            cnssLine.setOrdre(cnssSalOrdre);
            lines.add(cnssLine);

            totalRetenuesSociales = totalRetenuesSociales.add(cotisationCnss);
        }

        // 2. CHARGES PATRONALES CNSS (16% plafonnée à 800 000 FCFA sur Salaire Brut)
        SalaryElement cnssPatParam = findSalaryElement("CAT_CHG_PATRONALES", "CNSS", "CHG_PAT_CNSS", "COT_PAT_CNSS", "RET-002");
        String cnssPatCode = (cnssPatParam != null && cnssPatParam.getCode() != null) ? cnssPatParam.getCode() : "CHG_PAT_CNSS";
        String cnssPatLibelle = (cnssPatParam != null && cnssPatParam.getName() != null && !cnssPatParam.getName().isBlank())
                ? cnssPatParam.getName()
                : "Charges patronales CNSS";
        BigDecimal tauxCnssPat = (cnssPatParam != null && cnssPatParam.getRate() != null && cnssPatParam.getRate().compareTo(BigDecimal.ZERO) > 0)
                ? cnssPatParam.getRate()
                : new BigDecimal("16.00");
        Integer cnssPatOrdre = (cnssPatParam != null && cnssPatParam.getOrdre() != null) ? cnssPatParam.getOrdre() : 26;
        BigDecimal cnssPatronale = money(baseCnss.multiply(tauxCnssPat.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP)));

        if (!is13Ou14eme && !(isExtra && cnssPlafondAtteint) && cnssPatronale.compareTo(BigDecimal.ZERO) > 0) {
            BulletinLine cnssPatLine = new BulletinLine();
            cnssPatLine.setCode(cnssPatCode);
            cnssPatLine.setLibelle(cnssPatLibelle);
            cnssPatLine.setTypeLigne("COTISATION_PATRONALE");
            cnssPatLine.setBaseCalcul(baseCnss);
            cnssPatLine.setTaux(tauxCnssPat);
            cnssPatLine.setMontant(BigDecimal.ZERO);
            cnssPatLine.setPartPatronale(cnssPatronale);
            cnssPatLine.setOrdre(cnssPatOrdre);
            lines.add(cnssPatLine);

            totalCotisationsPatronales = totalCotisationsPatronales.add(cnssPatronale);
        }

        // 3. COTISATION CRRAE SALARIALE (6% sur baseCrrae = SB + SS + Prime Anc)
        SalaryElement crraeSalElem = findSalaryElement("CAT_COTIS_SOC", "CRRAE", "COTIS_CRRAE", "RET-005");
        String crraeSalCode = (crraeSalElem != null && crraeSalElem.getCode() != null) ? crraeSalElem.getCode() : "COTIS_CRRAE";
        String crraeSalLibelle = (crraeSalElem != null && crraeSalElem.getName() != null && !crraeSalElem.getName().isBlank())
                ? crraeSalElem.getName()
                : "COTISATION CRRAE/RCPNC";
        BigDecimal tauxCrraeSal = (crraeSalElem != null && crraeSalElem.getRate() != null && crraeSalElem.getRate().compareTo(BigDecimal.ZERO) > 0)
                ? crraeSalElem.getRate()
                : new BigDecimal("6.00");
        Integer crraeSalOrdre = (crraeSalElem != null && crraeSalElem.getOrdre() != null) ? crraeSalElem.getOrdre() : ordre++;

        if (!isExtra && baseCrrae.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal montantCrraeSal = money(calculatePercentage(baseCrrae, tauxCrraeSal));
            totalRetenuesSociales = totalRetenuesSociales.add(montantCrraeSal);

            BulletinLine crraeLine = new BulletinLine();
            crraeLine.setCode(crraeSalCode);
            crraeLine.setLibelle(crraeSalLibelle);
            crraeLine.setTypeLigne("RETENUE_SOCIALE");
            crraeLine.setBaseCalcul(baseCrrae);
            crraeLine.setTaux(tauxCrraeSal);
            crraeLine.setMontant(montantCrraeSal);
            crraeLine.setPartPatronale(BigDecimal.ZERO);
            crraeLine.setOrdre(crraeSalOrdre);
            lines.add(crraeLine);
        }

        // 4. CHARGE PATRONALE CRRAE (Résolution souple : CHG_PAT_CRRAE ou COT_CRRAE)
        SalaryElement crraeParam = findCrraePatronaleElement();
        String codePat = (crraeParam != null && crraeParam.getCode() != null) ? crraeParam.getCode() : "COT_CRRAE";
        String libellePat = (crraeParam != null && crraeParam.getName() != null && !crraeParam.getName().isBlank()) 
                ? crraeParam.getName() 
                : "Charges patronale CRRAE";
        String formulePat = (crraeParam != null && crraeParam.getFormule() != null && !crraeParam.getFormule().isBlank()) 
                ? crraeParam.getFormule() 
                : "(SAL_BASE + SUR_SALAIRE)*0,1";

        BigDecimal tauxPat = (crraeParam != null && crraeParam.getRate() != null && crraeParam.getRate().compareTo(BigDecimal.ZERO) > 0)
                ? crraeParam.getRate()
                : new BigDecimal("10.00");

        BigDecimal montantPat = evaluateComplexFormula(formulePat, salaireBase, surSalaire, primeAnciennete, remunerationBrute);
        BigDecimal baseCrraePat = money(salaireBase.add(surSalaire));
        if (montantPat.compareTo(BigDecimal.ZERO) <= 0) {
            montantPat = money(baseCrraePat.multiply(new BigDecimal("0.10")));
        }

        if (!isExtra && baseCrraePat.compareTo(BigDecimal.ZERO) > 0) {
            BulletinLine crraePatLine = new BulletinLine();
            crraePatLine.setCode(codePat);
            crraePatLine.setLibelle(libellePat);
            crraePatLine.setTypeLigne("COTISATION_PATRONALE");
            crraePatLine.setBaseCalcul(baseCrraePat);
            crraePatLine.setTaux(tauxPat);
            crraePatLine.setMontant(BigDecimal.ZERO);
            crraePatLine.setPartPatronale(montantPat);
            crraePatLine.setOrdre((crraeParam != null && crraeParam.getOrdre() != null) ? crraeParam.getOrdre() : 30);
            lines.add(crraePatLine);

            totalCotisationsPatronales = totalCotisationsPatronales.add(montantPat);
        }

        // 5. TAXE PATRONALE D'APPRENTISSAGE (TPA sur Rémunération Brute)
        SalaryElement tpaElem = findSalaryElement("CAT_CHG_PATRONALES", "TPA", "TPA_BURKINA", "TPA_PAT", "TPA_REVERSER", "RET-008");
        String tpaCode = (tpaElem != null && tpaElem.getCode() != null) ? tpaElem.getCode() : "TPA_PAT";
        String tpaLibelle = (tpaElem != null && tpaElem.getName() != null && !tpaElem.getName().isBlank())
                ? tpaElem.getName()
                : "TAXE PATRONALE D'APPRENTISSAGE (TPA 3%)";
        BigDecimal tauxTpa = (tpaElem != null && tpaElem.getRate() != null && tpaElem.getRate().compareTo(BigDecimal.ZERO) > 0)
                ? tpaElem.getRate()
                : new BigDecimal("3.00");
        Integer tpaOrdre = (tpaElem != null && tpaElem.getOrdre() != null) ? tpaElem.getOrdre() : ordre++;

        if (!is13Ou14eme && remunerationBrute.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal montantTpa = money(calculatePercentage(remunerationBrute, tauxTpa));
            BulletinLine tpaLine = new BulletinLine();
            tpaLine.setCode(tpaCode);
            tpaLine.setLibelle(tpaLibelle);
            tpaLine.setTypeLigne("COTISATION_PATRONALE");
            tpaLine.setBaseCalcul(remunerationBrute);
            tpaLine.setTaux(tauxTpa);
            tpaLine.setMontant(BigDecimal.ZERO);
            tpaLine.setPartPatronale(montantTpa);
            tpaLine.setOrdre(tpaOrdre);
            lines.add(tpaLine);

            totalCotisationsPatronales = totalCotisationsPatronales.add(montantTpa);
        }

        // 6. RETENUE IUTS (Impôt direct)
        SalaryElement iutsElem = findSalaryElement("CAT_IUTS", "IUTS", "RETENUE_IUTS", "IUTS", "RET-007");
        String iutsCode = (iutsElem != null && iutsElem.getCode() != null) ? iutsElem.getCode() : "IUTS";
        String iutsLibelle = (iutsElem != null && iutsElem.getName() != null && !iutsElem.getName().isBlank())
                ? iutsElem.getName()
                : "RETENUE IUTS";
        Integer iutsOrdre = (iutsElem != null && iutsElem.getOrdre() != null) ? iutsElem.getOrdre() : ordre++;

        if (impotIuts.compareTo(BigDecimal.ZERO) > 0) {
            BulletinLine iutsLine = new BulletinLine();
            iutsLine.setCode(iutsCode);
            iutsLine.setLibelle(iutsLibelle);
            iutsLine.setTypeLigne("IMPOT");
            iutsLine.setBaseCalcul(baseImposable);
            iutsLine.setTaux(BigDecimal.valueOf(nbCharges));
            iutsLine.setMontant(impotIuts);
            iutsLine.setOrdre(iutsOrdre);
            lines.add(iutsLine);
        }

        // 7. FONDS DE SOUTIEN PATRIOTIQUE (FSP 1% du Net Cédulaire : Brut - CNSS - IUTS)
        SalaryElement fspElem = findSalaryElement("CAT_COTIS_SOC", "SOLIDAR", "RET_FSP", "FSP", "RET-015");
        String fspCode = (fspElem != null && fspElem.getCode() != null) ? fspElem.getCode() : "FSP";
        String fspLibelle = (fspElem != null && fspElem.getName() != null && !fspElem.getName().isBlank())
                ? fspElem.getName()
                : "RETENUE FONDS DE SOLIDARITE";
        BigDecimal tauxSol = (fspElem != null && fspElem.getRate() != null && fspElem.getRate().compareTo(BigDecimal.ZERO) > 0)
                ? fspElem.getRate()
                : new BigDecimal("1.00");
        Integer fspOrdre = (fspElem != null && fspElem.getOrdre() != null) ? fspElem.getOrdre() : ordre++;

        if (baseSolidarite.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal montantSol = money(calculatePercentage(baseSolidarite, tauxSol));
            totalRetenuesSociales = totalRetenuesSociales.add(montantSol);

            BulletinLine solLine = new BulletinLine();
            solLine.setCode(fspCode);
            solLine.setLibelle(fspLibelle);
            solLine.setTypeLigne("RETENUE_SOCIALE");
            solLine.setBaseCalcul(baseSolidarite);
            solLine.setTaux(tauxSol);
            solLine.setMontant(montantSol);
            solLine.setOrdre(fspOrdre);
            lines.add(solLine);
        }

        // Précomptes (Retenues sur salaire, prêts, avances) : uniquement si configuré et montant > 0 pour l'employé
        List<PrecompteEmploye> precomptes = precompteRepository.findByEmployeeIdAndStatut(emp.getId(), "ACTIF");
        BigDecimal totalPrecomptes = BigDecimal.ZERO;
        for (PrecompteEmploye prec : precomptes) {
            BigDecimal mPrelev = isStc ? prec.getMontantRestant() : (prec.getMontantMensuel() != null && prec.getMontantRestant() != null ? prec.getMontantMensuel().min(prec.getMontantRestant()) : prec.getMontantMensuel());
            if (mPrelev != null && mPrelev.compareTo(BigDecimal.ZERO) > 0) {
                totalPrecomptes = totalPrecomptes.add(mPrelev);

                BulletinLine precLine = new BulletinLine();
                precLine.setRubriquePaie(prec.getRubriquePaie());
                precLine.setCode("PREC_" + prec.getId());
                precLine.setLibelle(isStc ? (prec.getLibelle() + " - Solde intégral") : prec.getLibelle());
                precLine.setTypeLigne("PRECOMPTE");
                precLine.setBaseCalcul(prec.getMontantInitial());
                precLine.setMontant(mPrelev);
                precLine.setOrdre(ordre++);
                lines.add(precLine);
            }
        }

        List<Precompte> precomptesVariables = precompteVariableRepository.findByEmployeeIdAndStatutIn(emp.getId(), java.util.List.of("EN_COURS", "ACTIF"));
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

        Bulletin bulletin = prepareBulletinTarget(existingBulletin, finalCode);
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
        bulletin.setNatureSession(session != null ? session.getNatureSession() : null);

        lines.removeIf(l -> (l.getMontant() == null || l.getMontant().compareTo(BigDecimal.ZERO) <= 0)
                && (l.getPartPatronale() == null || l.getPartPatronale().compareTo(BigDecimal.ZERO) <= 0));
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session non trouvée: #" + sessionPaieId));

        if ("VALIDE".equalsIgnoreCase(session.getStatut()) || "CLOTURE".equalsIgnoreCase(session.getStatut())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La session #" + sessionPaieId + " est déjà " + session.getStatut() + " et ne peut pas être revalidée.");
        }

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

            List<Precompte> precomptesVar = precompteVariableRepository.findByEmployeeIdAndStatutIn(b.getEmployee().getId(), java.util.List.of("EN_COURS", "ACTIF"));
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
        session.setNombreValide(bulletins.size());
        sessionPaieRepository.save(session);
    }

    @Transactional
    public SessionPaie devaliderSession(Long sessionPaieId) {
        SessionPaie session = sessionPaieRepository.findById(sessionPaieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session non trouvée: #" + sessionPaieId));

        if ("CLOTURE".equalsIgnoreCase(session.getStatut())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La session #" + sessionPaieId + " est clôturée et son statut ne peut pas être réinitialisé.");
        }

        List<Bulletin> bulletins = bulletinRepository.findBySessionPaieId(sessionPaieId);

        for (Bulletin b : bulletins) {
            b.setStatut("GENERE");
            b.setDateValidation(null);
            bulletinRepository.save(b);

            // Rétablir les précomptes de l'employé
            List<PrecompteEmploye> precomptes = precompteRepository.findByEmployeeId(b.getEmployee().getId());
            for (PrecompteEmploye p : precomptes) {
                b.getLines().stream()
                        .filter(l -> ("PREC_" + p.getId()).equals(l.getCode()))
                        .findFirst()
                        .ifPresent(l -> {
                            BigDecimal m = l.getMontant();
                            if (m != null && m.compareTo(BigDecimal.ZERO) > 0) {
                                BigDecimal restantActuel = p.getMontantRestant() != null ? p.getMontantRestant() : BigDecimal.ZERO;
                                p.setMontantRestant(restantActuel.add(m));
                                p.setEcheancesRestantes((p.getEcheancesRestantes() != null ? p.getEcheancesRestantes() : 0) + 1);
                                p.setStatut("ACTIF");
                                precompteRepository.save(p);
                            }
                        });
            }

            List<Precompte> precomptesVar = precompteVariableRepository.findByEmployeeId(b.getEmployee().getId());
            for (Precompte p : precomptesVar) {
                b.getLines().stream()
                        .filter(l -> ("PREC_" + p.getId()).equals(l.getCode()) || (p.getSalaryElement() != null && p.getSalaryElement().getCode().equals(l.getCode())))
                        .findFirst()
                        .ifPresent(l -> {
                            BigDecimal m = l.getMontant();
                            if (m != null && m.compareTo(BigDecimal.ZERO) > 0) {
                                BigDecimal restantActuel = p.getMontantRestant() != null ? p.getMontantRestant() : BigDecimal.ZERO;
                                p.setMontantRestant(restantActuel.add(m));
                                p.setEcheance((p.getEcheance() != null ? p.getEcheance() : 0) + 1);
                                p.setStatut("ACTIF");
                                precompteVariableRepository.save(p);
                            }
                        });
            }

            // Rétablir les avoirs de l'employé
            List<AvoirEmploye> avoirs = avoirRepository.findByEmployeeId(b.getEmployee().getId());
            for (AvoirEmploye a : avoirs) {
                b.getLines().stream()
                        .filter(l -> ("AVOIR_" + a.getId()).equals(l.getCode()))
                        .findFirst()
                        .ifPresent(l -> {
                            BigDecimal m = l.getMontant();
                            if (m != null && m.compareTo(BigDecimal.ZERO) > 0) {
                                BigDecimal restantActuel = a.getMontantRestant() != null ? a.getMontantRestant() : BigDecimal.ZERO;
                                a.setMontantRestant(restantActuel.add(m));
                                a.setEcheancesRestantes((a.getEcheancesRestantes() != null ? a.getEcheancesRestantes() : 0) + 1);
                                a.setStatut("ACTIF");
                                avoirRepository.save(a);
                            }
                        });
            }

            List<Avoir> avoirsVar = avoirVariableRepository.findByEmployeeId(b.getEmployee().getId());
            for (Avoir a : avoirsVar) {
                b.getLines().stream()
                        .filter(l -> ("AVOIR_" + a.getId()).equals(l.getCode()) || (a.getSalaryElement() != null && a.getSalaryElement().getCode().equals(l.getCode())))
                        .findFirst()
                        .ifPresent(l -> {
                            BigDecimal m = l.getMontant();
                            if (m != null && m.compareTo(BigDecimal.ZERO) > 0) {
                                BigDecimal restantActuel = a.getMontantRestant() != null ? a.getMontantRestant() : BigDecimal.ZERO;
                                a.setMontantRestant(restantActuel.add(m));
                                a.setEcheance((a.getEcheance() != null ? a.getEcheance() : 0) + 1);
                                a.setStatut("ACTIF");
                                avoirVariableRepository.save(a);
                            }
                        });
            }

            // Rétablir les trop-perçus
            List<TropPercu> tropPercus = tropPercuRepository.findByEmployeeIdAndStatut(b.getEmployee().getId(), "APPLIQUE");
            for (TropPercu tp : tropPercus) {
                if (isTropPercuForSession(tp, session)) {
                    tp.setStatut("EN_ATTENTE");
                    tropPercuRepository.save(tp);
                }
            }
        }

        session.setStatut("GENERE");
        session.setDateValidation(null);
        session.setNombreValide(0);
        return sessionPaieRepository.save(session);
    }

    @Transactional
    public void deleteSession(Long sessionPaieId) {
        SessionPaie session = sessionPaieRepository.findById(sessionPaieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session non trouvée: #" + sessionPaieId));

        if ("VALIDE".equalsIgnoreCase(session.getStatut()) || "CLOTURE".equalsIgnoreCase(session.getStatut())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Impossible de supprimer une session " + session.getStatut().toLowerCase() + ". Veuillez d'abord réinitialiser son statut.");
        }

        List<Bulletin> bulletins = bulletinRepository.findBySessionPaieId(sessionPaieId);
        if (!bulletins.isEmpty()) {
            bulletinRepository.deleteAll(bulletins);
        }
        sessionPaieRepository.delete(session);
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

        LocalDate debutPeriode = dto.getDateFrom() != null ? dto.getDateFrom() : (session != null ? getSessionDebutPeriode(session) : null);
        LocalDate finPeriode = dto.getDateTo() != null ? dto.getDateTo() : (session != null ? getSessionFinPeriode(session) : null);
        boolean isStc = (session != null && isStc(session)) || "STC".equalsIgnoreCase(dto.getTypeSession());
        assertEmployeeEligibleForSession(emp, session, debutPeriode, finPeriode, isStc);

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
            if (b != null) {
                assertModifiable(b);
            }
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

        if (dto.getMotifRupture() != null && !dto.getMotifRupture().isBlank()) {
            b.setMotifRupture(dto.getMotifRupture());
        }
        if (dto.getStatutPreavis() != null && !dto.getStatutPreavis().isBlank()) {
            b.setStatutPreavis(dto.getStatutPreavis());
        }
        b.setMontantIndemniteLicenciement(dto.getMontantIndemniteLicenciement());
        b.setMontantIndemnitePreavis(dto.getMontantIndemnitePreavis());
        b.setMontantIndemniteConges(dto.getMontantIndemniteConges());

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bulletin introuvable avec ID: " + id));

        // RÈGLE V3 : Verrouillage strict de bulletin
        assertModifiable(b);

        BigDecimal workedDays = dto.getWorkedDays() != null ? dto.getWorkedDays() : b.getWorkedDays();
        BigDecimal scheduledDays = dto.getScheduledWorkingDays() != null ? dto.getScheduledWorkingDays() : b.getScheduledWorkingDays();

        if (dto.getMotifRupture() != null && !dto.getMotifRupture().isBlank()) {
            b.setMotifRupture(dto.getMotifRupture().trim().toUpperCase(Locale.ROOT));
        }
        if (dto.getStatutPreavis() != null && !dto.getStatutPreavis().isBlank()) {
            b.setStatutPreavis(dto.getStatutPreavis().trim().toUpperCase(Locale.ROOT));
        }

        // Recalcul officiel côté serveur par le moteur de paie (interdiction d'écraser arbitrairement avec des montants non vérifiés)
        Bulletin updated = computeAndSaveBulletin(b.getSessionPaie(), b.getEmployee(), workedDays, scheduledDays, b);

        if (dto.getJustificationEcart() != null) {
            updated.setJustificationEcart(dto.getJustificationEcart());
            updated = bulletinRepository.save(updated);
        }

        if (updated.getSessionPaie() != null && updated.getSessionPaie().getId() != null) {
            refreshSessionTotals(updated.getSessionPaie().getId());
        }
        return toDto(updated);
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
        Bulletin b = bulletinRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bulletin introuvable avec ID: #" + id));
        assertModifiable(b);
        Long sessId = b.getSessionPaie() != null ? b.getSessionPaie().getId() : null;
        bulletinRepository.delete(b);
        if (sessId != null) {
            refreshSessionTotals(sessId);
        }
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
                String lCode = l.getCode() != null ? l.getCode().toUpperCase(Locale.ROOT) : "";
                boolean isGratOrProrata = cleanLib.toUpperCase(Locale.ROOT).contains("PRORATA") || cleanLib.toUpperCase(Locale.ROOT).contains("13") || cleanLib.toUpperCase(Locale.ROOT).contains("14");
                ld.setCode(l.getCode());
                ld.setLibelle(cleanLib);
                ld.setTypeLigne(l.getTypeLigne());
                ld.setBaseCalcul(l.getBaseCalcul());

                BigDecimal taux = l.getTaux();
                String libUpper = cleanLib.toUpperCase(Locale.ROOT);
                boolean is13Ou14Session = is13Ou14emeMois(b.getSessionPaie())
                        || is13Ou14emeMois(b.getTypeSession())
                        || is13Ou14emeMois(b.getNatureSession())
                        || (b.getSessionPaie() != null && is13Ou14emeMois(b.getSessionPaie().getNatureSession()))
                        || (b.getSessionPaie() != null && is13Ou14emeMois(b.getSessionPaie().getCodeSession()));
                if (is13Ou14Session) {
                    taux = l.getTaux();
                } else if (lCode.contains("SAL_BASE") || lCode.contains("SUR_SALAIRE") || libUpper.contains("SALAIRE DE BASE") || libUpper.contains("SUR-SALAIRE") || libUpper.contains("SURSALAIRE")) {
                    taux = b.getWorkedDays() != null ? b.getWorkedDays() : new BigDecimal("30.00");
                } else if (lCode.contains("CNSS") || libUpper.contains("CNSS")) {
                    if ("COTISATION_PATRONALE".equalsIgnoreCase(l.getTypeLigne())) {
                        taux = l.getTaux() != null ? l.getTaux() : new BigDecimal("16.00");
                    } else {
                        taux = new BigDecimal("5.50");
                    }
                } else if (lCode.contains("CRRAE") || libUpper.contains("CRRAE")) {
                    if ("COTISATION_PATRONALE".equalsIgnoreCase(l.getTypeLigne())) {
                        taux = l.getTaux() != null ? l.getTaux() : new BigDecimal("10.00");
                    } else {
                        taux = new BigDecimal("6.00");
                    }
                } else if (lCode.contains("SOLIDAR") || libUpper.contains("SOLIDAR") || lCode.contains("FSP")) {
                    taux = new BigDecimal("1.00");
                } else if (lCode.contains("ANC") || libUpper.contains("ANCIENNET")) {
                    // Conserver le taux réel d'ancienneté
                } else if (isGratOrProrata) {
                    // Conserver le taux réel de prorata du 13ème / 14ème mois !
                    taux = l.getTaux();
                } else {
                    // Indemnités forfaitaires (Caisse, Sujétion, Transport, Logement, Cash Point) et impôt IUTS barème
                    taux = null;
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
                && (ld.getRetenue() == null || ld.getRetenue().compareTo(BigDecimal.ZERO) <= 0)
                && (ld.getPartPatronale() == null || ld.getPartPatronale().compareTo(BigDecimal.ZERO) <= 0));
        lineDtos.sort(Comparator.comparingInt(ld -> getOverallLineSortWeight(ld.getCode(), ld.getLibelle(), ld.getTypeLigne())));

        BulletinDto dto = new BulletinDto();
        dto.setId(b.getId());
        dto.setCode(b.getCode());
        dto.setEmployeeId(b.getEmployee() != null ? b.getEmployee().getId() : null);
        dto.setEmployeeName(empName);

        String nomVal = (b.getEmployee() != null && b.getEmployee().getNom() != null && !b.getEmployee().getNom().isBlank()) ? b.getEmployee().getNom().trim() : null;
        String prenomVal = (b.getEmployee() != null && b.getEmployee().getPrenom() != null && !b.getEmployee().getPrenom().isBlank()) ? b.getEmployee().getPrenom().trim() : null;
        if ((nomVal == null || prenomVal == null) && empName != null && !empName.isBlank()) {
            String[] parts = empName.trim().split("\\s+");
            if (parts.length >= 2) {
                if (parts[1].equals(parts[1].toUpperCase(Locale.ROOT)) && !parts[0].equals(parts[0].toUpperCase(Locale.ROOT))) {
                    nomVal = parts[1];
                    prenomVal = parts[0];
                } else if (parts[0].equals(parts[0].toUpperCase(Locale.ROOT)) && !parts[1].equals(parts[1].toUpperCase(Locale.ROOT))) {
                    nomVal = parts[0];
                    prenomVal = parts[1];
                } else {
                    nomVal = parts[parts.length - 1];
                    prenomVal = parts[0];
                }
            } else {
                nomVal = empName;
                prenomVal = "—";
            }
        }
        dto.setEmployeeNom(nomVal);
        dto.setEmployeePrenom(prenomVal);
        dto.setNom(nomVal);
        dto.setPrenom(prenomVal);

        dto.setMatricule(matricule);
        dto.setFonction(fonctionStr);
        dto.setSessionPaieId(b.getSessionPaie() != null ? b.getSessionPaie().getId() : null);
        dto.setSessionPaieCode(b.getSessionPaie() != null ? b.getSessionPaie().getCodeSession() : null);
        dto.setSessionPeriode(b.getSessionPaie() != null ? b.getSessionPaie().getPeriode() : null);
        dto.setGradeId(b.getGrade() != null ? b.getGrade().getId() : null);
        dto.setGradeLibelle(gradeStr);
        dto.setContratId(b.getContrat() != null ? b.getContrat().getId() : null);
        dto.setTypeSession(b.getTypeSession());
        dto.setNatureSession(b.getNatureSession() != null ? b.getNatureSession() : (b.getSessionPaie() != null ? b.getSessionPaie().getNatureSession() : null));
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

        dto.setMotifRupture(b.getMotifRupture());
        dto.setStatutPreavis(b.getStatutPreavis());
        dto.setMontantIndemniteLicenciement(b.getMontantIndemniteLicenciement());
        dto.setMontantIndemnitePreavis(b.getMontantIndemnitePreavis());
        dto.setMontantIndemniteConges(b.getMontantIndemniteConges());

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
        String resolvedGrade = (!classification.equals("—") && !classification.toUpperCase().contains("GROUPE"))
                ? classification
                : ((gradeStr != null && !gradeStr.toUpperCase().contains("GROUPE")) ? gradeStr : (!classification.equals("—") ? classification : null));
        dto.setGrade(resolvedGrade);

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

        String rawSessionType = b.getTypeSession() != null ? b.getTypeSession() : (b.getSessionPaie() != null ? b.getSessionPaie().getTypeSession() : "ORDINAIRE");
        String rawNature = b.getNatureSession() != null ? b.getNatureSession() : (b.getSessionPaie() != null ? b.getSessionPaie().getNatureSession() : null);
        String sessionName = b.getSessionPaie() != null ? b.getSessionPaie().getName() : null;
        String formattedSessionType = BulletinPdfService.formatSessionTypeLabel(rawSessionType, rawNature, sessionName);
        dto.setSessionType(formattedSessionType);
        dto.setTypeSession(formattedSessionType);
        dto.setNatureSession(rawNature);

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
                if ((c.contains("CRRAE") || lib.contains("CRRAE")) && !"COTISATION_PATRONALE".equalsIgnoreCase(l.getTypeLigne())) {
                    if (l.getMontant() != null && l.getMontant().compareTo(BigDecimal.ZERO) > 0) {
                        crraeVal = l.getMontant();
                    }
                } else if (c.contains("SOLIDARITE") || c.contains("FSP") || lib.contains("SOLIDARITE")) {
                    solVal = l.getMontant() != null ? l.getMontant() : BigDecimal.ZERO;
                } else if ((c.contains("CNSS") || lib.contains("CNSS")) && !c.contains("PATRON") && !lib.contains("PATRON")) {
                    if (l.getMontant() != null && l.getMontant().compareTo(BigDecimal.ZERO) > 0) {
                        cnssFromLines = l.getMontant();
                    }
                }
            }
        }
        boolean bIsStc = isStc(b.getNatureSession()) || isStc(b.getTypeSession()) || (b.getSessionPaie() != null && isStc(b.getSessionPaie()));
        boolean bIs13Ou14 = is13Ou14emeMois(b.getSessionPaie())
                || is13Ou14emeMois(b.getTypeSession())
                || is13Ou14emeMois(b.getNatureSession())
                || (b.getSessionPaie() != null && is13Ou14emeMois(b.getSessionPaie().getNatureSession()))
                || (b.getSessionPaie() != null && is13Ou14emeMois(b.getSessionPaie().getCodeSession()));
        boolean bIsExtra = bIs13Ou14 || isExtraordinaire(b.getTypeSession()) || (b.getSessionPaie() != null && isExtraordinaire(b.getSessionPaie().getTypeSession()));
        if (!bIsExtra && crraeVal.compareTo(BigDecimal.ZERO) == 0 && b.getSalaireBase() != null) {
            BigDecimal baseCrrae = b.getSalaireBase().add(b.getSurSalaire() != null ? b.getSurSalaire() : BigDecimal.ZERO);
            crraeVal = baseCrrae.multiply(new BigDecimal("0.06")).setScale(0, java.math.RoundingMode.HALF_UP);
        }
        if (bIs13Ou14) {
            crraeVal = BigDecimal.ZERO;
            solVal = BigDecimal.ZERO;
        } else if (bIsExtra && !bIsStc) {
            crraeVal = BigDecimal.ZERO;
            solVal = BigDecimal.ZERO;
        } else if (bIsExtra) {
            crraeVal = BigDecimal.ZERO;
            // Pour STC : le FSP (Fonds de Soutien Patriotique) doit figurer !
        }
        dto.setCotisationCrrae(crraeVal);
        dto.setCotisationSolidarite(solVal);

        BigDecimal brutMois = b.getSalaireBrut() != null ? b.getSalaireBrut() : (b.getTotalAvoirs() != null ? b.getTotalAvoirs() : BigDecimal.ZERO);
        BigDecimal baseImpMois = b.getBaseImposable() != null ? b.getBaseImposable() : BigDecimal.ZERO;
        BigDecimal cnssMois = (b.getCotisationCnss() != null && b.getCotisationCnss().compareTo(BigDecimal.ZERO) > 0)
                ? b.getCotisationCnss()
                : (cnssFromLines.compareTo(BigDecimal.ZERO) > 0 ? cnssFromLines : BigDecimal.ZERO);
        if (!bIsExtra && !bIs13Ou14 && cnssMois.compareTo(BigDecimal.ZERO) == 0 && brutMois.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal baseCnss = brutMois.min(new BigDecimal("800000.00"));
            cnssMois = baseCnss.multiply(new BigDecimal("0.055")).min(new BigDecimal("44000.00")).setScale(0, RoundingMode.HALF_UP);
        }
        if (bIs13Ou14) {
            cnssMois = BigDecimal.ZERO;
            baseImpMois = BigDecimal.ZERO;
            crraeVal = BigDecimal.ZERO;
            solVal = BigDecimal.ZERO;
        } else if (bIsExtra && !bIsStc) {
            if (cnssFromLines.compareTo(BigDecimal.ZERO) == 0 && (b.getCotisationCnss() == null || b.getCotisationCnss().compareTo(BigDecimal.ZERO) == 0)) {
                cnssMois = BigDecimal.ZERO;
            }
        }
        dto.setCotisationCnss(cnssMois);

        BigDecimal iutsMois = bIs13Ou14 ? BigDecimal.ZERO : (b.getImpotIuts() != null ? b.getImpotIuts() : BigDecimal.ZERO);

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
                                    ybCnss = yb.getSalaireBrut().min(new BigDecimal("800000.00")).multiply(new BigDecimal("0.055")).min(new BigDecimal("44000.00")).setScale(0, RoundingMode.HALF_UP);
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

    /**
     * Évalue dynamiquement une formule de calcul d'élément de salaire
     * Supporte SUM(...), AVG(...), MIN(...), MAX(...), les catégories parentes (ex: CAT_SAL_BASE)
     * et les codes des éléments de salaire (ex: sal_base, sursalaire, etc.)
     */
    public static BigDecimal evaluateComplexFormula(String formula, BigDecimal salBase, BigDecimal surSalaire, BigDecimal primeAnc, BigDecimal brut) {
        if (formula == null || formula.isBlank()) return BigDecimal.ZERO;

        Map<String, BigDecimal> elements = new HashMap<>();
        elements.put("sal_base", salBase != null ? salBase : BigDecimal.ZERO);
        elements.put("salaire_base", salBase != null ? salBase : BigDecimal.ZERO);
        elements.put("sursalaire", surSalaire != null ? surSalaire : BigDecimal.ZERO);
        elements.put("sur_salaire", surSalaire != null ? surSalaire : BigDecimal.ZERO);
        elements.put("prime_anc", primeAnc != null ? primeAnc : BigDecimal.ZERO);
        elements.put("anciennete", primeAnc != null ? primeAnc : BigDecimal.ZERO);
        elements.put("remuneration_brute", brut != null ? brut : BigDecimal.ZERO);
        elements.put("brut_cotisable", brut != null ? brut : BigDecimal.ZERO);
        elements.put("brut", brut != null ? brut : BigDecimal.ZERO);

        Map<String, List<BigDecimal>> categories = new HashMap<>();
        List<BigDecimal> catSalBase = new ArrayList<>();
        if (salBase != null) catSalBase.add(salBase);
        if (surSalaire != null) catSalBase.add(surSalaire);
        categories.put("cat_sal_base", catSalBase);
        categories.put("cat_remuneration_due", catSalBase);

        return evaluateComplexFormula(formula, elements, categories);
    }

    public static BigDecimal evaluateComplexFormula(String formula, Map<String, BigDecimal> elementValues, Map<String, List<BigDecimal>> categoryValues) {
        if (formula == null || formula.isBlank()) return BigDecimal.ZERO;
        try {
            String expr = formula.replace(',', '.').trim();

            // 1. Remplacement des fonctions agrégatives SUM(CAT_...), AVG(CAT_...), MIN(...), MAX(...)
            expr = resolveAggregateFunctions(expr, categoryValues, elementValues);

            // 2. Remplacement des catégories directes (ex: CAT_SAL_BASE -> total de la catégorie)
            if (categoryValues != null) {
                for (Map.Entry<String, List<BigDecimal>> entry : categoryValues.entrySet()) {
                    String catCode = entry.getKey();
                    BigDecimal sum = entry.getValue() != null
                            ? entry.getValue().stream().filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add)
                            : BigDecimal.ZERO;
                    expr = expr.replaceAll("(?i)\\b" + Pattern.quote(catCode) + "\\b", sum.toPlainString());
                }
            }

            // 3. Remplacement des codes d'éléments de salaire (ex: sal_base, sursalaire...)
            if (elementValues != null) {
                List<String> sortedKeys = elementValues.keySet().stream()
                        .sorted((a, b) -> Integer.compare(b.length(), a.length()))
                        .toList();
                for (String code : sortedKeys) {
                    BigDecimal val = elementValues.get(code);
                    String valStr = (val != null ? val : BigDecimal.ZERO).toPlainString();
                    expr = expr.replaceAll("(?i)\\b" + Pattern.quote(code) + "\\b", valStr);
                }
            }

            // 4. Nettoyage des variables résiduelles non résolues -> 0
            expr = expr.replaceAll("(?i)\\b[a-z_][a-z0-9_-]*\\b", "0");

            return evalMathExpression(expr);
        } catch (Exception e) {
            log.warn("Erreur évaluation formule '{}' : {}", formula, e.getMessage());
            return BigDecimal.ZERO;
        }
    }

    private static String resolveAggregateFunctions(String expr, Map<String, List<BigDecimal>> categoryValues, Map<String, BigDecimal> elementValues) {
        Pattern pattern = Pattern.compile("(?i)(SUM|AVG|MIN|MAX)\\s*\\(([^)]+)\\)");
        Matcher matcher = pattern.matcher(expr);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            String func = matcher.group(1).toUpperCase(Locale.ROOT);
            String arg = matcher.group(2).trim();

            List<BigDecimal> values = new ArrayList<>();
            // Cas 1 : Catégorie correspondante
            if (categoryValues != null) {
                for (Map.Entry<String, List<BigDecimal>> entry : categoryValues.entrySet()) {
                    if (entry.getKey().equalsIgnoreCase(arg)) {
                        if (entry.getValue() != null) values.addAll(entry.getValue());
                        break;
                    }
                }
            }

            // Cas 2 : Liste d'éléments séparés par virgules
            if (values.isEmpty()) {
                String[] parts = arg.split(",");
                for (String part : parts) {
                    String p = part.trim();
                    if (elementValues != null && elementValues.containsKey(p.toLowerCase(Locale.ROOT))) {
                        values.add(elementValues.get(p.toLowerCase(Locale.ROOT)));
                    } else {
                        try {
                            values.add(new BigDecimal(p));
                        } catch (Exception ignored) {}
                    }
                }
            }

            BigDecimal result = BigDecimal.ZERO;
            if (!values.isEmpty()) {
                if ("SUM".equals(func)) {
                    result = values.stream().filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
                } else if ("AVG".equals(func)) {
                    BigDecimal sum = values.stream().filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
                    result = sum.divide(new BigDecimal(values.size()), 4, RoundingMode.HALF_UP);
                } else if ("MIN".equals(func)) {
                    result = values.stream().filter(Objects::nonNull).min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
                } else if ("MAX".equals(func)) {
                    result = values.stream().filter(Objects::nonNull).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
                }
            }
            matcher.appendReplacement(sb, Matcher.quoteReplacement(result.toPlainString()));
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    private static BigDecimal evalMathExpression(String expression) {
        if (expression == null || expression.isBlank()) return BigDecimal.ZERO;
        final String clean = expression.replaceAll("\\s+", "").replaceAll("[^0-9.+\\-*/()]", "");
        return new Object() {
            int pos = -1, ch;

            void nextChar() {
                ch = (++pos < clean.length()) ? clean.charAt(pos) : -1;
            }

            boolean eat(int charToEat) {
                while (ch == ' ') nextChar();
                if (ch == charToEat) {
                    nextChar();
                    return true;
                }
                return false;
            }

            BigDecimal parse() {
                nextChar();
                BigDecimal x = parseExpression();
                return x != null ? x.setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            }

            BigDecimal parseExpression() {
                BigDecimal x = parseTerm();
                for (;;) {
                    if (eat('+')) x = x.add(parseTerm());
                    else if (eat('-')) x = x.subtract(parseTerm());
                    else return x;
                }
            }

            BigDecimal parseTerm() {
                BigDecimal x = parseFactor();
                for (;;) {
                    if (eat('*')) x = x.multiply(parseFactor());
                    else if (eat('/')) {
                        BigDecimal divisor = parseFactor();
                        if (divisor.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
                        x = x.divide(divisor, 4, RoundingMode.HALF_UP);
                    } else return x;
                }
            }

            BigDecimal parseFactor() {
                if (eat('+')) return parseFactor();
                if (eat('-')) return parseFactor().negate();

                BigDecimal x;
                int startPos = this.pos;
                if (eat('(')) {
                    x = parseExpression();
                    eat(')');
                } else if ((ch >= '0' && ch <= '9') || ch == '.') {
                    while ((ch >= '0' && ch <= '9') || ch == '.') nextChar();
                    x = new BigDecimal(clean.substring(startPos, this.pos));
                } else {
                    return BigDecimal.ZERO;
                }
                return x;
            }
        }.parse();
    }

    /**
     * Recherche dynamique d'un élément de salaire dans la table salary_element
     * Priorité :
     * 1. Codes précis indiqués en paramètre (sur code ou codeCorrespondant, insensible à la casse)
     * 2. Catégorie de salaire et/ou mot-clé dans le code, code_correspondant ou libellé
     */
    public SalaryElement findSalaryElement(String categoryCode, String keyword, String... preferredCodes) {
        if (salaryElementRepository == null) return null;
        try {
            // 1. Recherche par codes préférés (exact match insensible à la casse sur code ou codeCorrespondant)
            if (preferredCodes != null) {
                for (String c : preferredCodes) {
                    if (c == null || c.isBlank()) continue;
                    String target = c.trim().toLowerCase();
                    Optional<SalaryElement> el = salaryElementRepository.findByCodeIgnoreCase(target);
                    if (el.isEmpty()) {
                        el = salaryElementRepository.findByCodeCorrespondantIgnoreCase(target);
                    }
                    if (el.isPresent() && !"INACTIF".equalsIgnoreCase(el.get().getStatut())) {
                        return el.get();
                    }
                }
            }
            // 2. Recherche par catégorie ou mot-clé parmi les éléments actifs
            List<SalaryElement> all = salaryElementRepository.findAll();
            for (SalaryElement se : all) {
                if ("INACTIF".equalsIgnoreCase(se.getStatut())) continue;
                if (categoryCode != null && se.getSalaryCategory() != null && categoryCode.equalsIgnoreCase(se.getSalaryCategory().getCode())) {
                    if (keyword == null || keyword.isBlank()) {
                        return se;
                    }
                    String c = se.getCode() != null ? se.getCode().toUpperCase(Locale.ROOT) : "";
                    String cc = se.getCodeCorrespondant() != null ? se.getCodeCorrespondant().toUpperCase(Locale.ROOT) : "";
                    String n = se.getName() != null ? se.getName().toUpperCase(Locale.ROOT) : "";
                    String kw = keyword.toUpperCase(Locale.ROOT);
                    if (c.contains(kw) || cc.contains(kw) || n.contains(kw)) {
                        return se;
                    }
                }
            }
            // 3. Recherche par mot-clé global si non trouvé dans la catégorie (en évitant les retenues si on cherchait un gain/salaire)
            if (keyword != null && !keyword.isBlank()) {
                String kw = keyword.toUpperCase(Locale.ROOT);
                boolean isLookingForGain = categoryCode != null && (categoryCode.contains("SAL") || categoryCode.contains("GAIN") || categoryCode.contains("AVOIR") || categoryCode.contains("PRIME"));
                for (SalaryElement se : all) {
                    if ("INACTIF".equalsIgnoreCase(se.getStatut())) continue;
                    String c = se.getCode() != null ? se.getCode().toUpperCase(Locale.ROOT) : "";
                    String cc = se.getCodeCorrespondant() != null ? se.getCodeCorrespondant().toUpperCase(Locale.ROOT) : "";
                    String n = se.getName() != null ? se.getName().toUpperCase(Locale.ROOT) : "";

                    if (isLookingForGain && (c.startsWith("RET_") || c.startsWith("PRET_") || c.startsWith("TROP_PERCU"))) {
                        continue;
                    }
                    if (c.contains(kw) || cc.contains(kw) || n.contains(kw)) {
                        return se;
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Erreur recherche salary_element ({}, {}): {}", categoryCode, keyword, e.getMessage());
        }
        return null;
    }

    private SalaryElement findCrraePatronaleElement() {
        if (salaryElementRepository == null) return null;
        try {
            // Priorité 1 : chg_pat_crrae (code ou codeCorrespondant)
            Optional<SalaryElement> el = salaryElementRepository.findByCodeIgnoreCase("chg_pat_crrae");
            if (el.isEmpty()) {
                el = salaryElementRepository.findByCodeCorrespondantIgnoreCase("chg_pat_crrae");
            }
            if (el.isPresent() && "ACTIF".equalsIgnoreCase(el.get().getStatut())) {
                return el.get();
            }
            // Priorité 2 : cot_crrae (code ou codeCorrespondant)
            el = salaryElementRepository.findByCodeIgnoreCase("cot_crrae");
            if (el.isEmpty()) {
                el = salaryElementRepository.findByCodeCorrespondantIgnoreCase("cot_crrae");
            }
            if (el.isPresent() && "ACTIF".equalsIgnoreCase(el.get().getStatut())) {
                return el.get();
            }
            // Priorité 3 : tout élément patronal lié à la CRRAE actif
            return findSalaryElement("CAT_CHG_PATRONALES", "CRRAE", "chg_pat_crrae", "cot_crrae");
        } catch (Exception e) {
            log.warn("Erreur recherche élément CRRAE patronal : {}", e.getMessage());
            return null;
        }
    }

    private SalaryElement findCnssSalaryElement() {
        return findSalaryElement("CAT_CHG_PATRONALES", "CNSS", "CHG_PAT_CNSS", "COT_PAT_CNSS", "RET-002");
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
        String nat = session.getNatureSession() != null ? session.getNatureSession().toUpperCase(Locale.ROOT) : "";
        if (nat.equals("13EME_MOIS") || nat.equals("TREIZIEME_MOIS")) return true;
        String t = (session.getTypeSession() != null ? session.getTypeSession() : "").toUpperCase(Locale.ROOT);
        String n = (session.getName() != null ? session.getName() : "").toUpperCase(Locale.ROOT);
        String c = (session.getCodeSession() != null ? session.getCodeSession() : "").toUpperCase(Locale.ROOT);
        String p = (session.getPeriode() != null ? session.getPeriode() : "").toUpperCase(Locale.ROOT);
        return (t.contains("13") || t.contains("TREIZIEME") || n.contains("13") || n.contains("TREIZIEME") || c.contains("13") || c.contains("TREIZIEME") || p.contains("13") || p.contains("TREIZIEME") || t.contains("GRATIF") || n.contains("GRATIF"))
                && !nat.equals("14EME_MOIS") && !n.contains("14") && !c.contains("14");
    }

    public static boolean is14emeMois(SessionPaie session) {
        if (session == null) return false;
        String nat = session.getNatureSession() != null ? session.getNatureSession().toUpperCase(Locale.ROOT) : "";
        if (nat.equals("14EME_MOIS") || nat.equals("QUATORZIEME_MOIS")) return true;
        String t = (session.getTypeSession() != null ? session.getTypeSession() : "").toUpperCase(Locale.ROOT);
        String n = (session.getName() != null ? session.getName() : "").toUpperCase(Locale.ROOT);
        String c = (session.getCodeSession() != null ? session.getCodeSession() : "").toUpperCase(Locale.ROOT);
        String p = (session.getPeriode() != null ? session.getPeriode() : "").toUpperCase(Locale.ROOT);
        return t.contains("14") || t.contains("QUATORZIEME") || n.contains("14") || n.contains("QUATORZIEME") || c.contains("14") || c.contains("QUATORZIEME") || p.contains("14") || p.contains("QUATORZIEME");
    }

    public static boolean is13Ou14emeMois(SessionPaie session) {
        return is13emeMois(session) || is14emeMois(session);
    }

    public static boolean is13Ou14emeMois(String text) {
        if (text == null) return false;
        String t = text.trim().toUpperCase(Locale.ROOT);
        return t.contains("13") || t.contains("14") || t.contains("GRATIF") || t.contains("TREIZIEME") || t.contains("QUATORZIEME");
    }

    public static boolean is13emeMois(String text) {
        return is13Ou14emeMois(text);
    }

    public static boolean isCongePaye(SessionPaie session) {
        if (session == null) return false;
        String nat = session.getNatureSession() != null ? session.getNatureSession().toUpperCase(Locale.ROOT) : "";
        if (nat.equals("CONGE_PAYE") || nat.contains("CONGE") || nat.contains("CONGÉ")) return true;
        String t = (session.getTypeSession() != null ? session.getTypeSession() : "").toUpperCase(Locale.ROOT);
        String n = (session.getName() != null ? session.getName() : "").toUpperCase(Locale.ROOT);
        String c = (session.getCodeSession() != null ? session.getCodeSession() : "").toUpperCase(Locale.ROOT);
        return n.contains("CONGE") || n.contains("CONGÉ") || c.contains("CONGE") || c.contains("CONGÉ") || t.contains("CONGE");
    }

    public static boolean isIndemniteRetraite(SessionPaie session) {
        if (session == null) return false;
        String nat = session.getNatureSession() != null ? session.getNatureSession().toUpperCase(Locale.ROOT) : "";
        if (nat.equals("INDEMNITE_RETRAITE") || nat.contains("RETRAITE")) return true;
        String n = (session.getName() != null ? session.getName() : "").toUpperCase(Locale.ROOT);
        String c = (session.getCodeSession() != null ? session.getCodeSession() : "").toUpperCase(Locale.ROOT);
        return n.contains("RETRAITE") || c.contains("RETRAITE");
    }

    public static boolean isStc(SessionPaie session) {
        if (session == null) return false;
        String nat = session.getNatureSession() != null ? session.getNatureSession().toUpperCase(Locale.ROOT) : "";
        if (nat.equals("STC") || nat.contains("SOLDE")) return true;
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

    public static boolean isDifferentielMaternite(SessionPaie session) {
        if (session == null) return false;
        String nat = session.getNatureSession() != null ? session.getNatureSession().toUpperCase(Locale.ROOT) : "";
        if (nat.equals("DIFFERENTIEL_MATERNITE") || nat.equals("COMPLEMENT_MATERNITE") || nat.contains("MATERNITE") || nat.contains("MATERNITÉ") || nat.equals("RELIQUAT") || nat.contains("RELIQUAT")) return true;
        String t = (session.getTypeSession() != null ? session.getTypeSession() : "").toUpperCase(Locale.ROOT);
        String n = (session.getName() != null ? session.getName() : "").toUpperCase(Locale.ROOT);
        String c = (session.getCodeSession() != null ? session.getCodeSession() : "").toUpperCase(Locale.ROOT);
        return n.contains("MATERNITE") || n.contains("MATERNITÉ") || c.contains("MATERNITE") || t.contains("MATERNITE") || n.contains("RELIQUAT") || c.contains("RELIQUAT");
    }

    public static boolean isDifferentielMaternite(String text) {
        if (text == null) return false;
        String t = text.trim().toUpperCase(Locale.ROOT);
        return t.contains("MATERNITE") || t.contains("MATERNITÉ") || t.contains("RELIQUAT");
    }

    private static boolean isGratification(String typeSession) {
        if (typeSession == null) return false;
        String t = typeSession.trim().toUpperCase(Locale.ROOT);
        return t.contains("GRATIF") || t.contains("TREIZIEME") || t.contains("13");
    }

    private static boolean isExtraordinaire(String typeSession) {
        if (typeSession == null) return false;
        String t = typeSession.trim().toUpperCase(Locale.ROOT);
        return t.contains("EXTRA") || t.contains("MATERNITE") || t.contains("MATERNITÉ");
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

        // 3. Salaire de base, sur-salaire, gratifications 13e/14e mois et prime d'ancienneté
        if (c.contains("13") || c.contains("14") || c.contains("GRAT") || l.contains("13") || l.contains("14") || l.contains("GRATIFICATION")) return 1;
        if (c.equals("SAL_BASE") || l.equals("SALAIRE DE BASE") || (l.contains("SALAIRE DE BASE") && !l.contains("TROP"))) return 1;
        if (c.equals("SUR_SALAIRE") || l.contains("SURSALAIRE") || l.contains("SUR-SALAIRE")) return 2;
        if (c.contains("ANC") || l.contains("ANCIENNET")) return 3;
        if (c.contains("CAISSE") || l.contains("CAISSE")) return 4;
        if (c.contains("SUJETION") || c.contains("SUJ") || l.contains("SUJETION") || l.contains("SUJÉTION")) return 5;
        if (c.contains("TRANS") || c.contains("TRP") || l.contains("TRANSPORT") || l.contains("DEPLACEMENT") || l.contains("DÉPLACEMENT")) return 6;
        if (c.contains("LOG") || l.contains("LOGEMENT") || l.contains("MAISON")) return 7;
        if (c.contains("CASH") || c.contains("CP") || l.contains("CASH POINT") || l.contains("CASHPOINT") || l.contains("GUICHET")) return 8;
        if (c.contains("AVOIR") || c.contains("RAPPEL") || l.contains("AVOIR") || l.contains("RAPPEL")) return 9;

        if ("GAIN".equalsIgnoreCase(typeLigne) || "AVOIR".equalsIgnoreCase(typeLigne)) {
            return 10;
        }

        return 40;
    }

    private BigDecimal getSommeRevenus12DerniersMois(Long employeeId, BigDecimal defaultMonthlyBrut) {
        List<Bulletin> past = bulletinRepository.findByEmployeeIdOrderByDateCalculDesc(employeeId);
        if (past == null || past.isEmpty()) {
            return defaultMonthlyBrut != null ? defaultMonthlyBrut.multiply(new BigDecimal("12")) : BigDecimal.ZERO;
        }
        // RÈGLE CODE DU TRAVAIL BF (Art. 159-160) : L'assiette de l'allocation de congés payés regroupe
        // l'ensemble des rémunérations perçues au cours de la période de référence,
        // y compris le 13ème mois, le 14ème mois et les gratifications.
        List<Bulletin> eligible = past.stream()
                .filter(b -> ("VALIDE".equalsIgnoreCase(b.getStatut()) || "CLOTURE".equalsIgnoreCase(b.getStatut())))
                .filter(b -> {
                    String nature = b.getNatureSession() != null ? b.getNatureSession().toUpperCase(Locale.ROOT) : "";
                    // Exclure uniquement les règlements de STC ou indemnités de départ à la retraite
                    boolean isExcluded = nature.contains("STC") || nature.contains("RETRAITE");
                    return !isExcluded;
                })
                .filter(b -> b.getSalaireBrut() != null && b.getSalaireBrut().compareTo(BigDecimal.ZERO) > 0)
                .limit(14) // Permet d'inclure les 12 mois ordinaires + 13ème mois + 14ème mois
                .toList();
        if (eligible.isEmpty()) {
            return defaultMonthlyBrut != null ? defaultMonthlyBrut.multiply(new BigDecimal("12")) : BigDecimal.ZERO;
        }
        BigDecimal sum = eligible.stream()
                .map(Bulletin::getSalaireBrut)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return money(sum);
    }

    private BigDecimal getJoursCongeAcquis(Long employeeId) {
        if (employeeId == null) return BigDecimal.ZERO;
        try {
            com.bpbf.sirh_backend.dtos.SoldeCongeDto solde = congeWorkflowService.getSoldeForEmployee(employeeId);
            if (solde != null && solde.getSoldeRestant() != null) {
                double val = Math.max(0.0, solde.getSoldeRestant());
                return BigDecimal.valueOf(val).setScale(1, RoundingMode.HALF_UP);
            }
        } catch (Exception e) {
            log.warn("Impossible de récupérer le solde de congé pour l'employé #{}: {}", employeeId, e.getMessage());
        }
        return BigDecimal.ZERO;
    }

    private double getAncienneteExacte(Employee emp, SessionPaie session) {
        double ans = (emp.getAncienneteReprise() != null && emp.getAncienneteReprise() > 0) ? emp.getAncienneteReprise().doubleValue() : 0.0;
        if (emp.getDateEmbauche() != null && !emp.getDateEmbauche().isBlank()) {
            try {
                LocalDate dateEmb = LocalDate.parse(emp.getDateEmbauche().trim());
                LocalDate dateRef = session != null && session.getDateTo() != null ? session.getDateTo() : LocalDate.now();
                java.time.Period period = java.time.Period.between(dateEmb, dateRef);
                ans += period.getYears() + (period.getMonths() / 12.0) + (period.getDays() / 365.0);
            } catch (Exception ignored) {}
        }
        return Math.max(0.0, ans);
    }

    private BigDecimal getSalaireGlobalMensuelMoyen(Long employeeId, BigDecimal base, BigDecimal sursalaire, BigDecimal primeAnc, List<IndemniteEmploye> rawIndemnites) {
        BigDecimal sgmActuel = (base != null ? base : BigDecimal.ZERO).add(sursalaire != null ? sursalaire : BigDecimal.ZERO).add(primeAnc != null ? primeAnc : BigDecimal.ZERO);
        if (rawIndemnites != null) {
            for (IndemniteEmploye ind : rawIndemnites) {
                if (ind == null || ind.getMontant() == null || ind.getMontant() <= 0) continue;
                String code = ind.getTypeIndemnite() != null && ind.getTypeIndemnite().getCode() != null ? ind.getTypeIndemnite().getCode().toUpperCase(Locale.ROOT) : "";
                String lib = ind.getLibelle() != null ? ind.getLibelle().toUpperCase(Locale.ROOT) : "";
                // Exclusion explicite des remboursements de frais
                if (code.contains("TRP") || code.contains("TRANS") || lib.contains("TRANSPORT") ||
                    code.contains("DEP") || lib.contains("DEPLACEMENT") || lib.contains("DÉPLACEMENT") ||
                    code.contains("MISS") || lib.contains("MISSION") || code.contains("CARB") || lib.contains("CARBURANT") ||
                    lib.contains("FRAIS")) {
                    continue;
                }
                sgmActuel = sgmActuel.add(money(BigDecimal.valueOf(ind.getMontant())));
            }
        }

        List<Bulletin> past = bulletinRepository.findByEmployeeIdOrderByDateCalculDesc(employeeId);
        if (past == null || past.isEmpty()) {
            return money(sgmActuel);
        }
        List<Bulletin> last12 = past.stream()
                .filter(b -> b.getSalaireBrut() != null && b.getSalaireBrut().compareTo(BigDecimal.ZERO) > 0)
                .limit(12)
                .toList();
        if (last12.isEmpty()) {
            return money(sgmActuel);
        }
        BigDecimal sum = BigDecimal.ZERO;
        for (Bulletin b : last12) {
            BigDecimal brutMois = b.getSalaireBrut() != null ? b.getSalaireBrut() : BigDecimal.ZERO;
            if (b.getLines() != null) {
                for (BulletinLine l : b.getLines()) {
                    String lc = l.getCode() != null ? l.getCode().toUpperCase(Locale.ROOT) : "";
                    String ll = l.getLibelle() != null ? l.getLibelle().toUpperCase(Locale.ROOT) : "";
                    if (lc.contains("TRP") || lc.contains("TRANS") || ll.contains("TRANSPORT") ||
                        lc.contains("DEP") || ll.contains("DEPLACEMENT") || ll.contains("DÉPLACEMENT") ||
                        lc.contains("CARB") || ll.contains("CARBURANT") || ll.contains("FRAIS")) {
                        if (l.getMontant() != null) {
                            brutMois = brutMois.subtract(l.getMontant());
                        }
                    }
                }
            }
            sum = sum.add(brutMois.max(BigDecimal.ZERO));
        }
        BigDecimal avg = sum.divide(BigDecimal.valueOf(last12.size()), 2, RoundingMode.HALF_UP);
        return money(avg);
    }

    private String generateBulletinCode(SessionPaie session, Employee emp) {
        String codeBulletin = String.format("BLT-%s-%s-%04d",
                session != null && session.getMois() != null ? session.getMois() : "M",
                session != null && session.getAnnee() != null ? session.getAnnee() : LocalDate.now().getYear(),
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
        return finalCode;
    }

    private String formatMoneyNoDec(BigDecimal amount) {
        if (amount == null) return "0";
        java.text.NumberFormat nf = java.text.NumberFormat.getInstance(Locale.FRENCH);
        nf.setMinimumFractionDigits(0);
        nf.setMaximumFractionDigits(0);
        return nf.format(amount);
    }

    private TypeIndemnite findTypeIndemniteDynamic(String code, String libelle) {
        if (typeIndemniteRepository == null) return null;
        if (code != null && !code.isBlank()) {
            for (TypeIndemnite ti : typeIndemniteRepository.findAll()) {
                if (code.equalsIgnoreCase(ti.getCode())) return ti;
            }
        }
        if (libelle != null && !libelle.isBlank()) {
            String normLib = BulletinPdfService.normalizeText(libelle);
            for (TypeIndemnite ti : typeIndemniteRepository.findAll()) {
                if (ti.getName() != null && BulletinPdfService.normalizeText(ti.getName()).equalsIgnoreCase(normLib)) {
                    return ti;
                }
            }
        }
        return null;
    }
}
