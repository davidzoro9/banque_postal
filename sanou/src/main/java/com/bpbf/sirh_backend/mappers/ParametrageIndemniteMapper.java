package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto;
import com.bpbf.sirh_backend.entities.ParametrageIndemnite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ParametrageIndemniteMapper {
    @Mapping(target = "typeIndemniteId", source = "typeIndemniteObj.id")
    @Mapping(target = "typeIndemniteLibelle", source = "typeIndemniteObj.name")
    @Mapping(target = "fonctionId", source = "fonctionObj.id")
    @Mapping(target = "fonctionLibelle", source = "fonctionObj.name")
    @Mapping(target = "gradeId", source = "gradeObj.id")
    @Mapping(target = "gradeLibelle", source = "gradeObj.libelle")
    @Mapping(target = "categorieId", source = "categorieObj.id")
    @Mapping(target = "categorieLibelle", source = "categorieObj.libelle")
    @Mapping(target = "emploiId", source = "emploiObj.id")
    @Mapping(target = "emploiLibelle", source = "emploiObj.name")
    ParametrageIndemniteDto toDto(ParametrageIndemnite entity);

    @Mapping(target = "typeIndemniteObj", ignore = true)
    @Mapping(target = "fonctionObj", ignore = true)
    @Mapping(target = "gradeObj", ignore = true)
    @Mapping(target = "categorieObj", ignore = true)
    @Mapping(target = "emploiObj", ignore = true)
    ParametrageIndemnite toEntity(ParametrageIndemniteDto dto);

    List<ParametrageIndemniteDto> toDtos(List<ParametrageIndemnite> list);
}
