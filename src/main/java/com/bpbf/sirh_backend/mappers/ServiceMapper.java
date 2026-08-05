package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.DirectionDto;
import com.bpbf.sirh_backend.dtos.ServiceDto;
import com.bpbf.sirh_backend.entities.Department;
import com.bpbf.sirh_backend.entities.Direction;
import com.bpbf.sirh_backend.entities.Service;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ServiceMapper {

    @Mapping(source="department.id", target = "departmentId")
    @Mapping(source = "direction.id", target = "directionId")
    ServiceDto toDto(Service service);

    @Mapping(source = "departmentId", target = "department", qualifiedByName = "mapDepartment")
    @Mapping(source = "directionId", target = "direction", qualifiedByName = "mapDirection")
    Service toEntity(ServiceDto serviceDto);

    List<ServiceDto> toDtos(List<Service> services);

    @Named("mapDepartment")
    default Department mapDepartment(Long departmentId) {
        if (departmentId == null) {
            return null;
        }

        Department department = new Department();
        department.setId(departmentId);

        return department;
    }

    @Named("mapDirection")
    default Direction mapDirection(Long directionId) {
        if (directionId == null) {
            return null;
        }

        Direction direction = new Direction();
        direction.setId(directionId);

        return direction;
    }
}
