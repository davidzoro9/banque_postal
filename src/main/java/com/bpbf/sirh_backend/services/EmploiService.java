package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.EmploiDto;
import com.bpbf.sirh_backend.dtos.FonctionDto;
import com.bpbf.sirh_backend.entities.Emploi;
import com.bpbf.sirh_backend.entities.Fonction;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.EmploiMapper;
import com.bpbf.sirh_backend.repositories.EmploiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmploiService {
    private final EmploiMapper emploiMapper;
    private final EmploiRepository emploiRepository;

    public List<EmploiDto> getAllEmploi(){
        List<Emploi> emplois = emploiRepository.findAll();
        return emploiMapper.toDtos(emplois);
    }

    public EmploiDto createEmploi(EmploiDto emploiDto){
        Emploi emploi = emploiMapper.toEntity(emploiDto);
        Emploi saved = emploiRepository.save(emploi);
        return emploiMapper.toDto(saved);
    }

    public EmploiDto updateEmploi(Long id, EmploiDto emploiDto){
        Emploi existingEmploi = emploiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cet emploi n'existe pas"));

        existingEmploi.setCode(emploiDto.getCode());
        existingEmploi.setName(emploiDto.getName());

        Emploi saved = emploiRepository.save(existingEmploi);

        return emploiMapper.toDto(saved);
    }

    public void delete(Long id){
        emploiRepository.deleteById(id);
    }
}
