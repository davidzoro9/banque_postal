package com.bpbf.sirh_backend.dtos.paie;

import java.time.LocalDate;

public class BulletinLotResponseDto {
    private Long id;
    private String name;
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private String typeSession;
    private Integer nombreBulletin;
    private Integer nombreValide;
    private String statut;

    public BulletinLotResponseDto() {}

    public BulletinLotResponseDto(Long id, String name, LocalDate dateFrom, LocalDate dateTo,
                                  String typeSession, Integer nombreBulletin, Integer nombreValide, String statut) {
        this.id = id;
        this.name = name;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.typeSession = typeSession;
        this.nombreBulletin = nombreBulletin;
        this.nombreValide = nombreValide;
        this.statut = statut;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getDateFrom() { return dateFrom; }
    public void setDateFrom(LocalDate dateFrom) { this.dateFrom = dateFrom; }

    public LocalDate getDateTo() { return dateTo; }
    public void setDateTo(LocalDate dateTo) { this.dateTo = dateTo; }

    public String getTypeSession() { return typeSession; }
    public void setTypeSession(String typeSession) { this.typeSession = typeSession; }

    public Integer getNombreBulletin() { return nombreBulletin; }
    public void setNombreBulletin(Integer nombreBulletin) { this.nombreBulletin = nombreBulletin; }

    public Integer getNombreValide() { return nombreValide; }
    public void setNombreValide(Integer nombreValide) { this.nombreValide = nombreValide; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public static BulletinLotResponseDtoBuilder builder() {
        return new BulletinLotResponseDtoBuilder();
    }

    public static class BulletinLotResponseDtoBuilder {
        private Long id;
        private String name;
        private LocalDate dateFrom;
        private LocalDate dateTo;
        private String typeSession;
        private Integer nombreBulletin;
        private Integer nombreValide;
        private String statut;

        public BulletinLotResponseDtoBuilder id(Long id) { this.id = id; return this; }
        public BulletinLotResponseDtoBuilder name(String name) { this.name = name; return this; }
        public BulletinLotResponseDtoBuilder dateFrom(LocalDate dateFrom) { this.dateFrom = dateFrom; return this; }
        public BulletinLotResponseDtoBuilder dateTo(LocalDate dateTo) { this.dateTo = dateTo; return this; }
        public BulletinLotResponseDtoBuilder typeSession(String typeSession) { this.typeSession = typeSession; return this; }
        public BulletinLotResponseDtoBuilder nombreBulletin(Integer nombreBulletin) { this.nombreBulletin = nombreBulletin; return this; }
        public BulletinLotResponseDtoBuilder nombreValide(Integer nombreValide) { this.nombreValide = nombreValide; return this; }
        public BulletinLotResponseDtoBuilder statut(String statut) { this.statut = statut; return this; }

        public BulletinLotResponseDto build() {
            return new BulletinLotResponseDto(id, name, dateFrom, dateTo, typeSession, nombreBulletin, nombreValide, statut);
        }
    }
}
