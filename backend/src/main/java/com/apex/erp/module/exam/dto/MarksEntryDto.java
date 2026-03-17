package com.apex.erp.module.exam.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MarksEntryDto {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private BigDecimal marksObtained;
    private Boolean isAbsent;
    private Boolean isMalpractice;
}
