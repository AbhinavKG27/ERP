package com.apex.erp.module.department.dto;

import lombok.Data;

@Data
public class BatchDto {
    private Long    id;
    private Long    programId;
    private String  programName;
    private String  departmentName;
    private Integer joinYear;
    private Integer graduationYear;
    private String  section;
    private Boolean isActive;
}