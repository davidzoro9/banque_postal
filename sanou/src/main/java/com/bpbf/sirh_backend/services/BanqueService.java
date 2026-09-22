package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.BanqueDto;
import com.bpbf.sirh_backend.entities.Banque;
import com.bpbf.sirh_backend.repositories.BanqueRepository;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.mappers.BanqueMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BanqueService {

	private final BanqueMapper banqueMapper;
	private final BanqueRepository banqueRepository;

	public List<BanqueDto> getAll(){

		List<Banque> banques = banqueRepository.findAll();
		return banqueMapper.toDtos(banques);
	}


	public BanqueDto create(BanqueDto banqueDto){

		Banque banque = banqueMapper.toEntity(banqueDto);
		Banque saved = banqueRepository.save(banque);

		return banqueMapper.toDto(saved);
	}


	public BanqueDto update(Long id, BanqueDto banqueDto){

		Banque existingBanque = banqueRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cette banque n'existe pas"));

		existingBanque.setCode(banqueDto.getCode());
		existingBanque.setLibelle(banqueDto.getLibelle());
		existingBanque.setDescription(banqueDto.getDescription());
		existingBanque.setActif(banqueDto.getActif());

		Banque saved = banqueRepository.save(existingBanque);

		return banqueMapper.toDto(saved);
	}


	public void delete(Long id){
		banqueRepository.deleteById(id);
	}
}