package com.bpbf.sirh_backend.dtos.paie;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SalaryCategoryRequestDto {
    private String code;
    private String name;
    private String type;

    public SalaryCategoryRequestDto() {}

    public SalaryCategoryRequestDto(String code, String name) {
        this.code = code;
        this.name = name;
        this.type = "GAIN";
    }

    public SalaryCategoryRequestDto(String code, String name, String type) {
        this.code = code;
        this.name = name;
        this.type = type != null ? type : "GAIN";
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
