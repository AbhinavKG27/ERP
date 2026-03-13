package com.apex.erp.module.department.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateProgramRequest {

    @NotBlank(message = "Program name is required")
    private String name;

    @NotBlank(message = "Program code is required")
    @Pattern(regexp = "^[A-Z_]{3,20}$",
             message = "Code must be uppercase letters and underscores")
    private String code;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull @Min(1) @Max(5)
    private Integer durationYears;

    @NotNull @Min(1) @Max(10)
    private Integer totalSemesters;
}