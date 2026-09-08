package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.TropPercuDto;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.entities.SalaryElement;
import com.bpbf.sirh_backend.entities.TropPercu;
import com.bpbf.sirh_backend.repositories.EmployeeRepository;
import com.bpbf.sirh_backend.repositories.SalaryElementRepository;
import com.bpbf.sirh_backend.repositories.TropPercuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TropPercuService {

    private final TropPercuRepository tropPercuRepository;
    private final EmployeeRepository employeeRepository;
    private final SalaryElementRepository salaryElementRepository;

    @Transactional(readOnly = true)
    public List<TropPercuDto> getAll() {
        return tropPercuRepository.findAllByOrderByDateCreationDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TropPercuDto> getByEmployee(Long employeeId) {
        return tropPercuRepository.findByEmployeeId(employeeId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TropPercuDto> getByMoisApplication(String moisApplication) {
        return tropPercuRepository.findByMoisApplication(moisApplication).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TropPercuDto getById(Long id) {
        return tropPercuRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Trop-perçu non trouvé avec l'id: " + id));
    }

    @Transactional
    public TropPercuDto create(TropPercuDto dto) {
        if (dto.getEmployeeId() == null) {
            throw new IllegalArgumentException("L'identifiant de l'employé est obligatoire");
        }
        if (dto.getAmount() == null || dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Le montant du trop-perçu doit être supérieur à zéro");
        }
        if (dto.getMoisApplication() == null || dto.getMoisApplication().isBlank()) {
            throw new IllegalArgumentException("Le mois de déduction (application) est obligatoire");
        }

        SalaryElement element = null;
        if (dto.getSalaryElementId() != null) {
            element = salaryElementRepository.findById(dto.getSalaryElementId()).orElse(null);
        }

        TropPercu entity = TropPercu.builder()
                .employeeId(dto.getEmployeeId())
                .salaryElement(element)
                .moisOrigine(dto.getMoisOrigine())
                .moisApplication(dto.getMoisApplication())
                .amount(dto.getAmount())
                .motif(dto.getMotif())
                .statut(dto.getStatut() != null && !dto.getStatut().isBlank() ? dto.getStatut() : "EN_ATTENTE")
                .build();

        TropPercu saved = tropPercuRepository.save(entity);
        log.info("Nouveau trop-perçu enregistré (id={}) pour l'employé id={} d'un montant de {} FCFA (Application: {})",
                saved.getId(), saved.getEmployeeId(), saved.getAmount(), saved.getMoisApplication());
        return toDto(saved);
    }

    @Transactional
    public TropPercuDto update(Long id, TropPercuDto dto) {
        TropPercu entity = tropPercuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trop-perçu non trouvé avec l'id: " + id));

        if (dto.getSalaryElementId() != null) {
            SalaryElement element = salaryElementRepository.findById(dto.getSalaryElementId()).orElse(null);
            entity.setSalaryElement(element);
        } else {
            entity.setSalaryElement(null);
        }

        entity.setEmployeeId(dto.getEmployeeId());
        entity.setMoisOrigine(dto.getMoisOrigine());
        entity.setMoisApplication(dto.getMoisApplication());
        entity.setAmount(dto.getAmount());
        entity.setMotif(dto.getMotif());
        if (dto.getStatut() != null && !dto.getStatut().isBlank()) {
            entity.setStatut(dto.getStatut());
        }

        TropPercu updated = tropPercuRepository.save(entity);
        log.info("Trop-perçu mis à jour (id={})", updated.getId());
        return toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!tropPercuRepository.existsById(id)) {
            throw new RuntimeException("Trop-perçu introuvable pour suppression (id: " + id + ")");
        }
        tropPercuRepository.deleteById(id);
        log.info("Trop-perçu supprimé (id={})", id);
    }

    @Transactional
    public TropPercuDto changerStatut(Long id, String statut) {
        TropPercu entity = tropPercuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trop-perçu non trouvé avec l'id: " + id));
        entity.setStatut(statut);
        return toDto(tropPercuRepository.save(entity));
    }

    private TropPercuDto toDto(TropPercu entity) {
        TropPercuDto dto = TropPercuDto.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployeeId())
                .moisOrigine(entity.getMoisOrigine())
                .moisApplication(entity.getMoisApplication())
                .amount(entity.getAmount())
                .motif(entity.getMotif())
                .statut(entity.getStatut())
                .dateCreation(entity.getDateCreation())
                .build();

        if (entity.getEmployeeId() != null) {
            employeeRepository.findById(entity.getEmployeeId()).ifPresent(emp -> {
                String fullName = ((emp.getNom() != null ? emp.getNom() : "") + " " + (emp.getPrenom() != null ? emp.getPrenom() : "")).trim(); dto.setEmployeeName(fullName);
                dto.setMatricule(emp.getMatricule());
            });
        }

        if (entity.getSalaryElement() != null) {
            dto.setSalaryElementId(entity.getSalaryElement().getId());
            dto.setSalaryElementName(entity.getSalaryElement().getName());
            dto.setSalaryElementCode(entity.getSalaryElement().getCode());
        }

        return dto;
    }
}
