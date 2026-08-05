package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.EmployeeDto;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.entities.Utilisateur;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.repositories.EmployeeRepository;
import com.bpbf.sirh_backend.repositories.UtilisateurRepository;
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

    /**
     * Crée automatiquement un compte utilisateur de type EMPLOYE
     * quand un nouvel employé est enregistré.
     * Format email : prenom.nom@gmail.com (tout en minuscules)
     * Mot de passe par défaut : 1234
     */
    private void autoCreateUserAccount(Employee emp) {
        try {
            String prenom = (emp.getPrenom() != null ? emp.getPrenom() : "employe").toLowerCase()
                    .replaceAll("[^a-z0-9]", "");
            String nom = (emp.getNom() != null ? emp.getNom() : "user").toLowerCase()
                    .replaceAll("[^a-z0-9]", "");
            String email = (emp.getEmail() != null && !emp.getEmail().trim().isEmpty())
                    ? emp.getEmail().trim().toLowerCase()
                    : (prenom + "." + nom + "@gmail.com");

            // Ne pas créer si le compte existe déjà
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
            // Ne pas bloquer la création de l'employé si le compte user échoue
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
        
        // Map compatibility fields for old backend/frontend logic
        String fullName = (dto.getNom() != null ? dto.getNom() : "") + (dto.getPrenom() != null ? " " + dto.getPrenom() : "");
        dto.setName(fullName.trim());
        dto.setPhone(dto.getTelephone());
        
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

            // Sync kids and spouse arrays/objects directly into JSON keys "enfants" and "conjoint" for SQL queries
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

            // Sync category, echelon and grade into JSON keys "categorie", "echelon", "grade" for SQL queries
            String cat = dto.getCategoriePro() != null ? dto.getCategoriePro() : (String) existingMap.getOrDefault("categorie", "CL1");
            String ech = dto.getEchelon() != null ? dto.getEchelon() : (String) existingMap.getOrDefault("echelon", "E01");
            existingMap.put("categorie", cat);
            existingMap.put("echelon", ech);
            String rawGrade = dto.getGrade() != null ? dto.getGrade() : (String) existingMap.get("grade");
            if (rawGrade == null || rawGrade.toUpperCase().contains("GRADE") || rawGrade.toUpperCase().contains("GROUPE")) {
                existingMap.put("grade", cat + ech);
            } else {
                existingMap.put("grade", rawGrade);
            }

            entity.setExtraData(objectMapper.writeValueAsString(existingMap));
        } catch (Exception e) {
            // Keep existing or default to empty
        }
    }
}
