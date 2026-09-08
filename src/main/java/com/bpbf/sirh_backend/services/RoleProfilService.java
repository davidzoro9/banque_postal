package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.RoleProfilDto;
import com.bpbf.sirh_backend.entities.RoleProfil;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.repositories.RoleProfilRepository;
import com.bpbf.sirh_backend.repositories.UtilisateurRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoleProfilService {

    private final RoleProfilRepository roleProfilRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public List<RoleProfilDto> getAll() {
        return roleProfilRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoleProfilDto getById(Long id) {
        RoleProfil entity = roleProfilRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rôle introuvable avec l'ID: " + id));
        return toDto(entity);
    }

    @Transactional
    public RoleProfilDto create(RoleProfilDto dto) {
        RoleProfil entity = new RoleProfil();
        entity.setCode(dto.getCode() != null ? dto.getCode().toUpperCase().trim() : null);
        entity.setLibelle(dto.getLibelle());
        entity.setDescription(dto.getDescription());
        entity.setBadgeColor(dto.getBadgeColor() != null ? dto.getBadgeColor() : "#0060B3");
        entity.setActif(dto.getActif() != null ? dto.getActif() : true);
        entity.setPermissions(serializePermissions(dto.getPermissions()));

        return toDto(roleProfilRepository.save(entity));
    }

    @Transactional
    public RoleProfilDto update(Long id, RoleProfilDto dto) {
        RoleProfil entity = roleProfilRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rôle introuvable avec l'ID: " + id));

        entity.setCode(dto.getCode() != null ? dto.getCode().toUpperCase().trim() : entity.getCode());
        entity.setLibelle(dto.getLibelle());
        entity.setDescription(dto.getDescription());
        if (dto.getBadgeColor() != null) {
            entity.setBadgeColor(dto.getBadgeColor());
        }
        if (dto.getActif() != null) {
            entity.setActif(dto.getActif());
        }
        if (dto.getPermissions() != null) {
            entity.setPermissions(serializePermissions(dto.getPermissions()));
        }

        return toDto(roleProfilRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!roleProfilRepository.existsById(id)) {
            throw new ResourceNotFoundException("Rôle introuvable avec l'ID: " + id);
        }
        roleProfilRepository.deleteById(id);
    }

    private RoleProfilDto toDto(RoleProfil entity) {
        RoleProfilDto dto = new RoleProfilDto();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setLibelle(entity.getLibelle());
        dto.setDescription(entity.getDescription());
        dto.setBadgeColor(entity.getBadgeColor());
        dto.setActif(entity.getActif());
        dto.setPermissions(deserializePermissions(entity.getPermissions()));

        long userCount = 0;
        try {
            if (entity.getCode() != null) {
                userCount = utilisateurRepository.countByRole(entity.getCode());
            }
        } catch (Exception e) {
            log.debug("Erreur comptage utilisateurs pour le rôle {}: {}", entity.getCode(), e.getMessage());
        }
        dto.setNbUsers(userCount);

        return dto;
    }

    private String serializePermissions(List<String> perms) {
        if (perms == null || perms.isEmpty()) {
            return "[]";
        }
        try {
            return objectMapper.writeValueAsString(perms);
        } catch (Exception e) {
            return String.join(",", perms);
        }
    }

    private List<String> deserializePermissions(String json) {
        if (json == null || json.trim().isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            String[] split = json.split(",");
            List<String> list = new ArrayList<>();
            for (String s : split) {
                if (!s.trim().isEmpty()) {
                    list.add(s.trim());
                }
            }
            return list;
        }
    }
}
