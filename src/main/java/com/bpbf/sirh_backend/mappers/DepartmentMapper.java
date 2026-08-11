package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.DepartmentDto;
import com.bpbf.sirh_backend.entities.Department;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {
    @Mapping(target = "directeurId", source = "directeurObj.id")
    @Mapping(target = "directeurLibelle", source = "directeur")
    DepartmentDto toDto(Department department);

    @Mapping(target = "directeurObj", ignore = true)
    Department toEntity(DepartmentDto departmentDto);

    List<DepartmentDto> toDtos(List<Department> departments);
}
