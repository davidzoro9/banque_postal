package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto;
import com.bpbf.sirh_backend.entities.ParametrageIndemnite;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ParametrageIndemniteMapper {
    ParametrageIndemniteDto toDto(ParametrageIndemnite parametrageIndemnite);
    ParametrageIndemnite toEntity(ParametrageIndemniteDto dto);
    List<ParametrageIndemniteDto> toDtos(List<ParametrageIndemnite> parametrageIndemnites);
}
