package com.apex.erp.module.attendance.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AttendanceSessionDto {
    private Long      id;
    private Long      facultyId;
    private String    facultyName;
    private Long      subjectId;
    private String    subjectName;
    private String    subjectCode;
    private Long      batchId;
    private String    batchInfo;
    private LocalDate sessionDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String    academicYear;
    private Integer   semesterNumber;
    private Boolean   isFinalized;
}