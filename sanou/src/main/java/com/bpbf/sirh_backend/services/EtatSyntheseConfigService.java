package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.etatsynthese.EtatSyntheseConfigDto;
import com.bpbf.sirh_backend.entities.EtatSyntheseConfig;
import com.bpbf.sirh_backend.repositories.EtatSyntheseConfigRepository;
import jakarta.annotation.PostConstruct;
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
public class EtatSyntheseConfigService {

    private final EtatSyntheseConfigRepository repository;

    @PostConstruct
    public void init() {
        try {
            initDefaultConfigs();
        } catch (Exception e) {
            log.error("Erreur lors de l'initialisation des états de synthèse par défaut", e);
        }
    }

    @Transactional(readOnly = true)
    public List<EtatSyntheseConfigDto> getAllConfigs(boolean onlyActive) {
        List<EtatSyntheseConfig> entities = onlyActive 
                ? repository.findByActifTrueOrderByOrdreAsc()
                : repository.findAllByOrderByOrdreAsc();

        if (entities.isEmpty()) {
            initDefaultConfigs();
            entities = onlyActive 
                    ? repository.findByActifTrueOrderByOrdreAsc()
                    : repository.findAllByOrderByOrdreAsc();
        }

        return entities.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EtatSyntheseConfigDto getConfigById(Long id) {
        EtatSyntheseConfig config = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Configuration d'état introuvable avec ID : " + id));
        return toDto(config);
    }

    @Transactional
    public EtatSyntheseConfigDto createConfig(EtatSyntheseConfigDto dto) {
        String cleanCode = (dto.getCode() != null ? dto.getCode().trim().toUpperCase() : "ETAT_PERSO_" + System.currentTimeMillis())
                .replaceAll("[^A-Z0-9_]", "_");

        if (repository.existsByCode(cleanCode)) {
            cleanCode = cleanCode + "_" + System.currentTimeMillis();
        }

        Integer nextOrdre = dto.getOrdre();
        if (nextOrdre == null) {
            List<EtatSyntheseConfig> all = repository.findAll();
            nextOrdre = all.stream().mapToInt(c -> c.getOrdre() != null ? c.getOrdre() : 0).max().orElse(0) + 1;
        }

        EtatSyntheseConfig entity = new EtatSyntheseConfig();
        entity.setCode(cleanCode);
        entity.setLibelle(dto.getLibelle() != null ? dto.getLibelle().trim() : "Nouvel état personnalisé");
        entity.setCategorie(dto.getCategorie() != null ? dto.getCategorie().trim() : "Personnalisé");
        entity.setDescription(dto.getDescription());
        entity.setIcon(dto.getIcon() != null && !dto.getIcon().isBlank() ? dto.getIcon() : "assessment");
        entity.setOrdre(nextOrdre);
        entity.setActif(dto.isActif());
        entity.setSystem(false); // États créés par l'utilisateur ne sont jamais système
        entity.setFiltreType(dto.getFiltreType() != null ? dto.getFiltreType() : "ALL");
        entity.setTypeElementCode(dto.getTypeElementCode());
        entity.setColonnesJson(dto.getColonnesJson());

        EtatSyntheseConfig saved = repository.save(entity);
        log.info("Nouvel état de synthèse créé : code={}, libelle={}", saved.getCode(), saved.getLibelle());
        return toDto(saved);
    }

    @Transactional
    public EtatSyntheseConfigDto updateConfig(Long id, EtatSyntheseConfigDto dto) {
        EtatSyntheseConfig entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Configuration d'état introuvable avec ID : " + id));

        if (dto.getLibelle() != null && !dto.getLibelle().isBlank()) {
            entity.setLibelle(dto.getLibelle().trim());
        }
        if (dto.getCategorie() != null) {
            entity.setCategorie(dto.getCategorie().trim());
        }
        if (dto.getDescription() != null) {
            entity.setDescription(dto.getDescription().trim());
        }
        if (dto.getIcon() != null && !dto.getIcon().isBlank()) {
            entity.setIcon(dto.getIcon().trim());
        }
        if (dto.getOrdre() != null) {
            entity.setOrdre(dto.getOrdre());
        }
        entity.setActif(dto.isActif());
        if (dto.getFiltreType() != null) {
            entity.setFiltreType(dto.getFiltreType());
        }
        if (dto.getTypeElementCode() != null) {
            entity.setTypeElementCode(dto.getTypeElementCode());
        }
        if (dto.getColonnesJson() != null) {
            entity.setColonnesJson(dto.getColonnesJson());
        }

        EtatSyntheseConfig updated = repository.save(entity);
        log.info("État de synthèse mis à jour : id={}, code={}", updated.getId(), updated.getCode());
        return toDto(updated);
    }

    @Transactional
    public EtatSyntheseConfigDto toggleActive(Long id) {
        EtatSyntheseConfig entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Configuration d'état introuvable avec ID : " + id));
        entity.setActif(!entity.isActif());
        EtatSyntheseConfig updated = repository.save(entity);
        return toDto(updated);
    }

    @Transactional
    public void deleteConfig(Long id) {
        EtatSyntheseConfig entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Configuration d'état introuvable avec ID : " + id));

        if (entity.isSystem()) {
            throw new IllegalStateException("L'état '" + entity.getLibelle() + "' est un état système réglementaire et ne peut pas être supprimé. Vous pouvez le désactiver.");
        }

        repository.delete(entity);
        log.info("État de synthèse supprimé : id={}, code={}", id, entity.getCode());
    }

    @Transactional
    public void initDefaultConfigs() {
        if (repository.count() > 0) {
            return;
        }

        log.info("Initialisation des 12 états de synthèse officiels dans PostgreSQL...");

        List<EtatSyntheseConfig> defaults = new ArrayList<>();

        defaults.add(createEntity("LIVRE_PAIE", "Livre de Paie", "Paie Globale", 
                "Vue matricielle complète des salaires de base, indemnités, cotisations, IUTS, FSP et net à payer.", "menu_book", 1, true, true));

        defaults.add(createEntity("ETAT_NOMINATIF", "État nominatif de paie", "Salaires", 
                "Détail individuel nominatif par collaborateur avec matricule, emploi et rémunération brute/nette.", "badge", 2, true, true));

        defaults.add(createEntity("ETAT_SALAIRE", "État salaire par direction", "Analytique", 
                "Consolidation de la masse salariale et ventilation par Direction et Service.", "payments", 3, true, true));

        defaults.add(createEntity("ETAT_BANQUE", "État par banque (Virements)", "Bancaire", 
                "Ordres et récapitulatif des virements bancaires par établissement financier et IBAN.", "account_balance", 4, true, true));

        defaults.add(createEntity("ETAT_CNSS", "État Cotisation CNSS", "Charges Sociales", 
                "Déclaration sociale CNSS : base plafonnée à 800 000 FCFA, part salariale (5.5%), part patronale (16%).", "security", 5, true, true));

        defaults.add(createEntity("ETAT_IUTS", "État IUTS", "Fiscalité", 
                "Impôt Unique sur les Traitements et Salaires : assiette fiscale, abattements, charges et impôt retenu.", "receipt_long", 6, true, true));

        defaults.add(createEntity("ETAT_PRECOMPTE", "État Précompte", "Retenues", 
                "Synthèse des retenues à la source, acomptes, saisies-arrêts et prêts du personnel.", "credit_card_off", 7, true, true));

        defaults.add(createEntity("ETAT_FSP", "État FSP (Soutien Patriotique)", "Cotisations Légales", 
                "Fonds de Soutien Patriotique : prélèvement légal obligatoire de 1% sur le salaire net.", "shield", 8, true, true));

        defaults.add(createEntity("ETAT_MUTUELLE", "État Mutuelle", "Assurance & Santé", 
                "Cotisations à la mutuelle de santé et prévoyance santé des salariés.", "health_and_safety", 9, true, true));

        defaults.add(createEntity("ETAT_TYPE_EMPLOYE", "État élément type employé", "Analytique", 
                "Répartition des charges salariales par catégorie socio-professionnelle et type de contrat.", "people", 10, true, true));

        defaults.add(createEntity("ETAT_ELEMENT_SALAIRE", "État Éléments De Salaire", "Rubriques & Primes", 
                "Ventilation analytique détaillée par rubrique de salaire (indemnités, primes, sursalaire).", "pie_chart", 11, true, true));

        defaults.add(createEntity("ETAT_BULLETIN", "État Bulletin (Contrôle exhaustif)", "Audit & Contrôle", 
                "Contrôle exhaustif ligne par ligne de tous les bulletins de paie émis lors de la session.", "rule", 12, true, true));

        repository.saveAll(defaults);
        log.info("12 états de synthèse enregistrés avec succès dans PostgreSQL.");
    }

    private EtatSyntheseConfig createEntity(String code, String libelle, String categorie, String desc, String icon, int ordre, boolean actif, boolean isSystem) {
        EtatSyntheseConfig c = new EtatSyntheseConfig();
        c.setCode(code);
        c.setLibelle(libelle);
        c.setCategorie(categorie);
        c.setDescription(desc);
        c.setIcon(icon);
        c.setOrdre(ordre);
        c.setActif(actif);
        c.setSystem(isSystem);
        c.setFiltreType("ALL");
        return c;
    }

    private EtatSyntheseConfigDto toDto(EtatSyntheseConfig entity) {
        if (entity == null) return null;
        return EtatSyntheseConfigDto.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .libelle(entity.getLibelle())
                .categorie(entity.getCategorie())
                .description(entity.getDescription())
                .icon(entity.getIcon())
                .ordre(entity.getOrdre())
                .actif(entity.isActif())
                .isSystem(entity.isSystem())
                .filtreType(entity.getFiltreType())
                .typeElementCode(entity.getTypeElementCode())
                .colonnesJson(entity.getColonnesJson())
                .build();
    }
}
