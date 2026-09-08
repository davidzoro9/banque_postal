package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.ActionPermissionDto;
import com.bpbf.sirh_backend.entities.ActionPermission;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.repositories.ActionPermissionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActionPermissionService {

    private final ActionPermissionRepository repository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public List<ActionPermissionDto> getAll() {
        return repository.findAllByOrderByOrdreAsc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<ActionPermissionDto> saveAll(List<ActionPermissionDto> dtoList) {
        if (dtoList == null || dtoList.isEmpty()) {
            return getAll();
        }

        for (int i = 0; i < dtoList.size(); i++) {
            ActionPermissionDto dto = dtoList.get(i);
            ActionPermission entity = null;
            if (dto.getId() != null) {
                entity = repository.findById(dto.getId()).orElse(null);
            }
            if (entity == null && dto.getActionCode() != null) {
                entity = repository.findByActionCode(dto.getActionCode()).orElse(null);
            }
            if (entity == null) {
                entity = new ActionPermission();
            }

            entity.setModuleName(dto.getModuleName());
            entity.setActionName(dto.getActionName());
            entity.setActionCode(dto.getActionCode());
            entity.setOrdre(dto.getOrdre() != null ? dto.getOrdre() : i + 1);
            entity.setRolesAccessJson(serializeRolesAccess(dto.getRolesAccess()));

            repository.save(entity);
        }

        return getAll();
    }

    @Transactional
    public ActionPermissionDto create(ActionPermissionDto dto) {
        ActionPermission entity = new ActionPermission();
        entity.setModuleName(dto.getModuleName());
        entity.setActionName(dto.getActionName());
        entity.setActionCode(dto.getActionCode());
        entity.setOrdre(dto.getOrdre() != null ? dto.getOrdre() : 0);
        entity.setRolesAccessJson(serializeRolesAccess(dto.getRolesAccess()));

        return toDto(repository.save(entity));
    }

    @Transactional
    public ActionPermissionDto update(Long id, ActionPermissionDto dto) {
        ActionPermission entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission introuvable avec l'ID: " + id));

        entity.setModuleName(dto.getModuleName());
        entity.setActionName(dto.getActionName());
        entity.setActionCode(dto.getActionCode());
        if (dto.getOrdre() != null) {
            entity.setOrdre(dto.getOrdre());
        }
        if (dto.getRolesAccess() != null) {
            entity.setRolesAccessJson(serializeRolesAccess(dto.getRolesAccess()));
        }

        return toDto(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Permission introuvable avec l'ID: " + id);
        }
        repository.deleteById(id);
    }

    private ActionPermissionDto toDto(ActionPermission entity) {
        ActionPermissionDto dto = new ActionPermissionDto();
        dto.setId(entity.getId());
        dto.setModuleName(entity.getModuleName());
        dto.setActionName(entity.getActionName());
        dto.setActionCode(entity.getActionCode());
        dto.setOrdre(entity.getOrdre());
        dto.setRolesAccess(deserializeRolesAccess(entity.getRolesAccessJson()));
        return dto;
    }

    private String serializeRolesAccess(Map<String, Boolean> map) {
        if (map == null || map.isEmpty()) {
            return "{}";
        }
        try {
            return objectMapper.writeValueAsString(map);
        } catch (Exception e) {
            return "{}";
        }
    }

    private Map<String, Boolean> deserializeRolesAccess(String json) {
        if (json == null || json.trim().isEmpty()) {
            return new HashMap<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Boolean>>() {});
        } catch (Exception e) {
            return new HashMap<>();
        }
    }
}
