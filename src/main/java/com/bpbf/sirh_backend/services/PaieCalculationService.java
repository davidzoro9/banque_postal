package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.PaieBulletinDto;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.entities.GrilleSalariale;
import com.bpbf.sirh_backend.entities.ParametrageIndemnite;
import com.bpbf.sirh_backend.entities.TypeIndemnite;
import com.bpbf.sirh_backend.entities.Fonction;
import com.bpbf.sirh_backend.repositories.FonctionRepository;
import com.bpbf.sirh_backend.repositories.EmployeeRepository;
import com.bpbf.sirh_backend.repositories.GrilleSalarialeRepository;
import com.bpbf.sirh_backend.repositories.ParametrageIndemniteRepository;
import com.bpbf.sirh_backend.repositories.TypeIndemniteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaieCalculationService {

    private final EmployeeRepository employeeRepository;
    private final ParametrageIndemniteRepository parametrageIndemniteRepository;
    private final GrilleSalarialeRepository grilleSalarialeRepository;
    private final TypeIndemniteRepository typeIndemniteRepository;
    private final FonctionRepository fonctionRepository;

    public PaieBulletinDto calculatePayslipForEmployee(Long employeeId) {
        Employee emp = employeeRepository.findById(employeeId).orElse(null);
        String name = emp != null ? (emp.getPrenom() != null ? emp.getPrenom() + " " + emp.getNom() : emp.getName()) : "Employé #" + employeeId;
        String matricule = emp != null ? emp.getMatricule() : "EMP-" + employeeId;
        String fonctionStr = (emp != null && emp.getFonction() != null) ? emp.getFonction().getName() : "Fonctionnaire";

        return computePayslip(employeeId, name, matricule, fonctionStr, "Grade I", "Catégorie IX");
    }

    public List<PaieBulletinDto> calculateAllPayslips() {
        List<Employee> employees = employeeRepository.findAll();
        if (employees.isEmpty()) {
            // Sample calculations for real BPBF staff if DB has no employees yet
            List<PaieBulletinDto> list = new ArrayList<>();
            list.add(computePayslip(1L, "SAWADOGO Abdoulaye", "EMP-001", "Directeur Général", "GRADE III", "CLASSE VIII"));
            list.add(computePayslip(2L, "ZOROM David Faïcal", "EMP-002", "Directeur Monétique & SI", "GRADE III", "CLASSE VII"));
            list.add(computePayslip(3L, "OUEDRAOGO Mariam", "EMP-003", "Responsable Monétique & Cash Point", "GRADE III", "CLASSE VI"));
            list.add(computePayslip(4L, "KABORE Yacouba", "EMP-004", "Chef d'Agence Centrale", "GRADE II", "CLASSE IV"));
            list.add(computePayslip(5L, "TRAORE Aminata", "EMP-005", "Chef de Service Paie & RH", "GRADE III", "CLASSE V"));
            list.add(computePayslip(6L, "COMPAORE Boureima", "EMP-006", "Caissier Principal", "GRADE I", "7ÈME CATEGORIE"));
            list.add(computePayslip(7L, "SANOGO Fatoumata", "EMP-007", "Assistante de Direction", "GRADE I", "6ÈME CATEGORIE"));
            return list;
        }

        return employees.stream()
                .map(emp -> {
                    String name = (emp.getPrenom() != null) ? emp.getPrenom() + " " + emp.getNom() : emp.getName();
                    String matricule = emp.getMatricule() != null ? emp.getMatricule() : "EMP-" + emp.getId();
                    String fonctionStr = (emp.getFonction() != null) ? emp.getFonction().getName() : "Cadre";
                    return computePayslip(emp.getId(), name, matricule, fonctionStr, "Grade I", "Catégorie IX");
                })
                .collect(Collectors.toList());
    }

    public PaieBulletinDto computePayslip(Long empId, String name, String matricule, String fonction, String grade, String categorie) {
        // Base Salary lookup from Grille Salariale or default
        Double salaireBase = 350000.0;
        List<GrilleSalariale> grilles = grilleSalarialeRepository.findAll();
        for (GrilleSalariale g : grilles) {
            if (g.getBasicSalary() != null && g.getBasicSalary().doubleValue() > 0) {
                salaireBase = g.getBasicSalary().doubleValue();
                break;
            }
        }

        // Automatic Allowance Extraction from ParametrageIndemnite
        List<ParametrageIndemnite> allParams = parametrageIndemniteRepository.findAll();
        List<TypeIndemnite> typeIndemnites = typeIndemniteRepository.findAll();
        List<PaieBulletinDto.IndemniteItemDto> indemnites = new ArrayList<>();
        Double totalIndemnites = 0.0;
        Double totalExonere = 0.0;

        if (allParams.isEmpty()) {
            // Default active allowances fallback if table empty
            indemnites.add(new PaieBulletinDto.IndemniteItemDto("PI-001", "Indemnité de Logement", 150000.0));
            indemnites.add(new PaieBulletinDto.IndemniteItemDto("PI-002", "Indemnité de Transport", 50000.0));
            indemnites.add(new PaieBulletinDto.IndemniteItemDto("PI-003", "Indemnité de Responsabilité", 100000.0));
            totalIndemnites = 300000.0;
            totalExonere = 30000.0; // 20% sur logement
        } else {
            String typeNominationEmp = "NON_NOMMEE";
            if (fonction != null && !fonction.isEmpty()) {
                List<Fonction> fonctions = fonctionRepository.findAll();
                for (Fonction f : fonctions) {
                    if ((f.getName() != null && f.getName().equalsIgnoreCase(fonction)) || (f.getCode() != null && f.getCode().equalsIgnoreCase(fonction))) {
                        if (f.getTypeNomination() != null) {
                            typeNominationEmp = f.getTypeNomination();
                        }
                        break;
                    }
                }
            }

            for (ParametrageIndemnite param : allParams) {
                if (Boolean.TRUE.equals(param.getActif())) {
                    Double m = param.getTaux() != null ? param.getTaux() : 0.0;
                    String typeIndStr = param.getTypeIndemniteObj() != null ? (param.getTypeIndemniteObj().getName() != null ? param.getTypeIndemniteObj().getName() : param.getTypeIndemniteObj().getCode()) : "Indemnité";
                    indemnites.add(new PaieBulletinDto.IndemniteItemDto(param.getCode(), typeIndStr, m));
                    totalIndemnites += m;

                    Double tauxExo = null;
                    Double plafondExo = null;

                    if (param.getTypeIndemniteObj() != null) {
                        tauxExo = param.getTypeIndemniteObj().getTauxExoneration();
                        plafondExo = param.getTypeIndemniteObj().getPlafondExoneration();
                    }

                    if (tauxExo != null && tauxExo > 0) {
                        double exoCalc = m * (tauxExo / 100.0);
                        if (plafondExo != null && plafondExo > 0 && exoCalc > plafondExo) {
                            exoCalc = plafondExo;
                        }
                        totalExonere += exoCalc;
                    }
                }
            }
        }

        Double salaireBrut = salaireBase + totalIndemnites;
        Double salaireImposable = Math.max(0.0, salaireBrut - totalExonere);
        Double cotisationCNSS = Math.round(salaireImposable * 0.055 * 100.0) / 100.0;
        Double impotIUTS = Math.round(salaireImposable * 0.10 * 100.0) / 100.0;
        Double totalRetenues = cotisationCNSS + impotIUTS;
        Double salaireNet = salaireBrut - totalRetenues;

        return new PaieBulletinDto(
                empId, name, matricule, fonction, grade, categorie,
                salaireBase, indemnites, totalIndemnites,
                salaireBrut, cotisationCNSS, impotIUTS, totalRetenues,
                salaireNet, "Juillet 2026", "Généré"
        );
    }
}
