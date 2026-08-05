package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.DirectionDto;
import com.bpbf.sirh_backend.entities.Department;
import com.bpbf.sirh_backend.entities.Direction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DirectionMapper {

    @Mapping(source = "department.id", target = "departmentId")
    DirectionDto toDto(Direction direction);

    @Mapping(source = "departmentId", target = "department")
    Direction toEntity(DirectionDto directionDto);

    List<DirectionDto> toDtos(List<Direction> directions);

    default Department mapDepartment(Long departmentId) {
        if (departmentId == null) {
            return null;
        }

        Department department = new Department();
        department.setId(departmentId);

        return department;
    }

}
