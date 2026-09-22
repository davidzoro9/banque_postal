package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.ParametrageGroupeDto;
import com.bpbf.sirh_backend.entities.ParametrageGroupe;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ParametrageGroupeMapper {
    @Mapping(target = "gradeId", source = "gradeObj.id")
    @Mapping(target = "gradeCode", source = "gradeObj.code")
    @Mapping(target = "gradeLibelle", source = "gradeObj.libelle")
    @Mapping(target = "categorieId", source = "categorieObj.id")
    @Mapping(target = "categorieCode", source = "categorieObj.code")
    @Mapping(target = "categorieLibelle", source = "categorieObj.libelle")
    ParametrageGroupeDto toDto(ParametrageGroupe entity);

    @Mapping(target = "gradeObj", ignore = true)
    @Mapping(target = "categorieObj", ignore = true)
    ParametrageGroupe toEntity(ParametrageGroupeDto dto);

    List<ParametrageGroupeDto> toDtos(List<ParametrageGroupe> entities);
}
