package com.apex.erp.module.exam.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class StudentResultDto {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Long subjectId;
    private String subjectName;
    private String academicYear;
    private Integer semesterNumber;
    private BigDecimal cia1Marks;
    private BigDecimal cia2Marks;
    private BigDecimal internalMarks;
    private BigDecimal externalMarks;
    private BigDecimal combinedMarks;
    private String gradeLetter;
    private Integer gradePoint;
    private Boolean isPass;
    private Boolean isBacklog;
}
