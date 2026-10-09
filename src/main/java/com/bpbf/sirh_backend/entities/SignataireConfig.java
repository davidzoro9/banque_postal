package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "signataire_config")
public class SignataireConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String code; // Ex: ETAT_SYNTHESE_SIGNATAIRES

    @Column(nullable = false, length = 150)
    private String titreSignataire1; // Ex: Le Comptable

    @Column(nullable = false, length = 150)
    private String nomSignataire1; // Ex: Ahadi Ismaël YONLI

    @Column(name = "employee_id_1")
    private Long employeeId1;

    @Column(nullable = false, length = 150)
    private String titreSignataire2; // Ex: Le Directeur Financier et Comptable

    @Column(nullable = false, length = 150)
    private String nomSignataire2; // Ex: Inoussa SANOUIDI

    @Column(name = "employee_id_2")
    private Long employeeId2;

    @Column(nullable = false)
    @Builder.Default
    private boolean actif = true;

    private LocalDateTime updatedAt;
}
