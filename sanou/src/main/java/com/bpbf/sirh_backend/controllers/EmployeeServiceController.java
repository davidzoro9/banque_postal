package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.ServiceDto;
import com.bpbf.sirh_backend.services.EmployeeServiceSerice;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmployeeServiceController {

    private final EmployeeServiceSerice employeeServiceSerice;

    @GetMapping({"", "/all"})
    public List<ServiceDto> getAll(){
        return employeeServiceSerice.getAllService();
    }

    @PostMapping({"", "/create"})
    public ServiceDto create(@RequestBody ServiceDto serviceDto){
        return employeeServiceSerice.createService(serviceDto);
    }

    @PutMapping("/{id}")
    public ServiceDto update(@PathVariable Long id, @RequestBody ServiceDto serviceDto){
        return employeeServiceSerice.updateService(id, serviceDto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        employeeServiceSerice.delete(id);
        return "Le service a été supprimé avec succès";
    }
}
