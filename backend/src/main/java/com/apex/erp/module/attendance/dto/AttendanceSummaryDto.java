package com.apex.erp.module.attendance.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AttendanceSummaryDto {
    private Long       studentId;
    private String     studentName;
    private String     rollNumber;
    private Long       subjectId;
    private String     subjectName;
    private String     academicYear;
    private Integer    semesterNumber;
    private Integer    totalSessions;
    private Integer    attendedSessions;
    private BigDecimal percentage;
    private String     eligibilityStatus;
    private Boolean    approvalGranted;
}