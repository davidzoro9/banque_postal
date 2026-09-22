package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.TypeAbsenceCongeDto;
import com.bpbf.sirh_backend.entities.TypeAbsenceConge;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TypeAbsenceCongeMapper {
    TypeAbsenceCongeDto toDto(TypeAbsenceConge typeAbsenceConge);
    TypeAbsenceConge toEntity(TypeAbsenceCongeDto typeAbsenceCongeDto);
    List<TypeAbsenceCongeDto> toDtos(List<TypeAbsenceConge> typeAbsenceConges);
}
