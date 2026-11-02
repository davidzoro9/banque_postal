package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.ParamTrancheLicenciementDto;
import com.bpbf.sirh_backend.entities.ParamTrancheLicenciement;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.repositories.ParamTrancheLicenciementRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParamTrancheLicenciementService {

    private final ParamTrancheLicenciementRepository repository;

    @PostConstruct
    public void initDefaultTranches() {
        try {
            if (repository.count() == 0) {
                List<ParamTrancheLicenciement> defaults = List.of(
                        ParamTrancheLicenciement.builder()
                                .code("TRANCHE_1_5")
                                .libelle("De la 1ʳᵉ à la 5ᵉ année")
                                .anneeDebut(1)
                                .anneeFin(5)
                                .taux(new BigDecimal("25.00"))
                                .description("25 % du salaire mensuel par année de service.")
                                .ordre(1)
                                .actif(true)
                                .build(),
                        ParamTrancheLicenciement.builder()
                                .code("TRANCHE_6_10")
                                .libelle("De la 6ᵉ à la 10ᵉ année")
                                .anneeDebut(6)
                                .anneeFin(10)
                                .taux(new BigDecimal("30.00"))
                                .description("30 % du salaire mensuel par année de service.")
                                .ordre(2)
                                .actif(true)
                                .build(),
                        ParamTrancheLicenciement.builder()
                                .code("TRANCHE_11_PLUS")
                                .libelle("Au-delà de la 10ᵉ année (11ᵉ année et plus)")
                                .anneeDebut(11)
                                .anneeFin(null)
                                .taux(new BigDecimal("40.00"))
                                .description("40 % du salaire mensuel par année de service.")
                                .ordre(3)
                                .actif(true)
                                .build()
                );
                repository.saveAll(defaults);
                log.info("Tranches d'indemnité de licenciement initialisées par défaut dans PostgreSQL.");
            }
        } catch (Exception e) {
            log.warn("Impossible d'initialiser les tranches de licenciement (peut-être déjà créées ou table en cours de migration): {}", e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<ParamTrancheLicenciementDto> getAll() {
        return repository.findAllByOrderByOrdreAscAnneeDebutAsc().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ParamTrancheLicenciementDto getById(Long id) {
        return repository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Tranche d'indemnité introuvable avec l'ID: " + id));
    }

    @Transactional
    public ParamTrancheLicenciementDto create(ParamTrancheLicenciementDto dto) {
        String cleanCode = dto.getCode() != null ? dto.getCode().trim().toUpperCase() : "TRANCHE_" + System.currentTimeMillis();
        cleanCode = cleanCode.replaceAll("[^A-Z0-9_]", "_");

        if (repository.existsByCode(cleanCode)) {
            cleanCode = cleanCode + "_" + System.currentTimeMillis();
        }

        ParamTrancheLicenciement entity = ParamTrancheLicenciement.builder()
                .code(cleanCode)
                .libelle(dto.getLibelle() != null ? dto.getLibelle().trim() : "Nouvelle tranche")
                .anneeDebut(dto.getAnneeDebut() != null ? dto.getAnneeDebut() : 1)
                .anneeFin(dto.getAnneeFin())
                .taux(dto.getTaux() != null ? dto.getTaux() : BigDecimal.ZERO)
                .description(dto.getDescription())
                .ordre(dto.getOrdre() != null ? dto.getOrdre() : 1)
                .actif(dto.getActif() != null ? dto.getActif() : true)
                .build();

        return toDto(repository.save(entity));
    }

    @Transactional
    public ParamTrancheLicenciementDto update(Long id, ParamTrancheLicenciementDto dto) {
        ParamTrancheLicenciement existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tranche d'indemnité introuvable avec l'ID: " + id));

        if (dto.getLibelle() != null && !dto.getLibelle().isBlank()) {
            existing.setLibelle(dto.getLibelle().trim());
        }
        if (dto.getAnneeDebut() != null) {
            existing.setAnneeDebut(dto.getAnneeDebut());
        }
        existing.setAnneeFin(dto.getAnneeFin()); // peut être null pour "au-delà"
        if (dto.getTaux() != null) {
            existing.setTaux(dto.getTaux());
        }
        if (dto.getDescription() != null) {
            existing.setDescription(dto.getDescription());
        }
        if (dto.getOrdre() != null) {
            existing.setOrdre(dto.getOrdre());
        }
        if (dto.getActif() != null) {
            existing.setActif(dto.getActif());
        }

        return toDto(repository.save(existing));
    }

    @Transactional
    public ParamTrancheLicenciementDto toggleActif(Long id) {
        ParamTrancheLicenciement existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tranche d'indemnité introuvable avec l'ID: " + id));
        existing.setActif(existing.getActif() == null || !existing.getActif());
        return toDto(repository.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    /**
     * Moteur de calcul dynamique de l'indemnité de licenciement par tranches configurables.
     * Découpe l'ancienneté selon les tranches actives enregistrées dans PostgreSQL.
     */
    @Transactional(readOnly = true)
    public BigDecimal calculateIndemniteLicenciement(BigDecimal sgm, double anciennete) {
        if (sgm == null || sgm.compareTo(BigDecimal.ZERO) <= 0 || anciennete <= 0) {
            return BigDecimal.ZERO;
        }

        List<ParamTrancheLicenciement> tranches;
        try {
            tranches = repository.findByActifTrueOrderByOrdreAscAnneeDebutAsc();
        } catch (Exception e) {
            tranches = new ArrayList<>();
        }

        if (tranches == null || tranches.isEmpty()) {
            // Barème de repli par défaut selon les spécifications
            // 1-5 ans: 25%, 6-10 ans: 30%, 11+ ans: 40%
            double ans = anciennete;
            BigDecimal part1 = BigDecimal.ZERO;
            BigDecimal part2 = BigDecimal.ZERO;
            BigDecimal part3 = BigDecimal.ZERO;
            if (ans > 0) {
                double t1 = Math.min(ans, 5.0);
                part1 = sgm.multiply(new BigDecimal("0.25")).multiply(BigDecimal.valueOf(t1));
            }
            if (ans > 5.0) {
                double t2 = Math.min(ans - 5.0, 5.0);
                part2 = sgm.multiply(new BigDecimal("0.30")).multiply(BigDecimal.valueOf(t2));
            }
            if (ans > 10.0) {
                double t3 = ans - 10.0;
                part3 = sgm.multiply(new BigDecimal("0.40")).multiply(BigDecimal.valueOf(t3));
            }
            return part1.add(part2).add(part3).setScale(0, RoundingMode.HALF_UP);
        }

        BigDecimal total = BigDecimal.ZERO;
        for (ParamTrancheLicenciement t : tranches) {
            int debut = t.getAnneeDebut() != null ? t.getAnneeDebut() : 1;
            Integer fin = t.getAnneeFin();
            BigDecimal taux = t.getTaux() != null ? t.getTaux() : BigDecimal.ZERO;

            if (anciennete < (debut - 1)) {
                continue;
            }

            double anneesDansTranche;
            if (fin != null) {
                anneesDansTranche = Math.min(anciennete, (double) fin) - (debut - 1);
            } else {
                anneesDansTranche = anciennete - (debut - 1);
            }
            anneesDansTranche = Math.max(0.0, anneesDansTranche);

            if (anneesDansTranche > 0 && taux.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal part = sgm.multiply(taux.divide(new BigDecimal("100"), 6, RoundingMode.HALF_UP))
                        .multiply(BigDecimal.valueOf(anneesDansTranche));
                total = total.add(part);
            }
        }

        return total.setScale(0, RoundingMode.HALF_UP);
    }

    private ParamTrancheLicenciementDto toDto(ParamTrancheLicenciement entity) {
        if (entity == null) return null;
        return ParamTrancheLicenciementDto.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .libelle(entity.getLibelle())
                .anneeDebut(entity.getAnneeDebut())
                .anneeFin(entity.getAnneeFin())
                .taux(entity.getTaux())
                .description(entity.getDescription())
                .ordre(entity.getOrdre())
                .actif(entity.getActif())
                .build();
    }
}
