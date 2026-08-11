package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto;
import com.bpbf.sirh_backend.entities.ParametrageIndemnite;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
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
        ParametrageIndemnite entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ce paramétrage d'indemnité n'existe pas"));

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
            entity.setTypeIndemniteObj(typeIndemniteRepository.findById(dto.getTypeIndemniteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ce type d'indemnité n'existe pas")));
        } else {
            entity.setTypeIndemniteObj(null);
        }

        if (dto.getFonctionId() != null) {
            entity.setFonctionObj(fonctionRepository.findById(dto.getFonctionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cette fonction n'existe pas")));
        } else {
            entity.setFonctionObj(null);
        }

        if (dto.getGradeId() != null) {
            entity.setGradeObj(gradeRepository.findById(dto.getGradeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ce grade n'existe pas")));
        } else {
            entity.setGradeObj(null);
        }

        if (dto.getCategorieId() != null) {
            entity.setCategorieObj(categorieRepository.findById(dto.getCategorieId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cette catégorie n'existe pas")));
        } else {
            entity.setCategorieObj(null);
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
