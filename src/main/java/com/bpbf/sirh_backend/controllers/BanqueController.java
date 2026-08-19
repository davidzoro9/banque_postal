package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.Banque;
import com.bpbf.sirh_backend.dtos.BanqueDto;
import com.bpbf.sirh_backend.services.BanqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/banques")
@RestController
@RequiredArgsConstructor
public class BanqueController {

	private final BanqueService banqueService;

	@GetMapping("/all")
	public List<BanqueDto> getAll(){
		return banqueService.getAll();
	}

	@PostMapping("/create")
	public BanqueDto create(@RequestBody BanqueDto banqueDto) {
		return banqueService.create(banqueDto);
	}

	@PutMapping("/{id}")
	public BanqueDto update(@PathVariable Long id, @RequestBody BanqueDto banqueDto) {
		return banqueService.update(id, banqueDto);
	}

	@DeleteMapping("/{id}")
	public String delete(@PathVariable Long id) {
		banqueService.delete(id);
		return "Opération éffectutée avec succès";
	}
}