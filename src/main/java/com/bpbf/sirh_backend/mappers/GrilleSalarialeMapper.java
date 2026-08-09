package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.GrilleSalarialeDto;
import com.bpbf.sirh_backend.entities.GrilleSalariale;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GrilleSalarialeMapper {
    @Mapping(source = "categorieObj.id", target = "categorieId")
    @Mapping(source = "echelonObj.id", target = "echelonId")
    @Mapping(source = "gradeObj.id", target = "gradeId")
    GrilleSalarialeDto toDto(GrilleSalariale grilleSalariale);

    @Mapping(source = "categorieId", target = "categorieObj.id")
    @Mapping(source = "echelonId", target = "echelonObj.id")
    @Mapping(source = "gradeId", target = "gradeObj.id")
    GrilleSalariale toEntity(GrilleSalarialeDto grilleSalarialeDto);

    List<GrilleSalarialeDto> toDtos(List<GrilleSalariale> grilleSalariales);
}

