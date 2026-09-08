package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.PaieBulletinDto;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.entities.Fonction;
import com.bpbf.sirh_backend.entities.IndemniteEmploye;
import com.bpbf.sirh_backend.entities.SituationSalariale;
import com.bpbf.sirh_backend.repositories.EmployeeRepository;
import com.bpbf.sirh_backend.repositories.FonctionRepository;
import com.bpbf.sirh_backend.repositories.IndemniteEmployeRepository;
import com.bpbf.sirh_backend.repositories.SituationSalarialeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaieCalculationService {

    private final EmployeeRepository employeeRepository;
    private final SituationSalarialeRepository situationRepository;
    private final IndemniteEmployeRepository indemniteEmployeRepository;
    private final FonctionRepository fonctionRepository;

    public PaieBulletinDto calculatePayslipForEmployee(Long employeeId) {
        Employee emp = employeeRepository.findById(employeeId).orElse(null);
        if (emp == null) {
            throw new RuntimeException("Employé introuvable avec l'identifiant: #" + employeeId);
        }
        String name = emp.getPrenom() != null ? emp.getPrenom() + " " + emp.getNom() : (emp.getName() != null ? emp.getName() : "Employé #" + employeeId);
        String matricule = emp.getMatricule() != null ? emp.getMatricule() : "EMP-" + employeeId;
        String fonctionStr = (emp.getFonction() != null) ? emp.getFonction().getName() : "Collaborateur";
        String gradeStr = (emp.getGradeObj() != null) ? (emp.getGradeObj().getLibelle() != null ? emp.getGradeObj().getLibelle() : emp.getGradeObj().getCode()) : "—";
        String catStr = (emp.getCategorieObj() != null) ? (emp.getCategorieObj().getLibelle() != null ? emp.getCategorieObj().getLibelle() : emp.getCategorieObj().getCode()) : "—";

        return computePayslip(employeeId, name, matricule, fonctionStr, gradeStr, catStr);
    }

    public List<PaieBulletinDto> calculateAllPayslips() {
        List<Employee> employees = employeeRepository.findAll();
        if (employees.isEmpty()) {
            return Collections.emptyList();
        }

        return employees.stream()
                .map(emp -> {
                    String name = (emp.getPrenom() != null) ? emp.getPrenom() + " " + emp.getNom() : (emp.getName() != null ? emp.getName() : "Employé #" + emp.getId());
                    String matricule = emp.getMatricule() != null ? emp.getMatricule() : "EMP-" + emp.getId();
                    String fonctionStr = (emp.getFonction() != null) ? emp.getFonction().getName() : "Collaborateur";
                    String gradeStr = (emp.getGradeObj() != null) ? (emp.getGradeObj().getLibelle() != null ? emp.getGradeObj().getLibelle() : emp.getGradeObj().getCode()) : "—";
                    String catStr = (emp.getCategorieObj() != null) ? (emp.getCategorieObj().getLibelle() != null ? emp.getCategorieObj().getLibelle() : emp.getCategorieObj().getCode()) : "—";
                    return computePayslip(emp.getId(), name, matricule, fonctionStr, gradeStr, catStr);
                })
                .collect(Collectors.toList());
    }

    public PaieBulletinDto computePayslip(Long empId, String name, String matricule, String fonction, String grade, String categorie) {
        // Lecture stricte du salaire de base depuis la base de données (Situation ou Grille salariale)
        Double salaireBase = 0.0;
        SituationSalariale situation = situationRepository.findByEmployeeId(empId).orElse(null);
        if (situation != null && situation.getSalaireBase() != null && situation.getSalaireBase() > 0) {
            salaireBase = situation.getSalaireBase();
        } else if (situation != null && situation.getGrilleSalariale() != null && situation.getGrilleSalariale().getBasicSalary() != null) {
            salaireBase = situation.getGrilleSalariale().getBasicSalary().doubleValue();
        } else {
            Employee emp = employeeRepository.findById(empId).orElse(null);
            if (emp != null && emp.getGrilleSalariale() != null && emp.getGrilleSalariale().getBasicSalary() != null) {
                salaireBase = emp.getGrilleSalariale().getBasicSalary().doubleValue();
            }
        }

        // Lecture stricte des indemnités de l'employé depuis la base de données
        List<IndemniteEmploye> empIndemnites = indemniteEmployeRepository.findByEmployeeId(empId);
        List<PaieBulletinDto.IndemniteItemDto> indemnites = new ArrayList<>();
        Double totalIndemnites = 0.0;
        Double totalExonere = 0.0;

        for (IndemniteEmploye ind : empIndemnites) {
            if (Boolean.FALSE.equals(ind.getActif())) continue;
            Double m = ind.getMontant() != null ? ind.getMontant().doubleValue() : 0.0;
            String code = (ind.getTypeIndemnite() != null && ind.getTypeIndemnite().getCode() != null) ? ind.getTypeIndemnite().getCode() : "IND";
            String libelle = ind.getLibelle() != null ? ind.getLibelle() : (ind.getTypeIndemnite() != null ? ind.getTypeIndemnite().getName() : "Indemnité");
            indemnites.add(new PaieBulletinDto.IndemniteItemDto(code, libelle, m));
            totalIndemnites += m;

            if (ind.getTypeIndemnite() != null) {
                Double tauxExo = ind.getTypeIndemnite().getTauxExoneration();
                Double plafondExo = ind.getTypeIndemnite().getPlafondExoneration();
                if (tauxExo != null && tauxExo > 0) {
                    double exoCalc = m * (tauxExo / 100.0);
                    if (plafondExo != null && plafondExo > 0 && exoCalc > plafondExo) {
                        exoCalc = plafondExo;
                    }
                    totalExonere += exoCalc;
                }
            }
        }

        Double salaireBrut = salaireBase + totalIndemnites;
        Double salaireImposable = Math.max(0.0, salaireBrut - totalExonere);
        Double cotisationCNSS = Math.round(salaireImposable * 0.055 * 100.0) / 100.0;
        Double impotIUTS = Math.round(salaireImposable * 0.10 * 100.0) / 100.0;
        Double totalRetenues = cotisationCNSS + impotIUTS;
        Double salaireNet = salaireBrut - totalRetenues;

        String moisCourant = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM yyyy", Locale.FRENCH));

        return new PaieBulletinDto(
                empId, name, matricule, fonction, grade, categorie,
                salaireBase, indemnites, totalIndemnites,
                salaireBrut, cotisationCNSS, impotIUTS, totalRetenues,
                salaireNet, moisCourant, "Généré"
        );
    }
}
