package com.apex.erp.module.exam.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateExamRequest {

    @NotNull
    private Long subjectId;

    @NotNull
    private Long batchId;

    @NotBlank
    @Pattern(regexp = "^(CIA1|CIA2|EXTERNAL)$")
    private String examType;

    @NotNull
    private LocalDate examDate;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal maxMarks;

    @NotBlank
    @Pattern(regexp = "^\\d{4}-\\d{2}$")
    private String academicYear;

    @NotNull
    @Min(1)
    @Max(10)
    private Integer semesterNumber;
}
