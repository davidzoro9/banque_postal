package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.FonctionDto;
import com.bpbf.sirh_backend.entities.Fonction;
import com.bpbf.sirh_backend.entities.ParametrageIndemnite;
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
    @org.springframework.context.annotation.Lazy
    private final EmployeeProcessService employeeProcessService;

    public List<FonctionDto> getAllFonction(){
        List<Fonction> fonctions = fonctionRepository.findAllByOrderByOrdreAscIdAsc();
        List<FonctionDto> dtos = fonctionMapper.toDtos(fonctions);
        List<ParametrageIndemnite> allParams = parametrageIndemniteRepository.findAll();

        for (FonctionDto dto : dtos) {
            if ("NOMMEE".equalsIgnoreCase(dto.getTypeNomination())) {
                List<FonctionDto.FonctionIndemniteDto> indList = new ArrayList<>();
                for (ParametrageIndemnite pi : allParams) {
                    if (pi.getFonctionObj() != null && dto.getId() != null && dto.getId().equals(pi.getFonctionObj().getId())) {
                        String tName = pi.getTypeIndemniteObj() != null ? pi.getTypeIndemniteObj().getName() : pi.getCode();
                        indList.add(new FonctionDto.FonctionIndemniteDto(tName, pi.getTaux()));
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
        existingFonction.setOrdre(fonctionDto.getOrdre());

        Fonction saved = fonctionRepository.save(existingFonction);

        saveAssociatedIndemnites(saved, fonctionDto);

        FonctionDto res = fonctionMapper.toDto(saved);
        res.setIndemnites(fonctionDto.getIndemnites());
        return res;
    }

    private void saveAssociatedIndemnites(Fonction fonction, FonctionDto fonctionDto) {
        if ("NOMMEE".equalsIgnoreCase(fonction.getTypeNomination())) {
            List<ParametrageIndemnite> existingList = parametrageIndemniteRepository.findAll();
            for (ParametrageIndemnite pi : existingList) {
                if (pi.getFonctionObj() != null && pi.getFonctionObj().getId().equals(fonction.getId())) {
                    parametrageIndemniteRepository.delete(pi);
                }
            }

            if (fonctionDto.getIndemnites() != null && !fonctionDto.getIndemnites().isEmpty()) {
                int idx = 1;
                for (FonctionDto.FonctionIndemniteDto indDto : fonctionDto.getIndemnites()) {
                    if (indDto.getTypeIndemnite() != null && !indDto.getTypeIndemnite().trim().isEmpty()) {
                        ParametrageIndemnite pi = new ParametrageIndemnite();
                        pi.setCode("IND-FCT-" + fonction.getId() + "-" + idx++);
                        pi.setFonctionObj(fonction);
                        
                        typeIndemniteRepository.findAll().stream()
                                .filter(t -> indDto.getTypeIndemnite().trim().equalsIgnoreCase(t.getName()) || indDto.getTypeIndemnite().trim().equalsIgnoreCase(t.getCode()))
                                .findFirst().ifPresent(pi::setTypeIndemniteObj);

                        pi.setTaux(indDto.getMontant() != null ? indDto.getMontant() : 0.0);
                        pi.setActif(true);

                        parametrageIndemniteRepository.save(pi);
                    }
                }
            }
            try {
                employeeProcessService.syncAllEmployees();
            } catch (Exception e) {
                System.err.println("Warn: Erreur syncAllEmployees après modification indemnités fonction: " + e.getMessage());
            }
        }
    }

    public void delete(Long id){
        fonctionRepository.deleteById(id);
    }
}
