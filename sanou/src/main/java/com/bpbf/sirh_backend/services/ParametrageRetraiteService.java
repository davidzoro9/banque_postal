package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.ParametrageRetraiteDto;
import com.bpbf.sirh_backend.entities.ParametrageRetraite;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.ParametrageRetraiteMapper;
import com.bpbf.sirh_backend.repositories.GradeRepository;
import com.bpbf.sirh_backend.repositories.ParametrageRetraiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParametrageRetraiteService {
    private final ParametrageRetraiteMapper mapper;
    private final ParametrageRetraiteRepository repository;
    private final GradeRepository gradeRepository;

    public List<ParametrageRetraiteDto> getAll() {
        return mapper.toDtos(repository.findAll());
    }

    public ParametrageRetraiteDto create(ParametrageRetraiteDto dto) {
        ParametrageRetraite entity = mapper.toEntity(dto);
        resolveGrade(entity, dto.getGradeId());
        return mapper.toDto(repository.save(entity));
    }

    public ParametrageRetraiteDto update(Long id, ParametrageRetraiteDto dto) {
        ParametrageRetraite entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ce paramétrage de retraite n'existe pas"));
        entity.setCode(dto.getCode());
        entity.setLibelle(dto.getLibelle());
        entity.setTaux(dto.getTaux());
        entity.setDescription(dto.getDescription());
        entity.setActif(dto.getActif());
        resolveGrade(entity, dto.getGradeId());
        return mapper.toDto(repository.save(entity));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private void resolveGrade(ParametrageRetraite entity, Long gradeId) {
        if (gradeId == null) {
            entity.setGradeObj(null);
        } else {
            entity.setGradeObj(gradeRepository.findById(gradeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Ce grade n'existe pas")));
        }
    }
}
