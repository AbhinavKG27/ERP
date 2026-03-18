package com.apex.erp.module.fee.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class MakePaymentRequest {

    @NotNull(message = "Student fee record ID is required")
    private Long studentFeeId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01",
                message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotBlank(message = "Payment method is required")
    @Pattern(regexp = "ONLINE|CHALLAN|INSTALLMENT",
             message = "Must be ONLINE, CHALLAN, or INSTALLMENT")
    private String paymentMethod;

    private String transactionId;
    private String paymentGateway;
    private String remarks;
}