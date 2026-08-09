package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.TypeRetenueEmploiDto;
import com.bpbf.sirh_backend.entities.TypeRetenueEmploi;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TypeRetenueEmploiMapper {
    @Mapping(target = "typeRetenueEmployeId", source = "typeRetenueEmploye.id")
    TypeRetenueEmploiDto toDto(TypeRetenueEmploi entity);

    @Mapping(target = "typeRetenueEmploye", ignore = true)
    TypeRetenueEmploi toEntity(TypeRetenueEmploiDto dto);

    List<TypeRetenueEmploiDto> toDtos(List<TypeRetenueEmploi> list);
}
