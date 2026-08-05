package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.GrilleSalarialeDto;
import com.bpbf.sirh_backend.entities.GrilleSalariale;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.GrilleSalarialeMapper;
import com.bpbf.sirh_backend.repositories.GrilleSalarialeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GrilleSalarialeService {
    private final GrilleSalarialeMapper grilleSalarialeMapper;
    private final GrilleSalarialeRepository grilleSalarialeRepository;

    public List<GrilleSalarialeDto> getAllGrilleSalariale(){
        List<GrilleSalariale> grilleSalariales = grilleSalarialeRepository.findAll();
        return grilleSalarialeMapper.toDtos(grilleSalariales);
    }

    public GrilleSalarialeDto createGrilleSalariale(GrilleSalarialeDto grilleSalarialeDto){
        GrilleSalariale grilleSalariale = grilleSalarialeMapper.toEntity(grilleSalarialeDto);
        GrilleSalariale saved = grilleSalarialeRepository.save(grilleSalariale);
        return grilleSalarialeMapper.toDto(saved);

    }

    public GrilleSalarialeDto updateGrilleSalariale(Long id, GrilleSalarialeDto grilleSalarialeDto){
        GrilleSalariale grilleSalariale = grilleSalarialeRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Cette grille n'existe pas"));

        grilleSalariale.setClasse(grilleSalarialeDto.getClasse());
        grilleSalariale.setCategory(grilleSalarialeDto.getCategory());
        grilleSalariale.setEchelle(grilleSalarialeDto.getEchelle());
        grilleSalariale.setEchellon(grilleSalarialeDto.getEchellon());
        grilleSalariale.setBasicSalary(grilleSalarialeDto.getBasicSalary());

        GrilleSalariale saved = grilleSalarialeRepository.save(grilleSalariale);
        return grilleSalarialeMapper.toDto(saved);
    }

    public void delete(Long id){
        grilleSalarialeRepository.deleteById(id);
    }
}
