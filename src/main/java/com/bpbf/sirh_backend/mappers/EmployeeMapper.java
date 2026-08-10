package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.EmployeeDto;
import com.bpbf.sirh_backend.entities.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    EmployeeDto toDto(Employee entity);
    Employee toEntity(EmployeeDto dto);
    List<EmployeeDto> toDtos(List<Employee> entities);
    void updateEntityFromDto(EmployeeDto dto, @MappingTarget Employee entity);
}
