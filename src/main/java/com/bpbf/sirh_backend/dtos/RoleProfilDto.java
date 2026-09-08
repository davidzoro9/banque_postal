package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoleProfilDto {
    private Long id;
    private String code;
    private String libelle;
    private String description;
    private String badgeColor;
    private Boolean actif;
    private List<String> permissions;
    private Long nbUsers;
}
