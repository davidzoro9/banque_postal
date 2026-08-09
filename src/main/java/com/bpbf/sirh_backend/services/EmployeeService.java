package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.EmployeeDto;
import com.bpbf.sirh_backend.entities.*;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.repositories.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final GrilleSalarialeRepository grilleSalarialeRepository;
    private final CategorieRepository categorieRepository;
    private final EchelonRepository echelonRepository;
    private final GradeRepository gradeRepository;
    private final FonctionRepository fonctionRepository;
    private final EmploiRepository emploiRepository;
    private final DepartmentRepository departmentRepository;
    private final DirectionRepository directionRepository;
    private final ServiceRepository serviceRepository;
    private final ParametrageIndemniteService parametrageIndemniteService;
    private final ObjectMapper objectMapper;

    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cet employé n'existe pas"));
        return toDto(employee);
    }

    public EmployeeDto createEmployee(EmployeeDto dto) {
        Employee employee = new Employee();
        updateEntityFromDto(employee, dto);
        try {
            Employee saved = employeeRepository.save(employee);
            autoCreateUserAccount(saved);
            return toDto(saved);
        } catch (Exception e) {
            Long maxId = employeeRepository.findAll().stream()
                    .mapToLong(emp -> emp.getId() != null ? emp.getId() : 0)
                    .max().orElse(0L);
            employee.setId(maxId + 1);
            Employee saved = employeeRepository.save(employee);
            autoCreateUserAccount(saved);
            return toDto(saved);
        }
    }

    private void autoCreateUserAccount(Employee emp) {
        try {
            String prenom = (emp.getPrenom() != null ? emp.getPrenom() : "employe").toLowerCase()
                    .replaceAll("[^a-z0-9]", "");
            String nom = (emp.getNom() != null ? emp.getNom() : "user").toLowerCase()
                    .replaceAll("[^a-z0-9]", "");
            String email = (emp.getEmail() != null && !emp.getEmail().trim().isEmpty())
                    ? emp.getEmail().trim().toLowerCase()
                    : (prenom + "." + nom + "@gmail.com");

            if (utilisateurRepository.findByEmail(email).isPresent()) return;

            Utilisateur user = new Utilisateur();
            user.setNom(emp.getNom() != null ? emp.getNom().toUpperCase() : "EMPLOYE");
            user.setPrenom(emp.getPrenom() != null ? emp.getPrenom() : "Employé");
            user.setUsername(prenom + "." + nom);
            user.setEmail(email);
            user.setPassword("1234");
            user.setRole("EMPLOYE");
            user.setActif(true);
            utilisateurRepository.save(user);
        } catch (Exception e) {
            System.err.println("[WARN] Impossible de créer le compte utilisateur auto: " + e.getMessage());
        }
    }

    public EmployeeDto updateEmployee(Long id, EmployeeDto dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cet employé n'existe pas"));
        updateEntityFromDto(employee, dto);
        Employee saved = employeeRepository.save(employee);
        return toDto(saved);
    }

    public void delete(Long id) {
        employeeRepository.deleteById(id);
    }

    public EmployeeDto getEmployeeByMatricule(String matricule) {
        Employee employee = employeeRepository.findByMatricule(matricule)
                .orElseThrow(() -> new ResourceNotFoundException("Employé avec matricule " + matricule + " introuvable"));
        return toDto(employee);
    }

    public EmployeeDto updateEmployeeByMatricule(String matricule, EmployeeDto dto) {
        Employee employee = employeeRepository.findByMatricule(matricule)
                .orElseThrow(() -> new ResourceNotFoundException("Employé avec matricule " + matricule + " introuvable"));
        updateEntityFromDto(employee, dto);
        Employee saved = employeeRepository.save(employee);
        return toDto(saved);
    }

    public void deleteByMatricule(String matricule) {
        Employee employee = employeeRepository.findByMatricule(matricule)
                .orElseThrow(() -> new ResourceNotFoundException("Employé avec matricule " + matricule + " introuvable"));
        employeeRepository.delete(employee);
    }

    private EmployeeDto toDto(Employee entity) {
        EmployeeDto dto;
        try {
            if (entity.getExtraData() != null && !entity.getExtraData().isEmpty()) {
                dto = objectMapper.readValue(entity.getExtraData(), EmployeeDto.class);
            } else {
                dto = new EmployeeDto();
            }
        } catch (Exception e) {
            dto = new EmployeeDto();
        }
        
        dto.setId(entity.getId());
        dto.setMatricule(entity.getMatricule());
        dto.setNom(entity.getNom() != null ? entity.getNom() : entity.getName());
        dto.setPrenom(entity.getPrenom());
        dto.setEmail(entity.getEmail());
        dto.setTelephone(entity.getTelephone() != null ? entity.getTelephone() : entity.getPhone());
        
        String fullName = (dto.getNom() != null ? dto.getNom() : "") + (dto.getPrenom() != null ? " " + dto.getPrenom() : "");
        dto.setName(fullName.trim());
        dto.setPhone(dto.getTelephone());
        
        // Relational IDs and populated fields
        if (entity.getCategorieObj() != null) {
            dto.setCategorieId(entity.getCategorieObj().getId());
            dto.setCategoriePro(entity.getCategorieObj().getCode());
        }
        if (entity.getEchelonObj() != null) {
            dto.setEchelonId(entity.getEchelonObj().getId());
            dto.setEchelon(entity.getEchelonObj().getCode());
        }
        if (entity.getGradeObj() != null) {
            dto.setGradeId(entity.getGradeObj().getId());
            dto.setGrade(entity.getGradeObj().getCode());
        }
        if (entity.getGrilleSalariale() != null) {
            dto.setGrilleSalarialeId(entity.getGrilleSalariale().getId());
            if (entity.getGrilleSalariale().getSalaireBase() != null) {
                dto.setSalaireBase(entity.getGrilleSalariale().getSalaireBase());
            }
        }
        
        dto.setFonction_id(entity.getFonction() != null ? entity.getFonction().getId() : null);
        dto.setEmploi_id(entity.getEmploi() != null ? entity.getEmploi().getId() : null);
        dto.setDepartment_id(entity.getDepartment() != null ? entity.getDepartment().getId() : null);
        dto.setDirection_id(entity.getDirection() != null ? entity.getDirection().getId() : null);
        dto.setService_id(entity.getService() != null ? entity.getService().getId() : null);
        dto.setSuperviseur_id(entity.getSuperviseur() != null ? entity.getSuperviseur().getId() : null);

        // Fallback grade extraction if needed
        if ((dto.getCategoriePro() == null || dto.getCategoriePro().isEmpty()) && dto.getGrade() != null) {
            String g = dto.getGrade().trim();
            int eIdx = g.indexOf('E');
            if (eIdx > 0) {
                dto.setCategoriePro(g.substring(0, eIdx));
            }
        }

        return dto;
    }

    private void updateEntityFromDto(Employee entity, EmployeeDto dto) {
        if (dto.getMatricule() != null) entity.setMatricule(dto.getMatricule());
        if (dto.getNom() != null) entity.setNom(dto.getNom());
        if (dto.getPrenom() != null) entity.setPrenom(dto.getPrenom());
        if (dto.getEmail() != null) entity.setEmail(dto.getEmail());
        if (dto.getTelephone() != null) {
            entity.setTelephone(dto.getTelephone());
            entity.setPhone(dto.getTelephone());
        }
        
        String nom = entity.getNom() != null ? entity.getNom() : "";
        String prenom = entity.getPrenom() != null ? entity.getPrenom() : "";
        entity.setName((nom + " " + prenom).trim());

        String statutStr = dto.getStatut() != null ? dto.getStatut() : dto.getState();
        if (statutStr != null && !statutStr.trim().isEmpty()) {
            try {
                entity.setState(com.bpbf.sirh_backend.entities.EmployeeStatus.valueOf(statutStr.trim().toUpperCase()));
            } catch (Exception e) {
                entity.setState(com.bpbf.sirh_backend.entities.EmployeeStatus.ACTIF);
            }
        } else if (entity.getState() == null) {
            entity.setState(com.bpbf.sirh_backend.entities.EmployeeStatus.ACTIF);
        }

        // ManyToOne relationship resolution by ID or Code
        if (dto.getGrilleSalarialeId() != null) {
            grilleSalarialeRepository.findById(dto.getGrilleSalarialeId()).ifPresent(entity::setGrilleSalariale);
        }
        if (dto.getCategorieId() != null) {
            categorieRepository.findById(dto.getCategorieId()).ifPresent(entity::setCategorieObj);
        } else if (dto.getCategoriePro() != null && !dto.getCategoriePro().trim().isEmpty()) {
            String catCode = dto.getCategoriePro().trim();
            categorieRepository.findAll().stream()
                    .filter(c -> catCode.equalsIgnoreCase(c.getCode()) || catCode.equalsIgnoreCase(c.getLibelle()))
                    .findFirst().ifPresent(entity::setCategorieObj);
        }

        if (dto.getEchelonId() != null) {
            echelonRepository.findById(dto.getEchelonId()).ifPresent(entity::setEchelonObj);
        } else if (dto.getEchelon() != null && !dto.getEchelon().trim().isEmpty()) {
            String echCode = dto.getEchelon().trim();
            echelonRepository.findAll().stream()
                    .filter(e -> echCode.equalsIgnoreCase(e.getCode()) || echCode.equalsIgnoreCase(e.getLibelle()))
                    .findFirst().ifPresent(entity::setEchelonObj);
        }

        if (dto.getGradeId() != null) {
            gradeRepository.findById(dto.getGradeId()).ifPresent(entity::setGradeObj);
        } else if (dto.getGrade() != null && !dto.getGrade().trim().isEmpty()) {
            String gCode = dto.getGrade().trim();
            gradeRepository.findAll().stream()
                    .filter(g -> gCode.equalsIgnoreCase(g.getCode()) || gCode.equalsIgnoreCase(g.getLibelle()))
                    .findFirst().ifPresent(entity::setGradeObj);
        }

        if (entity.getGradeObj() != null || dto.getGrade() != null) {
            String targetGrade = entity.getGradeObj() != null ? entity.getGradeObj().getCode() : dto.getGrade();
            if (targetGrade != null) {
                grilleSalarialeRepository.findAll().stream()
                        .filter(gs -> targetGrade.equalsIgnoreCase(gs.getCode()) || targetGrade.equalsIgnoreCase(gs.getGrade()))
                        .findFirst().ifPresent(entity::setGrilleSalariale);
            }
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
        
        try {
            java.util.Map<String, Object> existingMap;
            if (entity.getExtraData() != null && !entity.getExtraData().isEmpty()) {
                existingMap = objectMapper.readValue(entity.getExtraData(), new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, Object>>() {});
            } else {
                existingMap = new java.util.HashMap<>();
            }
            
            java.util.Map<String, Object> newMap = objectMapper.convertValue(dto, new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, Object>>() {});
            for (java.util.Map.Entry<String, Object> entry : newMap.entrySet()) {
                if (entry.getValue() != null) {
                    existingMap.put(entry.getKey(), entry.getValue());
                }
            }

            if (dto.getEnfantsJson() != null && !dto.getEnfantsJson().trim().isEmpty()) {
                try {
                    Object parsedEnfants = objectMapper.readValue(dto.getEnfantsJson(), Object.class);
                    existingMap.put("enfants", parsedEnfants);
                } catch (Exception e) {
                    existingMap.put("enfants", dto.getEnfantsJson());
                }
            }
            if (dto.getConjointJson() != null && !dto.getConjointJson().trim().isEmpty()) {
                try {
                    Object parsedConjoint = objectMapper.readValue(dto.getConjointJson(), Object.class);
                    existingMap.put("conjoint", parsedConjoint);
                } catch (Exception e) {
                    existingMap.put("conjoint", dto.getConjointJson());
                }
            }

            String cat = dto.getCategoriePro() != null ? dto.getCategoriePro() : (String) existingMap.get("categorie");
            if (cat == null) cat = (String) existingMap.get("categoriePro");
            if (cat == null && entity.getCategorieObj() != null) cat = entity.getCategorieObj().getCode();
            if (cat == null) cat = "CL1";

            String ech = dto.getEchelon() != null ? dto.getEchelon() : (String) existingMap.get("echelon");
            if (ech == null && entity.getEchelonObj() != null) ech = entity.getEchelonObj().getCode();
            if (ech == null) ech = "E01";

            String rawGrade = dto.getGrade() != null ? dto.getGrade() : (String) existingMap.get("grade");
            if (rawGrade == null && entity.getGradeObj() != null) rawGrade = entity.getGradeObj().getCode();
            if (rawGrade == null || rawGrade.toUpperCase().contains("GRADE") || rawGrade.toUpperCase().contains("GROUPE")) {
                rawGrade = cat + ech;
            }

            existingMap.put("categorie", cat);
            existingMap.put("categoriePro", cat);
            existingMap.put("echelon", ech);
            existingMap.put("grade", rawGrade);

            if (entity.getGrilleSalariale() != null && entity.getGrilleSalariale().getSalaireBase() != null) {
                existingMap.put("salaireBase", entity.getGrilleSalariale().getSalaireBase());
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
        res.put("categoriePro", emp.getCategoriePro());
        res.put("echelon", emp.getEchelon());
        res.put("grade", emp.getGrade());
        res.put("salaireBase", emp.getSalaireBase());
        
        String fonctionStr = emp.getFonction() != null ? emp.getFonction() : "";
        List<com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto> indemnitesBareme = parametrageIndemniteService.getByGradeAndFonction(emp.getGrade(), fonctionStr);
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
}
