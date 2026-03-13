package com.apex.erp.module.faculty.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FacultyDto {
    private Long      id;
    private Long      userId;
    private String    fullName;
    private String    email;
    private String    phone;
    private String    employeeId;
    private Long      departmentId;
    private String    departmentName;
    private String    designation;
    private String    specialization;
    private LocalDate joiningDate;
    private String    qualification;
    private Boolean   isActive;
}