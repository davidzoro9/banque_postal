package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.DepartmentDto;
import com.bpbf.sirh_backend.entities.Department;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.DepartmentMapper;
import com.bpbf.sirh_backend.repositories.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentMapper departmentMapper;
    private final DepartmentRepository departmentRepository;

    public List<DepartmentDto> getAllDepartment(){
        List<Department> departments = departmentRepository.findAll();
        return departmentMapper.toDtos(departments);
    }

    public DepartmentDto createDepartment(DepartmentDto departmentDto){
        Department department = departmentMapper.toEntity(departmentDto);
        Department saved = departmentRepository.save(department);
        return departmentMapper.toDto(saved);
    }

    public DepartmentDto updateDepartment(Long id, DepartmentDto departmentDto){
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ce Département n'existe pas"));

        existingDepartment.setCode(departmentDto.getCode());
        existingDepartment.setName(departmentDto.getName());
        existingDepartment.setDirecteur(departmentDto.getDirecteur());

        Department saved = departmentRepository.save(existingDepartment);
        return departmentMapper.toDto(saved);
    }

    public void delete(Long id){
        departmentRepository.deleteById(id);
    }


}
