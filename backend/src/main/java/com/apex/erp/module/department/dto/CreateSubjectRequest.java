package com.apex.erp.module.department.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateSubjectRequest {

    @NotBlank(message = "Subject name is required")
    private String name;

    @NotBlank(message = "Subject code is required")
    @Pattern(regexp = "^[A-Z0-9]{3,20}$",
             message = "Code must be uppercase alphanumeric")
    private String code;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull @Min(1) @Max(10)
    private Integer semesterNumber;

    @NotNull @Min(1) @Max(6)
    private Integer credits;

    @Pattern(regexp = "THEORY|LAB|ELECTIVE",
             message = "Type must be THEORY, LAB, or ELECTIVE")
    private String subjectType;
}