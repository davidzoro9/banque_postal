package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.GrilleSalarialeDto;
import com.bpbf.sirh_backend.entities.GrilleSalariale;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GrilleSalarialeMapper {
    GrilleSalarialeDto toDto(GrilleSalariale grilleSalariale);
    GrilleSalariale toEntity(GrilleSalarialeDto grilleSalarialeDto);
    List<GrilleSalarialeDto> toDtos(List<GrilleSalariale> grilleSalariales);
}
