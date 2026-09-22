package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.paie.*;
import com.bpbf.sirh_backend.entities.SalaryCategory;
import com.bpbf.sirh_backend.entities.SalaryElement;
import com.bpbf.sirh_backend.repositories.SalaryCategoryRepository;
import com.bpbf.sirh_backend.repositories.SalaryElementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SalaryParametrageService {

    private final SalaryCategoryRepository categoryRepository;
    private final SalaryElementRepository elementRepository;
    private final JdbcTemplate jdbcTemplate;

    // --- CATEGORIES ---
    @Transactional(readOnly = true)
    public List<SalaryCategoryResponseDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapCategoryToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SalaryCategoryResponseDto getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .map(this::mapCategoryToDto)
                .orElseThrow(() -> new RuntimeException("Catégorie de salaire non trouvée avec l'id: " + id));
    }

    @Transactional
    public SalaryCategoryResponseDto createCategory(SalaryCategoryRequestDto dto) {
        SalaryCategory cat = new SalaryCategory();
        cat.setCode(dto.getCode());
        cat.setName(dto.getName());
        cat.setType(dto.getType() != null && !dto.getType().trim().isEmpty() ? dto.getType().trim() : "GAIN");
        return mapCategoryToDto(categoryRepository.save(cat));
    }

    @Transactional
    public SalaryCategoryResponseDto updateCategory(Long id, SalaryCategoryRequestDto dto) {
        SalaryCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée: " + id));
        cat.setCode(dto.getCode());
        cat.setName(dto.getName());
        if (dto.getType() != null && !dto.getType().trim().isEmpty()) {
            cat.setType(dto.getType().trim());
        }
        return mapCategoryToDto(categoryRepository.save(cat));
    }

    @Transactional
    public void deleteCategory(Long id) {
        SalaryCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée: " + id));

        try {
            jdbcTemplate.update("UPDATE salary_element SET salary_category_id = NULL WHERE salary_category_id = ?", id);
        } catch (Exception e) {
            log.warn("Dissociation éléments pour catégorie {}: {}", id, e.getMessage());
        }
        categoryRepository.delete(cat);
    }

    // --- ELEMENTS ---
    @Transactional(readOnly = true)
    public List<SalaryElementResponseDto> getAllElements() {
        return elementRepository.findAll().stream()
                .map(this::mapElementToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SalaryElementResponseDto getElementById(Long id) {
        return elementRepository.findById(id)
                .map(this::mapElementToDto)
                .orElseThrow(() -> new RuntimeException("Élément de salaire non trouvé: " + id));
    }

    @Transactional
    public SalaryElementResponseDto createElement(SalaryElementRequestDto dto) {
        Long catId = dto.getSalaryCategoryId() != null ? dto.getSalaryCategoryId() : dto.getCategoryId();
        SalaryCategory category = null;
        if (catId != null && catId > 0) {
            category = categoryRepository.findById(catId).orElse(null);
        }

        SalaryElement el = new SalaryElement();
        el.setCode(dto.getCode() != null ? dto.getCode().trim().toUpperCase() : "");
        el.setName(dto.getName() != null ? dto.getName().trim() : "");
        el.setSalaryCategory(category);
        el.setRate(dto.getRate());
        el.setIsCotisable(dto.getIsCotisable() != null ? dto.getIsCotisable() : true);
        el.setIsImposable(dto.getIsImposable() != null ? dto.getIsImposable() : true);
        el.setMethodCalcul(dto.getMethodCalcul() != null ? dto.getMethodCalcul() : "MONTANT_FIXE");
        
        String formulaVal = dto.getFormule() != null ? dto.getFormule() : dto.getFormula();
        el.setFormule(formulaVal != null ? formulaVal : "0");
        
        el.setOrdre(dto.getOrdre() != null ? dto.getOrdre() : 1);
        el.setStatut(dto.getStatut() != null ? dto.getStatut() : "ACTIF");

        SalaryElement saved = elementRepository.saveAndFlush(el);
        return mapElementToDto(saved);
    }

    @Transactional
    public SalaryElementResponseDto updateElement(Long id, SalaryElementRequestDto dto) {
        SalaryElement el = elementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Élément non trouvé: " + id));

        Long catId = dto.getSalaryCategoryId() != null ? dto.getSalaryCategoryId() : dto.getCategoryId();
        if (catId != null && catId > 0) {
            SalaryCategory category = categoryRepository.findById(catId).orElse(null);
            el.setSalaryCategory(category);
        } else if (catId != null && catId <= 0) {
            el.setSalaryCategory(null);
        }

        if (dto.getCode() != null && !dto.getCode().trim().isEmpty()) {
            el.setCode(dto.getCode().trim().toUpperCase());
        }
        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            el.setName(dto.getName().trim());
        }
        el.setRate(dto.getRate());
        if (dto.getIsCotisable() != null) el.setIsCotisable(dto.getIsCotisable());
        if (dto.getIsImposable() != null) el.setIsImposable(dto.getIsImposable());
        if (dto.getMethodCalcul() != null) el.setMethodCalcul(dto.getMethodCalcul());
        
        String formulaVal = dto.getFormule() != null ? dto.getFormule() : dto.getFormula();
        if (formulaVal != null) {
            el.setFormule(formulaVal);
        }
        
        if (dto.getOrdre() != null) el.setOrdre(dto.getOrdre());
        if (dto.getStatut() != null) el.setStatut(dto.getStatut());

        SalaryElement saved = elementRepository.saveAndFlush(el);
        return mapElementToDto(saved);
    }

    @Transactional
    public void deleteElement(Long id) {
        SalaryElement el = elementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Élément non trouvé avec l'id: " + id));

        // Dissocier des tables liées de façon sécurisée (DML sans DDL)
        try {
            jdbcTemplate.update("UPDATE avoir SET salary_element_id = NULL WHERE salary_element_id = ?", id);
        } catch (Exception e) {
            log.warn("Notice dissociation avoir pour element {}: {}", id, e.getMessage());
        }
        try {
            jdbcTemplate.update("UPDATE precompte SET element_salary_id = NULL WHERE element_salary_id = ?", id);
        } catch (Exception e) {
            log.warn("Notice dissociation precompte pour element {}: {}", id, e.getMessage());
        }
        try {
            jdbcTemplate.update("UPDATE trop_percu SET salary_element_id = NULL WHERE salary_element_id = ?", id);
        } catch (Exception e) {
            log.warn("Notice dissociation trop_percu pour element {}: {}", id, e.getMessage());
        }

        // Dissocier les collections Hibernate associées à cette instance
        if (el.getAvoirs() != null) {
            el.getAvoirs().forEach(a -> a.setSalaryElement(null));
            el.getAvoirs().clear();
        }
        if (el.getPrecomptes() != null) {
            el.getPrecomptes().forEach(p -> p.setSalaryElement(null));
            el.getPrecomptes().clear();
        }

        elementRepository.delete(el);
        log.info("Élément de salaire id={} ({}) supprimé avec succès.", id, el.getCode());
    }

    // --- MAPPERS ---
    private SalaryCategoryResponseDto mapCategoryToDto(SalaryCategory cat) {
        return SalaryCategoryResponseDto.builder()
                .id(cat.getId())
                .code(cat.getCode())
                .name(cat.getName())
                .type(cat.getType() != null ? cat.getType() : "GAIN")
                .build();
    }

    private SalaryElementResponseDto mapElementToDto(SalaryElement el) {
        String type = "GAIN";
        if (el.getSalaryCategory() != null && el.getSalaryCategory().getType() != null) {
            type = el.getSalaryCategory().getType();
        }
        return SalaryElementResponseDto.builder()
                .id(el.getId())
                .code(el.getCode())
                .name(el.getName())
                .categoryId(el.getSalaryCategory() != null ? el.getSalaryCategory().getId() : null)
                .categoryName(el.getSalaryCategory() != null ? el.getSalaryCategory().getName() : null)
                .categoryCode(el.getSalaryCategory() != null ? el.getSalaryCategory().getCode() : null)
                .type(type)
                .rate(el.getRate())
                .isCotisable(el.getIsCotisable())
                .isImposable(el.getIsImposable())
                .methodCalcul(el.getMethodCalcul())
                .formule(el.getFormule())
                .ordre(el.getOrdre())
                .statut(el.getStatut())
                .build();
    }
}
