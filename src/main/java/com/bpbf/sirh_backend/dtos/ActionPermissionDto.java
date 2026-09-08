package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActionPermissionDto {
    private Long id;
    private String moduleName;
    private String actionName;
    private String actionCode;
    private Map<String, Boolean> rolesAccess;
    private Integer ordre;
}
