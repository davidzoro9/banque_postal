package com.bpbf.sirh_backend.mappers;

import com.bpbf.sirh_backend.dtos.RegimeSecuriteSocialDto;
import com.bpbf.sirh_backend.entities.RegimeSecuriteSocial;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RegimeSecuriteSocialMapper {

	RegimeSecuriteSocialDto toDto(RegimeSecuriteSocial entity);

	RegimeSecuriteSocial toEntity(RegimeSecuriteSocialDto dto);

	List<RegimeSecuriteSocialDto> toDtos(List<RegimeSecuriteSocial> entities);

	void updateEntityFromDto(RegimeSecuriteSocialDto dto, @MappingTarget RegimeSecuriteSocial entity);
}