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
        String code = typeAbsenceCongeDto.getCode();
        if (code == null || code.isBlank()) {
            String baseCode = typeAbsenceCongeDto.getName() != null 
                ? typeAbsenceCongeDto.getName().trim().toUpperCase().replaceAll("[^A-Z0-9]", "_") 
                : "TAC";
            if (baseCode.length() > 15) baseCode = baseCode.substring(0, 15);
            code = baseCode + "_" + System.currentTimeMillis();
            typeAbsenceCongeDto.setCode(code);
        } else {
            // Vérifier unicité du code
            if (typeAbsenceCongeRepository.findByCode(code).isPresent()) {
                code = code + "_" + (System.currentTimeMillis() % 10000);
                typeAbsenceCongeDto.setCode(code);
            }
        }

        TypeAbsenceConge typeAbsenceConge = typeAbsenceCongeMapper.toEntity(typeAbsenceCongeDto);
        typeAbsenceConge.setId(null);
        TypeAbsenceConge saved = typeAbsenceCongeRepository.save(typeAbsenceConge);
        return typeAbsenceCongeMapper.toDto(saved);
    }

    public TypeAbsenceCongeDto updateTypeAbsenceConge(Long id, TypeAbsenceCongeDto typeAbsenceCongeDto){
        TypeAbsenceConge typeAbsenceConge = typeAbsenceCongeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ce type d'absence/congé n'existe pas"));

        if (typeAbsenceCongeDto.getCode() != null && !typeAbsenceCongeDto.getCode().isBlank()) {
            typeAbsenceConge.setCode(typeAbsenceCongeDto.getCode());
        }
        if (typeAbsenceCongeDto.getName() != null && !typeAbsenceCongeDto.getName().isBlank()) {
            typeAbsenceConge.setName(typeAbsenceCongeDto.getName());
        }

        TypeAbsenceConge saved = typeAbsenceCongeRepository.save(typeAbsenceConge);

        return typeAbsenceCongeMapper.toDto(saved);
    }

    public void delete(Long id){
        typeAbsenceCongeRepository.deleteById(id);
    }
}
