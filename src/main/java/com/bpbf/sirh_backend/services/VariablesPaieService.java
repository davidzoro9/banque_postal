package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.paie.*;
import com.bpbf.sirh_backend.entities.Avoir;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.entities.Precompte;
import com.bpbf.sirh_backend.entities.SalaryElement;
import com.bpbf.sirh_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VariablesPaieService {

    private final AvoirRepository avoirRepository;
    private final PrecompteRepository precompteRepository;
    private final SalaryElementRepository salaryElementRepository;
    private final EmployeeRepository employeeRepository;

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

    @Transactional
    public AvoirResponseDto createAvoir(AvoirRequestDto dto) {
        SalaryElement element = null;
        if (dto.getSalaryElementId() != null) {
            element = salaryElementRepository.findById(dto.getSalaryElementId()).orElse(null);
        }

        Avoir avoir = Avoir.builder()
                .employeeId(dto.getEmployeeId())
                .salaryElement(element)
                .amount(dto.getAmount())
                .montantRestant(dto.getMontantRestant() != null ? dto.getMontantRestant() : dto.getAmount())
                .echeance(dto.getEcheance() != null ? dto.getEcheance() : 1)
                .dateEcheance(dto.getDateEcheance())
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

        avoir.setEmployeeId(dto.getEmployeeId());
        avoir.setAmount(dto.getAmount());
        avoir.setMontantRestant(dto.getMontantRestant());
        avoir.setEcheance(dto.getEcheance());
        avoir.setDateEcheance(dto.getDateEcheance());
        avoir.setStatut(dto.getStatut());

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
    public List<PrecompteResponseDto> getPrecomptesByEmployee(Long employeeId) {
        return precompteRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapPrecompteToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PrecompteResponseDto createPrecompte(PrecompteRequestDto dto) {
        SalaryElement element = null;
        if (dto.getSalaryElementId() != null) {
            element = salaryElementRepository.findById(dto.getSalaryElementId()).orElse(null);
        }

        Precompte precompte = Precompte.builder()
                .employeeId(dto.getEmployeeId())
                .salaryElement(element)
                .amount(dto.getAmount())
                .montantRestant(dto.getMontantRestant() != null ? dto.getMontantRestant() : dto.getAmount())
                .echeance(dto.getEcheance() != null ? dto.getEcheance() : 12)
                .dateEcheance(dto.getDateEcheance())
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

        precompte.setEmployeeId(dto.getEmployeeId());
        precompte.setAmount(dto.getAmount());
        precompte.setMontantRestant(dto.getMontantRestant());
        precompte.setEcheance(dto.getEcheance());
        precompte.setDateEcheance(dto.getDateEcheance());
        precompte.setStatut(dto.getStatut());

        return mapPrecompteToDto(precompteRepository.save(precompte));
    }

    @Transactional
    public void deletePrecompte(Long id) {
        precompteRepository.deleteById(id);
    }

    // --- MAPPERS ---
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

        AvoirResponseDto dto = new AvoirResponseDto();
        dto.setId(a.getId());
        dto.setEmployeeId(a.getEmployeeId());
        dto.setEmployeeName(empName);
        dto.setMatricule(matricule);
        dto.setSalaryElementId(a.getSalaryElement() != null ? a.getSalaryElement().getId() : null);
        dto.setSalaryElementName(a.getSalaryElement() != null ? a.getSalaryElement().getName() : null);
        dto.setSalaryElementCode(a.getSalaryElement() != null ? a.getSalaryElement().getCode() : null);
        dto.setAmount(a.getAmount());
        dto.setMontantRestant(a.getMontantRestant());
        dto.setEcheance(a.getEcheance());
        dto.setDateEcheance(a.getDateEcheance());
        dto.setStatut(a.getStatut());
        return dto;
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

        PrecompteResponseDto dto = new PrecompteResponseDto();
        dto.setId(p.getId());
        dto.setEmployeeId(p.getEmployeeId());
        dto.setEmployeeName(empName);
        dto.setMatricule(matricule);
        dto.setSalaryElementId(p.getSalaryElement() != null ? p.getSalaryElement().getId() : null);
        dto.setSalaryElementName(p.getSalaryElement() != null ? p.getSalaryElement().getName() : null);
        dto.setSalaryElementCode(p.getSalaryElement() != null ? p.getSalaryElement().getCode() : null);
        dto.setAmount(p.getAmount());
        dto.setMontantRestant(p.getMontantRestant());
        dto.setEcheance(p.getEcheance());
        dto.setDateEcheance(p.getDateEcheance());
        dto.setStatut(p.getStatut());
        return dto;
    }
}

