package com.bpbf.sirh_backend.dtos.paie;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BulletinSummaryResponseDto {
    private Long id;
    private String code;
    private Long employeeId;
    private String employeeName;
    private String matricule;
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private BigDecimal workedDays;
    private BigDecimal totalBrut;
    private BigDecimal totalRetenues;
    private BigDecimal netAPayer;
    private String statut;

    public BulletinSummaryResponseDto() {}

    public BulletinSummaryResponseDto(Long id, String code, Long employeeId, String employeeName,
                                      String matricule, LocalDate dateFrom, LocalDate dateTo,
                                      BigDecimal workedDays, BigDecimal totalBrut, BigDecimal totalRetenues,
                                      BigDecimal netAPayer, String statut) {
        this.id = id;
        this.code = code;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.matricule = matricule;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.workedDays = workedDays;
        this.totalBrut = totalBrut;
        this.totalRetenues = totalRetenues;
        this.netAPayer = netAPayer;
        this.statut = statut;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

    public LocalDate getDateFrom() { return dateFrom; }
    public void setDateFrom(LocalDate dateFrom) { this.dateFrom = dateFrom; }

    public LocalDate getDateTo() { return dateTo; }
    public void setDateTo(LocalDate dateTo) { this.dateTo = dateTo; }

    public BigDecimal getWorkedDays() { return workedDays; }
    public void setWorkedDays(BigDecimal workedDays) { this.workedDays = workedDays; }

    public BigDecimal getTotalBrut() { return totalBrut; }
    public void setTotalBrut(BigDecimal totalBrut) { this.totalBrut = totalBrut; }

    public BigDecimal getTotalRetenues() { return totalRetenues; }
    public void setTotalRetenues(BigDecimal totalRetenues) { this.totalRetenues = totalRetenues; }

    public BigDecimal getNetAPayer() { return netAPayer; }
    public void setNetAPayer(BigDecimal netAPayer) { this.netAPayer = netAPayer; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public static BulletinSummaryResponseDtoBuilder builder() {
        return new BulletinSummaryResponseDtoBuilder();
    }

    public static class BulletinSummaryResponseDtoBuilder {
        private Long id;
        private String code;
        private Long employeeId;
        private String employeeName;
        private String matricule;
        private LocalDate dateFrom;
        private LocalDate dateTo;
        private BigDecimal workedDays;
        private BigDecimal totalBrut;
        private BigDecimal totalRetenues;
        private BigDecimal netAPayer;
        private String statut;

        public BulletinSummaryResponseDtoBuilder id(Long id) { this.id = id; return this; }
        public BulletinSummaryResponseDtoBuilder code(String code) { this.code = code; return this; }
        public BulletinSummaryResponseDtoBuilder employeeId(Long employeeId) { this.employeeId = employeeId; return this; }
        public BulletinSummaryResponseDtoBuilder employeeName(String employeeName) { this.employeeName = employeeName; return this; }
        public BulletinSummaryResponseDtoBuilder matricule(String matricule) { this.matricule = matricule; return this; }
        public BulletinSummaryResponseDtoBuilder dateFrom(LocalDate dateFrom) { this.dateFrom = dateFrom; return this; }
        public BulletinSummaryResponseDtoBuilder dateTo(LocalDate dateTo) { this.dateTo = dateTo; return this; }
        public BulletinSummaryResponseDtoBuilder workedDays(BigDecimal workedDays) { this.workedDays = workedDays; return this; }
        public BulletinSummaryResponseDtoBuilder totalBrut(BigDecimal totalBrut) { this.totalBrut = totalBrut; return this; }
        public BulletinSummaryResponseDtoBuilder totalRetenues(BigDecimal totalRetenues) { this.totalRetenues = totalRetenues; return this; }
        public BulletinSummaryResponseDtoBuilder netAPayer(BigDecimal netAPayer) { this.netAPayer = netAPayer; return this; }
        public BulletinSummaryResponseDtoBuilder statut(String statut) { this.statut = statut; return this; }

        public BulletinSummaryResponseDto build() {
            return new BulletinSummaryResponseDto(id, code, employeeId, employeeName, matricule, dateFrom, dateTo, workedDays, totalBrut, totalRetenues, netAPayer, statut);
        }
    }
}
