package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.entities.RegimeSecuriteSocial;
import com.bpbf.sirh_backend.dtos.RegimeSecuriteSocialDto;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.RegimeSecuriteSocialMapper;
import com.bpbf.sirh_backend.repositories.RegimeSecuriteSocialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegimeSecuriteSocialService {

	private final RegimeSecuriteSocialMapper mapper;
	private final RegimeSecuriteSocialRepository repository;


	public List<RegimeSecuriteSocialDto> getAll() {
		return mapper.toDtos(repository.findAll());
	}


	public RegimeSecuriteSocialDto getById(Long id) {

		RegimeSecuriteSocial entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Régime de Sécurité Sociale introuvable"));

		return mapper.toDto(entity);
	}


	public RegimeSecuriteSocialDto create(RegimeSecuriteSocialDto dto) {

		if (repository.existsByCodeIgnoreCase(dto.getCode())) {
			throw new IllegalArgumentException("Un régime possède déjà le code " + dto.getCode());
		}

		RegimeSecuriteSocial entity = mapper.toEntity(dto);

		return mapper.toDto(repository.save(entity));
	}

	public RegimeSecuriteSocialDto update(Long id, RegimeSecuriteSocialDto dto) {

		RegimeSecuriteSocial entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Régime de sécurité sociale introuvable"));

		mapper.updateEntityFromDto(dto, entity);

		entity.setId(id);

		return mapper.toDto(repository.save(entity));
	}


	public void delete(Long id){

		if (!repository.existsById(id)) {
			throw new ResourceNotFoundException("Régime de sécurité sociale introuvable");
		}

		repository.deleteById(id);
	}


}