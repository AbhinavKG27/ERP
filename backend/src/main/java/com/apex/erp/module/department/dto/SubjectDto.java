package com.apex.erp.module.department.dto;

import lombok.Data;

@Data
public class SubjectDto {
    private Long    id;
    private String  name;
    private String  code;
    private Long    departmentId;
    private String  departmentName;
    private Integer semesterNumber;
    private Integer credits;
    private String  subjectType;
    private Boolean isActive;
}