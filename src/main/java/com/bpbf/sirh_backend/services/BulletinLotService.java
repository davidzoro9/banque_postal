package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.paie.*;
import com.bpbf.sirh_backend.entities.*;
import com.bpbf.sirh_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BulletinLotService {

    private final BulletinLotRepository bulletinLotRepository;
    private final BulletinRepository bulletinRepository;
    private final BulletinLineRepository bulletinLineRepository;
    private final EmployeeRepository employeeRepository;
    private final SalaryElementRepository salaryElementRepository;
    private final AvoirRepository avoirRepository;
    private final PrecompteRepository precompteRepository;
    private final SituationSalarialeRepository situationRepository;
    private final SessionPaieRepository sessionPaieRepository;

    // --- LOTS ---
    @Transactional(readOnly = true)
    public List<BulletinLotResponseDto> getAllLots() {
        return bulletinLotRepository.findAll().stream()
                .map(this::mapLotToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BulletinLotResponseDto getLotById(Long id) {
        return bulletinLotRepository.findById(id)
                .map(this::mapLotToDto)
                .orElseThrow(() -> new RuntimeException("Lot non trouvé: " + id));
    }

    @Transactional
    public BulletinLotResponseDto createLot(BulletinLotCreateDto dto) {
        BulletinLot lot = BulletinLot.builder()
                .name(dto.getName())
                .dateFrom(dto.getDateFrom())
                .dateTo(dto.getDateTo())
                .typeSession(dto.getTypeSession() != null ? dto.getTypeSession() : "NORMALE")
                .nombreBulletin(0)
                .nombreValide(0)
                .statut("BROUILLON")
                .build();

        return mapLotToDto(bulletinLotRepository.save(lot));
    }

    @Transactional
    public BulletinLotResponseDto validerLot(Long lotId) {
        BulletinLot lot = bulletinLotRepository.findById(lotId)
                .orElseThrow(() -> new RuntimeException("Lot non trouvé: " + lotId));
        lot.setStatut("VALIDE");
        lot.setNombreValide(lot.getNombreBulletin());
        List<Bulletin> bulletins = bulletinRepository.findByBulletinLotId(lotId);
        for (Bulletin b : bulletins) {
            b.setStatut("VALIDE");
            b.setDateValidation(java.time.LocalDateTime.now());
            bulletinRepository.save(b);
        }
        return mapLotToDto(bulletinLotRepository.save(lot));
    }

    @Transactional
    public BulletinLotResponseDto cloturerLot(Long lotId) {
        BulletinLot lot = bulletinLotRepository.findById(lotId)
                .orElseThrow(() -> new RuntimeException("Lot non trouvé: " + lotId));
        lot.setStatut("CLOTURE");
        List<Bulletin> bulletins = bulletinRepository.findByBulletinLotId(lotId);
        for (Bulletin b : bulletins) {
            b.setStatut("CLOTURE");
            bulletinRepository.save(b);
        }
        return mapLotToDto(bulletinLotRepository.save(lot));
    }

    // --- GENERATION PAR LOT ---
    @Transactional
    public List<BulletinSummaryResponseDto> generateBulletinsForLot(GeneratePayrollRequestDto req) {
        BulletinLot lot = bulletinLotRepository.findById(req.getBulletinLotId())
                .orElseThrow(() -> new RuntimeException("Lot introuvable: " + req.getBulletinLotId()));

        List<Employee> employees;
        if (req.getEmployeeIds() != null && !req.getEmployeeIds().isEmpty()) {
            employees = employeeRepository.findAllById(req.getEmployeeIds());
        } else {
            employees = employeeRepository.findAll();
        }

        LocalDate dateRef = lot.getDateFrom() != null ? lot.getDateFrom() : LocalDate.now();
        String mois = String.format("%02d", dateRef.getMonthValue());
        int annee = dateRef.getYear();

        SessionPaie sessionLot = sessionPaieRepository.findFirstByMoisAndAnneeOrderByIdDesc(mois, annee).orElse(null);
        if (sessionLot == null) {
            String[] moisNoms = {"Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"};
            String nomMois = (dateRef.getMonthValue() >= 1 && dateRef.getMonthValue() <= 12) ? moisNoms[dateRef.getMonthValue() - 1] : "Mois " + mois;

            SessionPaie newSession = SessionPaie.builder()
                    .codeSession(String.format("SESS-%d-%s", annee, mois))
                    .mois(mois)
                    .annee(annee)
                    .periode(nomMois + " " + annee)
                    .typeSession(lot.getTypeSession() != null ? lot.getTypeSession() : "PAIE_NORMALE")
                    .statut("GENERE")
                    .nombreEmployes(employees.size())
                    .nombreValide(0)
                    .build();

            int sessSuffix = 1;
            String baseSessCode = newSession.getCodeSession();
            while (sessionPaieRepository.findByCodeSession(newSession.getCodeSession()).isPresent()) {
                newSession.setCodeSession(String.format("%s-%d", baseSessCode, sessSuffix++));
            }
            sessionLot = sessionPaieRepository.save(newSession);
        }

        List<Bulletin> generatedBulletins = new ArrayList<>();

        for (Employee emp : employees) {
            String baseLotCode = "BLT-" + (lot.getName() != null ? lot.getName().replaceAll("\\s+", "-") : "LOT") + "-" + (emp.getMatricule() != null ? emp.getMatricule() : "EMP");
            if (baseLotCode.length() > 60) baseLotCode = baseLotCode.substring(0, 60);
            String finalLotCode = baseLotCode;
            if (bulletinRepository.findByCode(finalLotCode).isPresent()) {
                long count = bulletinRepository.countByEmployeeId(emp.getId()) + 1;
                finalLotCode = String.format("%s-%d", baseLotCode, count);
                while (bulletinRepository.findByCode(finalLotCode).isPresent()) {
                    finalLotCode = String.format("%s-%d", baseLotCode, ++count);
                }
            }

            Bulletin b = Bulletin.builder()
                    .bulletinLot(lot)
                    .sessionPaie(sessionLot)
                    .employee(emp)
                    .code(finalLotCode)
                    .typeSession(lot.getTypeSession())
                    .dateFrom(lot.getDateFrom())
                    .dateTo(lot.getDateTo())
                    .scheduledWorkingDays(new BigDecimal("30.00"))
                    .workedDays(new BigDecimal("30.00"))
                    .build();

            // Lignes du bulletin
            List<BulletinLine> lines = new ArrayList<>();

            // 1. Salaire de base (résolu depuis PostgreSQL)
            SituationSalariale situation = situationRepository.findByEmployeeId(emp.getId()).orElse(null);
            BigDecimal salaireBase = BigDecimal.ZERO;
            if (situation != null && situation.getSalaireBase() != null && situation.getSalaireBase() > 0) {
                salaireBase = BigDecimal.valueOf(situation.getSalaireBase()).setScale(2, RoundingMode.HALF_UP);
            } else if (situation != null && situation.getGrilleSalariale() != null && situation.getGrilleSalariale().getBasicSalary() != null) {
                salaireBase = situation.getGrilleSalariale().getBasicSalary().setScale(2, RoundingMode.HALF_UP);
            } else if (emp.getGrilleSalariale() != null && emp.getGrilleSalariale().getBasicSalary() != null) {
                salaireBase = emp.getGrilleSalariale().getBasicSalary().setScale(2, RoundingMode.HALF_UP);
            }

            // Calcul automatique du nombre de jours travaillés selon dateEmbauche (prorata temporis)
            BigDecimal scheduledDays = new BigDecimal("30.00");
            BigDecimal workedDays = new BigDecimal("30.00");
            LocalDate debutPeriode = lot.getDateFrom();
            LocalDate finPeriode = lot.getDateTo();
            if (emp.getDateEmbauche() != null && !emp.getDateEmbauche().isBlank() && debutPeriode != null) {
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

            BigDecimal ratio = workedDays.divide(scheduledDays, 6, RoundingMode.HALF_UP);
            if (ratio.compareTo(BigDecimal.ONE) > 0) ratio = BigDecimal.ONE;
            if (ratio.compareTo(BigDecimal.ZERO) < 0) ratio = BigDecimal.ZERO;

            salaireBase = salaireBase.multiply(ratio).setScale(2, RoundingMode.HALF_UP);

            boolean isGratif = lot.getTypeSession() != null && lot.getTypeSession().toUpperCase().contains("GRATIF");
            if (isGratif) {
                // Pour un lot de GRATIFICATION (13ème mois) :
                // Le Net = Brut = Salaire de Base (proratisé le cas échéant)
                // Aucune retenue sociale salariale (CNSS = 0), ni fiscale (IUTS = 0), ni précompte
                lines.add(BulletinLine.builder()
                        .bulletin(b)
                        .code("GRAT_ANN")
                        .libelle("Gratification Annuelle 13ème Mois")
                        .typeLigne("GAIN")
                        .baseCalcul(salaireBase)
                        .taux(new BigDecimal("100.00"))
                        .montant(salaireBase)
                        .ordre(1)
                        .build());

                b.setScheduledWorkingDays(scheduledDays);
                b.setWorkedDays(workedDays);
                b.setSalaireBase(salaireBase);
                b.setSalaireBrut(salaireBase);
                b.setTotalIndemnites(BigDecimal.ZERO);
                b.setTotalAvoirs(BigDecimal.ZERO);
                b.setTotalPrecomptes(BigDecimal.ZERO);
                b.setCotisationCnss(BigDecimal.ZERO);
                b.setImpotIuts(BigDecimal.ZERO);
                b.setTotalRetenues(BigDecimal.ZERO);
                b.setTotalCotisationsPatronales(BigDecimal.ZERO);
                b.setSalaireNet(salaireBase); // NET = BRUT !
                b.setStatut("GENERE");
                b.setDateCalcul(java.time.LocalDateTime.now());

                for (BulletinLine l : lines) {
                    b.addLine(l);
                }
                generatedBulletins.add(bulletinRepository.save(b));
                continue;
            }

            lines.add(BulletinLine.builder()
                    .bulletin(b)
                    .code("SAL_BASE")
                    .libelle("Salaire de Base")
                    .typeLigne("GAIN")
                    .baseCalcul(salaireBase)
                    .taux(new BigDecimal("100.00"))
                    .montant(salaireBase)
                    .ordre(1)
                    .build());

            // 2. Avoirs actifs
            BigDecimal totalAvoirs = BigDecimal.ZERO;
            List<Avoir> avoirs = avoirRepository.findByEmployeeIdAndStatut(emp.getId(), "ACTIF");
            for (Avoir a : avoirs) {
                if (a.getAmount() != null && a.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal m = a.getAmount();
                    if (a.getEcheance() != null && a.getEcheance() > 1 && a.getMontantRestant() != null) {
                        m = a.getAmount().divide(new BigDecimal(a.getEcheance()), 0, RoundingMode.HALF_UP);
                    }
                    if (a.getMontantRestant() != null && a.getMontantRestant().compareTo(BigDecimal.ZERO) > 0) {
                        m = m.min(a.getMontantRestant());
                    }
                    totalAvoirs = totalAvoirs.add(m);

                    lines.add(BulletinLine.builder()
                            .bulletin(b)
                            .code(a.getSalaryElement() != null ? a.getSalaryElement().getCode() : "AVOIR")
                            .libelle(a.getSalaryElement() != null ? a.getSalaryElement().getName() : "Avoir Collaborateur")
                            .typeLigne("GAIN")
                            .baseCalcul(a.getAmount())
                            .taux(new BigDecimal("100.00"))
                            .montant(m)
                            .ordre(10)
                            .build());
                }
            }

            BigDecimal brut = salaireBase.add(totalAvoirs);

            BigDecimal totalPrecomptesMontant = BigDecimal.ZERO;
            List<Precompte> precomptes = precompteRepository.findByEmployeeIdAndStatut(emp.getId(), "EN_COURS");
            if (precomptes.isEmpty()) {
                precomptes = precompteRepository.findByEmployeeIdAndStatut(emp.getId(), "ACTIF");
            }
            for (Precompte p : precomptes) {
                if (p.getAmount() != null && p.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal retenue = p.getAmount();
                    if (p.getRetenueMensuelle() != null && p.getRetenueMensuelle().compareTo(BigDecimal.ZERO) > 0) {
                        retenue = p.getRetenueMensuelle();
                    } else if (p.getEcheance() != null && p.getEcheance() > 1) {
                        retenue = p.getAmount().divide(new BigDecimal(p.getEcheance()), 0, RoundingMode.HALF_UP);
                    }
                    if (p.getMontantRestant() != null && p.getMontantRestant().compareTo(BigDecimal.ZERO) > 0) {
                        retenue = retenue.min(p.getMontantRestant());
                    }
                    totalPrecomptesMontant = totalPrecomptesMontant.add(retenue);

                    lines.add(BulletinLine.builder()
                            .code(p.getSalaryElement() != null ? p.getSalaryElement().getCode() : "PREC")
                            .libelle(p.getSalaryElement() != null ? p.getSalaryElement().getName() : "Précompte / Retenue")
                            .typeLigne("PRECOMPTE")
                            .baseCalcul(p.getAmount())
                            .taux(new BigDecimal("100.00"))
                            .montant(retenue)
                            .ordre(30)
                            .build());
                }
            }

            // 4. Cotisations CNSS Salariale 5.5% sur le Brut Réel
            BigDecimal cnss = brut.multiply(new BigDecimal("0.055")).setScale(0, RoundingMode.HALF_UP);
            lines.add(BulletinLine.builder()
                    .code("CNSS_SAL")
                    .libelle("Sécurité Sociale (CNSS 5.5%)")
                    .typeLigne("RETENUE_SOCIALE")
                    .baseCalcul(brut)
                    .taux(new BigDecimal("5.50"))
                    .montant(cnss)
                    .ordre(20)
                    .build());

            // 5. Impôt IUTS (sur la base imposable)
            BigDecimal abattement = salaireBase.multiply(new BigDecimal("0.25")).setScale(0, RoundingMode.HALF_UP);
            BigDecimal baseImp = brut.subtract(abattement).max(BigDecimal.ZERO);
            BigDecimal iuts = baseImp.multiply(new BigDecimal("0.0675")).setScale(0, RoundingMode.HALF_UP);
            lines.add(BulletinLine.builder()
                    .code("IUTS")
                    .libelle("Impôt Unique sur Traitements et Salaires")
                    .typeLigne("IMPOT")
                    .baseCalcul(baseImp)
                    .taux(new BigDecimal("6.75"))
                    .montant(iuts)
                    .ordre(25)
                    .build());

            BigDecimal totalRetenues = cnss.add(iuts).add(totalPrecomptesMontant);
            BigDecimal net = brut.subtract(totalRetenues).max(BigDecimal.ZERO);

            b.setScheduledWorkingDays(scheduledDays);
            b.setWorkedDays(workedDays);
            b.setSalaireBase(salaireBase);
            b.setSalaireBrut(brut);
            b.setTotalAvoirs(totalAvoirs);
            b.setTotalPrecomptes(totalPrecomptesMontant);
            b.setCotisationCnss(cnss);
            b.setImpotIuts(iuts);
            b.setTotalRetenues(totalRetenues);
            b.setSalaireNet(net);
            b.setStatut("GENERE");
            b.setDateCalcul(java.time.LocalDateTime.now());

            for (BulletinLine l : lines) {
                b.addLine(l);
            }
            generatedBulletins.add(bulletinRepository.save(b));
        }

        lot.setNombreBulletin(generatedBulletins.size());
        lot.setStatut("GENERE");
        bulletinLotRepository.save(lot);

        return generatedBulletins.stream()
                .map(this::mapBulletinToSummaryDto)
                .collect(Collectors.toList());
    }

    // --- MAPPERS ---
    private BulletinLotResponseDto mapLotToDto(BulletinLot lot) {
        return BulletinLotResponseDto.builder()
                .id(lot.getId())
                .name(lot.getName())
                .dateFrom(lot.getDateFrom())
                .dateTo(lot.getDateTo())
                .typeSession(lot.getTypeSession())
                .nombreBulletin(lot.getNombreBulletin())
                .nombreValide(lot.getNombreValide())
                .statut(lot.getStatut())
                .build();
    }

    private BulletinSummaryResponseDto mapBulletinToSummaryDto(Bulletin b) {
        BigDecimal totalBrut = BigDecimal.ZERO;
        BigDecimal totalRetenues = BigDecimal.ZERO;

        if (b.getLines() != null) {
            for (BulletinLine l : b.getLines()) {
                if ("GAIN".equals(l.getTypeLigne())) {
                    totalBrut = totalBrut.add(l.getMontant() != null ? l.getMontant() : BigDecimal.ZERO);
                } else {
                    totalRetenues = totalRetenues.add(l.getMontant() != null ? l.getMontant() : BigDecimal.ZERO);
                }
            }
        }

        return BulletinSummaryResponseDto.builder()
                .id(b.getId())
                .code(b.getCode())
                .employeeId(b.getEmployee() != null ? b.getEmployee().getId() : null)
                .employeeName(b.getEmployee() != null ? b.getEmployee().getNom() + " " + b.getEmployee().getPrenom() : "AGENT")
                .matricule(b.getEmployee() != null ? b.getEmployee().getMatricule() : "EMP-000")
                .dateFrom(b.getDateFrom())
                .dateTo(b.getDateTo())
                .workedDays(b.getWorkedDays())
                .totalBrut(totalBrut)
                .totalRetenues(totalRetenues)
                .netAPayer(totalBrut.subtract(totalRetenues))
                .statut(b.getStatut())
                .build();
    }
}
