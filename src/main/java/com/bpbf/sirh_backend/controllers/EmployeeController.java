package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.*;
import com.bpbf.sirh_backend.services.EmployeeProcessService;
import com.bpbf.sirh_backend.services.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"api/employes", "api/employees"})
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;
    private final EmployeeProcessService employeeProcessService;

    @GetMapping("/all")
    public List<EmployeeDto> getAll() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public EmployeeDto getById(@PathVariable String id) {
        try {
            Long numericId = Long.parseLong(id);
            return employeeService.getEmployeeById(numericId);
        } catch (NumberFormatException e) {
            return employeeService.getEmployeeByMatricule(id);
        }
    }

    @GetMapping("/{id}/situation-salariale")
    public SituationSalarialeDto getSituationSalariale(@PathVariable String id) {
        return employeeProcessService.getSituation(id);
    }

    @GetMapping("/{id}/famille")
    public List<FamilleEmployeDto> getFamille(@PathVariable String id) {
        return employeeProcessService.getFamille(id);
    }

    @PostMapping("/{id}/famille")
    public FamilleEmployeDto createFamille(@PathVariable String id, @RequestBody FamilleEmployeDto dto) {
        return employeeProcessService.createFamille(id, dto);
    }

    @PutMapping("/{id}/famille/{membreId}")
    public FamilleEmployeDto updateFamille(@PathVariable String id, @PathVariable Long membreId,
                                            @RequestBody FamilleEmployeDto dto) {
        return employeeProcessService.updateFamille(id, membreId, dto);
    }

    @DeleteMapping("/{id}/famille/{membreId}")
    public void deleteFamille(@PathVariable String id, @PathVariable Long membreId) {
        employeeProcessService.deleteFamille(id, membreId);
    }

    @GetMapping("/{id}/informations-salariales")
    public InformationSalarialeDto getInformationsSalariales(@PathVariable String id) {
        return employeeProcessService.getInformation(id);
    }

    @PutMapping("/{id}/informations-salariales")
    public InformationSalarialeDto putInformationsSalariales(@PathVariable String id,
                                                              @RequestBody InformationSalarialeDto dto) {
        return employeeProcessService.putInformation(id, dto);
    }

    @PostMapping("/{id}/informations-salariales/recalculer")
    public InformationSalarialeDto recalculateInformationsSalariales(@PathVariable String id) {
        return employeeProcessService.recalculateInformation(id);
    }

    @GetMapping("/{id}/informations-salariales/simulation")
    public InformationSalarialeDto simulateInformationsSalariales(
            @PathVariable String id,
            @RequestParam(required = false) Double salaireBase,
            @RequestParam(required = false) Double surSalaire,
            @RequestParam(required = false) Integer ancienneteReprise) {
        return employeeProcessService.simulateSalary(id, salaireBase, surSalaire, ancienneteReprise);
    }

    @GetMapping("/{id}/indemnites")
    public List<IndemniteEmployeDto> getIndemnites(@PathVariable String id) {
        return employeeProcessService.getIndemnites(id);
    }

    @PutMapping("/{id}/indemnites/{indemniteId}/toggle")
    public IndemniteEmployeDto toggleIndemnite(@PathVariable String id, @PathVariable Long indemniteId) {
        return employeeProcessService.toggleIndemnite(id, indemniteId);
    }

    @DeleteMapping("/{id}/indemnites/{indemniteId}")
    public org.springframework.http.ResponseEntity<Void> deleteIndemnite(@PathVariable String id, @PathVariable Long indemniteId) {
        employeeProcessService.deleteIndemnite(id, indemniteId);
        return org.springframework.http.ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/avantages")
    public EmployeeDto updateAvantages(@PathVariable String id, @RequestBody java.util.Map<String, Boolean> avantages) {
        return employeeService.updateAvantages(id, avantages);
    }

    @GetMapping("/{id}/exonerations")
    public List<ExonerationEmployeDto> getExonerations(@PathVariable String id) {
        return employeeProcessService.getExonerations(id);
    }

    @PostMapping("/create")
    public EmployeeDto create(@RequestBody EmployeeDto employeeDto) {
        return employeeService.createEmployee(employeeDto);
    }

    @PutMapping("/{id}")
    public EmployeeDto update(@PathVariable String id, @RequestBody EmployeeDto employeeDto) {
        try {
            Long numericId = Long.parseLong(id);
            return employeeService.updateEmployee(numericId, employeeDto);
        } catch (NumberFormatException e) {
            return employeeService.updateEmployeeByMatricule(id, employeeDto);
        }
    }

    @PutMapping("/{id}/superviseur")
    public EmployeeDto updateSuperviseur(@PathVariable Long id, @RequestParam(required = false) Long superviseurId) {
        return employeeService.updateSuperviseur(id, superviseurId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        try {
            Long numericId = Long.parseLong(id);
            employeeService.delete(numericId);
        } catch (NumberFormatException e) {
            employeeService.deleteByMatricule(id);
        }
    }
}
