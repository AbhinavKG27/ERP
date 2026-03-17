package com.apex.erp.module.exam.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExamDto {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private Long batchId;
    private Long facultyId;
    private String examType;
    private LocalDate examDate;
    private BigDecimal maxMarks;
    private String academicYear;
    private Integer semesterNumber;
    private String status;
}
