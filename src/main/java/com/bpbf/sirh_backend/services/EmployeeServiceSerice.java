package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.ServiceDto;
import com.bpbf.sirh_backend.entities.Department;
import com.bpbf.sirh_backend.entities.Direction;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.ServiceMapper;
import com.bpbf.sirh_backend.repositories.DepartmentRepository;
import com.bpbf.sirh_backend.repositories.DirectionRepository;
import com.bpbf.sirh_backend.repositories.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceSerice {

    private final ServiceMapper serviceMapper;
    private final ServiceRepository serviceRepository;
    private final DepartmentRepository departmentRepository;
    private final DirectionRepository directionRepository;

    public List<ServiceDto> getAllService(){
        List<com.bpbf.sirh_backend.entities.Service> services = serviceRepository.findAll();
        return serviceMapper.toDtos(services);
    }

    public ServiceDto createService(ServiceDto serviceDto){
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

        com.bpbf.sirh_backend.entities.Service service = new com.bpbf.sirh_backend.entities.Service();
        service.setCode(serviceDto.getCode());
        service.setName(serviceDto.getName());
        service.setDescription(serviceDto.getDescription());
        service.setDirection(direction);
        service.setDepartment(department);
        com.bpbf.sirh_backend.entities.Service saved = serviceRepository.save(service);

        return serviceMapper.toDto(saved);
    }

    public ServiceDto updateService(Long id, ServiceDto serviceDto){
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

        service.setCode(serviceDto.getCode());
        service.setName(serviceDto.getName());
        service.setDescription(serviceDto.getDescription());
        service.setDepartment(department);
        service.setDirection(direction);

        com.bpbf.sirh_backend.entities.Service saved = serviceRepository.save(service);
        return serviceMapper.toDto(saved);
    }

    public void delete(Long id){
        serviceRepository.deleteById(id);
    }
}
