package com.apex.erp.module.faculty.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateFacultyRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank @Email
    private String email;

    @NotBlank(message = "Employee ID is required")
    @Pattern(regexp = "^[A-Z0-9]{4,20}$",
             message = "Employee ID must be uppercase alphanumeric")
    private String employeeId;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotBlank(message = "Designation is required")
    private String designation;

    private String specialization;
    private String qualification;
    private String phone;

    @NotNull(message = "Joining date is required")
    @PastOrPresent
    private LocalDate joiningDate;
}