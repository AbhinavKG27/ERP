package com.apex.erp.module.attendance.dto;

import lombok.Data;

@Data
public class AttendanceRecordDto {
    private Long   studentId;
    private String studentName;
    private String rollNumber;
    private String status;
}