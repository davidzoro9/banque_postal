package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.TypeContratDto;
import com.bpbf.sirh_backend.entities.TypeContrat;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TypeContratMapper {
    TypeContratDto toDto(TypeContrat typeContrat);
    TypeContrat toEntity(TypeContratDto typeContratDto);
    List<TypeContratDto> toDtos(List<TypeContrat> typeContrats);
}
