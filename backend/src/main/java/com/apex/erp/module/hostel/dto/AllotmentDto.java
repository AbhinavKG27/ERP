package com.apex.erp.module.hostel.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AllotmentDto {
    private Long      id;
    private Long      studentId;
    private String    studentName;
    private String    rollNumber;
    private Long      roomId;
    private String    roomNumber;
    private String    blockName;
    private String    academicYear;
    private LocalDate allotmentDate;
    private LocalDate vacatingDate;
    private String    status;
}