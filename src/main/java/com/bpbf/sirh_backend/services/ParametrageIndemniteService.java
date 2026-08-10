package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto;
import com.bpbf.sirh_backend.entities.ParametrageIndemnite;
import com.bpbf.sirh_backend.mappers.ParametrageIndemniteMapper;
import com.bpbf.sirh_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParametrageIndemniteService {

    private final ParametrageIndemniteMapper mapper;
    private final ParametrageIndemniteRepository repository;
    private final TypeIndemniteRepository typeIndemniteRepository;
    private final FonctionRepository fonctionRepository;
    private final GradeRepository gradeRepository;
    private final CategorieRepository categorieRepository;

    public List<ParametrageIndemniteDto> getAll() {
        List<ParametrageIndemnite> list = repository.findAll();
        return mapper.toDtos(list);
    }

    public ParametrageIndemniteDto create(ParametrageIndemniteDto dto) {
        ParametrageIndemnite entity = mapper.toEntity(dto);
        resolveRelationships(entity, dto);
        ParametrageIndemnite saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    public ParametrageIndemniteDto update(Long id, ParametrageIndemniteDto dto) {
        ParametrageIndemnite entity = repository.findById(id).orElseGet(ParametrageIndemnite::new);

        entity.setCode(dto.getCode());
        entity.setTaux(dto.getTaux());
        if (dto.getActif() != null) {
            entity.setActif(dto.getActif());
        }

        resolveRelationships(entity, dto);

        ParametrageIndemnite saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    private void resolveRelationships(ParametrageIndemnite entity, ParametrageIndemniteDto dto) {
        if (dto.getTypeIndemniteId() != null) {
            typeIndemniteRepository.findById(dto.getTypeIndemniteId()).ifPresent(entity::setTypeIndemniteObj);
        }

        if (dto.getFonctionId() != null) {
            fonctionRepository.findById(dto.getFonctionId()).ifPresent(entity::setFonctionObj);
        }

        if (dto.getGradeId() != null) {
            gradeRepository.findById(dto.getGradeId()).ifPresent(entity::setGradeObj);
        }

        if (dto.getCategorieId() != null) {
            categorieRepository.findById(dto.getCategorieId()).ifPresent(entity::setCategorieObj);
        }
    }

    public List<ParametrageIndemniteDto> getByGradeAndFonction(String gradeStr, String fonctionStr) {
        List<ParametrageIndemnite> allActive = repository.findAll().stream()
                .filter(p -> p.getActif() == null || p.getActif())
                .toList();

        return mapper.toDtos(allActive);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
