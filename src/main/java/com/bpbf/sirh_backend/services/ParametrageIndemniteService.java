package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto;
import com.bpbf.sirh_backend.entities.ParametrageIndemnite;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.ParametrageIndemniteMapper;
import com.bpbf.sirh_backend.repositories.ParametrageIndemniteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParametrageIndemniteService {

    private final ParametrageIndemniteMapper mapper;
    private final ParametrageIndemniteRepository repository;

    public List<ParametrageIndemniteDto> getAll() {
        List<ParametrageIndemnite> list = repository.findAll();
        return mapper.toDtos(list);
    }

    public ParametrageIndemniteDto create(ParametrageIndemniteDto dto) {
        ParametrageIndemnite entity = mapper.toEntity(dto);
        ParametrageIndemnite saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    public ParametrageIndemniteDto update(Long id, ParametrageIndemniteDto dto) {
        ParametrageIndemnite entity = repository.findById(id).orElseGet(() -> {
            ParametrageIndemnite newEntity = new ParametrageIndemnite();
            return newEntity;
        });

        entity.setCode(dto.getCode());
        entity.setTypeIndemnite(dto.getTypeIndemnite());
        entity.setFonction(dto.getFonction());
        entity.setGrade(dto.getGrade());
        entity.setCategorie(dto.getCategorie());
        entity.setTaux(dto.getTaux());
        entity.setTauxExoneration(dto.getTauxExoneration());
        entity.setPlafondExoneration(dto.getPlafondExoneration());
        if (dto.getActif() != null) {
            entity.setActif(dto.getActif());
        }

        ParametrageIndemnite saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
