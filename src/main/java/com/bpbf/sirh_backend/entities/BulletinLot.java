package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bulletin_lot")
public class BulletinLot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    private LocalDate dateFrom;

    private LocalDate dateTo;

    @Column(length = 50)
    private String typeSession = "NORMALE"; // NORMALE, EXTRAORDINAIRE

    private Integer nombreBulletin = 0;

    private Integer nombreValide = 0;

    private String statut = "BROUILLON"; // BROUILLON, VALIDE, CLOTURE

    @OneToMany(mappedBy = "bulletinLot", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Bulletin> bulletins = new ArrayList<>();

    public BulletinLot() {}

    public BulletinLot(Long id, String name, LocalDate dateFrom, LocalDate dateTo, String typeSession,
                       Integer nombreBulletin, Integer nombreValide, String statut, List<Bulletin> bulletins) {
        this.id = id;
        this.name = name;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.typeSession = typeSession != null ? typeSession : "NORMALE";
        this.nombreBulletin = nombreBulletin != null ? nombreBulletin : 0;
        this.nombreValide = nombreValide != null ? nombreValide : 0;
        this.statut = statut != null ? statut : "BROUILLON";
        this.bulletins = bulletins != null ? bulletins : new ArrayList<>();
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

    public List<Bulletin> getBulletins() { return bulletins; }
    public void setBulletins(List<Bulletin> bulletins) { this.bulletins = bulletins; }

    public static BulletinLotBuilder builder() {
        return new BulletinLotBuilder();
    }

    public static class BulletinLotBuilder {
        private Long id;
        private String name;
        private LocalDate dateFrom;
        private LocalDate dateTo;
        private String typeSession = "NORMALE";
        private Integer nombreBulletin = 0;
        private Integer nombreValide = 0;
        private String statut = "BROUILLON";
        private List<Bulletin> bulletins = new ArrayList<>();

        public BulletinLotBuilder id(Long id) { this.id = id; return this; }
        public BulletinLotBuilder name(String name) { this.name = name; return this; }
        public BulletinLotBuilder dateFrom(LocalDate dateFrom) { this.dateFrom = dateFrom; return this; }
        public BulletinLotBuilder dateTo(LocalDate dateTo) { this.dateTo = dateTo; return this; }
        public BulletinLotBuilder typeSession(String typeSession) { this.typeSession = typeSession; return this; }
        public BulletinLotBuilder nombreBulletin(Integer nombreBulletin) { this.nombreBulletin = nombreBulletin; return this; }
        public BulletinLotBuilder nombreValide(Integer nombreValide) { this.nombreValide = nombreValide; return this; }
        public BulletinLotBuilder statut(String statut) { this.statut = statut; return this; }
        public BulletinLotBuilder bulletins(List<Bulletin> bulletins) { this.bulletins = bulletins; return this; }

        public BulletinLot build() {
            return new BulletinLot(id, name, dateFrom, dateTo, typeSession, nombreBulletin, nombreValide, statut, bulletins);
        }
    }
}
