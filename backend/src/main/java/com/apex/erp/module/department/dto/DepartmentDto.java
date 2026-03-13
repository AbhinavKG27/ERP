package com.apex.erp.module.department.dto;

import lombok.Data;

@Data
public class DepartmentDto {
    private Long    id;
    private String  name;
    private String  code;
    private String  programType;
    private Long    hodId;
    private String  hodName;
    private Boolean isActive;
}