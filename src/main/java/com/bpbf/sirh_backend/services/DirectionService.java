package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.entities.Agence;
import com.bpbf.sirh_backend.dtos.DirectionDto;
import com.bpbf.sirh_backend.entities.Department;
import com.bpbf.sirh_backend.entities.Direction;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.DirectionMapper;
import com.bpbf.sirh_backend.repositories.AgenceRepository;
import com.bpbf.sirh_backend.repositories.DepartmentRepository;
import com.bpbf.sirh_backend.repositories.DirectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DirectionService {

    private final DirectionMapper directionMapper;
    private final DirectionRepository directionRepository;
    private final DepartmentRepository departmentRepository;
    private final AgenceRepository agenceRepository;

    public List<DirectionDto> getAllDirection(){
        List<Direction> directions = directionRepository.findAll();
        return directionMapper.toDtos(directions);
    }

    public DirectionDto createDirection(DirectionDto directionDto){

        Agence agence = null;
        if (directionDto.getAgenceId() != null) {
            agence = agenceRepository.findById(directionDto.getAgenceId()).orElseThrow(() -> new ResourceNotFoundException("Cette agence n'existe pas"));
        }

        Direction direction = new Direction();
        direction.setCode(directionDto.getCode());
        direction.setName(directionDto.getName());
        direction.setDescription(directionDto.getDescription());

        if (directionDto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(directionDto.getDepartmentId()).orElse(null);
            direction.setDepartment(department);
        }

        direction.setAgence(agence);
        Direction saved = directionRepository.save(direction);
        return directionMapper.toDto(saved);
    }

    public DirectionDto updateDirection(Long id, DirectionDto directionDto){
        Direction direction = directionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cette direction n'existe pas"));

        direction.setCode(directionDto.getCode());
        direction.setName(directionDto.getName());
        direction.setDescription(directionDto.getDescription());

        if (directionDto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(directionDto.getDepartmentId()).orElse(null);
            direction.setDepartment(department);
        }

        Agence agence = null;
        if (directionDto.getAgenceId() != null) {
            agence = agenceRepository.findById(directionDto.getAgenceId()).orElseThrow(() -> new ResourceNotFoundException("Cette agence n'existe pas"));
        }

        direction.setAgence(agence);
        Direction saved = directionRepository.save(direction);
        return directionMapper.toDto(saved);
    }

    public void delete(Long id){
        directionRepository.deleteById(id);
    }
}
