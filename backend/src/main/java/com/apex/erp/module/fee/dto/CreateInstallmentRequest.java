package com.apex.erp.module.fee.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreateInstallmentRequest {

    @NotNull(message = "Student fee record ID is required")
    private Long studentFeeId;

    @NotEmpty(message = "Installments list is required")
    private List<InstallmentItem> installments;

    @Data
    public static class InstallmentItem {
        @NotNull private Integer installmentNumber;
        @NotNull private BigDecimal amount;
        @NotNull private LocalDate dueDate;
    }
}