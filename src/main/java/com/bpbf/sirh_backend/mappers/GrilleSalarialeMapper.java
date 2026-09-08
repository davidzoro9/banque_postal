package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.GrilleSalarialeDto;
import com.bpbf.sirh_backend.entities.GrilleSalariale;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GrilleSalarialeMapper {
    @Mapping(source = "categorieObj.id", target = "categorieId")
    @Mapping(source = "categorieObj.code", target = "categorieCode")
    @Mapping(source = "categorieObj.libelle", target = "categorieLibelle")
    @Mapping(source = "echelonObj.id", target = "echelonId")
    @Mapping(source = "echelonObj.code", target = "echelonCode")
    @Mapping(source = "echelonObj.libelle", target = "echelonLibelle")
    @Mapping(source = "gradeObj.id", target = "gradeId")
    @Mapping(source = "gradeObj.code", target = "gradeCode")
    @Mapping(source = "gradeObj.libelle", target = "gradeLibelle")
    GrilleSalarialeDto toDto(GrilleSalariale grilleSalariale);

    @Mapping(source = "categorieId", target = "categorieObj.id")
    @Mapping(source = "echelonId", target = "echelonObj.id")
    @Mapping(source = "gradeId", target = "gradeObj.id")
    GrilleSalariale toEntity(GrilleSalarialeDto grilleSalarialeDto);

    List<GrilleSalarialeDto> toDtos(List<GrilleSalariale> grilleSalariales);
}
