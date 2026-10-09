package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.CompteComptableDto;
import com.bpbf.sirh_backend.entities.CompteComptable;
import com.bpbf.sirh_backend.repositories.CompteComptableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompteComptableService {

    private final CompteComptableRepository repository;

    @Transactional(readOnly = true)
    public List<CompteComptableDto> getAll(boolean actifOnly) {
        List<CompteComptable> list = actifOnly ? 
                repository.findByActifTrueOrderByNumeroCompteAsc() : 
                repository.findAllByOrderByNumeroCompteAsc();
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CompteComptableDto getById(Long id) {
        CompteComptable c = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte comptable introuvable : " + id));
        return toDto(c);
    }

    @Transactional
    public CompteComptableDto create(CompteComptableDto dto) {
        if (dto.getNumeroCompte() == null || dto.getNumeroCompte().trim().isBlank()) {
            throw new IllegalArgumentException("Le numéro de compte comptable est obligatoire.");
        }
        if (dto.getLibelle() == null || dto.getLibelle().trim().isBlank()) {
            throw new IllegalArgumentException("Le libellé du compte est obligatoire.");
        }

        CompteComptable entity = CompteComptable.builder()
                .numeroCompte(dto.getNumeroCompte().trim())
                .libelle(dto.getLibelle().trim())
                .classeCompte(dto.getClasseCompte() != null ? dto.getClasseCompte().trim() : determineClasse(dto.getNumeroCompte()))
                .sensParDefaut(dto.getSensParDefaut() != null ? dto.getSensParDefaut().trim().toUpperCase() : "DEBIT")
                .typeRubriqueAssociee(dto.getTypeRubriqueAssociee())
                .codeJournal(dto.getCodeJournal() != null ? dto.getCodeJournal().trim() : "OD_PAIE")
                .description(dto.getDescription())
                .actif(dto.getActif() != null ? dto.getActif() : true)
                .build();

        return toDto(repository.save(entity));
    }

    @Transactional
    public CompteComptableDto update(Long id, CompteComptableDto dto) {
        CompteComptable c = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte comptable introuvable : " + id));

        if (dto.getNumeroCompte() != null && !dto.getNumeroCompte().trim().isBlank()) {
            c.setNumeroCompte(dto.getNumeroCompte().trim());
        }
        if (dto.getLibelle() != null && !dto.getLibelle().trim().isBlank()) {
            c.setLibelle(dto.getLibelle().trim());
        }
        if (dto.getClasseCompte() != null) {
            c.setClasseCompte(dto.getClasseCompte().trim());
        } else if (c.getNumeroCompte() != null) {
            c.setClasseCompte(determineClasse(c.getNumeroCompte()));
        }
        if (dto.getSensParDefaut() != null) {
            c.setSensParDefaut(dto.getSensParDefaut().trim().toUpperCase());
        }
        if (dto.getTypeRubriqueAssociee() != null) {
            c.setTypeRubriqueAssociee(dto.getTypeRubriqueAssociee());
        }
        if (dto.getCodeJournal() != null) {
            c.setCodeJournal(dto.getCodeJournal().trim());
        }
        if (dto.getDescription() != null) {
            c.setDescription(dto.getDescription().trim());
        }
        if (dto.getActif() != null) {
            c.setActif(dto.getActif());
        }

        return toDto(repository.save(c));
    }

    @Transactional
    public CompteComptableDto toggleStatus(Long id) {
        CompteComptable c = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte comptable introuvable : " + id));
        c.setActif(c.getActif() == null || !c.getActif());
        return toDto(repository.save(c));
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private String determineClasse(String num) {
        if (num == null || num.isEmpty()) return "AUTRE";
        char c = num.charAt(0);
        return switch (c) {
            case '6' -> "CLASSE_6 (Charges du personnel)";
            case '4' -> "CLASSE_4 (Comptes de tiers & dettes)";
            case '5' -> "CLASSE_5 (Trésorerie & Banques)";
            case '7' -> "CLASSE_7 (Produits)";
            default -> "CLASSE_" + c;
        };
    }

    private CompteComptableDto toDto(CompteComptable c) {
        return CompteComptableDto.builder()
                .id(c.getId())
                .numeroCompte(c.getNumeroCompte())
                .libelle(c.getLibelle())
                .classeCompte(c.getClasseCompte())
                .sensParDefaut(c.getSensParDefaut())
                .typeRubriqueAssociee(c.getTypeRubriqueAssociee())
                .codeJournal(c.getCodeJournal())
                .description(c.getDescription())
                .actif(c.getActif())
                .build();
    }
}
