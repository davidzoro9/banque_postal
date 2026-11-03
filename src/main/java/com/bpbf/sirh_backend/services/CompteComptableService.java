package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.*;
import com.bpbf.sirh_backend.entities.*;
import com.bpbf.sirh_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompteComptableService {

    private final CompteComptableRepository repository;
    private final ClasseComptableRepository classeRepository;
    private final SensEcritureRepository sensRepository;
    private final JournalComptableRepository journalRepository;
    private final RubriquePaieRepository rubriqueRepository;
    private final SalaryElementRepository salaryElementRepository;
    private final SalaryParametrageService salaryParametrageService;

    @Transactional(readOnly = true)
    public List<CompteComptableDto> getAll(boolean actifOnly) {
        List<CompteComptable> list = actifOnly ? 
                repository.findByActifTrueOrderByNumeroCompteAsc() : 
                repository.findAllByOrderByNumeroCompteAsc();
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CompteComptableDto getById(Long id) {
        CompteComptable c = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte comptable introuvable : " + id));
        return toDto(c);
    }

    @Transactional
    public CompteComptableDto create(CompteComptableDto dto) {
        if (dto.getNumeroCompte() == null || dto.getNumeroCompte().trim().isBlank()) {
            throw new IllegalArgumentException("Le numéro de compte comptable est obligatoire.");
        }
        if (dto.getLibelle() == null || dto.getLibelle().trim().isBlank()) {
            throw new IllegalArgumentException("Le libellé du compte est obligatoire.");
        }

        CompteComptable entity = CompteComptable.builder()
                .numeroCompte(dto.getNumeroCompte().trim())
                .libelle(dto.getLibelle().trim())
                .classeCompte(dto.getClasseCompte() != null ? dto.getClasseCompte().trim() : determineClasse(dto.getNumeroCompte()))
                .sensParDefaut(dto.getSensParDefaut() != null ? dto.getSensParDefaut().trim().toUpperCase() : "DEBIT")
                .typeRubriqueAssociee(dto.getTypeRubriqueAssociee())
                .codeJournal(dto.getCodeJournal() != null ? dto.getCodeJournal().trim() : "OD_PAIE")
                .description(dto.getDescription())
                .actif(dto.getActif() != null ? dto.getActif() : true)
                .build();

        return toDto(repository.save(entity));
    }

    @Transactional
    public CompteComptableDto update(Long id, CompteComptableDto dto) {
        CompteComptable c = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte comptable introuvable : " + id));

        if (dto.getNumeroCompte() != null && !dto.getNumeroCompte().trim().isBlank()) {
            c.setNumeroCompte(dto.getNumeroCompte().trim());
        }
        if (dto.getLibelle() != null && !dto.getLibelle().trim().isBlank()) {
            c.setLibelle(dto.getLibelle().trim());
        }
        if (dto.getClasseCompte() != null) {
            c.setClasseCompte(dto.getClasseCompte().trim());
        } else if (c.getNumeroCompte() != null) {
            c.setClasseCompte(determineClasse(c.getNumeroCompte()));
        }
        if (dto.getSensParDefaut() != null) {
            c.setSensParDefaut(dto.getSensParDefaut().trim().toUpperCase());
        }
        if (dto.getTypeRubriqueAssociee() != null) {
            c.setTypeRubriqueAssociee(dto.getTypeRubriqueAssociee());
        }
        if (dto.getCodeJournal() != null) {
            c.setCodeJournal(dto.getCodeJournal().trim());
        }
        if (dto.getDescription() != null) {
            c.setDescription(dto.getDescription().trim());
        }
        if (dto.getActif() != null) {
            c.setActif(dto.getActif());
        }

        return toDto(repository.save(c));
    }

    @Transactional
    public CompteComptableDto toggleStatus(Long id) {
        CompteComptable c = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte comptable introuvable : " + id));
        c.setActif(c.getActif() == null || !c.getActif());
        return toDto(repository.save(c));
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // =========================================================================
    // PARAMÉTRAGES DU FORMULAIRE : ZÉRO HARDCODE (PostgreSQL -> REST API -> UI)
    // =========================================================================

    @Transactional(readOnly = true)
    public ParametresFormulaireCompteDto getParametresFormulaire() {
        return ParametresFormulaireCompteDto.builder()
                .classes(getClasses(true))
                .sens(getSens(true))
                .journaux(getJournaux(true))
                .rubriques(getRubriquesOptions(true))
                .elements(salaryParametrageService.getAllElements())
                .build();
    }

    @Transactional
    public List<ClasseComptableDto> getClasses(boolean actifOnly) {
        List<ClasseComptable> list = actifOnly ? 
                classeRepository.findByActifTrueOrderByOrdreAsc() : 
                classeRepository.findAllByOrderByOrdreAsc();
        for (ClasseComptable c : list) {
            boolean modified = false;
            if ((c.getNumero() == null || c.getNumero().isBlank()) && c.getCode() != null) {
                c.setNumero(c.getCode().replace("CLASSE_", "").trim());
                modified = true;
            }
            if ((c.getNom() == null || c.getNom().isBlank()) && c.getLibelle() != null) {
                if (c.getLibelle().contains("—")) {
                    String[] parts = c.getLibelle().split("—", 2);
                    if (parts.length > 1) {
                        c.setNom(parts[1].trim());
                        modified = true;
                    }
                } else if (c.getLibelle().contains("-")) {
                    String[] parts = c.getLibelle().split("-", 2);
                    if (parts.length > 1) {
                        c.setNom(parts[1].trim());
                        modified = true;
                    }
                }
            }
            if (modified) {
                try {
                    classeRepository.save(c);
                } catch (Exception ignored) {}
            }
        }
        return list.stream().map(this::toClasseDto).collect(Collectors.toList());
    }

    private ClasseComptableDto toClasseDto(ClasseComptable c) {
        String num = c.getNumero();
        String nom = c.getNom();
        if ((num == null || num.isBlank()) && c.getCode() != null) {
            num = c.getCode().replace("CLASSE_", "").trim();
        }
        if ((nom == null || nom.isBlank()) && c.getLibelle() != null) {
            if (c.getLibelle().contains("—")) {
                String[] p = c.getLibelle().split("—", 2);
                if (p.length > 1) nom = p[1].trim();
            } else if (c.getLibelle().contains("-")) {
                String[] p = c.getLibelle().split("-", 2);
                if (p.length > 1) nom = p[1].trim();
            }
        }
        if (nom == null || nom.isBlank()) {
            nom = c.getLibelle() != null ? c.getLibelle() : c.getCode();
        }
        return ClasseComptableDto.builder()
                .id(c.getId())
                .code(c.getCode())
                .numero(num)
                .nom(nom)
                .libelle(c.getLibelle() != null ? c.getLibelle() : (num != null ? "Classe " + num + " — " + nom : c.getCode()))
                .description(c.getDescription())
                .ordre(c.getOrdre())
                .actif(c.getActif())
                .build();
    }

    @Transactional
    public ClasseComptableDto saveClasse(ClasseComptableDto dto) {
        if (dto.getNumero() == null || dto.getNumero().trim().isBlank()) {
            throw new IllegalArgumentException("Le numéro de classe est obligatoire.");
        }
        if (dto.getNom() == null || dto.getNom().trim().isBlank()) {
            throw new IllegalArgumentException("Le nom de la classe est obligatoire.");
        }
        String num = dto.getNumero().trim();
        String nom = dto.getNom().trim();
        String code = dto.getCode() != null && !dto.getCode().isBlank() ? dto.getCode().trim() : "CLASSE_" + num;
        String libelle = "Classe " + num + " — " + nom;

        ClasseComptable c = classeRepository.findByCode(code).orElseGet(() -> ClasseComptable.builder().code(code).build());
        c.setNumero(num);
        c.setNom(nom);
        c.setLibelle(libelle);
        if (dto.getDescription() != null) c.setDescription(dto.getDescription().trim());
        if (dto.getOrdre() != null) c.setOrdre(dto.getOrdre());
        if (dto.getActif() != null) c.setActif(dto.getActif());
        ClasseComptable saved = classeRepository.save(c);

        return ClasseComptableDto.builder()
                .id(saved.getId())
                .code(saved.getCode())
                .numero(saved.getNumero())
                .nom(saved.getNom())
                .libelle(saved.getLibelle())
                .description(saved.getDescription())
                .ordre(saved.getOrdre())
                .actif(saved.getActif())
                .build();
    }

    @Transactional
    public void deleteClasse(Long id) {
        classeRepository.deleteById(id);
    }

    @Transactional
    public ClasseComptableDto toggleClasseStatus(Long id) {
        ClasseComptable c = classeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe comptable introuvable : " + id));
        c.setActif(c.getActif() == null || !c.getActif());
        ClasseComptable saved = classeRepository.save(c);
        return ClasseComptableDto.builder()
                .id(saved.getId())
                .code(saved.getCode())
                .numero(saved.getNumero())
                .nom(saved.getNom())
                .libelle(saved.getLibelle())
                .description(saved.getDescription())
                .ordre(saved.getOrdre())
                .actif(saved.getActif())
                .build();
    }

    @Transactional(readOnly = true)
    public List<SensEcritureDto> getSens(boolean actifOnly) {
        List<SensEcritureComptable> list = actifOnly ? 
                sensRepository.findByActifTrueOrderByOrdreAsc() : 
                sensRepository.findAllByOrderByOrdreAsc();
        return list.stream().map(s -> SensEcritureDto.builder()
                .id(s.getId())
                .code(s.getCode())
                .libelle(s.getLibelle())
                .description(s.getDescription())
                .ordre(s.getOrdre())
                .actif(s.getActif())
                .build()).collect(Collectors.toList());
    }

    @Transactional
    public SensEcritureDto saveSens(SensEcritureDto dto) {
        if (dto.getCode() == null || dto.getCode().trim().isBlank()) {
            throw new IllegalArgumentException("Le code du sens comptable est obligatoire.");
        }
        if (dto.getLibelle() == null || dto.getLibelle().trim().isBlank()) {
            throw new IllegalArgumentException("Le libellé du sens comptable est obligatoire.");
        }
        String code = dto.getCode().trim().toUpperCase();
        SensEcritureComptable s = sensRepository.findByCode(code).orElseGet(() -> SensEcritureComptable.builder().code(code).build());
        s.setLibelle(dto.getLibelle().trim());
        if (dto.getDescription() != null) s.setDescription(dto.getDescription().trim());
        if (dto.getOrdre() != null) s.setOrdre(dto.getOrdre());
        if (dto.getActif() != null) s.setActif(dto.getActif());
        SensEcritureComptable saved = sensRepository.save(s);
        return SensEcritureDto.builder()
                .id(saved.getId())
                .code(saved.getCode())
                .libelle(saved.getLibelle())
                .description(saved.getDescription())
                .ordre(saved.getOrdre())
                .actif(saved.getActif())
                .build();
    }

    @Transactional
    public void deleteSens(Long id) {
        sensRepository.deleteById(id);
    }

    @Transactional
    public SensEcritureDto toggleSensStatus(Long id) {
        SensEcritureComptable s = sensRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sens comptable introuvable : " + id));
        s.setActif(s.getActif() == null || !s.getActif());
        SensEcritureComptable saved = sensRepository.save(s);
        return SensEcritureDto.builder()
                .id(saved.getId())
                .code(saved.getCode())
                .libelle(saved.getLibelle())
                .description(saved.getDescription())
                .ordre(saved.getOrdre())
                .actif(saved.getActif())
                .build();
    }

    @Transactional(readOnly = true)
    public List<JournalComptableDto> getJournaux(boolean actifOnly) {
        List<JournalComptable> list = actifOnly ? 
                journalRepository.findByActifTrueOrderByOrdreAsc() : 
                journalRepository.findAllByOrderByOrdreAsc();
        return list.stream().map(j -> JournalComptableDto.builder()
                .id(j.getId())
                .code(j.getCode())
                .libelle(j.getLibelle())
                .typeJournal(j.getTypeJournal())
                .description(j.getDescription())
                .ordre(j.getOrdre())
                .actif(j.getActif())
                .build()).collect(Collectors.toList());
    }

    @Transactional
    public JournalComptableDto saveJournal(JournalComptableDto dto) {
        if (dto.getCode() == null || dto.getCode().trim().isBlank()) {
            throw new IllegalArgumentException("Le code du journal est obligatoire.");
        }
        if (dto.getLibelle() == null || dto.getLibelle().trim().isBlank()) {
            throw new IllegalArgumentException("Le libellé du journal est obligatoire.");
        }
        String code = dto.getCode().trim().toUpperCase();
        JournalComptable j = journalRepository.findByCode(code).orElseGet(() -> JournalComptable.builder().code(code).build());
        j.setLibelle(dto.getLibelle().trim());
        j.setTypeJournal(dto.getTypeJournal() != null ? dto.getTypeJournal().trim() : "OD");
        if (dto.getDescription() != null) j.setDescription(dto.getDescription().trim());
        if (dto.getOrdre() != null) j.setOrdre(dto.getOrdre());
        if (dto.getActif() != null) j.setActif(dto.getActif());
        JournalComptable saved = journalRepository.save(j);
        return JournalComptableDto.builder()
                .id(saved.getId())
                .code(saved.getCode())
                .libelle(saved.getLibelle())
                .typeJournal(saved.getTypeJournal())
                .description(saved.getDescription())
                .ordre(saved.getOrdre())
                .actif(saved.getActif())
                .build();
    }

    @Transactional
    public void deleteJournal(Long id) {
        journalRepository.deleteById(id);
    }

    @Transactional
    public JournalComptableDto toggleJournalStatus(Long id) {
        JournalComptable j = journalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Journal comptable introuvable : " + id));
        j.setActif(j.getActif() == null || !j.getActif());
        JournalComptable saved = journalRepository.save(j);
        return JournalComptableDto.builder()
                .id(saved.getId())
                .code(saved.getCode())
                .libelle(saved.getLibelle())
                .typeJournal(saved.getTypeJournal())
                .description(saved.getDescription())
                .ordre(saved.getOrdre())
                .actif(saved.getActif())
                .build();
    }

    @Transactional
    public List<RubriqueOptionDto> getRubriquesOptions(boolean actifOnly) {
        List<RubriquePaie> list = actifOnly ? 
                rubriqueRepository.findByActifTrueOrderByOrdreAsc() : 
                rubriqueRepository.findAllByOrderByOrdreAsc();
        List<SalaryElement> allElements = salaryElementRepository.findAll();
        return list.stream().map(r -> toRubriqueOptionDto(r, allElements)).collect(Collectors.toList());
    }

    private RubriqueOptionDto toRubriqueOptionDto(RubriquePaie r, List<SalaryElement> allElements) {
        String libelleFinal = r.getLibelle();
        Long seId = null;
        String seName = null;

        if (r.getSalaryElement() != null) {
            seId = r.getSalaryElement().getId();
            seName = r.getSalaryElement().getName();
            if (seName != null && !seName.isBlank()) {
                libelleFinal = seName;
            }
        } else {
            SalaryElement el = findMatchingSalaryElement(r.getCodeRubrique(), allElements);
            if (el != null) {
                seId = el.getId();
                seName = el.getName();
                if (seName != null && !seName.isBlank()) {
                    libelleFinal = seName;
                }
                try {
                    r.setSalaryElement(el);
                    r.setLibelle(seName);
                    rubriqueRepository.save(r);
                } catch (Exception ignored) {}
            }
        }

        return RubriqueOptionDto.builder()
                .id(r.getId())
                .code(r.getCodeRubrique())
                .libelle(libelleFinal)
                .sensSuggere(r.getSensSuggere() != null ? r.getSensSuggere() : "DEBIT")
                .classeSuggeree(r.getClasseSuggeree() != null ? r.getClasseSuggeree() : "CLASSE_6")
                .numeroCompteDefaut(r.getNumeroCompteDefaut())
                .typeRubrique(r.getTypeRubrique())
                .description(r.getDescription())
                .ordre(r.getOrdre())
                .actif(r.getActif())
                .salaryElementId(seId)
                .salaryElementName(seName)
                .build();
    }

    private SalaryElement findMatchingSalaryElement(String codeRubrique, List<SalaryElement> allElements) {
        if (codeRubrique == null || codeRubrique.isBlank() || allElements == null || allElements.isEmpty()) {
            return null;
        }
        String cr = codeRubrique.trim().toLowerCase(java.util.Locale.ROOT);
        String crClean = cr.replace("_", "").replace("-", "");

        // 1. Égalité directe de code ou codeCorrespondant
        for (SalaryElement el : allElements) {
            if (el.getCode() != null) {
                String ec = el.getCode().trim().toLowerCase(java.util.Locale.ROOT);
                if (ec.equals(cr) || ec.replace("_", "").replace("-", "").equals(crClean)) {
                    return el;
                }
            }
            if (el.getCodeCorrespondant() != null) {
                String cc = el.getCodeCorrespondant().trim().toLowerCase(java.util.Locale.ROOT);
                if (cc.equals(cr) || cc.replace("_", "").replace("-", "").equals(crClean)) {
                    return el;
                }
            }
        }

        // 2. Correspondance sémantique officielle BPBF
        for (SalaryElement el : allElements) {
            String ec = el.getCode() != null ? el.getCode().trim().toLowerCase(java.util.Locale.ROOT) : "";
            String cc = el.getCodeCorrespondant() != null ? el.getCodeCorrespondant().trim().toLowerCase(java.util.Locale.ROOT) : "";

            if (cr.equals("salaire_base") || cr.equals("sal_base")) {
                if (ec.contains("base") || ec.contains("mensuel") || cc.contains("base")) return el;
            } else if (cr.equals("sur_salaire") || cr.equals("sursalaire")) {
                if (ec.contains("sursal") || cc.contains("sursal")) return el;
            } else if (cr.equals("primes")) {
                if (ec.equals("prime_anc") || ec.equals("prime_gratif") || ec.contains("prime")) return el;
            } else if (cr.equals("indemnites")) {
                if (ec.startsWith("ind") || cc.startsWith("ind")) return el;
            } else if (cr.equals("heures_supp")) {
                if (ec.contains("heure_sup") || ec.contains("heure")) return el;
            } else if (cr.equals("conges_payes")) {
                if (ec.contains("conge") || ec.contains("iccp")) return el;
            } else if (cr.equals("cnss")) {
                if (ec.equals("cotis_cnss") || ec.equals("cnss")) return el;
            } else if (cr.equals("crrae")) {
                if (ec.equals("cotis_crrae") || ec.equals("crrae")) return el;
            } else if (cr.equals("iuts")) {
                if (ec.equals("ret_iuts") || ec.equals("iuts")) return el;
            } else if (cr.equals("fsp")) {
                if (ec.equals("ret_fsp") || ec.equals("fsp")) return el;
            } else if (cr.equals("cotisations_patronales")) {
                if (ec.equals("cot_pat_cnss") || ec.equals("chg_pat_cnss")) return el;
            } else if (cr.equals("crrae_patronale")) {
                if (ec.equals("cot_crrae") || ec.equals("chg_pat_crrae")) return el;
            } else if (cr.equals("tpa")) {
                if (ec.startsWith("tpa")) return el;
            } else if (cr.equals("net_a_payer")) {
                if (ec.contains("net") || cc.contains("net")) return el;
            } else if (cr.equals("acomptes")) {
                if (ec.contains("avance") || ec.contains("acompte")) return el;
            } else if (cr.equals("precomptes")) {
                if (ec.contains("pret") || ec.contains("precompte")) return el;
            } else if (cr.equals("trop_percus")) {
                if (ec.contains("trop") || cc.contains("trop")) return el;
            } else if (cr.equals("rappels")) {
                if (ec.contains("rappel") || ec.contains("avoir")) return el;
            }
        }

        return null;
    }

    @Transactional
    public RubriqueOptionDto saveRubrique(RubriqueOptionDto dto) {
        if (dto.getCode() == null || dto.getCode().trim().isBlank()) {
            throw new IllegalArgumentException("Le code de la rubrique est obligatoire.");
        }
        String code = dto.getCode().trim().toUpperCase(java.util.Locale.ROOT);
        RubriquePaie r = rubriqueRepository.findByCodeRubrique(code).orElseGet(() -> RubriquePaie.builder().codeRubrique(code).build());
        
        List<SalaryElement> allElements = salaryElementRepository.findAll();
        SalaryElement linkedEl = null;

        if (dto.getSalaryElementId() != null) {
            linkedEl = salaryElementRepository.findById(dto.getSalaryElementId()).orElse(null);
        }
        if (linkedEl == null) {
            linkedEl = findMatchingSalaryElement(code, allElements);
        }

        if (linkedEl != null) {
            r.setSalaryElement(linkedEl);
            if (linkedEl.getName() != null && !linkedEl.getName().isBlank()) {
                r.setLibelle(linkedEl.getName());
            } else if (dto.getLibelle() != null && !dto.getLibelle().isBlank()) {
                r.setLibelle(dto.getLibelle().trim());
            }
        } else {
            if (dto.getLibelle() == null || dto.getLibelle().trim().isBlank()) {
                throw new IllegalArgumentException("Le libellé de la rubrique est obligatoire.");
            }
            r.setLibelle(dto.getLibelle().trim());
        }

        if (dto.getSensSuggere() != null) r.setSensSuggere(dto.getSensSuggere().trim().toUpperCase(java.util.Locale.ROOT));
        if (dto.getClasseSuggeree() != null) r.setClasseSuggeree(dto.getClasseSuggeree().trim());
        if (dto.getNumeroCompteDefaut() != null) r.setNumeroCompteDefaut(dto.getNumeroCompteDefaut().trim());
        if (dto.getTypeRubrique() != null) r.setTypeRubrique(dto.getTypeRubrique().trim());
        if (dto.getDescription() != null) r.setDescription(dto.getDescription().trim());
        if (dto.getOrdre() != null) r.setOrdre(dto.getOrdre());
        if (dto.getActif() != null) r.setActif(dto.getActif());
        RubriquePaie saved = rubriqueRepository.save(r);
        return toRubriqueOptionDto(saved, allElements);
    }

    @Transactional
    public void deleteRubrique(Long id) {
        rubriqueRepository.deleteById(id);
    }

    @Transactional
    public RubriqueOptionDto toggleRubriqueStatus(Long id) {
        RubriquePaie r = rubriqueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rubrique de paie introuvable : " + id));
        r.setActif(r.getActif() == null || !r.getActif());
        RubriquePaie saved = rubriqueRepository.save(r);
        return toRubriqueOptionDto(saved, salaryElementRepository.findAll());
    }

    private String determineClasse(String num) {
        if (num == null || num.isEmpty()) return "CLASSE_6";
        char c = num.charAt(0);
        return switch (c) {
            case '6' -> "CLASSE_6";
            case '4' -> "CLASSE_4";
            case '5' -> "CLASSE_5";
            case '7' -> "CLASSE_7";
            case '1' -> "CLASSE_1";
            case '2' -> "CLASSE_2";
            default -> "CLASSE_" + c;
        };
    }

    private CompteComptableDto toDto(CompteComptable c) {
        return CompteComptableDto.builder()
                .id(c.getId())
                .numeroCompte(c.getNumeroCompte())
                .libelle(c.getLibelle())
                .classeCompte(c.getClasseCompte())
                .sensParDefaut(c.getSensParDefaut())
                .typeRubriqueAssociee(c.getTypeRubriqueAssociee())
                .codeJournal(c.getCodeJournal())
                .description(c.getDescription())
                .actif(c.getActif())
                .build();
    }
}
