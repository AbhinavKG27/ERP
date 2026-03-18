package com.apex.erp.module.fee.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateFeeStructureRequest {

    @NotNull(message = "Program ID is required")
    private Long programId;

    @NotBlank(message = "Academic year is required")
    @Pattern(regexp = "^\\d{4}-\\d{2}$",
             message = "Format: 2024-25")
    private String academicYear;

    @NotBlank(message = "Fee type is required")
    @Pattern(regexp = "TUITION|HOSTEL|EXAM|LIBRARY|LAB|FINE",
             message = "Invalid fee type")
    private String feeType;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01",
                message = "Amount must be greater than 0")
    private BigDecimal amount;

    private LocalDate dueDate;
}