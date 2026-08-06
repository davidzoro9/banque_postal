package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="service")
public class Service {
    @Id
    @GeneratedValue
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String code;
    private String name;
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "department_id", nullable = true)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "direction_id", nullable = true)
    private Direction direction;
}
