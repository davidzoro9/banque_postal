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
        entity.setRegleType(dto.getRegleType() != null ? dto.getRegleType() : "ORDINAIRE");
        entity.setTypeNomination(dto.getTypeNomination() != null ? dto.getTypeNomination() : "TOUTES");
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
        } else if (dto.getTypeIndemnite() != null && !dto.getTypeIndemnite().trim().isEmpty()) {
            typeIndemniteRepository.findAll().stream()
                    .filter(t -> dto.getTypeIndemnite().equalsIgnoreCase(t.getCode()) || dto.getTypeIndemnite().equalsIgnoreCase(t.getName()))
                    .findFirst().ifPresent(entity::setTypeIndemniteObj);
        }

        if (dto.getFonctionId() != null) {
            fonctionRepository.findById(dto.getFonctionId()).ifPresent(entity::setFonctionObj);
        } else if (dto.getFonction() != null && !dto.getFonction().trim().isEmpty()) {
            fonctionRepository.findAll().stream()
                    .filter(f -> dto.getFonction().equalsIgnoreCase(f.getCode()) || dto.getFonction().equalsIgnoreCase(f.getName()))
                    .findFirst().ifPresent(entity::setFonctionObj);
        }

        if (dto.getGradeId() != null) {
            gradeRepository.findById(dto.getGradeId()).ifPresent(entity::setGradeObj);
        } else if (dto.getGrade() != null && !dto.getGrade().trim().isEmpty()) {
            gradeRepository.findAll().stream()
                    .filter(g -> dto.getGrade().equalsIgnoreCase(g.getCode()) || dto.getGrade().equalsIgnoreCase(g.getLibelle()))
                    .findFirst().ifPresent(entity::setGradeObj);
        }

        if (dto.getCategorieId() != null) {
            categorieRepository.findById(dto.getCategorieId()).ifPresent(entity::setCategorieObj);
        } else if (dto.getCategorie() != null && !dto.getCategorie().trim().isEmpty()) {
            categorieRepository.findAll().stream()
                    .filter(c -> dto.getCategorie().equalsIgnoreCase(c.getCode()) || dto.getCategorie().equalsIgnoreCase(c.getLibelle()))
                    .findFirst().ifPresent(entity::setCategorieObj);
        }
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
