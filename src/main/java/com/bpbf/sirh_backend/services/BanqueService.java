package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.BanqueDto;
import com.bpbf.sirh_backend.entities.Banque;
import com.bpbf.sirh_backend.mappers.BanqueMapper;
import com.bpbf.sirh_backend.repositories.BanqueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BanqueService {

	private final BanqueRepository banqueRepository;
	private final BanqueMapper banqueMapper;

	public List<BanqueDto> getAll() {
		List<Banque> banques = banqueRepository.findAll();
		return banqueMapper.toDtos(banques);
	}

	public BanqueDto create(BanqueDto banqueDto) {
		Banque banque = banqueMapper.toEntity(banqueDto);
		Banque saved = banqueRepository.save(banque);

		return banqueMapper.toDto(saved);
	}

	public BanqueDto update(Long id, BanqueDto banqueDto) {

		Banque existingBanque = banqueRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cette banque n'existe pas"));

		existingBanque.setCode(banqueDto.getCode());
		existingBanque.setLibelle(banqueDto.getLibelle());

		Banque saved = banqueRepository.save(existingBanque);

		return banqueMapper.toDto(saved);
	}

	public void delete(Long id) {
		banqueRepository.deleteById(id);
	}
}