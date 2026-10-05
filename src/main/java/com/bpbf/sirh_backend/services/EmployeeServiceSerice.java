package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.ServiceDto;
import com.bpbf.sirh_backend.entities.Department;
import com.bpbf.sirh_backend.entities.Direction;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.ServiceMapper;
import com.bpbf.sirh_backend.repositories.DepartmentRepository;
import com.bpbf.sirh_backend.repositories.DirectionRepository;
import com.bpbf.sirh_backend.repositories.EmployeeRepository;
import com.bpbf.sirh_backend.repositories.ServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeServiceSerice {

    private final ServiceMapper serviceMapper;
    private final ServiceRepository serviceRepository;
    private final DepartmentRepository departmentRepository;
    private final DirectionRepository directionRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public List<ServiceDto> getAllService(){
        List<com.bpbf.sirh_backend.entities.Service> services = serviceRepository.findAll();
        return serviceMapper.toDtos(services);
    }

    @Transactional
    public ServiceDto createService(ServiceDto serviceDto){
        validateSingleParent(serviceDto);
        Department department = null;
        if (serviceDto.getDepartmentId() != null) {
            department = departmentRepository.findById(serviceDto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ce département n'existe pas"));
        }

        Direction direction = null;
        if (serviceDto.getDirectionId() != null) {
            direction = directionRepository.findById(serviceDto.getDirectionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cette direction n'existe pas"));
        }

        Employee dir = null;
        if (serviceDto.getDirecteurId() != null) {
            dir = employeeRepository.findById(serviceDto.getDirecteurId()).orElse(null);
        }

        com.bpbf.sirh_backend.entities.Service service = new com.bpbf.sirh_backend.entities.Service();
        service.setCode(serviceDto.getCode());
        service.setName(serviceDto.getName());
        service.setDescription(serviceDto.getDescription());
        service.setDirection(direction);
        service.setDepartment(department);
        service.setDirecteur(dir);
        com.bpbf.sirh_backend.entities.Service saved = serviceRepository.save(service);

        return serviceMapper.toDto(saved);
    }

    @Transactional
    public ServiceDto updateService(Long id, ServiceDto serviceDto){
        validateSingleParent(serviceDto);
        com.bpbf.sirh_backend.entities.Service service = serviceRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Ce service n'existe pas"));
        
        Department department = null;
        if (serviceDto.getDepartmentId() != null) {
            department = departmentRepository.findById(serviceDto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Ce département n'existe pas"));
        }

        Direction direction = null;
        if (serviceDto.getDirectionId() != null) {
            direction = directionRepository.findById(serviceDto.getDirectionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cette direction n'existe pas"));
        }

        Employee dir = null;
        if (serviceDto.getDirecteurId() != null) {
            dir = employeeRepository.findById(serviceDto.getDirecteurId()).orElse(null);
        }

        service.setCode(serviceDto.getCode());
        service.setName(serviceDto.getName());
        service.setDescription(serviceDto.getDescription());
        service.setDepartment(department);
        service.setDirection(direction);
        service.setDirecteur(dir);

        // Si un responsable est désigné, synchroniser les collaborateurs de ce service
        if (dir != null) {
            List<Employee> members = employeeRepository.findAll().stream()
                    .filter(e -> e.getService() != null && e.getService().getId().equals(id))
                    .toList();
            for (Employee m : members) {
                if (!m.getId().equals(dir.getId())) {
                    m.setSuperviseur(dir);
                    employeeRepository.save(m);
                }
            }
        }

        com.bpbf.sirh_backend.entities.Service saved = serviceRepository.save(service);
        return serviceMapper.toDto(saved);
    }

    @Transactional
    public void delete(Long id){
        serviceRepository.deleteById(id);
    }

    private void validateSingleParent(ServiceDto serviceDto) {
        if (serviceDto.getDepartmentId() != null && serviceDto.getDirectionId() != null) {
            throw new IllegalArgumentException(
                    "Un service doit être rattaché soit à une direction, soit à un département, pas aux deux");
        }
    }
}
