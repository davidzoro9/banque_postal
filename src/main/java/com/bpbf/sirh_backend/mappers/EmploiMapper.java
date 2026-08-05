package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.EmploiDto;
import com.bpbf.sirh_backend.entities.Emploi;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EmploiMapper {
    EmploiDto toDto(Emploi emploi);
    Emploi toEntity(EmploiDto emploiDto);
    List<EmploiDto> toDtos(List<Emploi> emplois);
}
