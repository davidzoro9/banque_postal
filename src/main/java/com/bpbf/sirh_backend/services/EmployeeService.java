package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.EmployeeDto;
import com.bpbf.sirh_backend.entities.*;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.EmployeeMapper;
import com.bpbf.sirh_backend.repositories.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;
    private final CategorieRepository categorieRepository;
    private final EchelonRepository echelonRepository;
    private final GradeRepository gradeRepository;
    private final GrilleSalarialeRepository grilleSalarialeRepository;
    private final FonctionRepository fonctionRepository;
    private final EmploiRepository emploiRepository;
    private final DepartmentRepository departmentRepository;
    private final DirectionRepository directionRepository;
    private final ServiceRepository serviceRepository;
    private final AgenceRepository agenceRepository;
    private final ParametrageIndemniteService parametrageIndemniteService;
    private final ObjectMapper objectMapper;
    private final RegimeSecuriteSocialRepository regimeSecuriteSocialRepository;
    private final EmployeeProcessService employeeProcessService;

    public List<EmployeeDto> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        List<EmployeeDto> dtos = employeeMapper.toDtos(employees);
        for (int i = 0; i < employees.size(); i++) {
            updateDtoFromEntity(employees.get(i), dtos.get(i));
        }
        return dtos;
    }

    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec l'id: " + id));
        EmployeeDto dto = employeeMapper.toDto(employee);
        updateDtoFromEntity(employee, dto);
        return dto;
    }

    public EmployeeDto getEmployeeByMatricule(String matricule) {
        Employee employee = employeeRepository.findByMatricule(matricule)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec le matricule: " + matricule));
        EmployeeDto dto = employeeMapper.toDto(employee);
        updateDtoFromEntity(employee, dto);
        return dto;
    }

    @Transactional
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        Employee employee = employeeMapper.toEntity(employeeDto);
        resolveRelationships(employee, employeeDto);
        Employee saved = employeeRepository.save(employee);
        updateExtraDataFromEntity(saved, employeeDto);
        saved = employeeRepository.save(saved);
        employeeProcessService.sync(saved, employeeDto);
        EmployeeDto res = employeeMapper.toDto(saved);
        updateDtoFromEntity(saved, res);
        return res;
    }

    @Transactional
    public EmployeeDto updateEmployee(Long id, EmployeeDto employeeDto) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec l'id: " + id));

        employeeMapper.updateEntityFromDto(employeeDto, existing);
        resolveRelationships(existing, employeeDto);
        updateExtraDataFromEntity(existing, employeeDto);
        Employee saved = employeeRepository.save(existing);
        employeeProcessService.sync(saved, employeeDto);
        EmployeeDto res = employeeMapper.toDto(saved);
        updateDtoFromEntity(saved, res);
        return res;
    }

    @Transactional
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employé non trouvé avec l'id: " + id);
        }
        employeeProcessService.deleteForEmployee(id);
        employeeRepository.deleteById(id);
    }

    private void updateDtoFromEntity(Employee entity, EmployeeDto dto) {
        if (entity == null || dto == null) return;
        if (dto.getName() == null || dto.getName().isEmpty()) {
            dto.setName((dto.getPrenom() != null ? dto.getPrenom() : "") + " " + (dto.getNom() != null ? dto.getNom() : ""));
        }
        if (entity.getGrilleSalariale() != null && entity.getGrilleSalariale().getSalaireBase() != null) {
            dto.setSalaireBase(entity.getGrilleSalariale().getSalaireBase());
        }
        dto.setDateEmbauche(entity.getDateEmbauche());
        dto.setStatut(entity.getStatut());

        if (entity.getCategorieObj() != null) dto.setCategorieId(entity.getCategorieObj().getId());
        if (entity.getEchelonObj() != null) dto.setEchelonId(entity.getEchelonObj().getId());
        if (entity.getGradeObj() != null) dto.setGradeId(entity.getGradeObj().getId());

        if (entity.getFonction() != null) dto.setFonction_id(entity.getFonction().getId());
        if (entity.getEmploi() != null) dto.setEmploi_id(entity.getEmploi().getId());
        if (entity.getDepartment() != null) dto.setDepartment_id(entity.getDepartment().getId());
        if (entity.getDirection() != null) dto.setDirection_id(entity.getDirection().getId());
        if (entity.getService() != null) dto.setService_id(entity.getService().getId());
        if (entity.getAgence() != null) dto.setAgence_id(entity.getAgence().getId());
        if (entity.getSuperviseur() != null) dto.setSuperviseur_id(entity.getSuperviseur().getId());
        if (entity.getGrilleSalariale() != null) dto.setGrilleSalarialeId(entity.getGrilleSalariale().getId());

        if (entity.getFonction() != null) {
            dto.setFonction_id(entity.getFonction().getId());
            dto.setFonctionLibelle(entity.getFonction().getName());
        }

        if (entity.getEmploi() != null) {
            dto.setEmploi_id(entity.getEmploi().getId());
            dto.setEmploiLibelle(entity.getEmploi().getName());
        }

        if (entity.getDepartment() != null) {
            dto.setDepartment_id(entity.getDepartment().getId());
            dto.setDepartmentLibelle(entity.getDepartment().getName());
        }

        if (entity.getDirection() != null) {
            dto.setDirection_id(entity.getDirection().getId());
            dto.setDirectionLibelle(entity.getDirection().getName());
        }

        if (entity.getService() != null) {
            dto.setService_id(entity.getService().getId());
            dto.setServiceLibelle(entity.getService().getName());
        }

        if (entity.getAgence() != null) {
            dto.setAgence_id(entity.getAgence().getId());
            dto.setAgenceLibelle(entity.getAgence().getNomAgence());
        }

        if (entity.getCategorieObj() != null) {
            dto.setCategorieId(entity.getCategorieObj().getId());
            dto.setCategorieLibelle(
                entity.getCategorieObj().getLibelle()
            );
        }

        if (entity.getEchelonObj() != null) {
            dto.setEchelonId(entity.getEchelonObj().getId());
            dto.setEchelonLibelle(
                entity.getEchelonObj().getLibelle()
            );
        }
        
        if (entity.getGradeObj() != null) {
            dto.setGradeId(entity.getGradeObj().getId());
            dto.setGradeLibelle(
                entity.getGradeObj().getLibelle()
            );
        }

        if (entity.getRegimeSecuriteSocial() != null) {
            RegimeSecuriteSocial regime = entity.getRegimeSecuriteSocial();

            dto.setRegimeSecuriteSocialId(regime.getId());
            dto.setRegimeSecuriteSocialCode(regime.getCode());
            dto.setRegimeSecuriteSocialLibelle(
                regime.getLibelle()
            );
        }

               if (entity.getExtraData() != null && !entity.getExtraData().trim().isEmpty()) {
            try {
                java.util.Map<String, Object> map = objectMapper.readValue(entity.getExtraData(), new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, Object>>() {});
                if (map.containsKey("primeLogement") && map.get("primeLogement") != null) {
                    dto.setPrimeLogement(Double.valueOf(map.get("primeLogement").toString()));
                }
                if (map.containsKey("primeTransport") && map.get("primeTransport") != null) {
                    dto.setPrimeTransport(Double.valueOf(map.get("primeTransport").toString()));
                }
                if (map.containsKey("primeResponsabilite") && map.get("primeResponsabilite") != null) {
                    dto.setPrimeResponsabilite(Double.valueOf(map.get("primeResponsabilite").toString()));
                } // 🛡️ Accolade bien fermée ici

                if (map.containsKey("conjoint")) {
                    dto.setConjoint(map.get("conjoint"));
                }
                if (map.containsKey("enfants")) {
                    dto.setEnfants(map.get("enfants"));
                }
            } catch (Exception ignored) {}
        }
    }
    private void resolveRelationships(Employee entity, EmployeeDto dto) {

        if (dto.getCategorieId() == null) {
            entity.setCategorieObj(null);
        } else {
            Categorie categorie = categorieRepository
                    .findById(dto.getCategorieId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Catégorie introuvable avec l'ID : "
                                    + dto.getCategorieId()));

            entity.setCategorieObj(categorie);
        }

        if (dto.getEchelonId() == null) {
            entity.setEchelonObj(null);
        } else {
            Echelon echelon = echelonRepository
                    .findById(dto.getEchelonId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Échelon introuvable avec l'ID : "
                                    + dto.getEchelonId()));

            entity.setEchelonObj(echelon);
        }

        if (dto.getGradeId() == null) {
            entity.setGradeObj(null);
        } else {
            Grade grade = gradeRepository
                    .findById(dto.getGradeId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Grade introuvable avec l'ID : "
                                    + dto.getGradeId()));

            entity.setGradeObj(grade);
        }

        if (dto.getGrilleSalarialeId() == null) {
            entity.setGrilleSalariale(null);
        } else {
            GrilleSalariale grille = grilleSalarialeRepository
                    .findById(dto.getGrilleSalarialeId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Grille salariale introuvable avec l'ID : "
                                    + dto.getGrilleSalarialeId()));

            entity.setGrilleSalariale(grille);
        }

        if (dto.getFonction_id() == null) {
            entity.setFonction(null);
        } else {
            Fonction fonction = fonctionRepository
                    .findById(dto.getFonction_id())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Fonction introuvable avec l'ID : "
                                    + dto.getFonction_id()));

            entity.setFonction(fonction);
        }

        if (dto.getEmploi_id() == null) {
            entity.setEmploi(null);
        } else {
            Emploi emploi = emploiRepository
                    .findById(dto.getEmploi_id())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Emploi introuvable avec l'ID : "
                                    + dto.getEmploi_id()));

            entity.setEmploi(emploi);
        }

        if (dto.getDepartment_id() == null) {
            entity.setDepartment(null);
        } else {
            Department department = departmentRepository
                    .findById(dto.getDepartment_id())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Département introuvable avec l'ID : "
                                    + dto.getDepartment_id()));

            entity.setDepartment(department);
        }

        if (dto.getDirection_id() == null) {
            entity.setDirection(null);
        } else {
            Direction direction = directionRepository
                    .findById(dto.getDirection_id())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Direction introuvable avec l'ID : "
                                    + dto.getDirection_id()));

            entity.setDirection(direction);
        }

        if (dto.getService_id() == null) {
            entity.setService(null);
        } else {
            com.bpbf.sirh_backend.entities.Service service = serviceRepository
                    .findById(dto.getService_id())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Service introuvable avec l'ID : "
                                    + dto.getService_id()));

            entity.setService(service);
        }

        if (dto.getAgence_id() == null) {
            entity.setAgence(null);
        } else {
            Agence agence = agenceRepository
                    .findById(dto.getAgence_id())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Agence introuvable avec l'ID : " + dto.getAgence_id()));
            entity.setAgence(agence);
        }

        if (dto.getSuperviseur_id() != null) {
            employeeRepository.findById(dto.getSuperviseur_id()).ifPresent(entity::setSuperviseur);
        }

        if (dto.getRegimeSecuriteSocialId() == null) {
            entity.setRegimeSecuriteSocial(null);
        } else {
            RegimeSecuriteSocial regime = regimeSecuriteSocialRepository
                    .findById(dto.getRegimeSecuriteSocialId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Régime de Sécurité sociale introuvable "
                                    + "avec l'ID : "
                                    + dto.getRegimeSecuriteSocialId()));

            entity.setRegimeSecuriteSocial(regime);
        }

        updateExtraDataFromEntity(entity, dto);
    }

    private void updateExtraDataFromEntity(Employee entity, EmployeeDto dto) {
        try {
            java.util.Map<String, Object> existingMap = new java.util.HashMap<>();
            if (entity.getExtraData() != null && !entity.getExtraData().trim().isEmpty()) {
                try {
                    existingMap = objectMapper.readValue(entity.getExtraData(),
                            new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, Object>>() {
                            });
                } catch (Exception ignored) {
                }
            }

            String cat = entity.getCategorieObj() != null
                    ? (entity.getCategorieObj().getLibelle() != null
                            ? entity.getCategorieObj().getLibelle()
                            : entity.getCategorieObj().getCode())
                    : (String) existingMap.getOrDefault("categorie", "CL1");
            String ech = entity.getEchelonObj() != null
                    ? (entity.getEchelonObj().getLibelle() != null
                            ? entity.getEchelonObj().getLibelle()
                            : entity.getEchelonObj().getCode())
                    : (String) existingMap.getOrDefault("echelon", "E01");
            String rawGrade = (cat != null && ech != null) ? (cat + ech)
                    : (entity.getGradeObj() != null ? entity.getGradeObj().getCode() : "");

            existingMap.put("categorie", cat);
            existingMap.put("categoriePro", cat);
            existingMap.put("echelon", ech);
            existingMap.put("grade", rawGrade);

            if (entity.getGrilleSalariale() != null && entity.getGrilleSalariale().getSalaireBase() != null) {
                existingMap.put("salaireBase", entity.getGrilleSalariale().getSalaireBase());
            } else if (dto != null && dto.getSalaireBase() != null) {
                existingMap.put("salaireBase", dto.getSalaireBase());
            }

            String finalFonction = entity.getFonction() != null ? entity.getFonction().getName() : "Agent simple";
            existingMap.put("fonction", finalFonction);
            try {
                List<com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto> indemnites = parametrageIndemniteService
                        .getByGradeAndFonction(rawGrade, finalFonction);
                double log = 0;
                double trp = 0;
                double sujResp = 0;
                for (com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto ind : indemnites) {
                    String code = ind.getCode() != null ? ind.getCode().toLowerCase() : "";
                    double t = ind.getTaux() != null ? ind.getTaux() : 0;
                    if (code.contains("log"))
                        log = t;
                    if (code.contains("trp"))
                        trp = t;
                    if (code.contains("suj") || code.contains("fct") || code.contains("cmp")) {
                        sujResp += t;
                    }
                }
                if (log > 0)
                    existingMap.put("primeLogement", log);
                if (trp > 0)
                    existingMap.put("primeTransport", trp);
                if (sujResp > 0)
                    existingMap.put("primeResponsabilite", sujResp);
            } catch (Exception ignored) {
            }
            if (dto != null && dto.getConjoint() != null) {
                existingMap.put("conjoint", dto.getConjoint());
            }
            if (dto != null && dto.getEnfants() != null) {
                existingMap.put("enfants", dto.getEnfants());
            }

            entity.setExtraData(objectMapper.writeValueAsString(existingMap));
        } catch (Exception e) {
            // Keep existing or default to empty
        }
    }

    public java.util.Map<String, Object> getSituationSalarialeByMatricule(String idOrMatricule) {
        EmployeeDto emp = null;
        try {
            Long numericId = Long.parseLong(idOrMatricule);
            emp = getEmployeeById(numericId);
        } catch (NumberFormatException e) {
            emp = getEmployeeByMatricule(idOrMatricule);
        }

        java.util.Map<String, Object> res = new java.util.LinkedHashMap<>();
        res.put("matricule", emp.getMatricule());
        res.put("nomComplet", emp.getName() != null ? emp.getName() : (emp.getPrenom() + " " + emp.getNom()));
        res.put("salaireBase", emp.getSalaireBase());

        List<com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto> indemnitesBareme = parametrageIndemniteService
                .getByGradeAndFonction("", "");
        res.put("indemnitesBareme", indemnitesBareme);

        double totalIndemnites = indemnitesBareme.stream().mapToDouble(i -> i.getTaux() != null ? i.getTaux() : 0.0)
                .sum();
        if (totalIndemnites == 0) {
            double log = emp.getPrimeLogement() != null ? emp.getPrimeLogement() : 0;
            double trp = emp.getPrimeTransport() != null ? emp.getPrimeTransport() : 0;
            double resp = emp.getPrimeResponsabilite() != null ? emp.getPrimeResponsabilite() : 0;
            totalIndemnites = log + trp + resp;
        }
        res.put("totalIndemnites", totalIndemnites);
        res.put("salaireBrutTotal", (emp.getSalaireBase() != null ? emp.getSalaireBase() : 0.0) + totalIndemnites);

        return res;
    }

    @Transactional
    public EmployeeDto updateEmployeeByMatricule(String matricule, EmployeeDto dto) {
        Employee existing = employeeRepository.findByMatricule(matricule)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec le matricule: " + matricule));

        employeeMapper.updateEntityFromDto(dto, existing);
        resolveRelationships(existing, dto);
        updateExtraDataFromEntity(existing, dto);
        Employee saved = employeeRepository.save(existing);
        employeeProcessService.sync(saved, dto);
        EmployeeDto res = employeeMapper.toDto(saved);
        updateDtoFromEntity(saved, res);
        return res;
    }

    public void delete(Long id) {
        deleteEmployee(id);
    }

    @Transactional
    public void deleteByMatricule(String matricule) {
        Employee employee = employeeRepository.findByMatricule(matricule)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec le matricule: " + matricule));
        employeeProcessService.deleteForEmployee(employee.getId());
        employeeRepository.deleteById(employee.getId());
    }
}
