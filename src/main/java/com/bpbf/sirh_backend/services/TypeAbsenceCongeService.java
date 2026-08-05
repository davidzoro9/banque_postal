package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.TypeAbsenceCongeDto;
import com.bpbf.sirh_backend.entities.TypeAbsenceConge;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.TypeAbsenceCongeMapper;
import com.bpbf.sirh_backend.repositories.TypeAbsenceCongeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class TypeAbsenceCongeService {

    private final TypeAbsenceCongeMapper typeAbsenceCongeMapper;
    private final TypeAbsenceCongeRepository typeAbsenceCongeRepository;

    public List<TypeAbsenceCongeDto> getAllTypeAbsenceConge(){
        List<TypeAbsenceConge> typeAbsenceConges = typeAbsenceCongeRepository.findAll();
        return typeAbsenceCongeMapper.toDtos(typeAbsenceConges);
    }

    public TypeAbsenceCongeDto createTypeAbsenceConge(TypeAbsenceCongeDto typeAbsenceCongeDto){
        TypeAbsenceConge typeAbsenceConge = typeAbsenceCongeMapper.toEntity(typeAbsenceCongeDto);
        TypeAbsenceConge saved = typeAbsenceCongeRepository.save(typeAbsenceConge);
        return typeAbsenceCongeMapper.toDto(saved);
    }

    public TypeAbsenceCongeDto updateTypeAbsenceConge(Long id, TypeAbsenceCongeDto typeAbsenceCongeDto){
        TypeAbsenceConge typeAbsenceConge = typeAbsenceCongeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ce type d'absence/congé n'existe pas"));

        typeAbsenceConge.setCode(typeAbsenceCongeDto.getCode());
        typeAbsenceConge.setName(typeAbsenceCongeDto.getName());

        TypeAbsenceConge saved = typeAbsenceCongeRepository.save(typeAbsenceConge);

        return typeAbsenceCongeMapper.toDto(saved);
    }

    public void delete(Long id){
        typeAbsenceCongeRepository.deleteById(id);
    }
}
