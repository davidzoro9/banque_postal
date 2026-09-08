package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.paie.*;
import com.bpbf.sirh_backend.entities.SalaryCategory;
import com.bpbf.sirh_backend.entities.SalaryElement;
import com.bpbf.sirh_backend.repositories.SalaryCategoryRepository;
import com.bpbf.sirh_backend.repositories.SalaryElementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryParametrageService {

    private final SalaryCategoryRepository categoryRepository;
    private final SalaryElementRepository elementRepository;

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
        return mapCategoryToDto(categoryRepository.save(cat));
    }

    @Transactional
    public SalaryCategoryResponseDto updateCategory(Long id, SalaryCategoryRequestDto dto) {
        SalaryCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée: " + id));
        cat.setCode(dto.getCode());
        cat.setName(dto.getName());
        return mapCategoryToDto(categoryRepository.save(cat));
    }

    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
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
        SalaryCategory category = null;
        if (dto.getSalaryCategoryId() != null) {
            category = categoryRepository.findById(dto.getSalaryCategoryId()).orElse(null);
        }

        SalaryElement el = new SalaryElement();
        el.setCode(dto.getCode());
        el.setName(dto.getName());
        el.setSalaryCategory(category);
        el.setRate(dto.getRate());
        el.setIsCotisable(dto.getIsCotisable() != null ? dto.getIsCotisable() : true);
        el.setIsImposable(dto.getIsImposable() != null ? dto.getIsImposable() : true);
        el.setMethodCalcul(dto.getMethodCalcul());
        el.setFormule(dto.getFormule());
        el.setOrdre(dto.getOrdre() != null ? dto.getOrdre() : 1);
        el.setStatut(dto.getStatut() != null ? dto.getStatut() : "ACTIF");

        return mapElementToDto(elementRepository.save(el));
    }

    @Transactional
    public SalaryElementResponseDto updateElement(Long id, SalaryElementRequestDto dto) {
        SalaryElement el = elementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Élément non trouvé: " + id));

        if (dto.getSalaryCategoryId() != null) {
            SalaryCategory category = categoryRepository.findById(dto.getSalaryCategoryId()).orElse(null);
            el.setSalaryCategory(category);
        }

        el.setCode(dto.getCode());
        el.setName(dto.getName());
        el.setRate(dto.getRate());
        el.setIsCotisable(dto.getIsCotisable());
        el.setIsImposable(dto.getIsImposable());
        el.setMethodCalcul(dto.getMethodCalcul());
        el.setFormule(dto.getFormule());
        el.setOrdre(dto.getOrdre());
        el.setStatut(dto.getStatut());

        return mapElementToDto(elementRepository.save(el));
    }

    @Transactional
    public void deleteElement(Long id) {
        elementRepository.deleteById(id);
    }

    // --- MAPPERS ---
    private SalaryCategoryResponseDto mapCategoryToDto(SalaryCategory cat) {
        return SalaryCategoryResponseDto.builder()
                .id(cat.getId())
                .code(cat.getCode())
                .name(cat.getName())
                .build();
    }

    private SalaryElementResponseDto mapElementToDto(SalaryElement el) {
        return SalaryElementResponseDto.builder()
                .id(el.getId())
                .code(el.getCode())
                .name(el.getName())
                .categoryId(el.getSalaryCategory() != null ? el.getSalaryCategory().getId() : null)
                .categoryName(el.getSalaryCategory() != null ? el.getSalaryCategory().getName() : null)
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
