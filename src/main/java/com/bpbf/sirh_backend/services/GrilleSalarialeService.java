package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.GrilleSalarialeDto;
import com.bpbf.sirh_backend.entities.Categorie;
import com.bpbf.sirh_backend.entities.Echelon;
import com.bpbf.sirh_backend.entities.Grade;
import com.bpbf.sirh_backend.entities.GrilleSalariale;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.GrilleSalarialeMapper;
import com.bpbf.sirh_backend.repositories.CategorieRepository;
import com.bpbf.sirh_backend.repositories.EchelonRepository;
import com.bpbf.sirh_backend.repositories.GradeRepository;
import com.bpbf.sirh_backend.repositories.GrilleSalarialeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GrilleSalarialeService {
    private final GrilleSalarialeMapper grilleSalarialeMapper;
    private final GrilleSalarialeRepository grilleSalarialeRepository;
    private final CategorieRepository categorieRepository;
    private final EchelonRepository echelonRepository;
    private final GradeRepository gradeRepository;

    public List<GrilleSalarialeDto> getAllGrilleSalariale(){
        List<GrilleSalariale> grilleSalariales = grilleSalarialeRepository.findAll();
        return grilleSalarialeMapper.toDtos(grilleSalariales);
    }

    public List<GrilleSalarialeDto> getGrillesByGrade(Long gradeId){
        List<GrilleSalariale> grilles = grilleSalarialeRepository.findByGradeObjId(gradeId);
        return grilleSalarialeMapper.toDtos(grilles);
    }

    public GrilleSalarialeDto findGrille(Long gradeId, Long categorieId, Long echelonId, String grade, String category, String echellon) {
        List<GrilleSalariale> all = grilleSalarialeRepository.findAll();

        String catFromGrade = category;
        String echFromGrade = echellon;
        if (grade != null && grade.trim().toUpperCase().matches("^(C[1-7]|CL[1-8])E\\d{2}$")) {
            String cleanGrade = grade.trim().toUpperCase();
            int eIdx = cleanGrade.indexOf('E');
            catFromGrade = cleanGrade.substring(0, eIdx);
            echFromGrade = cleanGrade.substring(eIdx);
        }

        final String targetCat = catFromGrade;
        final String targetEch = echFromGrade;

        return all.stream()
                .filter(g -> (gradeId == null || (g.getGradeObj() != null && gradeId.equals(g.getGradeObj().getId())))
                          && (grade == null || grade.trim().isEmpty() 
                              || grade.equalsIgnoreCase(g.getClasse()) 
                              || grade.equalsIgnoreCase(g.getGrade())
                              || (g.getGradeObj() != null && grade.equalsIgnoreCase(g.getGradeObj().getCode())))
                          && (categorieId == null || (g.getCategorieObj() != null && categorieId.equals(g.getCategorieObj().getId())))
                          && (targetCat == null || targetCat.trim().isEmpty() || matchCat(targetCat, g.getCategory(), g.getCategory()))
                          && (echelonId == null || (g.getEchelonObj() != null && echelonId.equals(g.getEchelonObj().getId())))
                          && (targetEch == null || targetEch.trim().isEmpty() 
                              || targetEch.equalsIgnoreCase(g.getEchellon())
                              || ("E" + String.format("%02d", parseEchelonNum(targetEch))).equalsIgnoreCase(g.getEchellon())
                              || targetEch.equalsIgnoreCase("E" + String.format("%02d", parseEchelonNum(g.getEchellon())))))
                .findFirst()
                .map(grilleSalarialeMapper::toDto)
                .orElse(null);
    }

    public GrilleSalarialeDto createGrilleSalariale(GrilleSalarialeDto grilleSalarialeDto){
        GrilleSalariale grilleSalariale = grilleSalarialeMapper.toEntity(grilleSalarialeDto);
        resolveRelationships(grilleSalariale, grilleSalarialeDto);
        GrilleSalariale saved = grilleSalarialeRepository.save(grilleSalariale);
        return grilleSalarialeMapper.toDto(saved);
    }

    public GrilleSalarialeDto updateGrilleSalariale(Long id, GrilleSalarialeDto grilleSalarialeDto){
        GrilleSalariale grilleSalariale = grilleSalarialeRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Cette grille n'existe pas"));

        grilleSalariale.setBasicSalary(grilleSalarialeDto.getBasicSalary());

        resolveRelationships(grilleSalariale, grilleSalarialeDto);

        GrilleSalariale saved = grilleSalarialeRepository.save(grilleSalariale);
        return grilleSalarialeMapper.toDto(saved);
    }

    public void delete(Long id){
        grilleSalarialeRepository.deleteById(id);
    }

    private void resolveRelationships(GrilleSalariale entity, GrilleSalarialeDto dto) {
        if (dto.getCategorieId() != null) {
            entity.setCategorieObj(categorieRepository.findById(dto.getCategorieId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cette catégorie n'existe pas")));
        } else {
            entity.setCategorieObj(null);
        }

        if (dto.getEchelonId() != null) {
            entity.setEchelonObj(echelonRepository.findById(dto.getEchelonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cet échelon n'existe pas")));
        } else {
            entity.setEchelonObj(null);
        }

        if (dto.getGradeId() != null) {
            entity.setGradeObj(gradeRepository.findById(dto.getGradeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ce grade n'existe pas")));
        } else {
            entity.setGradeObj(null);
        }
    }

    private int parseEchelonNum(String s) {
        try {
            return Integer.parseInt(s.replaceAll("\\D+", ""));
        } catch (Exception e) {
            return -1;
        }
    }

    private boolean matchCat(String catCode, String cCode, String cLibelle) {
        if (catCode == null || cCode == null) return false;
        if (catCode.equalsIgnoreCase(cCode) || catCode.equalsIgnoreCase(cLibelle)) return true;
        if (catCode.toUpperCase().startsWith("C") && !catCode.toUpperCase().startsWith("CL")) {
            String num = catCode.replaceAll("\\D+", "");
            if (!num.isEmpty() && num.equalsIgnoreCase(cCode)) return true;
        }
        if (catCode.toUpperCase().startsWith("CL")) {
            String numStr = catCode.replaceAll("\\D+", "");
            if (!numStr.isEmpty()) {
                try {
                    int num = Integer.parseInt(numStr);
                    String[] roman = {"", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"};
                    if (num >= 1 && num < roman.length && roman[num].equalsIgnoreCase(cCode)) return true;
                } catch (Exception ignored) {}
            }
        }
        return false;
    }
}

