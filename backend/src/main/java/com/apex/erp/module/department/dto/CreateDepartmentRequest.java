package com.apex.erp.module.department.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateDepartmentRequest {

    @NotBlank(message = "Department name is required")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "Department code is required")
    @Size(max = 10)
    @Pattern(regexp = "^[A-Z]{2,10}$",
             message = "Code must be 2-10 uppercase letters")
    private String code;

    @NotBlank(message = "Program type is required")
    @Pattern(regexp = "UG|PG|BOTH",
             message = "Program type must be UG, PG, or BOTH")
    private String programType;

    private Long hodId;
}