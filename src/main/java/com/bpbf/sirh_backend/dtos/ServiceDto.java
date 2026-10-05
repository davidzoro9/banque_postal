package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDto {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Long directionId;
    private String directionLibelle;
    private Long departmentId;
    private String departmentLibelle;

    private Long directeurId;
    private String directeurLibelle;
    private String directeurMatricule;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getDirectionId() { return directionId; }
    public void setDirectionId(Long directionId) { this.directionId = directionId; }

    public String getDirectionLibelle() { return directionLibelle; }
    public void setDirectionLibelle(String directionLibelle) { this.directionLibelle = directionLibelle; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentLibelle() { return departmentLibelle; }
    public void setDepartmentLibelle(String departmentLibelle) { this.departmentLibelle = departmentLibelle; }

    public Long getDirecteurId() { return directeurId; }
    public void setDirecteurId(Long directeurId) { this.directeurId = directeurId; }

    public String getDirecteurLibelle() { return directeurLibelle; }
    public void setDirecteurLibelle(String directeurLibelle) { this.directeurLibelle = directeurLibelle; }

    public String getDirecteurMatricule() { return directeurMatricule; }
    public void setDirecteurMatricule(String directeurMatricule) { this.directeurMatricule = directeurMatricule; }
}
