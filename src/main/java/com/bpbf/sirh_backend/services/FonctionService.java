package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.FonctionDto;
import com.bpbf.sirh_backend.entities.Fonction;
import com.bpbf.sirh_backend.entities.ParametrageIndemnite;
import com.bpbf.sirh_backend.entities.TypeIndemnite;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.FonctionMapper;
import com.bpbf.sirh_backend.repositories.FonctionRepository;
import com.bpbf.sirh_backend.repositories.ParametrageIndemniteRepository;
import com.bpbf.sirh_backend.repositories.TypeIndemniteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FonctionService {
    private final FonctionMapper fonctionMapper;
    private final FonctionRepository fonctionRepository;
    private final ParametrageIndemniteRepository parametrageIndemniteRepository;
    private final TypeIndemniteRepository typeIndemniteRepository;

    public List<FonctionDto> getAllFonction(){
        List<Fonction> fonctions = fonctionRepository.findAll();
        List<FonctionDto> dtos = fonctionMapper.toDtos(fonctions);
        List<ParametrageIndemnite> allParams = parametrageIndemniteRepository.findAll();

        for (FonctionDto dto : dtos) {
            if ("NOMMEE".equalsIgnoreCase(dto.getTypeNomination())) {
                List<FonctionDto.FonctionIndemniteDto> indList = new ArrayList<>();
                for (ParametrageIndemnite pi : allParams) {
                    if ("NOMINATION".equalsIgnoreCase(pi.getRegleType())) {
                        String piFct = pi.getFonction();
                        if (piFct != null && (piFct.equalsIgnoreCase(dto.getName()) || piFct.equalsIgnoreCase(dto.getCode()))) {
                            indList.add(new FonctionDto.FonctionIndemniteDto(pi.getTypeIndemnite(), pi.getTaux()));
                        }
                    }
                }
                dto.setIndemnites(indList);
            }
        }
        return dtos;
    }

    public FonctionDto createFonction(FonctionDto fonctionDto){
        Fonction fonction = fonctionMapper.toEntity(fonctionDto);
        Fonction saved = fonctionRepository.save(fonction);

        saveAssociatedIndemnites(saved, fonctionDto);

        FonctionDto res = fonctionMapper.toDto(saved);
        res.setIndemnites(fonctionDto.getIndemnites());
        return res;
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

        saveAssociatedIndemnites(saved, fonctionDto);

        FonctionDto res = fonctionMapper.toDto(saved);
        res.setIndemnites(fonctionDto.getIndemnites());
        return res;
    }

    private void saveAssociatedIndemnites(Fonction fonction, FonctionDto fonctionDto) {
        if ("NOMMEE".equalsIgnoreCase(fonction.getTypeNomination())) {
            // Clear previous nomination indemnities for this function
            List<ParametrageIndemnite> existingList = parametrageIndemniteRepository.findAll();
            for (ParametrageIndemnite pi : existingList) {
                if ("NOMINATION".equalsIgnoreCase(pi.getRegleType())) {
                    String piFct = pi.getFonction();
                    if (piFct != null && (piFct.equalsIgnoreCase(fonction.getName()) || piFct.equalsIgnoreCase(fonction.getCode()))) {
                        parametrageIndemniteRepository.delete(pi);
                    }
                }
            }

            if (fonctionDto.getIndemnites() != null && !fonctionDto.getIndemnites().isEmpty()) {
                int idx = 1;
                for (FonctionDto.FonctionIndemniteDto indDto : fonctionDto.getIndemnites()) {
                    if (indDto.getTypeIndemnite() != null && !indDto.getTypeIndemnite().trim().isEmpty()) {
                        ParametrageIndemnite pi = new ParametrageIndemnite();
                        pi.setCode("IND-FCT-" + fonction.getId() + "-" + idx++);
                        pi.setFonctionObj(fonction);
                        pi.setTypeIndemnite(indDto.getTypeIndemnite().trim());
                        
                        // Try to link TypeIndemnite entity
                        typeIndemniteRepository.findAll().stream()
                                .filter(t -> indDto.getTypeIndemnite().trim().equalsIgnoreCase(t.getName()) || indDto.getTypeIndemnite().trim().equalsIgnoreCase(t.getCode()))
                                .findFirst().ifPresent(pi::setTypeIndemniteObj);

                        pi.setTaux(indDto.getMontant() != null ? indDto.getMontant() : 0.0);
                        pi.setRegleType("NOMINATION");
                        pi.setTypeNomination("NOMMEE");
                        pi.setActif(true);

                        parametrageIndemniteRepository.save(pi);
                    }
                }
            }
        }
    }

    public void delete(Long id){
        fonctionRepository.deleteById(id);
    }
}
