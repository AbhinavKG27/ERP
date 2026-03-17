package com.apex.erp.module.exam.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RevaluationRequest {

    @NotNull
    private Long examId;

    @NotNull
    private Long studentId;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal newMarks;
}
