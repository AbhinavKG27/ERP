package com.apex.erp.module.department.dto;

import lombok.Data;

@Data
public class ProgramDto {
    private Long    id;
    private String  name;
    private String  code;
    private Long    departmentId;
    private String  departmentName;
    private Integer durationYears;
    private Integer totalSemesters;
    private Boolean isActive;
}