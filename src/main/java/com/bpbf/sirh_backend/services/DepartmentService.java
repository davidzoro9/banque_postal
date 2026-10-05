package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.DepartmentDto;
import com.bpbf.sirh_backend.entities.Department;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.DepartmentMapper;
import com.bpbf.sirh_backend.repositories.DepartmentRepository;
import com.bpbf.sirh_backend.repositories.DirectionRepository;
import com.bpbf.sirh_backend.repositories.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DepartmentService {

    private final DepartmentMapper departmentMapper;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final DirectionRepository directionRepository;

    @Transactional(readOnly = true)
    public List<DepartmentDto> getAllDepartment(){
        List<Department> departments = departmentRepository.findAll();
        return departmentMapper.toDtos(departments);
    }

    @Transactional
    public DepartmentDto createDepartment(DepartmentDto departmentDto){
        Department department = departmentMapper.toEntity(departmentDto);
        resolveRelationships(department, departmentDto);
        Department saved = departmentRepository.save(department);
        return departmentMapper.toDto(saved);
    }

    @Transactional
    public DepartmentDto updateDepartment(Long id, DepartmentDto departmentDto){
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ce Département n'existe pas"));

        existingDepartment.setCode(departmentDto.getCode());
        existingDepartment.setName(departmentDto.getName());
        resolveRelationships(existingDepartment, departmentDto);

        Department saved = departmentRepository.save(existingDepartment);
        return departmentMapper.toDto(saved);
    }

    private void resolveRelationships(Department entity, DepartmentDto dto) {
        if (dto.getDirecteurId() != null) {
            Employee dir = employeeRepository.findById(dto.getDirecteurId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ce directeur n'existe pas"));
            entity.setDirecteurObj(dir);

            // Synchroniser les collaborateurs du département pour la validation hiérarchique des congés
            if (entity.getId() != null) {
                List<Employee> members = employeeRepository.findAll().stream()
                        .filter(e -> e.getDepartment() != null && e.getDepartment().getId().equals(entity.getId()))
                        .toList();
                for (Employee m : members) {
                    if (!m.getId().equals(dir.getId())) {
                        m.setSuperviseur(dir);
                        employeeRepository.save(m);
                    }
                }
                log.info("Superviseur hiérarchique mis à jour pour {} agents du département {}", members.size(), entity.getName());
            }
        } else {
            entity.setDirecteurObj(null);
        }

        if (dto.getDirectionId() != null) {
            entity.setDirection(directionRepository.findById(dto.getDirectionId()).orElse(null));
        } else {
            entity.setDirection(null);
        }
    }

    @Transactional
    public void delete(Long id){
        departmentRepository.deleteById(id);
    }
}
