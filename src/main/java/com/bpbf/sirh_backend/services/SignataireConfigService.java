package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.etatsynthese.SignatairesEtatDto;
import com.bpbf.sirh_backend.entities.SignataireConfig;
import com.bpbf.sirh_backend.repositories.SignataireConfigRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class SignataireConfigService {

    public static final String CODE_ETAT_SYNTHESE = "ETAT_SYNTHESE_SIGNATAIRES";
    public static final String DEFAULT_TITRE_1 = "Le Comptable";
    public static final String DEFAULT_NOM_1 = "Ahadi Ismaël YONLI";
    public static final String DEFAULT_TITRE_2 = "Le Directeur Financier et Comptable";
    public static final String DEFAULT_NOM_2 = "Inoussa SANOUIDI";

    private final SignataireConfigRepository repository;

    @PostConstruct
    public void init() {
        try {
            ensureDefaultSignataires();
        } catch (Exception e) {
            log.error("Erreur lors de l'initialisation des signataires officiels", e);
        }
    }

    @Transactional
    public SignataireConfig ensureDefaultSignataires() {
        return repository.findByCode(CODE_ETAT_SYNTHESE).orElseGet(() -> {
            SignataireConfig c = SignataireConfig.builder()
                    .code(CODE_ETAT_SYNTHESE)
                    .titreSignataire1(DEFAULT_TITRE_1)
                    .nomSignataire1(DEFAULT_NOM_1)
                    .titreSignataire2(DEFAULT_TITRE_2)
                    .nomSignataire2(DEFAULT_NOM_2)
                    .actif(true)
                    .updatedAt(LocalDateTime.now())
                    .build();
            SignataireConfig saved = repository.save(c);
            log.info("Signataires officiels par défaut initialisés dans PostgreSQL : {} & {}", DEFAULT_NOM_1, DEFAULT_NOM_2);
            return saved;
        });
    }

    @Transactional(readOnly = true)
    public SignatairesEtatDto getSignataires() {
        SignataireConfig config = repository.findByCode(CODE_ETAT_SYNTHESE)
                .orElse(null);
        if (config == null) {
            return SignatairesEtatDto.builder()
                    .titreSignataire1(DEFAULT_TITRE_1)
                    .nomSignataire1(DEFAULT_NOM_1)
                    .titreSignataire2(DEFAULT_TITRE_2)
                    .nomSignataire2(DEFAULT_NOM_2)
                    .build();
        }
        return toDto(config);
    }

    @Transactional
    public SignatairesEtatDto updateSignataires(SignatairesEtatDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Les données des signataires ne peuvent être nulles.");
        }
        SignataireConfig config = repository.findByCode(CODE_ETAT_SYNTHESE)
                .orElseGet(() -> SignataireConfig.builder()
                        .code(CODE_ETAT_SYNTHESE)
                        .actif(true)
                        .build());

        String t1 = (dto.getTitreSignataire1() != null && !dto.getTitreSignataire1().isBlank())
                ? dto.getTitreSignataire1().trim() : DEFAULT_TITRE_1;
        String n1 = (dto.getNomSignataire1() != null && !dto.getNomSignataire1().isBlank())
                ? dto.getNomSignataire1().trim() : DEFAULT_NOM_1;
        String t2 = (dto.getTitreSignataire2() != null && !dto.getTitreSignataire2().isBlank())
                ? dto.getTitreSignataire2().trim() : DEFAULT_TITRE_2;
        String n2 = (dto.getNomSignataire2() != null && !dto.getNomSignataire2().isBlank())
                ? dto.getNomSignataire2().trim() : DEFAULT_NOM_2;

        config.setTitreSignataire1(t1);
        config.setNomSignataire1(n1);
        config.setTitreSignataire2(t2);
        config.setNomSignataire2(n2);
        config.setUpdatedAt(LocalDateTime.now());

        SignataireConfig saved = repository.save(config);
        log.info("Signataires officiels mis à jour avec succès : [{}] {} / [{}] {}", t1, n1, t2, n2);
        return toDto(saved);
    }

    private SignatairesEtatDto toDto(SignataireConfig entity) {
        return SignatairesEtatDto.builder()
                .titreSignataire1(entity.getTitreSignataire1())
                .nomSignataire1(entity.getNomSignataire1())
                .titreSignataire2(entity.getTitreSignataire2())
                .nomSignataire2(entity.getNomSignataire2())
                .build();
    }
}
