package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.TypeIndemniteDto;
import com.bpbf.sirh_backend.entities.TypeIndemnite;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.TypeIndemniteMapper;
import com.bpbf.sirh_backend.repositories.TypeIndemniteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TypeIndemniteService {

    private final TypeIndemniteMapper typeIndemniteMapper;
    private final TypeIndemniteRepository typeIndemniteRepository;

    public List<TypeIndemniteDto> getAllTypeIndemnite(){
        List<TypeIndemnite> typeIndemnites = typeIndemniteRepository.findAll();
        return typeIndemniteMapper.toDtos(typeIndemnites);
    }

    public TypeIndemniteDto createTypeIndemnite(TypeIndemniteDto typeIndemniteDto){
        TypeIndemnite typeIndemnite = typeIndemniteMapper.toEntity(typeIndemniteDto);
        TypeIndemnite saved = typeIndemniteRepository.save(typeIndemnite);
        return typeIndemniteMapper.toDto(saved);
    }

    public TypeIndemniteDto updateTypeIndemnite(Long id, TypeIndemniteDto typeIndemniteDto){
        TypeIndemnite typeIndemnite = typeIndemniteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ce type d'indemnité n'existe pas"));

        typeIndemnite.setCode(typeIndemniteDto.getCode());
        typeIndemnite.setName(typeIndemniteDto.getName());
        typeIndemnite.setDescription(typeIndemniteDto.getDescription());
        typeIndemnite.setTauxExoneration(typeIndemniteDto.getTauxExoneration());
        typeIndemnite.setPlafondExoneration(typeIndemniteDto.getPlafondExoneration());

        TypeIndemnite saved = typeIndemniteRepository.save(typeIndemnite);

        return typeIndemniteMapper.toDto(saved);
    }

    public void delete(Long id){
        typeIndemniteRepository.deleteById(id);
    }
}
