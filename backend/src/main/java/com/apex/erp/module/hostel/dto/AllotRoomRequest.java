package com.apex.erp.module.hostel.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AllotRoomRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Room ID is required")
    private Long roomId;

    @NotBlank
    @Pattern(regexp = "^\\d{4}-\\d{2}$",
             message = "Format: 2024-25")
    private String academicYear;

    @NotNull
    private LocalDate allotmentDate;
}