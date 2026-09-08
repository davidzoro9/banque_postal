package com.bpbf.sirh_backend.dtos.paie;

import java.util.List;

public class GeneratePayrollRequestDto {
    private Long bulletinLotId;
    private List<Long> employeeIds;

    public GeneratePayrollRequestDto() {}

    public GeneratePayrollRequestDto(Long bulletinLotId, List<Long> employeeIds) {
        this.bulletinLotId = bulletinLotId;
        this.employeeIds = employeeIds;
    }

    public Long getBulletinLotId() { return bulletinLotId; }
    public void setBulletinLotId(Long bulletinLotId) { this.bulletinLotId = bulletinLotId; }

    public List<Long> getEmployeeIds() { return employeeIds; }
    public void setEmployeeIds(List<Long> employeeIds) { this.employeeIds = employeeIds; }

    public static GeneratePayrollRequestDtoBuilder builder() {
        return new GeneratePayrollRequestDtoBuilder();
    }

    public static class GeneratePayrollRequestDtoBuilder {
        private Long bulletinLotId;
        private List<Long> employeeIds;

        public GeneratePayrollRequestDtoBuilder bulletinLotId(Long bulletinLotId) { this.bulletinLotId = bulletinLotId; return this; }
        public GeneratePayrollRequestDtoBuilder employeeIds(List<Long> employeeIds) { this.employeeIds = employeeIds; return this; }

        public GeneratePayrollRequestDto build() {
            return new GeneratePayrollRequestDto(bulletinLotId, employeeIds);
        }
    }
}
