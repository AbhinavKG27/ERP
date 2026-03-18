package com.apex.erp.module.fee.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AssignFeeRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Fee structure ID is required")
    private Long feeStructureId;

    @NotBlank(message = "Academic year is required")
    @Pattern(regexp = "^\\d{4}-\\d{2}$",
             message = "Format: 2024-25")
    private String academicYear;
}