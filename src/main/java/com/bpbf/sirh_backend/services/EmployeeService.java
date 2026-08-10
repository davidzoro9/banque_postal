package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.EmployeeDto;
import com.bpbf.sirh_backend.entities.*;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.EmployeeMapper;
import com.bpbf.sirh_backend.repositories.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
    private final ParametrageIndemniteService parametrageIndemniteService;
    private final ObjectMapper objectMapper;

    public List<EmployeeDto> getAllEmployees(){
        List<Employee> employees = employeeRepository.findAll();
        List<EmployeeDto> dtos = employeeMapper.toDtos(employees);
        for (int i = 0; i < employees.size(); i++) {
            updateDtoFromEntity(employees.get(i), dtos.get(i));
        }
        return dtos;
    }

    public EmployeeDto getEmployeeById(Long id){
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec l'id: " + id));
        EmployeeDto dto = employeeMapper.toDto(employee);
        updateDtoFromEntity(employee, dto);
        return dto;
    }

    public EmployeeDto getEmployeeByMatricule(String matricule){
        Employee employee = employeeRepository.findByMatricule(matricule)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec le matricule: " + matricule));
        EmployeeDto dto = employeeMapper.toDto(employee);
        updateDtoFromEntity(employee, dto);
        return dto;
    }

    public EmployeeDto createEmployee(EmployeeDto employeeDto){
        Employee employee = employeeMapper.toEntity(employeeDto);
        resolveRelationships(employee, employeeDto);
        Employee saved = employeeRepository.save(employee);
        updateExtraDataFromEntity(saved, employeeDto);
        saved = employeeRepository.save(saved);
        EmployeeDto res = employeeMapper.toDto(saved);
        updateDtoFromEntity(saved, res);
        return res;
    }

    public EmployeeDto updateEmployee(Long id, EmployeeDto employeeDto){
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec l'id: " + id));

        employeeMapper.updateEntityFromDto(employeeDto, existing);
        resolveRelationships(existing, employeeDto);
        updateExtraDataFromEntity(existing, employeeDto);
        Employee saved = employeeRepository.save(existing);
        EmployeeDto res = employeeMapper.toDto(saved);
        updateDtoFromEntity(saved, res);
        return res;
    }

    public void deleteEmployee(Long id){
        if(!employeeRepository.existsById(id)){
            throw new ResourceNotFoundException("Employé non trouvé avec l'id: " + id);
        }
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

        if (entity.getCategorieObj() != null) dto.setCategorieId(entity.getCategorieObj().getId());
        if (entity.getEchelonObj() != null) dto.setEchelonId(entity.getEchelonObj().getId());
        if (entity.getGradeObj() != null) dto.setGradeId(entity.getGradeObj().getId());

        if (entity.getFonction() != null) dto.setFonction_id(entity.getFonction().getId());
        if (entity.getEmploi() != null) dto.setEmploi_id(entity.getEmploi().getId());
        if (entity.getDepartment() != null) dto.setDepartment_id(entity.getDepartment().getId());
        if (entity.getDirection() != null) dto.setDirection_id(entity.getDirection().getId());
        if (entity.getService() != null) dto.setService_id(entity.getService().getId());
        if (entity.getSuperviseur() != null) dto.setSuperviseur_id(entity.getSuperviseur().getId());
        if (entity.getGrilleSalariale() != null) dto.setGrilleSalarialeId(entity.getGrilleSalariale().getId());

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
                }
            } catch (Exception ignored) {}
        }
    }

    private void resolveRelationships(Employee entity, EmployeeDto dto) {
        if (dto.getCategorieId() != null) {
            categorieRepository.findById(dto.getCategorieId()).ifPresent(entity::setCategorieObj);
        }

        if (dto.getEchelonId() != null) {
            echelonRepository.findById(dto.getEchelonId()).ifPresent(entity::setEchelonObj);
        }

        if (dto.getGradeId() != null) {
            gradeRepository.findById(dto.getGradeId()).ifPresent(entity::setGradeObj);
        }

        if (dto.getGrilleSalarialeId() != null) {
            grilleSalarialeRepository.findById(dto.getGrilleSalarialeId()).ifPresent(entity::setGrilleSalariale);
        }

        if (dto.getFonction_id() != null) {
            fonctionRepository.findById(dto.getFonction_id()).ifPresent(entity::setFonction);
        }

        if (dto.getEmploi_id() != null) {
            emploiRepository.findById(dto.getEmploi_id()).ifPresent(entity::setEmploi);
        }
        if (dto.getDepartment_id() != null) {
            departmentRepository.findById(dto.getDepartment_id()).ifPresent(entity::setDepartment);
        }
        if (dto.getDirection_id() != null) {
            directionRepository.findById(dto.getDirection_id()).ifPresent(entity::setDirection);
        }
        if (dto.getService_id() != null) {
            serviceRepository.findById(dto.getService_id()).ifPresent(entity::setService);
        }
        if (dto.getSuperviseur_id() != null) {
            employeeRepository.findById(dto.getSuperviseur_id()).ifPresent(entity::setSuperviseur);
        }

        updateExtraDataFromEntity(entity, dto);
    }

    private void updateExtraDataFromEntity(Employee entity, EmployeeDto dto) {
        try {
            java.util.Map<String, Object> existingMap = new java.util.HashMap<>();
            if (entity.getExtraData() != null && !entity.getExtraData().trim().isEmpty()) {
                try {
                    existingMap = objectMapper.readValue(entity.getExtraData(), new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, Object>>() {});
                } catch (Exception ignored) {}
            }

            String cat = entity.getCategorieObj() != null ? entity.getCategorieObj().getCode() : (String) existingMap.getOrDefault("categorie", "CL1");
            String ech = entity.getEchelonObj() != null ? entity.getEchelonObj().getCode() : (String) existingMap.getOrDefault("echelon", "E01");
            String rawGrade = (cat != null && ech != null) ? (cat + ech) : (entity.getGradeObj() != null ? entity.getGradeObj().getCode() : "");

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
                List<com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto> indemnites = parametrageIndemniteService.getByGradeAndFonction(rawGrade, finalFonction);
                double log = 0;
                double trp = 0;
                double sujResp = 0;
                for (com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto ind : indemnites) {
                    String code = ind.getCode() != null ? ind.getCode().toLowerCase() : "";
                    double t = ind.getTaux() != null ? ind.getTaux() : 0;
                    if (code.contains("log")) log = t;
                    if (code.contains("trp")) trp = t;
                    if (code.contains("suj") || code.contains("fct") || code.contains("cmp")) {
                        sujResp += t;
                    }
                }
                if (log > 0) existingMap.put("primeLogement", log);
                if (trp > 0) existingMap.put("primeTransport", trp);
                if (sujResp > 0) existingMap.put("primeResponsabilite", sujResp);
            } catch (Exception ignored) {}

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
        
        List<com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto> indemnitesBareme = parametrageIndemniteService.getByGradeAndFonction("", "");
        res.put("indemnitesBareme", indemnitesBareme);

        double totalIndemnites = indemnitesBareme.stream().mapToDouble(i -> i.getTaux() != null ? i.getTaux() : 0.0).sum();
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

    public EmployeeDto updateEmployeeByMatricule(String matricule, EmployeeDto dto) {
        Employee existing = employeeRepository.findByMatricule(matricule)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec le matricule: " + matricule));

        employeeMapper.updateEntityFromDto(dto, existing);
        resolveRelationships(existing, dto);
        updateExtraDataFromEntity(existing, dto);
        Employee saved = employeeRepository.save(existing);
        EmployeeDto res = employeeMapper.toDto(saved);
        updateDtoFromEntity(saved, res);
        return res;
    }

    public void delete(Long id) {
        deleteEmployee(id);
    }

    public void deleteByMatricule(String matricule) {
        Employee employee = employeeRepository.findByMatricule(matricule)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec le matricule: " + matricule));
        employeeRepository.deleteById(employee.getId());
    }
}
