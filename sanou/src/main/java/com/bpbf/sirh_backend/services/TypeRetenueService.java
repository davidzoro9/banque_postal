package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.TypeRetenueDto;
import com.bpbf.sirh_backend.entities.TypeRetenue;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.TypeRetenueMapper;
import com.bpbf.sirh_backend.repositories.TypeRetenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TypeRetenueService {

    private final TypeRetenueRepository repository;
    private final TypeRetenueMapper mapper;

    @Transactional(readOnly = true)
    public List<TypeRetenueDto> getAll() {
        return mapper.toDtos(repository.findAll());
    }

    @Transactional(readOnly = true)
    public TypeRetenueDto getById(Long id) {
        TypeRetenue entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Type de retenue introuvable avec l'ID: " + id));
        return mapper.toDto(entity);
    }

    @Transactional
    public TypeRetenueDto create(TypeRetenueDto dto) {
        TypeRetenue entity = mapper.toEntity(dto);
        if (entity.getActif() == null) {
            entity.setActif(true);
        }
        return mapper.toDto(repository.save(entity));
    }

    @Transactional
    public TypeRetenueDto update(Long id, TypeRetenueDto dto) {
        TypeRetenue entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Type de retenue introuvable avec l'ID: " + id));
        entity.setCode(dto.getCode());
        entity.setLibelle(dto.getLibelle());
        entity.setDescription(dto.getDescription());
        if (dto.getActif() != null) {
            entity.setActif(dto.getActif());
        }
        return mapper.toDto(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Type de retenue introuvable avec l'ID: " + id);
        }
        repository.deleteById(id);
    }
}
