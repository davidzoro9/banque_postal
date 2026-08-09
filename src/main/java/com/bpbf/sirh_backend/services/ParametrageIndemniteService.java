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

    public List<ParametrageIndemniteDto> getByGradeAndFonction(String gradeStr, String fonctionStr) {
        String cat = "";
        if (gradeStr != null && !gradeStr.trim().isEmpty()) {
            String g = gradeStr.trim().toUpperCase();
            int eIdx = g.indexOf('E');
            if (eIdx > 0) cat = g.substring(0, eIdx);
            else cat = g;
        }

        final String targetCat = cat;
        final String targetFct = fonctionStr != null ? fonctionStr.trim().toUpperCase() : "";

        List<ParametrageIndemnite> allActive = repository.findAll().stream()
                .filter(p -> p.getActif() == null || p.getActif())
                .collect(java.util.stream.Collectors.toList());

        // 1. Si une fonction est spécifiée, chercher d'abord les indemnités de nomination rattachées à cette fonction
        if (!targetFct.isEmpty()) {
            List<ParametrageIndemnite> fctIndemnites = allActive.stream()
                    .filter(p -> {
                        String pFonction = (p.getFonction() != null ? p.getFonction() : "").toUpperCase();
                        return !pFonction.isEmpty() && (targetFct.contains(pFonction) || pFonction.contains(targetFct));
                    })
                    .collect(java.util.stream.Collectors.toList());

            // Règle Métier BPBF : Si l'agent a une fonction nommée avec des indemnités spécifiques de fonction,
            // on prend UNIQUEMENT les indemnités de la fonction et NON celles de la catégorie/classe.
            if (!fctIndemnites.isEmpty()) {
                return mapper.toDtos(fctIndemnites);
            }
        }

        // 2. Sinon (Fonction Pas Nommée / Agent Simple), barème général par catégorie / classe
        List<ParametrageIndemnite> catIndemnites = allActive.stream()
                .filter(p -> {
                    String pCode = (p.getCode() != null ? p.getCode() : "").toUpperCase();
                    String pCategorie = (p.getCategorie() != null ? p.getCategorie() : "").toUpperCase();
                    String pGrade = (p.getGrade() != null ? p.getGrade() : "").toUpperCase();
                    String pFonction = (p.getFonction() != null ? p.getFonction() : "").toUpperCase();

                    // Ignorer les indemnités purement nominatives de fonction
                    if (!pFonction.isEmpty()) return false;

                    if (!targetCat.isEmpty()) {
                        if (pCode.contains("-" + targetCat + "-")) return true;

                        if (!pCategorie.isEmpty()) {
                            String[] cats = pCategorie.split(",");
                            for (String c : cats) {
                                if (c.trim().equalsIgnoreCase(targetCat)) return true;
                            }
                        }

                        if (pCategorie.isEmpty()) {
                            if (targetCat.startsWith("C") && !targetCat.startsWith("CL")) {
                                return "GROUPE I".equalsIgnoreCase(pGrade);
                            }
                            if (targetCat.startsWith("CL")) {
                                try {
                                    int num = Integer.parseInt(targetCat.replace("CL", ""));
                                    if (num <= 4 && "GROUPE II".equalsIgnoreCase(pGrade)) {
                                        return pCode.contains("CL" + num);
                                    }
                                    if (num >= 5 && "GROUPE III".equalsIgnoreCase(pGrade)) {
                                        return pCode.contains("CL" + num);
                                    }
                                } catch (Exception ignored) {}
                            }
                        }
                    }
                    return false;
                })
                .collect(java.util.stream.Collectors.toList());

        return mapper.toDtos(catIndemnites);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
