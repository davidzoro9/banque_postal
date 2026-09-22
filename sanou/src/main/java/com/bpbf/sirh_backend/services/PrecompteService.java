package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.PrecompteEmployeDto;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.entities.PrecompteEmploye;
import com.bpbf.sirh_backend.entities.RubriquePaie;
import com.bpbf.sirh_backend.repositories.EmployeeRepository;
import com.bpbf.sirh_backend.repositories.PrecompteEmployeRepository;
import com.bpbf.sirh_backend.repositories.RubriquePaieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrecompteService {

    private final PrecompteEmployeRepository precompteRepository;
    private final EmployeeRepository employeeRepository;
    private final RubriquePaieRepository rubriquePaieRepository;

    @Transactional(readOnly = true)
    public List<PrecompteEmployeDto> getAll() {
        return precompteRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PrecompteEmployeDto> getByEmployee(Long employeeId) {
        return precompteRepository.findByEmployeeId(employeeId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PrecompteEmployeDto> getActiveByEmployee(Long employeeId) {
        return precompteRepository.findByEmployeeIdAndStatut(employeeId, "ACTIF").stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PrecompteEmployeDto getById(Long id) {
        return precompteRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Précompte non trouvé: #" + id));
    }

    @Transactional
    public PrecompteEmployeDto create(PrecompteEmployeDto dto) {
        Employee emp = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employé introuvable: #" + dto.getEmployeeId()));

        RubriquePaie rubrique = null;
        if (dto.getRubriquePaieId() != null) {
            rubrique = rubriquePaieRepository.findById(dto.getRubriquePaieId()).orElse(null);
        }

        BigDecimal montantRestant = dto.getMontantRestant() != null ? dto.getMontantRestant() : dto.getMontantInitial();
        Integer echeancesRestantes = dto.getEcheancesRestantes() != null ? dto.getEcheancesRestantes() : dto.getEcheancesTotal();

        PrecompteEmploye entity = PrecompteEmploye.builder()
                .employee(emp)
                .rubriquePaie(rubrique)
                .libelle(dto.getLibelle())
                .montantInitial(dto.getMontantInitial())
                .montantMensuel(dto.getMontantMensuel())
                .montantRestant(montantRestant)
                .echeancesTotal(dto.getEcheancesTotal())
                .echeancesRestantes(echeancesRestantes)
                .dateDebut(dto.getDateDebut())
                .dateFinPrevue(dto.getDateFinPrevue())
                .statut(dto.getStatut() != null ? dto.getStatut() : "ACTIF")
                .motif(dto.getMotif())
                .build();

        return toDto(precompteRepository.save(entity));
    }

    @Transactional
    public PrecompteEmployeDto update(Long id, PrecompteEmployeDto dto) {
        PrecompteEmploye entity = precompteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Précompte non trouvé: #" + id));

        if (dto.getRubriquePaieId() != null) {
            entity.setRubriquePaie(rubriquePaieRepository.findById(dto.getRubriquePaieId()).orElse(null));
        }
        entity.setLibelle(dto.getLibelle());
        entity.setMontantInitial(dto.getMontantInitial());
        entity.setMontantMensuel(dto.getMontantMensuel());
        entity.setMontantRestant(dto.getMontantRestant());
        entity.setEcheancesTotal(dto.getEcheancesTotal());
        entity.setEcheancesRestantes(dto.getEcheancesRestantes());
        entity.setDateDebut(dto.getDateDebut());
        entity.setDateFinPrevue(dto.getDateFinPrevue());
        entity.setStatut(dto.getStatut());
        entity.setMotif(dto.getMotif());

        return toDto(precompteRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        precompteRepository.deleteById(id);
    }

    public PrecompteEmployeDto toDto(PrecompteEmploye e) {
        String empName = e.getEmployee() != null
                ? (e.getEmployee().getPrenom() != null ? e.getEmployee().getPrenom() + " " + e.getEmployee().getNom() : e.getEmployee().getName())
                : null;
        String matricule = e.getEmployee() != null ? e.getEmployee().getMatricule() : null;
        String rubriqueLibelle = e.getRubriquePaie() != null ? e.getRubriquePaie().getLibelle() : null;

        return PrecompteEmployeDto.builder()
                .id(e.getId())
                .employeeId(e.getEmployee() != null ? e.getEmployee().getId() : null)
                .employeeName(empName)
                .matricule(matricule)
                .rubriquePaieId(e.getRubriquePaie() != null ? e.getRubriquePaie().getId() : null)
                .rubriquePaieLibelle(rubriqueLibelle)
                .libelle(e.getLibelle())
                .montantInitial(e.getMontantInitial())
                .montantMensuel(e.getMontantMensuel())
                .montantRestant(e.getMontantRestant())
                .echeancesTotal(e.getEcheancesTotal())
                .echeancesRestantes(e.getEcheancesRestantes())
                .dateDebut(e.getDateDebut())
                .dateFinPrevue(e.getDateFinPrevue())
                .statut(e.getStatut())
                .motif(e.getMotif())
                .dateCreation(e.getDateCreation())
                .build();
    }
}
