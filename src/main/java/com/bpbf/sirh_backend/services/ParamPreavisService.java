package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.ParamPreavisDto;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.entities.ParamPreavis;
import com.bpbf.sirh_backend.repositories.ParamPreavisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParamPreavisService {

    private final ParamPreavisRepository repository;

    @Transactional(readOnly = true)
    public List<ParamPreavisDto> getAll() {
        return repository.findAllByOrderByOrdreAsc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ParamPreavisDto getById(Long id) {
        return repository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Règle de préavis introuvable : #" + id));
    }

    @Transactional
    public ParamPreavisDto create(ParamPreavisDto dto) {
        if (dto.getCode() == null || dto.getCode().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le code est obligatoire");
        }
        if (dto.getLibelle() == null || dto.getLibelle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le libellé est obligatoire");
        }
        if (dto.getDureeMois() == null || dto.getDureeMois() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La durée en mois doit être supérieure à 0");
        }

        ParamPreavis entity = ParamPreavis.builder()
                .code(dto.getCode().trim().toUpperCase(Locale.ROOT))
                .libelle(dto.getLibelle().trim())
                .typePersonnel(dto.getTypePersonnel() != null ? dto.getTypePersonnel().trim().toUpperCase(Locale.ROOT) : "NON_CADRE")
                .dureeMois(dto.getDureeMois())
                .description(dto.getDescription())
                .ordre(dto.getOrdre() != null ? dto.getOrdre() : 1)
                .actif(dto.getActif() != null ? dto.getActif() : true)
                .build();

        return toDto(repository.save(entity));
    }

    @Transactional
    public ParamPreavisDto update(Long id, ParamPreavisDto dto) {
        ParamPreavis entity = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Règle de préavis introuvable : #" + id));

        if (dto.getCode() != null && !dto.getCode().isBlank()) {
            entity.setCode(dto.getCode().trim().toUpperCase(Locale.ROOT));
        }
        if (dto.getLibelle() != null && !dto.getLibelle().isBlank()) {
            entity.setLibelle(dto.getLibelle().trim());
        }
        if (dto.getTypePersonnel() != null && !dto.getTypePersonnel().isBlank()) {
            entity.setTypePersonnel(dto.getTypePersonnel().trim().toUpperCase(Locale.ROOT));
        }
        if (dto.getDureeMois() != null && dto.getDureeMois() > 0) {
            entity.setDureeMois(dto.getDureeMois());
        }
        if (dto.getDescription() != null) {
            entity.setDescription(dto.getDescription());
        }
        if (dto.getOrdre() != null) {
            entity.setOrdre(dto.getOrdre());
        }
        if (dto.getActif() != null) {
            entity.setActif(dto.getActif());
        }

        return toDto(repository.save(entity));
    }

    @Transactional
    public ParamPreavisDto toggleActif(Long id) {
        ParamPreavis entity = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Règle de préavis introuvable : #" + id));
        entity.setActif(!Boolean.TRUE.equals(entity.getActif()));
        return toDto(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Règle de préavis introuvable : #" + id);
        }
        repository.deleteById(id);
    }

    /**
     * Règle V3 : Résolution de la durée officielle de préavis (en mois) depuis les paramètres généraux
     */
    @Transactional(readOnly = true)
    public int getDureePreavisForEmployee(Employee emp) {
        if (emp == null) return 1;

        // 1. Dérogation individuelle sur la fiche de l'employé
        if (emp.getDureePreavis() != null && emp.getDureePreavis() > 0) {
            return emp.getDureePreavis();
        }

        // 2. Détermination de la typologie (Cadre / Maîtrise / Non-cadre)
        boolean isCadre = false;
        boolean isMaitrise = false;

        if (emp.getCategorieObj() != null && emp.getCategorieObj().getLibelle() != null) {
            String cLib = emp.getCategorieObj().getLibelle().toUpperCase(Locale.ROOT);
            if (cLib.contains("CADRE") || cLib.contains("DIRECTION")) {
                isCadre = true;
            } else if (cLib.contains("MAITRISE") || cLib.contains("MAÎTRISE") || cLib.contains("TECHNI")) {
                isMaitrise = true;
            }
        }
        if (!isCadre && emp.getGradeObj() != null && emp.getGradeObj().getLibelle() != null) {
            String gLib = emp.getGradeObj().getLibelle().toUpperCase(Locale.ROOT);
            if (gLib.contains("CADRE") || gLib.contains("DIRECTEUR") || gLib.contains("CHEF")) {
                isCadre = true;
            } else if (gLib.contains("MAITRISE") || gLib.contains("MAÎTRISE") || gLib.contains("TECHNI")) {
                isMaitrise = true;
            }
        }
        if (!isCadre && emp.getFonction() != null && emp.getFonction().getName() != null) {
            String fLib = emp.getFonction().getName().toUpperCase(Locale.ROOT);
            if (fLib.contains("DIRECTEUR") || fLib.contains("CHEF DE SERVICE") || fLib.contains("RESPONSABLE") || fLib.contains("CADRE")) {
                isCadre = true;
            }
        }

        // 3. Lecture depuis la table param_preavis (Paramètres Généraux)
        List<ParamPreavis> params = repository.findByActifTrueOrderByOrdreAsc();
        if (isCadre) {
            for (ParamPreavis p : params) {
                if ("CADRE".equalsIgnoreCase(p.getTypePersonnel()) || "PREAVIS_CADRE".equalsIgnoreCase(p.getCode())) {
                    if (p.getDureeMois() != null && p.getDureeMois() > 0) return p.getDureeMois();
                }
            }
            return 3;
        }

        if (isMaitrise) {
            for (ParamPreavis p : params) {
                if ("MAITRISE".equalsIgnoreCase(p.getTypePersonnel()) || "PREAVIS_MAITRISE".equalsIgnoreCase(p.getCode())) {
                    if (p.getDureeMois() != null && p.getDureeMois() > 0) return p.getDureeMois();
                }
            }
        }

        for (ParamPreavis p : params) {
            if ("NON_CADRE".equalsIgnoreCase(p.getTypePersonnel()) || "PREAVIS_NON_CADRE".equalsIgnoreCase(p.getCode())) {
                if (p.getDureeMois() != null && p.getDureeMois() > 0) return p.getDureeMois();
            }
        }

        return 1;
    }

    private ParamPreavisDto toDto(ParamPreavis entity) {
        return ParamPreavisDto.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .libelle(entity.getLibelle())
                .typePersonnel(entity.getTypePersonnel())
                .dureeMois(entity.getDureeMois())
                .description(entity.getDescription())
                .ordre(entity.getOrdre())
                .actif(entity.getActif())
                .build();
    }
}
