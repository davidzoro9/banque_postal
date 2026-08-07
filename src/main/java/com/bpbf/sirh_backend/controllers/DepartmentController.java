package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.DepartmentDto;
import com.bpbf.sirh_backend.services.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DepartmentController {
    
    private final DepartmentService departmentService;
    
    @GetMapping({"", "/all"})
    public List<DepartmentDto> getAll(){
        return departmentService.getAllDepartment();
    }
    
    @PostMapping({"", "/create"})
    public DepartmentDto create(@RequestBody DepartmentDto departmentDto){
        return departmentService.createDepartment(departmentDto);
    }
    
    @PutMapping("/{id}")
    public DepartmentDto update(@PathVariable Long id , @RequestBody DepartmentDto departmentDto){
        return departmentService.updateDepartment(id, departmentDto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        departmentService.delete(id);
        return "Opération éffectutée avec succès";
    }
}
