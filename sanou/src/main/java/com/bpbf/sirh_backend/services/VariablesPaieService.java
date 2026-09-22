package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.paie.*;
import com.bpbf.sirh_backend.entities.Avoir;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.entities.Precompte;
import com.bpbf.sirh_backend.entities.SalaryElement;
import com.bpbf.sirh_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VariablesPaieService {

    private final AvoirRepository avoirRepository;
    private final PrecompteRepository precompteRepository;
    private final SalaryElementRepository salaryElementRepository;
    private final EmployeeRepository employeeRepository;
    private final JdbcTemplate jdbcTemplate;

    // --- AVOIRS ---
    @Transactional(readOnly = true)
    public List<AvoirResponseDto> getAllAvoirs() {
        return avoirRepository.findAll().stream()
                .map(this::mapAvoirToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AvoirResponseDto> getAvoirsByEmployee(Long employeeId) {
        return avoirRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapAvoirToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AvoirResponseDto getAvoirById(Long id) {
        return avoirRepository.findById(id)
                .map(this::mapAvoirToDto)
                .orElseThrow(() -> new RuntimeException("Avoir non trouvé: " + id));
    }

    @Transactional(readOnly = true)
    public String generateNextAvoirReference() {
        int year = LocalDate.now().getYear();
        long count = avoirRepository.count() + 1;
        String ref = String.format("AVR-%d-%04d", year, count);
        int guard = 0;
        while (avoirRepository.existsByReference(ref)) {
            count++;
            ref = String.format("AVR-%d-%04d", year, count);
            if (++guard > 1000) break;
        }
        return ref;
    }

    @Transactional
    public AvoirResponseDto createAvoir(AvoirRequestDto dto) {
        SalaryElement element = null;
        if (dto.getSalaryElementId() != null) {
            element = salaryElementRepository.findById(dto.getSalaryElementId()).orElse(null);
        }

        // Référence automatique pour les rappels / avoirs
        String ref = dto.getReference();
        if (ref == null || ref.trim().isEmpty() || "/".equals(ref.trim())) {
            ref = generateNextAvoirReference();
        } else {
            ref = ref.trim();
        }

        BigDecimal amount = dto.getAmount() != null ? dto.getAmount() : BigDecimal.ZERO;
        LocalDate dateDebut = dto.getDateDebut() != null ? dto.getDateDebut() : LocalDate.now();

        // Règle métier : un rappel de salaire est un versement ponctuel rétroactif (pas d'échéancier multi-mois)
        int echeance = 1;

        Avoir avoir = Avoir.builder()
                .employeeId(dto.getEmployeeId())
                .salaryElement(element)
                .reference(ref)
                .motif(dto.getMotif() != null && !dto.getMotif().trim().isEmpty() ? dto.getMotif().trim() : "-")
                .motifAnnulation(dto.getMotifAnnulation())
                .dateDebut(dateDebut)
                .amount(amount)
                .montantRestant(dto.getMontantRestant() != null ? dto.getMontantRestant() : amount)
                .echeance(echeance)
                .dateEcheance(dto.getDateEcheance() != null ? dto.getDateEcheance() : dateDebut)
                .statut(dto.getStatut() != null ? dto.getStatut() : "ACTIF")
                .build();

        return mapAvoirToDto(avoirRepository.save(avoir));
    }

    @Transactional
    public AvoirResponseDto updateAvoir(Long id, AvoirRequestDto dto) {
        Avoir avoir = avoirRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avoir non trouvé: " + id));

        if (dto.getSalaryElementId() != null) {
            SalaryElement element = salaryElementRepository.findById(dto.getSalaryElementId()).orElse(null);
            avoir.setSalaryElement(element);
        }

        if (dto.getEmployeeId() != null) {
            avoir.setEmployeeId(dto.getEmployeeId());
        }

        if (dto.getReference() != null && !dto.getReference().trim().isEmpty() && !"/".equals(dto.getReference().trim())) {
            avoir.setReference(dto.getReference().trim());
        } else if (avoir.getReference() == null || "/".equals(avoir.getReference().trim())) {
            avoir.setReference(generateNextAvoirReference());
        }

        if (dto.getMotif() != null) avoir.setMotif(dto.getMotif());
        if (dto.getMotifAnnulation() != null) avoir.setMotifAnnulation(dto.getMotifAnnulation());
        if (dto.getDateDebut() != null) avoir.setDateDebut(dto.getDateDebut());
        if (dto.getAmount() != null) avoir.setAmount(dto.getAmount());
        if (dto.getMontantRestant() != null) avoir.setMontantRestant(dto.getMontantRestant());
        avoir.setEcheance(1);
        if (dto.getDateEcheance() != null) avoir.setDateEcheance(dto.getDateEcheance());
        if (dto.getStatut() != null) avoir.setStatut(dto.getStatut());

        return mapAvoirToDto(avoirRepository.save(avoir));
    }

    @Transactional
    public void deleteAvoir(Long id) {
        avoirRepository.deleteById(id);
    }

    // --- PRECOMPTES ---
    @Transactional(readOnly = true)
    public List<PrecompteResponseDto> getAllPrecomptes() {
        return precompteRepository.findAll().stream()
                .map(this::mapPrecompteToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PrecompteResponseDto getPrecompteById(Long id) {
        return precompteRepository.findById(id)
                .map(this::mapPrecompteToDto)
                .orElseThrow(() -> new RuntimeException("Précompte non trouvé: " + id));
    }

    @Transactional(readOnly = true)
    public List<PrecompteResponseDto> getPrecomptesByEmployee(Long employeeId) {
        return precompteRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapPrecompteToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public String generateNextReference() {
        int year = LocalDate.now().getYear();
        long count = precompteRepository.count() + 1;
        String ref = String.format("PREC-%d-%04d", year, count);
        int guard = 0;
        while (precompteRepository.existsByReference(ref)) {
            count++;
            ref = String.format("PREC-%d-%04d", year, count);
            if (++guard > 1000) break;
        }
        return ref;
    }

    @Transactional
    public PrecompteResponseDto createPrecompte(PrecompteRequestDto dto) {
        SalaryElement element = null;
        if (dto.getSalaryElementId() != null) {
            element = salaryElementRepository.findById(dto.getSalaryElementId()).orElse(null);
        }

        // 1. Référence automatique si vide ou non renseignée
        String ref = dto.getReference();
        if (ref == null || ref.trim().isEmpty() || "/".equals(ref.trim())) {
            ref = generateNextReference();
        } else {
            ref = ref.trim();
        }

        // 2. Calcul automatique : montant total vs mensualité négociée autorisée
        BigDecimal amount = dto.getAmount() != null ? dto.getAmount() : BigDecimal.ZERO;
        BigDecimal retMensuelle = dto.getRetenueMensuelle();
        Integer echeance = dto.getEcheance();
        LocalDate dateDebut = dto.getDateDebut() != null ? dto.getDateDebut() : LocalDate.now();
        LocalDate dateEcheance = dto.getDateEcheance();

        if (retMensuelle != null && retMensuelle.compareTo(BigDecimal.ZERO) > 0 && amount.compareTo(BigDecimal.ZERO) > 0) {
            // Règle métier : l'utilisateur saisit la mensualité autorisée, le système calcule le nombre d'échéances
            echeance = amount.divide(retMensuelle, 0, RoundingMode.CEILING).intValue();
            if (echeance <= 0) echeance = 1;
            if (dateEcheance == null && dateDebut != null) {
                dateEcheance = dateDebut.plusMonths(echeance);
            }
        } else if (echeance != null && echeance > 0 && amount.compareTo(BigDecimal.ZERO) > 0) {
            retMensuelle = amount.divide(BigDecimal.valueOf(echeance), 2, RoundingMode.HALF_UP);
            if (dateEcheance == null && dateDebut != null) {
                dateEcheance = dateDebut.plusMonths(echeance);
            }
        } else {
            if (echeance == null || echeance <= 0) echeance = 1;
            if (retMensuelle == null) retMensuelle = amount;
        }

        BigDecimal restant = dto.getMontantRestant() != null ? dto.getMontantRestant() : amount;

        Precompte precompte = Precompte.builder()
                .employeeId(dto.getEmployeeId())
                .salaryElement(element)
                .reference(ref)
                .motif(dto.getMotif() != null && !dto.getMotif().trim().isEmpty() ? dto.getMotif().trim() : "-")
                .motifAnnulation(dto.getMotifAnnulation())
                .dateDebut(dateDebut)
                .amount(amount)
                .montantRestant(restant)
                .retenueMensuelle(retMensuelle)
                .echeance(echeance)
                .dateEcheance(dateEcheance)
                .statut(dto.getStatut() != null ? dto.getStatut() : "EN_COURS")
                .build();

        return mapPrecompteToDto(precompteRepository.save(precompte));
    }

    @Transactional
    public PrecompteResponseDto updatePrecompte(Long id, PrecompteRequestDto dto) {
        Precompte precompte = precompteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Précompte non trouvé: " + id));

        if (dto.getSalaryElementId() != null) {
            SalaryElement element = salaryElementRepository.findById(dto.getSalaryElementId()).orElse(null);
            precompte.setSalaryElement(element);
        }

        if (dto.getEmployeeId() != null) {
            precompte.setEmployeeId(dto.getEmployeeId());
        }

        if (dto.getReference() != null && !dto.getReference().trim().isEmpty() && !"/".equals(dto.getReference().trim())) {
            precompte.setReference(dto.getReference().trim());
        } else if (precompte.getReference() == null || "/".equals(precompte.getReference().trim())) {
            precompte.setReference(generateNextReference());
        }

        if (dto.getMotif() != null) precompte.setMotif(dto.getMotif());
        if (dto.getMotifAnnulation() != null) precompte.setMotifAnnulation(dto.getMotifAnnulation());
        if (dto.getDateDebut() != null) precompte.setDateDebut(dto.getDateDebut());

        BigDecimal amount = dto.getAmount() != null ? dto.getAmount() : precompte.getAmount();
        precompte.setAmount(amount);

        BigDecimal retMensuelle = dto.getRetenueMensuelle();
        Integer echeance = dto.getEcheance();
        LocalDate dateDebut = precompte.getDateDebut() != null ? precompte.getDateDebut() : LocalDate.now();
        LocalDate dateEcheance = dto.getDateEcheance();

        if (retMensuelle != null && retMensuelle.compareTo(BigDecimal.ZERO) > 0 && amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
            echeance = amount.divide(retMensuelle, 0, RoundingMode.CEILING).intValue();
            if (echeance <= 0) echeance = 1;
            if (dateEcheance == null) {
                dateEcheance = dateDebut.plusMonths(echeance);
            }
            precompte.setRetenueMensuelle(retMensuelle);
            precompte.setEcheance(echeance);
            precompte.setDateEcheance(dateEcheance);
        } else if (echeance != null && echeance > 0 && amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
            retMensuelle = amount.divide(BigDecimal.valueOf(echeance), 2, RoundingMode.HALF_UP);
            if (dateEcheance == null) {
                dateEcheance = dateDebut.plusMonths(echeance);
            }
            precompte.setRetenueMensuelle(retMensuelle);
            precompte.setEcheance(echeance);
            precompte.setDateEcheance(dateEcheance);
        }

        if (dto.getMontantRestant() != null) {
            precompte.setMontantRestant(dto.getMontantRestant());
        }
        if (dto.getStatut() != null) {
            precompte.setStatut(dto.getStatut());
        }

        return mapPrecompteToDto(precompteRepository.save(precompte));
    }

    @Transactional
    public void deletePrecompte(Long id) {
        precompteRepository.deleteById(id);
    }

    private AvoirResponseDto mapAvoirToDto(Avoir a) {
        String empName = "AGENT";
        String matricule = "EMP-000";
        if (a.getEmployeeId() != null) {
            Employee emp = employeeRepository.findById(a.getEmployeeId()).orElse(null);
            if (emp != null) {
                empName = emp.getNom() + " " + emp.getPrenom();
                matricule = emp.getMatricule();
            }
        }

        BigDecimal montantInitial = a.getAmount() != null ? a.getAmount() : BigDecimal.ZERO;
        String ref = a.getReference() != null && !a.getReference().trim().isEmpty() ? a.getReference().trim() : "/";

        AvoirResponseDto dto = new AvoirResponseDto();
        dto.setId(a.getId());
        dto.setNumero(ref);
        dto.setReference(ref);
        dto.setMotif(a.getMotif() != null ? a.getMotif() : "-");
        dto.setMotifAnnulation(a.getMotifAnnulation() != null ? a.getMotifAnnulation() : "-");
        dto.setDateDebut(a.getDateDebut());
        dto.setEmployeeId(a.getEmployeeId());
        dto.setEmployeeName(empName);
        dto.setMatricule(matricule);
        dto.setSalaryElementId(a.getSalaryElement() != null ? a.getSalaryElement().getId() : null);
        dto.setSalaryElementName(a.getSalaryElement() != null ? a.getSalaryElement().getName() : "RAPPEL DE SALAIRE");
        dto.setSalaryElementCode(a.getSalaryElement() != null ? a.getSalaryElement().getCode() : "RAPPEL_SALAIRE");
        dto.setAmount(montantInitial);
        dto.setMontantRestant(a.getMontantRestant() != null ? a.getMontantRestant() : montantInitial);
        dto.setMontantVerse(BigDecimal.ZERO);
        dto.setVersementMensuel(montantInitial);
        dto.setEcheance(1);
        dto.setDateEcheance(a.getDateEcheance() != null ? a.getDateEcheance() : a.getDateDebut());
        dto.setStatut(a.getStatut() != null ? a.getStatut() : "ACTIF");
        dto.setVersements(new ArrayList<>());
        return dto;
    }

    private List<AvoirVersementDto> buildAvoirVersements(Avoir a, String empName, BigDecimal versMensuel, BigDecimal verseTotal) {
        List<AvoirVersementDto> list = new ArrayList<>();
        try {
            String elemCode = a.getSalaryElement() != null ? a.getSalaryElement().getCode() : "";
            String elemName = a.getSalaryElement() != null ? a.getSalaryElement().getName() : "";

            String sql = "SELECT b.id, b.date_from, bl.montant " +
                         "FROM bulletin_line bl " +
                         "JOIN bulletin b ON bl.bulletin_id = b.id " +
                         "WHERE b.employee_id = ? AND bl.type_ligne = 'GAIN' " +
                         "AND (bl.code = ? OR bl.libelle ILIKE ?) " +
                         "ORDER BY b.date_from ASC";

            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, a.getEmployeeId(), elemCode, "%" + elemName + "%");
            if (!rows.isEmpty()) {
                BigDecimal solde = a.getAmount() != null ? a.getAmount() : BigDecimal.ZERO;
                for (Map<String, Object> r : rows) {
                    Long bId = ((Number) r.get("id")).longValue();
                    java.sql.Date d = (java.sql.Date) r.get("date_from");
                    LocalDate datePaiement = d != null ? d.toLocalDate() : LocalDate.now();
                    BigDecimal montant = (BigDecimal) r.get("montant");
                    solde = solde.subtract(montant != null ? montant : BigDecimal.ZERO);

                    String moisStr = getMoisNom(datePaiement.getMonthValue()) + "-" + datePaiement.getYear();
                    String fiche = "Bulletin de paie de " + empName + " pour " + moisStr;

                    list.add(AvoirVersementDto.builder()
                            .bulletinId(bId)
                            .fichePaie(fiche)
                            .periode(moisStr)
                            .datePaiement(datePaiement)
                            .montant(montant)
                            .soldeApres(solde.max(BigDecimal.ZERO))
                            .build());
                }
                return list;
            }
        } catch (Exception e) {
            log.debug("Notice query real bulletin lines for avoir: {}", e.getMessage());
        }

        if (verseTotal != null && verseTotal.compareTo(BigDecimal.ZERO) > 0 && versMensuel != null && versMensuel.compareTo(BigDecimal.ZERO) > 0) {
            int nbVersements = verseTotal.divide(versMensuel, 0, RoundingMode.HALF_UP).intValue();
            if (nbVersements <= 0) nbVersements = 1;

            LocalDate baseDate = a.getDateDebut() != null ? a.getDateDebut() : (a.getDateEcheance() != null ? a.getDateEcheance().minusMonths(a.getEcheance() != null ? a.getEcheance() : 1) : LocalDate.now().minusMonths(nbVersements));
            BigDecimal soldeCourant = a.getAmount() != null ? a.getAmount() : BigDecimal.ZERO;

            for (int i = 0; i < nbVersements; i++) {
                LocalDate dateV = baseDate.plusMonths(i);
                BigDecimal montantV = versMensuel;
                if (i == nbVersements - 1) {
                    BigDecimal cumulPrecedent = versMensuel.multiply(BigDecimal.valueOf(i));
                    montantV = verseTotal.subtract(cumulPrecedent);
                }
                soldeCourant = soldeCourant.subtract(montantV);
                String moisStr = getMoisNom(dateV.getMonthValue()) + "-" + dateV.getYear();
                String fiche = "Bulletin de paie de " + empName + " pour " + moisStr;

                list.add(AvoirVersementDto.builder()
                        .bulletinId(null)
                        .fichePaie(fiche)
                        .periode(moisStr)
                        .datePaiement(dateV)
                        .montant(montantV)
                        .soldeApres(soldeCourant.max(BigDecimal.ZERO))
                        .build());
            }
        }

        return list;
    }

    private PrecompteResponseDto mapPrecompteToDto(Precompte p) {
        String empName = "AGENT";
        String matricule = "EMP-000";
        if (p.getEmployeeId() != null) {
            Employee emp = employeeRepository.findById(p.getEmployeeId()).orElse(null);
            if (emp != null) {
                empName = emp.getNom() + " " + emp.getPrenom();
                matricule = emp.getMatricule();
            }
        }

        BigDecimal montantInitial = p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO;
        Integer echeance = p.getEcheance() != null && p.getEcheance() > 0 ? p.getEcheance() : 1;
        BigDecimal retMensuelle = p.getRetenueMensuelle();
        if (retMensuelle == null || retMensuelle.compareTo(BigDecimal.ZERO) <= 0) {
            retMensuelle = montantInitial.divide(new BigDecimal(echeance), 2, RoundingMode.HALF_UP);
        }

        String ref = p.getReference() != null && !p.getReference().trim().isEmpty() && !"/".equals(p.getReference().trim()) 
                ? p.getReference().trim() 
                : String.format("PREC-2026-%04d", p.getId() != null ? p.getId() : 1);

        // 1. Chercher les versements réels enregistrés sur les bulletins
        List<PrecompteVersementDto> versements = buildVersements(p, empName, retMensuelle, null);

        BigDecimal rembourse;
        BigDecimal restant;
        if (!versements.isEmpty()) {
            BigDecimal totalVersements = versements.stream()
                    .map(PrecompteVersementDto::getMontant)
                    .filter(java.util.Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            rembourse = totalVersements;
            restant = montantInitial.subtract(totalVersements).max(BigDecimal.ZERO);

            // Resynchroniser l'entité en base si nécessaire
            if (p.getMontantRestant() == null || p.getMontantRestant().compareTo(restant) != 0) {
                p.setMontantRestant(restant);
                if (restant.compareTo(BigDecimal.ZERO) <= 0) {
                    p.setStatut("SOLDE");
                }
                precompteRepository.save(p);
            }
        } else {
            restant = p.getMontantRestant() != null ? p.getMontantRestant() : montantInitial;
            rembourse = montantInitial.subtract(restant).max(BigDecimal.ZERO);
            if (rembourse.compareTo(BigDecimal.ZERO) > 0) {
                versements = buildVersements(p, empName, retMensuelle, rembourse);
            }
        }

        PrecompteResponseDto dto = new PrecompteResponseDto();
        dto.setId(p.getId());
        dto.setNumero(ref);
        dto.setReference(ref);
        dto.setMotif(p.getMotif() != null ? p.getMotif() : "-");
        dto.setMotifAnnulation(p.getMotifAnnulation() != null ? p.getMotifAnnulation() : "-");
        dto.setDateDebut(p.getDateDebut());
        dto.setEmployeeId(p.getEmployeeId());
        dto.setEmployeeName(empName);
        dto.setMatricule(matricule);
        dto.setSalaryElementId(p.getSalaryElement() != null ? p.getSalaryElement().getId() : null);
        dto.setSalaryElementName(p.getSalaryElement() != null ? p.getSalaryElement().getName() : "AVANCE SUR SALAIRE");
        dto.setSalaryElementCode(p.getSalaryElement() != null ? p.getSalaryElement().getCode() : "AVANCE_SAL");
        dto.setAmount(montantInitial);
        dto.setMontantRestant(restant);
        dto.setMontantRembourse(rembourse);
        dto.setRetenueMensuelle(retMensuelle);
        dto.setEcheance(echeance);
        dto.setDateEcheance(p.getDateEcheance());
        dto.setStatut(p.getStatut() != null ? p.getStatut() : "EN_COURS");
        dto.setVersements(versements);
        return dto;
    }

    private List<PrecompteVersementDto> buildVersements(Precompte p, String empName, BigDecimal retMensuelle, BigDecimal rembourseTotal) {
        List<PrecompteVersementDto> list = new ArrayList<>();
        // 1. Chercher d'abord dans les vraies lignes de bulletins enregistrées en BDD
        try {
            String elemCode = p.getSalaryElement() != null ? p.getSalaryElement().getCode() : "";
            String elemName = p.getSalaryElement() != null ? p.getSalaryElement().getName() : "";

            String sql = "SELECT b.id, b.date_from, bl.montant " +
                         "FROM bulletin_line bl " +
                         "JOIN bulletin b ON bl.bulletin_id = b.id " +
                         "WHERE b.employee_id = ? AND bl.type_ligne = 'PRECOMPTE' " +
                         "AND (bl.code = ? OR bl.libelle ILIKE ?) " +
                         "ORDER BY b.date_from ASC";

            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, p.getEmployeeId(), elemCode, "%" + elemName + "%");
            if (!rows.isEmpty()) {
                BigDecimal solde = p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO;
                for (Map<String, Object> r : rows) {
                    Long bId = ((Number) r.get("id")).longValue();
                    java.sql.Date d = (java.sql.Date) r.get("date_from");
                    LocalDate datePaiement = d != null ? d.toLocalDate() : LocalDate.now();
                    BigDecimal montant = (BigDecimal) r.get("montant");
                    solde = solde.subtract(montant != null ? montant : BigDecimal.ZERO);

                    String moisStr = getMoisNom(datePaiement.getMonthValue()) + "-" + datePaiement.getYear();
                    String fiche = "Bulletin de paie de " + empName + " pour " + moisStr;

                    list.add(PrecompteVersementDto.builder()
                            .bulletinId(bId)
                            .fichePaie(fiche)
                            .periode(moisStr)
                            .datePaiement(datePaiement)
                            .montant(montant)
                            .soldeApres(solde.max(BigDecimal.ZERO))
                            .build());
                }
                return list;
            }
        } catch (Exception e) {
            log.debug("Notice query real bulletin lines for precompte: {}", e.getMessage());
        }

        // 2. Si aucun bulletin formel n'est encore généré mais qu'un montant a déjà été remboursé
        // (ex: prêt en cours avec mensualités déjà prélevées comme dans l'image 2)
        if (rembourseTotal != null && rembourseTotal.compareTo(BigDecimal.ZERO) > 0 && retMensuelle != null && retMensuelle.compareTo(BigDecimal.ZERO) > 0) {
            int nbVersements = rembourseTotal.divide(retMensuelle, 0, RoundingMode.HALF_UP).intValue();
            if (nbVersements <= 0) nbVersements = 1;

            LocalDate baseDate = p.getDateDebut() != null ? p.getDateDebut() : (p.getDateEcheance() != null ? p.getDateEcheance().minusMonths(p.getEcheance() != null ? p.getEcheance() : 6) : LocalDate.of(2025, 1, 1));
            BigDecimal soldeCourant = p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO;

            for (int i = 0; i < nbVersements; i++) {
                LocalDate dateV = baseDate.plusMonths(i);
                BigDecimal montantV = retMensuelle;
                if (i == nbVersements - 1) {
                    BigDecimal cumulPrecedent = retMensuelle.multiply(BigDecimal.valueOf(i));
                    montantV = rembourseTotal.subtract(cumulPrecedent);
                }
                soldeCourant = soldeCourant.subtract(montantV);
                String moisStr = getMoisNom(dateV.getMonthValue()) + "-" + dateV.getYear();
                String fiche = "Bulletin de paie de " + empName + " pour " + moisStr;

                list.add(PrecompteVersementDto.builder()
                        .bulletinId(null)
                        .fichePaie(fiche)
                        .periode(moisStr)
                        .datePaiement(dateV)
                        .montant(montantV)
                        .soldeApres(soldeCourant.max(BigDecimal.ZERO))
                        .build());
            }
        }

        return list;
    }

    private String getMoisNom(int m) {
        String[] mois = {"", "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"};
        if (m >= 1 && m <= 12) return mois[m];
        return "mois-" + m;
    }
}
