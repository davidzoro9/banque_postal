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
        if (entity.getFonction() != null && entity.getFonction().getName() != null) {
            dto.setFonction(entity.getFonction().getName());
        } else if (dto.getFonction() == null || dto.getFonction().isEmpty()) {
            dto.setFonction("Agent simple");
        }
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
        if (dto.getCategoriePro() != null && dto.getEchelon() != null) {
            dto.setGrade(dto.getCategoriePro().trim() + dto.getEchelon().trim());
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
        if (dto.getCategorieId() != null) {
            categorieRepository.findById(dto.getCategorieId()).ifPresent(entity::setCategorieObj);
        } else if (dto.getCategoriePro() != null && !dto.getCategoriePro().trim().isEmpty()) {
            String catCode = dto.getCategoriePro().trim();
            Categorie matchedCat = categorieRepository.findAll().stream()
                    .filter(c -> catCode.equalsIgnoreCase(c.getCode()) || catCode.equalsIgnoreCase(c.getLibelle()))
                    .findFirst().orElseGet(() -> {
                        Categorie c = new Categorie();
                        c.setCode(catCode);
                        c.setLibelle(catCode);
                        c.setActif(true);
                        return categorieRepository.save(c);
                    });
            entity.setCategorieObj(matchedCat);
        }

        if (dto.getEchelonId() != null) {
            echelonRepository.findById(dto.getEchelonId()).ifPresent(entity::setEchelonObj);
        } else if (dto.getEchelon() != null && !dto.getEchelon().trim().isEmpty()) {
            String echCode = dto.getEchelon().trim();
            Echelon matchedEch = echelonRepository.findAll().stream()
                    .filter(e -> echCode.equalsIgnoreCase(e.getCode()) || echCode.equalsIgnoreCase(e.getLibelle()))
                    .findFirst().orElseGet(() -> {
                        Echelon e = new Echelon();
                        e.setCode(echCode);
                        e.setLibelle(echCode);
                        e.setActif(true);
                        return echelonRepository.save(e);
                    });
            entity.setEchelonObj(matchedEch);
        }

        if (dto.getGradeId() != null) {
            gradeRepository.findById(dto.getGradeId()).ifPresent(entity::setGradeObj);
        } else if (dto.getGrade() != null && !dto.getGrade().trim().isEmpty()) {
            String gCode = dto.getGrade().trim();
            gradeRepository.findAll().stream()
                    .filter(g -> gCode.equalsIgnoreCase(g.getCode()) || gCode.equalsIgnoreCase(g.getLibelle()))
                    .findFirst().ifPresent(entity::setGradeObj);
        }

        String catCodeResolved = entity.getCategorieObj() != null ? entity.getCategorieObj().getCode() : dto.getCategoriePro();
        String echCodeResolved = entity.getEchelonObj() != null ? entity.getEchelonObj().getCode() : dto.getEchelon();
        String targetGrade = (catCodeResolved != null && echCodeResolved != null) ? (catCodeResolved.trim() + echCodeResolved.trim()) : dto.getGrade();

        if (targetGrade != null && !targetGrade.trim().isEmpty()) {
            String cleanGrade = targetGrade.trim().toUpperCase();
            grilleSalarialeRepository.findAll().stream()
                    .filter(gs -> cleanGrade.equalsIgnoreCase(gs.getCode()) || cleanGrade.equalsIgnoreCase(gs.getGrade())
                               || (catCodeResolved != null && echCodeResolved != null 
                                   && catCodeResolved.equalsIgnoreCase(gs.getCategory()) && echCodeResolved.equalsIgnoreCase(gs.getEchellon())))
                    .findFirst().ifPresent(entity::setGrilleSalariale);
        }

        if (dto.getFonction_id() != null) {
            fonctionRepository.findById(dto.getFonction_id()).ifPresent(entity::setFonction);
        } else if (dto.getFonction() != null && !dto.getFonction().trim().isEmpty()) {
            String fName = dto.getFonction().trim();
            if ("Agent simple".equalsIgnoreCase(fName) || fName.toLowerCase().contains("agent simple") || "Sans nomination".equalsIgnoreCase(fName)) {
                entity.setFonction(null);
            } else {
                String cleanName = fName.contains("(") ? fName.substring(0, fName.indexOf("(")).trim() : fName;
                String normName = cleanName.toUpperCase().replace("É","E").replace("È","E").replace("Ê","E");

                Fonction matchedFct = fonctionRepository.findAll().stream()
                        .filter(f -> f.getName() != null && (
                                normName.equalsIgnoreCase(f.getName().toUpperCase().replace("É","E").replace("È","E").replace("Ê","E"))
                             || normName.equalsIgnoreCase(f.getCode() != null ? f.getCode().toUpperCase() : "")
                        ))
                        .findFirst().orElse(null);

                if (matchedFct != null) {
                    entity.setFonction(matchedFct);
                } else {
                    Fonction newFct = new Fonction();
                    newFct.setCode("FCT-" + System.currentTimeMillis());
                    newFct.setName(cleanName);
                    newFct.setTypeNomination("NOMMEE");
                    newFct.setActif(true);
                    entity.setFonction(fonctionRepository.save(newFct));
                }
            }
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

            String cat = entity.getCategorieObj() != null ? entity.getCategorieObj().getCode() : (dto != null ? dto.getCategoriePro() : (String) existingMap.get("categoriePro"));
            if (cat == null) cat = "CL1";
            String ech = entity.getEchelonObj() != null ? entity.getEchelonObj().getCode() : (dto != null ? dto.getEchelon() : (String) existingMap.get("echelon"));
            if (ech == null) ech = "E01";
            String rawGrade = (cat != null && ech != null) ? (cat + ech) : (entity.getGradeObj() != null ? entity.getGradeObj().getCode() : (dto != null ? dto.getGrade() : ""));

            existingMap.put("categorie", cat);
            existingMap.put("categoriePro", cat);
            existingMap.put("echelon", ech);
            existingMap.put("grade", rawGrade);

            if (entity.getGrilleSalariale() != null && entity.getGrilleSalariale().getSalaireBase() != null) {
                existingMap.put("salaireBase", entity.getGrilleSalariale().getSalaireBase());
            } else if (dto != null && dto.getSalaireBase() != null) {
                existingMap.put("salaireBase", dto.getSalaireBase());
            }

            // Recalcul automatique des indemnités de barème selon le nouveau grade et fonction
            String finalFonction = entity.getFonction() != null ? entity.getFonction().getName() : (dto != null && dto.getFonction() != null ? dto.getFonction() : "Agent simple");
            existingMap.put("fonction", finalFonction);
            try {
                List<com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto> indemnites = parametrageIndemniteService.getByGradeAndFonction(rawGrade, finalFonction);
                double log = 0;
                double trp = 0;
                double sujResp = 0;
                for (com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto ind : indemnites) {
                    String typeInd = ind.getTypeIndemnite() != null ? ind.getTypeIndemnite().toLowerCase() : "";
                    String code = ind.getCode() != null ? ind.getCode().toLowerCase() : "";
                    double t = ind.getTaux() != null ? ind.getTaux() : 0;
                    if (typeInd.contains("logement") || code.contains("log")) log = t;
                    if (typeInd.contains("transport") || code.contains("trp")) trp = t;
                    if (typeInd.contains("sujét") || typeInd.contains("fonction") || typeInd.contains("responsabilit") || typeInd.contains("compensat") || code.contains("suj") || code.contains("fct") || code.contains("cmp")) {
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
