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
    private final EmploiRepository emploiRepository;
    @org.springframework.context.annotation.Lazy
    private final EmployeeProcessService employeeProcessService;

    public List<ParametrageIndemniteDto> getAll() {
        List<ParametrageIndemnite> list = repository.findAll();
        return mapper.toDtos(list);
    }

    public ParametrageIndemniteDto create(ParametrageIndemniteDto dto) {
        ParametrageIndemnite entity = mapper.toEntity(dto);
        if (dto.getRegleType() != null) {
            entity.setRegleType(dto.getRegleType());
        }

        // Sécurisation anti-collision : si le code envoyé existe déjà ou est vide, générer le code suivant
        String code = entity.getCode();
        if (code == null || code.trim().isEmpty() || repository.existsByCode(code.trim())) {
            long max = repository.findAll().stream().mapToLong(p -> {
                if (p.getCode() != null && p.getCode().contains("-")) {
                    try {
                        String[] parts = p.getCode().split("-");
                        return Long.parseLong(parts[parts.length - 1]);
                    } catch (Exception e) {
                        return 0L;
                    }
                }
                return 0L;
            }).max().orElse(repository.count());
            String generated = "PAR-" + String.format("%03d", max + 1);
            int attempt = 1;
            while (repository.existsByCode(generated)) {
                generated = "PAR-" + String.format("%03d", max + 1 + attempt++);
            }
            entity.setCode(generated);
        } else {
            entity.setCode(code.trim());
        }

        resolveRelationships(entity, dto);
        ParametrageIndemnite saved = repository.save(entity);
        try {
            employeeProcessService.syncAllEmployees();
        } catch (Exception e) {
            System.err.println("Warn: Erreur syncAllEmployees après création: " + e.getMessage());
        }
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
        if (dto.getRegleType() != null) {
            entity.setRegleType(dto.getRegleType());
        }

        resolveRelationships(entity, dto);

        ParametrageIndemnite saved = repository.save(entity);
        try {
            employeeProcessService.syncAllEmployees();
        } catch (Exception e) {
            System.err.println("Warn: Erreur syncAllEmployees après modification: " + e.getMessage());
        }
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

        if (dto.getEmploiId() != null) {
            entity.setEmploiObj(emploiRepository.findById(dto.getEmploiId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cet emploi n'existe pas")));
        } else {
            entity.setEmploiObj(null);
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
        try {
            employeeProcessService.syncAllEmployees();
        } catch (Exception e) {
            System.err.println("Warn: Erreur syncAllEmployees après suppression: " + e.getMessage());
        }
    }
}
