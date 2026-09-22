package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.ParametrageRetraiteDto;
import com.bpbf.sirh_backend.entities.ParametrageRetraite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ParametrageRetraiteMapper {
    @Mapping(target = "gradeId", source = "gradeObj.id")
    @Mapping(target = "gradeLibelle", source = "gradeObj.libelle")
    ParametrageRetraiteDto toDto(ParametrageRetraite entity);

    @Mapping(target = "gradeObj", ignore = true)
    ParametrageRetraite toEntity(ParametrageRetraiteDto dto);

    List<ParametrageRetraiteDto> toDtos(List<ParametrageRetraite> entities);
}
