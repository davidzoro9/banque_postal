package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.BaremeIUTSDto;
import com.bpbf.sirh_backend.entities.BaremeIUTS;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.BaremeIUTSMapper;
import com.bpbf.sirh_backend.repositories.BaremeIUTSRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BaremeIUTSService {

    private final BaremeIUTSRepository repository;
    private final BaremeIUTSMapper mapper;

    @Transactional(readOnly = true)
    public List<BaremeIUTSDto> getAll() {
        return mapper.toDtos(repository.findAll());
    }

    @Transactional(readOnly = true)
    public BaremeIUTSDto getById(Long id) {
        BaremeIUTS entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Barème IUTS introuvable avec l'ID: " + id));
        return mapper.toDto(entity);
    }

    @Transactional
    public BaremeIUTSDto create(BaremeIUTSDto dto) {
        BaremeIUTS entity = mapper.toEntity(dto);
        if (entity.getActif() == null) {
            entity.setActif(true);
        }
        return mapper.toDto(repository.save(entity));
    }

    @Transactional
    public BaremeIUTSDto update(Long id, BaremeIUTSDto dto) {
        BaremeIUTS entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Barème IUTS introuvable avec l'ID: " + id));
        entity.setCodeTranche(dto.getCode());
        entity.setTrancheMin(dto.getTrancheMin());
        entity.setTrancheMax(dto.getTrancheMax());
        entity.setTauxImposition(dto.getTauxPercent());
        entity.setAbattementForfaitaire(dto.getAbattementFixe());
        if (dto.getActif() != null) {
            entity.setActif(dto.getActif());
        }
        return mapper.toDto(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Barème IUTS introuvable avec l'ID: " + id);
        }
        repository.deleteById(id);
    }
}
