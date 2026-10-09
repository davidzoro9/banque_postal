package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.TypeAbsenceCongeDto;
import com.bpbf.sirh_backend.entities.TypeAbsenceConge;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.TypeAbsenceCongeMapper;
import com.bpbf.sirh_backend.repositories.TypeAbsenceCongeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class TypeAbsenceCongeService {

    private final TypeAbsenceCongeMapper typeAbsenceCongeMapper;
    private final TypeAbsenceCongeRepository typeAbsenceCongeRepository;

    public List<TypeAbsenceCongeDto> getAllTypeAbsenceConge(){
        List<TypeAbsenceConge> typeAbsenceConges = typeAbsenceCongeRepository.findAll();
        return typeAbsenceCongeMapper.toDtos(typeAbsenceConges);
    }

    public TypeAbsenceCongeDto createTypeAbsenceConge(TypeAbsenceCongeDto typeAbsenceCongeDto){
        String code = typeAbsenceCongeDto.getCode();
        if (code == null || code.isBlank()) {
            String baseCode = typeAbsenceCongeDto.getName() != null 
                ? typeAbsenceCongeDto.getName().trim().toUpperCase().replaceAll("[^A-Z0-9]", "_") 
                : "TAC";
            if (baseCode.length() > 15) baseCode = baseCode.substring(0, 15);
            code = baseCode + "_" + System.currentTimeMillis();
            typeAbsenceCongeDto.setCode(code);
        } else {
            // Vérifier unicité du code
            if (typeAbsenceCongeRepository.findByCode(code).isPresent()) {
                code = code + "_" + (System.currentTimeMillis() % 10000);
                typeAbsenceCongeDto.setCode(code);
            }
        }

        TypeAbsenceConge typeAbsenceConge = typeAbsenceCongeMapper.toEntity(typeAbsenceCongeDto);
        typeAbsenceConge.setId(null);
        TypeAbsenceConge saved = typeAbsenceCongeRepository.save(typeAbsenceConge);
        return typeAbsenceCongeMapper.toDto(saved);
    }

    public TypeAbsenceCongeDto updateTypeAbsenceConge(Long id, TypeAbsenceCongeDto typeAbsenceCongeDto){
        TypeAbsenceConge typeAbsenceConge = typeAbsenceCongeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ce type d'absence/congé n'existe pas"));

        if (typeAbsenceCongeDto.getCode() != null && !typeAbsenceCongeDto.getCode().isBlank()) {
            typeAbsenceConge.setCode(typeAbsenceCongeDto.getCode());
        }
        if (typeAbsenceCongeDto.getName() != null && !typeAbsenceCongeDto.getName().isBlank()) {
            typeAbsenceConge.setName(typeAbsenceCongeDto.getName());
        }
        if (typeAbsenceCongeDto.getDeductibleDuSolde() != null) {
            typeAbsenceConge.setDeductibleDuSolde(typeAbsenceCongeDto.getDeductibleDuSolde());
        }
        if (typeAbsenceCongeDto.getDureeMaxLegaleJours() != null) {
            typeAbsenceConge.setDureeMaxLegaleJours(typeAbsenceCongeDto.getDureeMaxLegaleJours());
        }
        if (typeAbsenceCongeDto.getCategorie() != null && !typeAbsenceCongeDto.getCategorie().isBlank()) {
            typeAbsenceConge.setCategorie(typeAbsenceCongeDto.getCategorie());
        }
        if (typeAbsenceCongeDto.getSexeRequis() != null && !typeAbsenceCongeDto.getSexeRequis().isBlank()) {
            typeAbsenceConge.setSexeRequis(typeAbsenceCongeDto.getSexeRequis());
        }
        if (typeAbsenceCongeDto.getRemunere() != null) {
            typeAbsenceConge.setRemunere(typeAbsenceCongeDto.getRemunere());
        }
        if (typeAbsenceCongeDto.getTauxRemuneration() != null) {
            typeAbsenceConge.setTauxRemuneration(typeAbsenceCongeDto.getTauxRemuneration());
        }
        if (typeAbsenceCongeDto.getJustificatifRequis() != null) {
            typeAbsenceConge.setJustificatifRequis(typeAbsenceCongeDto.getJustificatifRequis());
        }
        if (typeAbsenceCongeDto.getTypeJustificatif() != null) {
            typeAbsenceConge.setTypeJustificatif(typeAbsenceCongeDto.getTypeJustificatif());
        }
        if (typeAbsenceCongeDto.getActif() != null) {
            typeAbsenceConge.setActif(typeAbsenceCongeDto.getActif());
        }
        if (typeAbsenceCongeDto.getDelaiJustificationJours() != null) {
            typeAbsenceConge.setDelaiJustificationJours(typeAbsenceCongeDto.getDelaiJustificationJours());
        }
        if (typeAbsenceCongeDto.getDescription() != null) {
            typeAbsenceConge.setDescription(typeAbsenceCongeDto.getDescription());
        }

        TypeAbsenceConge saved = typeAbsenceCongeRepository.save(typeAbsenceConge);

        return typeAbsenceCongeMapper.toDto(saved);
    }

    @org.springframework.transaction.annotation.Transactional
    public List<TypeAbsenceCongeDto> batchUpdate(List<TypeAbsenceCongeDto> dtos) {
        if (dtos == null || dtos.isEmpty()) return java.util.Collections.emptyList();
        List<TypeAbsenceCongeDto> result = new java.util.ArrayList<>();
        for (TypeAbsenceCongeDto dto : dtos) {
            if (dto.getId() != null) {
                result.add(updateTypeAbsenceConge(dto.getId(), dto));
            } else {
                result.add(createTypeAbsenceConge(dto));
            }
        }
        return result;
    }

    public void delete(Long id){
        typeAbsenceCongeRepository.deleteById(id);
    }
}
