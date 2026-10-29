package com.bpbf.sirh_backend.dtos.paie;

public class AdminReferenceCodeDto {
    private String code;
    private String label;
    private String category;
    private String source;

    public AdminReferenceCodeDto() {}

    public AdminReferenceCodeDto(String code, String label, String category, String source) {
        this.code = code != null ? code.trim().toLowerCase() : null;
        this.label = label;
        this.category = category;
        this.source = source;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code != null ? code.trim().toLowerCase() : null; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
