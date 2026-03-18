package com.apex.erp.module.fee.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FeeStructureDto {
    private Long       id;
    private Long       programId;
    private String     programName;
    private String     academicYear;
    private String     feeType;
    private BigDecimal amount;
    private LocalDate  dueDate;
    private Boolean    isActive;
}