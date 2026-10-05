package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.DirectionDto;
import com.bpbf.sirh_backend.entities.Department;
import com.bpbf.sirh_backend.entities.Direction;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.entities.Agence;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.DirectionMapper;
import com.bpbf.sirh_backend.repositories.DepartmentRepository;
import com.bpbf.sirh_backend.repositories.DirectionRepository;
import com.bpbf.sirh_backend.repositories.EmployeeRepository;
import com.bpbf.sirh_backend.repositories.AgenceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DirectionService {

    private final DirectionMapper directionMapper;
    private final DirectionRepository directionRepository;
    private final DepartmentRepository departmentRepository;
    private final AgenceRepository agenceRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public List<DirectionDto> getAllDirection(){
        List<Direction> directions = directionRepository.findAll();
        return directionMapper.toDtos(directions);
    }

    @Transactional(readOnly = true)
    public DirectionDto getDirectionById(Long id) {
        Direction direction = directionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cette direction n'existe pas : " + id));
        return directionMapper.toDto(direction);
    }

    @Transactional
    public DirectionDto createDirection(DirectionDto directionDto){
        Direction direction = new Direction();
        direction.setCode(directionDto.getCode());
        direction.setName(directionDto.getName());
        direction.setDescription(directionDto.getDescription());

        if (directionDto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(directionDto.getDepartmentId()).orElse(null);
            direction.setDepartment(department);
        } else {
            direction.setDepartment(null);
        }

        if (directionDto.getParentDirectionId() != null) {
            Direction parent = directionRepository.findById(directionDto.getParentDirectionId()).orElse(null);
            direction.setParentDirection(parent);
        } else {
            direction.setParentDirection(null);
        }

        if (directionDto.getAgenceId() != null) {
            Agence agence = agenceRepository.findById(directionDto.getAgenceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cette agence n'existe pas"));
            direction.setAgence(agence);
        } else {
            direction.setAgence(null);
        }

        if (directionDto.getDirecteurId() != null) {
            Employee dir = employeeRepository.findById(directionDto.getDirecteurId()).orElse(null);
            direction.setDirecteur(dir);
        } else {
            direction.setDirecteur(null);
        }
    
        Direction saved = directionRepository.save(direction);
        return directionMapper.toDto(saved);
    }

    @Transactional
    public DirectionDto updateDirection(Long id, DirectionDto directionDto){
        Direction direction = directionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cette direction n'existe pas"));

        direction.setCode(directionDto.getCode());
        direction.setName(directionDto.getName());
        direction.setDescription(directionDto.getDescription());

        if (directionDto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(directionDto.getDepartmentId()).orElse(null);
            direction.setDepartment(department);
        } else {
            direction.setDepartment(null);
        }

        if (directionDto.getParentDirectionId() != null) {
            Direction parent = directionRepository.findById(directionDto.getParentDirectionId()).orElse(null);
            direction.setParentDirection(parent);
        } else {
            direction.setParentDirection(null);
        }

        if (directionDto.getAgenceId() != null) {
            Agence agence = agenceRepository.findById(directionDto.getAgenceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cette agence n'existe pas"));
            direction.setAgence(agence);
        } else {
            direction.setAgence(null);
        }

        if (directionDto.getDirecteurId() != null) {
            Employee dir = employeeRepository.findById(directionDto.getDirecteurId()).orElse(null);
            direction.setDirecteur(dir);
        } else {
            direction.setDirecteur(null);
        }

        Direction saved = directionRepository.save(direction);
        return directionMapper.toDto(saved);
    }

    @Transactional
    public DirectionDto assignDirecteur(Long directionId, Long employeeId, boolean syncEmployees) {
        Direction direction = directionRepository.findById(directionId)
                .orElseThrow(() -> new ResourceNotFoundException("Direction introuvable : " + directionId));
        
        Employee directeur = null;
        if (employeeId != null && employeeId > 0) {
            directeur = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Employé introuvable : " + employeeId));
            direction.setDirecteur(directeur);
        } else {
            direction.setDirecteur(null);
        }

        Direction saved = directionRepository.save(direction);

        // Synchroniser le supérieur hiérarchique pour les agents de la direction (pour la validation des congés)
        if (syncEmployees && directeur != null) {
            List<Employee> members = employeeRepository.findAll().stream()
                    .filter(e -> e.getDirection() != null && e.getDirection().getId().equals(directionId))
                    .toList();
            for (Employee member : members) {
                if (!member.getId().equals(directeur.getId())) {
                    member.setSuperviseur(directeur);
                    employeeRepository.save(member);
                }
            }
            log.info("Superviseur hiérarchique mis à jour pour {} agents de la direction {}", members.size(), direction.getName());
        }

        return directionMapper.toDto(saved);
    }

    @Transactional
    public void delete(Long id){
        directionRepository.deleteById(id);
    }
}
