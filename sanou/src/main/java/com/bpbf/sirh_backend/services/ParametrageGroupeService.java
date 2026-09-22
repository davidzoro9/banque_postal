package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.ParametrageGroupeDto;
import com.bpbf.sirh_backend.entities.ParametrageGroupe;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.ParametrageGroupeMapper;
import com.bpbf.sirh_backend.repositories.CategorieRepository;
import com.bpbf.sirh_backend.repositories.GradeRepository;
import com.bpbf.sirh_backend.repositories.ParametrageGroupeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParametrageGroupeService {
    private final ParametrageGroupeMapper mapper;
    private final ParametrageGroupeRepository repository;
    private final GradeRepository gradeRepository;
    private final CategorieRepository categorieRepository;

    public List<ParametrageGroupeDto> getAll() {
        return mapper.toDtos(repository.findAll());
    }

    public ParametrageGroupeDto create(ParametrageGroupeDto dto) {
        ParametrageGroupe entity = mapper.toEntity(dto);
        resolveRelationships(entity, dto);
        return mapper.toDto(repository.save(entity));
    }

    public ParametrageGroupeDto update(Long id, ParametrageGroupeDto dto) {
        ParametrageGroupe entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ce paramétrage de groupe n'existe pas"));
        entity.setCode(dto.getCode());
        entity.setLibelle(dto.getLibelle());
        entity.setDescription(dto.getDescription());
        entity.setActif(dto.getActif());
        resolveRelationships(entity, dto);
        return mapper.toDto(repository.save(entity));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private void resolveRelationships(ParametrageGroupe entity, ParametrageGroupeDto dto) {
        if (dto.getGradeId() == null) {
            entity.setGradeObj(null);
        } else {
            entity.setGradeObj(gradeRepository.findById(dto.getGradeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ce grade n'existe pas")));
        }

        if (dto.getCategorieId() == null) {
            entity.setCategorieObj(null);
        } else {
            entity.setCategorieObj(categorieRepository.findById(dto.getCategorieId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cette catégorie n'existe pas")));
        }
    }
}
