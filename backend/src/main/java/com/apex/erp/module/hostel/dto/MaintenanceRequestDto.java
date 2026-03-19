package com.apex.erp.module.hostel.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MaintenanceRequestDto {
    private Long          id;
    private Long          studentId;
    private String        studentName;
    private Long          roomId;
    private String        roomNumber;
    private String        issueType;
    private String        description;
    private String        status;
    private LocalDateTime raisedAt;
    private LocalDateTime resolvedAt;
}