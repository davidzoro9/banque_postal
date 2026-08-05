package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.FonctionDto;
import com.bpbf.sirh_backend.entities.Fonction;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "Spring")
public interface FonctionMapper {
    FonctionDto toDto(Fonction fonction);
    Fonction toEntity(FonctionDto fonctionDto);
    List<FonctionDto> toDtos(List<Fonction> fonctions);
}
