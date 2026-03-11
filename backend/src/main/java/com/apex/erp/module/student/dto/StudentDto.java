package com.apex.erp.module.student.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class StudentDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String rollNumber;
    private String registerNumber;
    private Long batchId;
    private Integer currentSemester;
    private BigDecimal currentCgpa;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String phone;
    private String address;
    private String parentName;
    private String parentPhone;
    private String parentEmail;
    private LocalDate admissionDate;
    private Boolean isDetained;
    private String status;
}