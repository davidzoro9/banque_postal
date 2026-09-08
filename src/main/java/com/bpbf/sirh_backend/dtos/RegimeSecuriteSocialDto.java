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

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public String getCode() { return code; }
	public void setCode(String code) { this.code = code; }

	public String getLibelle() { return libelle; }
	public void setLibelle(String libelle) { this.libelle = libelle; }

	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }

	public Boolean getActif() { return actif; }
	public void setActif(Boolean actif) { this.actif = actif; }
}