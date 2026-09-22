package com.bpbf.sirh_backend.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BanqueDto {

	private Long id;
	private String code;
	private String libelle;
	private String description;
	private Boolean actif;
}