package com.bpbf.sirh_backend.dtos.paie;

public class SalaryCategoryResponseDto {
    private Long id;
    private String code;
    private String name;

    public SalaryCategoryResponseDto() {}

    public SalaryCategoryResponseDto(Long id, String code, String name) {
        this.id = id;
        this.code = code;
        this.name = name;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String code;
        private String name;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder code(String code) { this.code = code; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public SalaryCategoryResponseDto build() { return new SalaryCategoryResponseDto(id, code, name); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
