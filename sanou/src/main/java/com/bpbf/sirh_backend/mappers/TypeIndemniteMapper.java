package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.TypeIndemniteDto;
import com.bpbf.sirh_backend.entities.TypeIndemnite;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TypeIndemniteMapper {
    TypeIndemniteDto toDto(TypeIndemnite typeIndemnite);
    TypeIndemnite toEntity(TypeIndemniteDto typeIndemniteDto);
    List<TypeIndemniteDto> toDtos(List<TypeIndemnite> typeIndemnites);
}
