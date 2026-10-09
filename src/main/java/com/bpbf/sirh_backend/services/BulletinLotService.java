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
    private final BulletinService bulletinService;
    private final AuditLogService auditLogService;


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
            Bulletin b = bulletinService.computeAndSaveBulletin(sessionLot, emp, null, null);
            if (b != null) {
                b.setBulletinLot(lot);
                b = bulletinRepository.save(b);
                generatedBulletins.add(b);
            }
        }

        lot.setNombreBulletin(generatedBulletins.size());
        lot.setStatut("GENERE");
        bulletinLotRepository.save(lot);

        auditLogService.logAction("UTILISATEUR_RH", "GENERATION_LOT_PAIE", "BulletinLot", lot.getId(),
                "Génération avec succès de " + generatedBulletins.size() + " bulletin(s) de paie pour le lot: " + lot.getName());

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
