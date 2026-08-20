package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.BanqueDto;
import com.bpbf.sirh_backend.entities.Banque;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BanqueMapper {

	BanqueDto toDto(Banque banque);
	Banque toEntity(BanqueDto banqueDto);

	List<BanqueDto> toDtos(List<Banque> banques);
}