package com.apex.erp.module.student.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateStudentRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Roll number is required")
    @Pattern(regexp = "^[A-Z0-9]{6,20}$",
             message = "Roll number must be 6-20 uppercase alphanumeric")
    private String rollNumber;

    @NotBlank(message = "Register number is required")
    private String registerNumber;

    @NotNull(message = "Batch ID is required")
    private Long batchId;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "MALE|FEMALE|OTHER",
             message = "Gender must be MALE, FEMALE, or OTHER")
    private String gender;

    private String bloodGroup;
    private String phone;
    private String address;
    private String parentName;
    private String parentPhone;
    private String parentEmail;

    @NotNull(message = "Admission date is required")
    private LocalDate admissionDate;
}