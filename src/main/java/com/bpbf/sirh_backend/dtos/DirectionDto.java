package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DirectionDto {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Long departmentId;
    private String departmentLibelle;

    private Long parentDirectionId;
    private String parentDirectionLibelle;

    private Long agenceId;
    private String agenceLibelle;
}
