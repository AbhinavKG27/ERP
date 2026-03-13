package com.apex.erp.module.faculty.dto;

import lombok.Data;

@Data
public class SubjectAssignmentDto {
    private Long   facultyId;
    private String facultyName;
    private Long   subjectId;
    private String subjectName;
    private String subjectCode;
    private Long   batchId;
    private String batchInfo;
    private String academicYear;
    private Integer semesterNumber;
}