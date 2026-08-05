package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.EmployeeDto;
import com.bpbf.sirh_backend.services.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/employes")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

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
