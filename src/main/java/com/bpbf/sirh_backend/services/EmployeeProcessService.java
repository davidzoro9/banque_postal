package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.*;
import com.bpbf.sirh_backend.entities.*;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeProcessService {
    private final EmployeeRepository employeeRepository;
    private final FamilleEmployeRepository familleRepository;
    private final InformationSalarialeRepository informationRepository;
    private final SituationSalarialeRepository situationRepository;
    private final IndemniteEmployeRepository indemniteRepository;
    private final ExonerationEmployeRepository exonerationRepository;
    private final ParametrageIndemniteRepository parametrageRepository;

    @Transactional
    public void sync(Employee employee, EmployeeDto dto) {
        upsertInformation(employee, dto.getModePaiement(), dto.getBanque(), dto.getIban(),
                dto.getIntituleCompte(), dto.getSalaireBrut());

        Long fonctionId = idOf(employee.getFonction());
        Long gradeId = idOf(employee.getGradeObj());
        Long categorieId = idOf(employee.getCategorieObj());
        List<ParametrageIndemnite> applicable = parametrageRepository.findApplicable(fonctionId, gradeId, categorieId);
        Map<Long, IndemniteEmploye> existing = indemniteRepository.findByEmployeeId(employee.getId()).stream()
                .filter(i -> i.getParametrageIndemnite() != null)
                .collect(Collectors.toMap(i -> i.getParametrageIndemnite().getId(), Function.identity()));

        List<IndemniteEmploye> current = new ArrayList<>();
        for (ParametrageIndemnite parametrage : applicable) {
            IndemniteEmploye indemnite = existing.remove(parametrage.getId());
            if (indemnite == null) {
                indemnite = new IndemniteEmploye();
                indemnite.setEmployee(employee);
                indemnite.setParametrageIndemnite(parametrage);
            }
            TypeIndemnite type = parametrage.getTypeIndemniteObj();
            indemnite.setTypeIndemnite(type);
            indemnite.setLibelle(type.getName());
            indemnite.setMontant(valueOrZero(parametrage.getTaux()));
            indemnite.setActif(true);
            current.add(indemniteRepository.save(indemnite));
        }

        // Exemptions reference indemnities, so obsolete children must be removed first.
        for (IndemniteEmploye obsolete : existing.values()) {
            exonerationRepository.deleteByIndemniteEmployeId(obsolete.getId());
        }
        exonerationRepository.flush();
        indemniteRepository.deleteAll(existing.values());
        indemniteRepository.flush();

        double totalIndemnites = current.stream().mapToDouble(i -> valueOrZero(i.getMontant())).sum();
        if (employee.getGrilleSalariale() != null) {
            SituationSalariale situation = situationRepository.findByEmployeeId(employee.getId())
                    .orElseGet(SituationSalariale::new);
            situation.setEmployee(employee);
            situation.setGrilleSalariale(employee.getGrilleSalariale());
            situation.setCategorie(employee.getCategorieObj());
            situation.setEchelon(employee.getEchelonObj());
            situation.setGrade(employee.getGradeObj());
            double base = valueOrZero(employee.getGrilleSalariale().getSalaireBase());
            situation.setSalaireBase(base);
            situation.setTotalIndemnites(totalIndemnites);
            situation.setSalaireBrut(base + totalIndemnites);
            situationRepository.save(situation);
        } else {
            situationRepository.deleteByEmployeeId(employee.getId());
        }

        for (IndemniteEmploye indemnite : current) {
            TypeIndemnite type = indemnite.getTypeIndemnite();
            ExonerationEmploye exoneration = exonerationRepository.findByIndemniteEmployeId(indemnite.getId())
                    .orElseGet(ExonerationEmploye::new);
            double taux = valueOrZero(type.getTauxExoneration());
            double plafond = valueOrZero(type.getPlafondExoneration());
            exoneration.setEmployee(employee);
            exoneration.setTypeIndemnite(type);
            exoneration.setIndemniteEmploye(indemnite);
            exoneration.setLibelle(type.getName());
            exoneration.setTauxExonere(taux);
            exoneration.setPlafondExonere(plafond);
            exoneration.setMontant(calculateExoneration(indemnite.getMontant(), taux, plafond));
            exonerationRepository.save(exoneration);
        }
    }

    static double calculateExoneration(Double montant, Double taux, Double plafond) {
        double calculated = valueOrZero(montant) * valueOrZero(taux) / 100.0;
        return valueOrZero(plafond) > 0 ? Math.min(calculated, plafond) : calculated;
    }

    @Transactional(readOnly = true)
    public List<FamilleEmployeDto> getFamille(String idOrMatricule) {
        Employee employee = resolveEmployee(idOrMatricule);
        return familleRepository.findByEmployeeIdOrderByNomAscPrenomAsc(employee.getId())
                .stream().map(this::toDto).toList();
    }

    @Transactional
    public FamilleEmployeDto createFamille(String idOrMatricule, FamilleEmployeDto dto) {
        Employee employee = resolveEmployee(idOrMatricule);
        FamilleEmploye entity = new FamilleEmploye();
        entity.setEmployee(employee);
        copyFamille(dto, entity);
        return toDto(familleRepository.save(entity));
    }

    @Transactional
    public FamilleEmployeDto updateFamille(String idOrMatricule, Long membreId, FamilleEmployeDto dto) {
        Employee employee = resolveEmployee(idOrMatricule);
        FamilleEmploye entity = familleRepository.findById(membreId)
                .filter(membre -> membre.getEmployee().getId().equals(employee.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Membre de famille non trouvé: " + membreId));
        copyFamille(dto, entity);
        return toDto(familleRepository.save(entity));
    }

    @Transactional
    public void deleteFamille(String idOrMatricule, Long membreId) {
        Employee employee = resolveEmployee(idOrMatricule);
        FamilleEmploye entity = familleRepository.findById(membreId)
                .filter(membre -> membre.getEmployee().getId().equals(employee.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Membre de famille non trouvé: " + membreId));
        familleRepository.delete(entity);
    }

    @Transactional(readOnly = true)
    public InformationSalarialeDto getInformation(String idOrMatricule) {
        Employee employee = resolveEmployee(idOrMatricule);
        return informationRepository.findByEmployeeId(employee.getId()).map(this::toDto)
                .orElseGet(() -> new InformationSalarialeDto(null, employee.getId(), null, null, null, null, null));
    }

    @Transactional
    public InformationSalarialeDto putInformation(String idOrMatricule, InformationSalarialeDto dto) {
        Employee employee = resolveEmployee(idOrMatricule);
        return toDto(upsertInformation(employee, dto.getModePaiement(), dto.getBanque(), dto.getIban(),
                dto.getIntituleCompte(), dto.getSalaireBrut()));
    }

    @Transactional(readOnly = true)
    public SituationSalarialeDto getSituation(String idOrMatricule) {
        Employee employee = resolveEmployee(idOrMatricule);
        return situationRepository.findByEmployeeId(employee.getId()).map(this::toDto)
                .orElseGet(() -> {
                    SituationSalarialeDto dto = new SituationSalarialeDto();
                    dto.setEmployeeId(employee.getId());
                    return dto;
                });
    }

    @Transactional(readOnly = true)
    public List<IndemniteEmployeDto> getIndemnites(String idOrMatricule) {
        Employee employee = resolveEmployee(idOrMatricule);
        return indemniteRepository.findByEmployeeId(employee.getId()).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<ExonerationEmployeDto> getExonerations(String idOrMatricule) {
        Employee employee = resolveEmployee(idOrMatricule);
        return exonerationRepository.findByEmployeeId(employee.getId()).stream().map(this::toDto).toList();
    }

    @Transactional
    public void deleteForEmployee(Long employeeId) {
        exonerationRepository.deleteByEmployeeId(employeeId);
        exonerationRepository.flush();
        indemniteRepository.deleteByEmployeeId(employeeId);
        indemniteRepository.flush();
        situationRepository.deleteByEmployeeId(employeeId);
        informationRepository.deleteByEmployeeId(employeeId);
        familleRepository.deleteByEmployeeId(employeeId);
    }

    private InformationSalariale upsertInformation(Employee employee, String modePaiement, String banque,
                                                     String iban, String intituleCompte, Double salaireBrut) {
        InformationSalariale entity = informationRepository.findByEmployeeId(employee.getId())
                .orElseGet(InformationSalariale::new);
        entity.setEmployee(employee);
        if (modePaiement != null) entity.setModePaiement(modePaiement);
        if (banque != null) entity.setBanque(banque);
        if (iban != null) entity.setIban(iban);
        if (intituleCompte != null) entity.setIntituleCompte(intituleCompte);
        if (salaireBrut != null) entity.setSalaireBrut(salaireBrut);
        return informationRepository.save(entity);
    }

    private Employee resolveEmployee(String value) {
        try {
            return employeeRepository.findById(Long.parseLong(value))
                    .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé: " + value));
        } catch (NumberFormatException e) {
            return employeeRepository.findByMatricule(value)
                    .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé: " + value));
        }
    }

    private FamilleEmployeDto toDto(FamilleEmploye e) {
        return new FamilleEmployeDto(e.getId(), e.getEmployee().getId(), e.getNom(), e.getPrenom(),
                e.getDateNaissance(), e.getLienParente(), e.getEstCharge(), e.getStatut());
    }

    private void copyFamille(FamilleEmployeDto dto, FamilleEmploye entity) {
        if (dto.getNom() == null || dto.getNom().isBlank()) {
            throw new IllegalArgumentException("Le nom est obligatoire");
        }
        if (dto.getPrenom() == null || dto.getPrenom().isBlank()) {
            throw new IllegalArgumentException("Le prénom est obligatoire");
        }
        if (dto.getLienParente() == null) {
            throw new IllegalArgumentException("Le lien de parenté est obligatoire");
        }
        entity.setNom(dto.getNom().trim());
        entity.setPrenom(dto.getPrenom().trim());
        entity.setDateNaissance(dto.getDateNaissance());
        entity.setLienParente(dto.getLienParente());
        entity.setEstCharge(Boolean.TRUE.equals(dto.getEstCharge()));
        entity.setStatut(dto.getStatut());
    }

    private InformationSalarialeDto toDto(InformationSalariale e) {
        return new InformationSalarialeDto(e.getId(), e.getEmployee().getId(), e.getModePaiement(),
                e.getBanque(), e.getIban(), e.getIntituleCompte(), e.getSalaireBrut());
    }

    private SituationSalarialeDto toDto(SituationSalariale e) {
        return new SituationSalarialeDto(e.getId(), e.getEmployee().getId(), idOf(e.getGrilleSalariale()),
                e.getGrilleSalariale() == null ? null : e.getGrilleSalariale().getCode(), idOf(e.getCategorie()),
                label(e.getCategorie()), idOf(e.getEchelon()), label(e.getEchelon()), idOf(e.getGrade()),
                label(e.getGrade()), e.getSalaireBase(), e.getTotalIndemnites(), e.getSalaireBrut());
    }

    private IndemniteEmployeDto toDto(IndemniteEmploye e) {
        return new IndemniteEmployeDto(e.getId(), e.getTypeIndemnite().getId(), e.getTypeIndemnite().getCode(),
                e.getTypeIndemnite().getName(), e.getEmployee().getId(), idOf(e.getParametrageIndemnite()), e.getMontant(), e.getActif());
    }

    private ExonerationEmployeDto toDto(ExonerationEmploye e) {
        return new ExonerationEmployeDto(e.getId(), e.getTypeIndemnite().getId(), e.getTypeIndemnite().getCode(),
                e.getTypeIndemnite().getName(), e.getEmployee().getId(), idOf(e.getIndemniteEmploye()), e.getMontant(),
                e.getTauxExonere(), e.getPlafondExonere());
    }

    private static Long idOf(Object entity) {
        if (entity == null) return null;
        if (entity instanceof Fonction e) return e.getId();
        if (entity instanceof Grade e) return e.getId();
        if (entity instanceof Categorie e) return e.getId();
        if (entity instanceof Echelon e) return e.getId();
        if (entity instanceof GrilleSalariale e) return e.getId();
        if (entity instanceof ParametrageIndemnite e) return e.getId();
        if (entity instanceof IndemniteEmploye e) return e.getId();
        return null;
    }

    private static String label(Categorie e) { return e == null ? null : (e.getLibelle() != null ? e.getLibelle() : e.getCode()); }
    private static String label(Echelon e) { return e == null ? null : (e.getLibelle() != null ? e.getLibelle() : e.getCode()); }
    private static String label(Grade e) { return e == null ? null : (e.getLibelle() != null ? e.getLibelle() : e.getCode()); }
    private static double valueOrZero(Double value) { return value == null ? 0.0 : value; }
}
