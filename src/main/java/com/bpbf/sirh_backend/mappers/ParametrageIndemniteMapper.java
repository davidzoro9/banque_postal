package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto;
import com.bpbf.sirh_backend.entities.ParametrageIndemnite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ParametrageIndemniteMapper {
    @Mapping(target = "typeIndemniteId", source = "typeIndemniteObj.id")
    @Mapping(target = "fonctionId", source = "fonctionObj.id")
    @Mapping(target = "gradeId", source = "gradeObj.id")
    @Mapping(target = "categorieId", source = "categorieObj.id")
    ParametrageIndemniteDto toDto(ParametrageIndemnite entity);

    @Mapping(target = "typeIndemniteObj", ignore = true)
    @Mapping(target = "fonctionObj", ignore = true)
    @Mapping(target = "gradeObj", ignore = true)
    @Mapping(target = "categorieObj", ignore = true)
    ParametrageIndemnite toEntity(ParametrageIndemniteDto dto);

    List<ParametrageIndemniteDto> toDtos(List<ParametrageIndemnite> list);
}
