package com.bpbf.sirh_backend.dtos.paie;

import java.time.LocalDate;

public class BulletinLotCreateDto {
    private String name;
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private String typeSession;

    public BulletinLotCreateDto() {}

    public BulletinLotCreateDto(String name, LocalDate dateFrom, LocalDate dateTo, String typeSession) {
        this.name = name;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.typeSession = typeSession;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getDateFrom() { return dateFrom; }
    public void setDateFrom(LocalDate dateFrom) { this.dateFrom = dateFrom; }

    public LocalDate getDateTo() { return dateTo; }
    public void setDateTo(LocalDate dateTo) { this.dateTo = dateTo; }

    public String getTypeSession() { return typeSession; }
    public void setTypeSession(String typeSession) { this.typeSession = typeSession; }

    public static BulletinLotCreateDtoBuilder builder() {
        return new BulletinLotCreateDtoBuilder();
    }

    public static class BulletinLotCreateDtoBuilder {
        private String name;
        private LocalDate dateFrom;
        private LocalDate dateTo;
        private String typeSession;

        public BulletinLotCreateDtoBuilder name(String name) { this.name = name; return this; }
        public BulletinLotCreateDtoBuilder dateFrom(LocalDate dateFrom) { this.dateFrom = dateFrom; return this; }
        public BulletinLotCreateDtoBuilder dateTo(LocalDate dateTo) { this.dateTo = dateTo; return this; }
        public BulletinLotCreateDtoBuilder typeSession(String typeSession) { this.typeSession = typeSession; return this; }

        public BulletinLotCreateDto build() {
            return new BulletinLotCreateDto(name, dateFrom, dateTo, typeSession);
        }
    }
}
