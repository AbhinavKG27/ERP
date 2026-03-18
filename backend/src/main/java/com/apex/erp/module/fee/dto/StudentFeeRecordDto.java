package com.apex.erp.module.fee.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class StudentFeeRecordDto {
    private Long       id;
    private Long       studentId;
    private String     studentName;
    private String     rollNumber;
    private String     feeType;
    private String     academicYear;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal balanceAmount;
    private String     status;
}