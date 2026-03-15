package com.apex.erp.module.attendance.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Map;

@Data
public class MarkAttendanceRequest {

    @NotNull(message = "Session ID is required")
    private Long sessionId;

    // Map of studentId -> status (PRESENT/ABSENT/OD/ML)
    @NotNull(message = "Attendance map is required")
    private Map<Long, String> attendanceMap;
}