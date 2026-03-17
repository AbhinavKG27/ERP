package com.apex.erp.module.exam.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class MarkEntryRequest {

    @NotNull
    private Long studentId;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal marksObtained;

    private Boolean isAbsent = false;

    private Boolean isMalpractice = false;
}
