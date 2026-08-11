package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.ServiceDto;
import com.bpbf.sirh_backend.entities.Service;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ServiceMapper {

    @Mapping(source="department.id", target = "departmentId")
    @Mapping(source="department.name", target = "departmentLibelle")
    @Mapping(source = "direction.id", target = "directionId")
    @Mapping(source = "direction.name", target = "directionLibelle")
    ServiceDto toDto(Service service);

    @Mapping(target = "department", ignore = true)
    @Mapping(target = "direction", ignore = true)
    Service toEntity(ServiceDto serviceDto);

    List<ServiceDto> toDtos(List<Service> services);

}
