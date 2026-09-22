package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.TypeRetenueDto;
import com.bpbf.sirh_backend.entities.TypeRetenue;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TypeRetenueMapper {
    TypeRetenueDto toDto(TypeRetenue entity);
    TypeRetenue toEntity(TypeRetenueDto dto);
    List<TypeRetenueDto> toDtos(List<TypeRetenue> list);
}
