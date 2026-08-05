package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.FonctionDto;
import com.bpbf.sirh_backend.entities.Fonction;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.FonctionMapper;
import com.bpbf.sirh_backend.repositories.FonctionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FonctionService {
    private final FonctionMapper fonctionMapper;
    private final FonctionRepository fonctionRepository;

    public List<FonctionDto> getAllFonction(){
        List<Fonction> fonctions = fonctionRepository.findAll();
        return fonctionMapper.toDtos(fonctions);
    }

    public FonctionDto createFonction(FonctionDto fonctionDto){
        Fonction fonction = fonctionMapper.toEntity(fonctionDto);
        Fonction saved = fonctionRepository.save(fonction);
        return fonctionMapper.toDto(saved);
    }

    public FonctionDto updateFonction(Long id, FonctionDto fonctionDto){
        Fonction existingFonction = fonctionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cette fonction n'existe pas"));

        existingFonction.setCode(fonctionDto.getCode());
        existingFonction.setName(fonctionDto.getName());
        existingFonction.setDescription(fonctionDto.getDescription());
        existingFonction.setTypeNomination(fonctionDto.getTypeNomination());
        existingFonction.setActif(fonctionDto.getActif() != null ? fonctionDto.getActif() : true);

        Fonction saved = fonctionRepository.save(existingFonction);

        return fonctionMapper.toDto(saved);
    }

    public void delete(Long id){
        fonctionRepository.deleteById(id);
    }
}
