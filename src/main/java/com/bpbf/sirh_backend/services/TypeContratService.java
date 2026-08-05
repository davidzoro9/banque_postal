package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.TypeContratDto;
import com.bpbf.sirh_backend.entities.TypeContrat;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.TypeContratMapper;
import com.bpbf.sirh_backend.repositories.TypeContratRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TypeContratService {

    private final TypeContratMapper typeContratMapper;
    private final TypeContratRepository typeContratRepository;

    public List<TypeContratDto> getAllTypeContrat(){
        List<TypeContrat> typeContrats = typeContratRepository.findAll();
        return typeContratMapper.toDtos(typeContrats);
    }

    public TypeContratDto createTypeContrat(TypeContratDto typeContratDto){
        TypeContrat typeContrat = typeContratMapper.toEntity(typeContratDto);
        TypeContrat saved = typeContratRepository.save(typeContrat);
        return typeContratMapper.toDto(saved);
    }

    public TypeContratDto updateTypeContrat(Long id, TypeContratDto typeContratDto){
        TypeContrat typeContrat = typeContratRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ce type de contrat n'existe pas"));

        typeContrat.setCode(typeContratDto.getCode());
        typeContrat.setName(typeContratDto.getName());

        TypeContrat saved = typeContratRepository.save(typeContrat);

        return typeContratMapper.toDto(saved);
    }

    public void delete(Long id){
        typeContratRepository.deleteById(id);
    }
}
