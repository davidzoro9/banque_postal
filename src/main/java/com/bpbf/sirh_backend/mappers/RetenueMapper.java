package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.RetenueDto;
import com.bpbf.sirh_backend.entities.Retenue;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RetenueMapper {
    @Mapping(target = "typeRetenueId", source = "typeRetenue.id")
    RetenueDto toDto(Retenue entity);

    @Mapping(target = "typeRetenue", ignore = true)
    Retenue toEntity(RetenueDto dto);

    List<RetenueDto> toDtos(List<Retenue> list);
}
