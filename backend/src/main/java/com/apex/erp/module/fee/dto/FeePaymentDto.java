package com.apex.erp.module.fee.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FeePaymentDto {
    private Long          id;
    private Long          studentId;
    private String        studentName;
    private BigDecimal    amount;
    private String        paymentMethod;
    private String        transactionId;
    private String        paymentGateway;
    private String        paymentStatus;
    private LocalDateTime paidAt;
    private String        receiptNumber;
    private String        remarks;
}