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
    @Mapping(source = "parentDirection.id", target = "parentDirectionId")
    @Mapping(source = "parentDirection.name", target = "parentDirectionLibelle")
    @Mapping(source = "agence.id", target = "agenceId")
    @Mapping(source = "agence.nomAgence", target = "agenceLibelle")
    @Mapping(source = "directeur.id", target = "directeurId")
    @Mapping(expression = "java(direction.getDirecteur() != null ? (direction.getDirecteur().getName() != null ? direction.getDirecteur().getName() : (direction.getDirecteur().getPrenom() + \" \" + direction.getDirecteur().getNom())) : null)", target = "directeurLibelle")
    @Mapping(source = "directeur.matricule", target = "directeurMatricule")
    DirectionDto toDto(Direction direction);

    @Mapping(target = "department", ignore = true)
    @Mapping(target = "parentDirection", ignore = true)
    @Mapping(target = "agence", ignore = true)
    @Mapping(target = "directeur", ignore = true)
    Direction toEntity(DirectionDto directionDto);

    List<DirectionDto> toDtos(List<Direction> directions);

}
