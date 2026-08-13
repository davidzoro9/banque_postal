package com.bpbf.sirh_backend.dtos;

import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegimeSecuriteSocialDto {

	private Long id;
	private String code;
	private String libelle;
	private String description;
	private Boolean actif;
}