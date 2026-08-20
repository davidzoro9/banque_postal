package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.DirectionDto;
import com.bpbf.sirh_backend.entities.Direction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DirectionMapper {

    @Mapping(source = "department.id", target = "departmentId")
    @Mapping(source = "department.name", target = "departmentLibelle")
    @Mapping(source = "agence.id", target = "agenceId")
    @Mapping(source = "agence.nomAgence", target = "agenceLibelle")
    DirectionDto toDto(Direction direction);

    @Mapping(target = "department", ignore = true)
    @Mapping(target = "agence", ignore = true)
    Direction toEntity(DirectionDto directionDto);

    List<DirectionDto> toDtos(List<Direction> directions);

}
