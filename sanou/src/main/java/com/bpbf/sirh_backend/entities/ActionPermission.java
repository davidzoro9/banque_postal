package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "action_permission")
public class ActionPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "module_name", nullable = false)
    private String moduleName;

    @Column(name = "action_name", nullable = false)
    private String actionName;

    @Column(name = "action_code", unique = true, nullable = false, length = 100)
    private String actionCode;

    @Column(name = "roles_access_json", columnDefinition = "TEXT")
    private String rolesAccessJson; // e.g. {"ADMIN":true,"DRH":true,...}

    private Integer ordre = 0;
}
