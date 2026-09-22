package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.RetenueDto;
import com.bpbf.sirh_backend.entities.BaseCalculRetenue;
import com.bpbf.sirh_backend.entities.Retenue;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.RetenueMapper;
import com.bpbf.sirh_backend.repositories.RetenueRepository;
import com.bpbf.sirh_backend.repositories.RegimeSecuriteSocialRepository;
import com.bpbf.sirh_backend.repositories.TypeRetenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RetenueService {
    private final RetenueMapper mapper;
    private final RetenueRepository repository;
    private final TypeRetenueRepository typeRetenueRepository;
    private final RegimeSecuriteSocialRepository regimeSecuriteSocialRepository;

    public List<RetenueDto> getAll() {
        return mapper.toDtos(repository.findAll());
    }

    public RetenueDto create(RetenueDto dto) {
        validateBaseCalcul(dto);
        Retenue entity = mapper.toEntity(dto);
        resolveTypeRetenue(entity, dto.getTypeRetenueId());
        resolveRegimeSecuriteSocial(entity, dto.getRegimeSecuriteSocialId());
        return mapper.toDto(repository.save(entity));
    }

    public RetenueDto update(Long id, RetenueDto dto) {
        validateBaseCalcul(dto);
        Retenue entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cette retenue n'existe pas"));
        entity.setCode(dto.getCode());
        entity.setLibelle(dto.getLibelle());
        entity.setTaux(dto.getTaux());
        entity.setBaseCalcul(dto.getBaseCalcul());
        entity.setDescription(dto.getDescription());
        entity.setActif(dto.getActif());
        resolveTypeRetenue(entity, dto.getTypeRetenueId());
        resolveRegimeSecuriteSocial(entity, dto.getRegimeSecuriteSocialId());
        return mapper.toDto(repository.save(entity));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private void validateBaseCalcul(RetenueDto dto) {
        if (dto.getBaseCalcul() == null) {
            dto.setBaseCalcul(BaseCalculRetenue.REMUNERATION_BRUTE);
        }
    }

    private void resolveTypeRetenue(Retenue entity, Long typeRetenueId) {
        if (typeRetenueId == null) {
            entity.setTypeRetenue(null);
        } else {
            entity.setTypeRetenue(typeRetenueRepository.findById(typeRetenueId)
                    .orElseThrow(() -> new ResourceNotFoundException("Ce type de retenue n'existe pas")));
        }
    }

    private void resolveRegimeSecuriteSocial(Retenue entity, Long regimeId) {
        if (regimeId == null) {
            entity.setRegimeSecuriteSocial(null);
        } else {
            entity.setRegimeSecuriteSocial(regimeSecuriteSocialRepository.findById(regimeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Ce régime de sécurité sociale n'existe pas")));
        }
    }
}
