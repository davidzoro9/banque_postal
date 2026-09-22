package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.BaremeIUTSDto;
import com.bpbf.sirh_backend.entities.BaremeIUTS;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BaremeIUTSMapper {

    @Mapping(target = "code", source = "codeTranche")
    @Mapping(target = "tauxPercent", source = "tauxImposition")
    @Mapping(target = "abattementFixe", source = "abattementForfaitaire")
    BaremeIUTSDto toDto(BaremeIUTS entity);

    @Mapping(target = "codeTranche", source = "code")
    @Mapping(target = "tauxImposition", source = "tauxPercent")
    @Mapping(target = "abattementForfaitaire", source = "abattementFixe")
    BaremeIUTS toEntity(BaremeIUTSDto dto);

    List<BaremeIUTSDto> toDtos(List<BaremeIUTS> list);
}
