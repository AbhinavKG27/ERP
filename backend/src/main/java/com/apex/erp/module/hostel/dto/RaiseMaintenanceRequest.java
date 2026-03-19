package com.apex.erp.module.hostel.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RaiseMaintenanceRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Room ID is required")
    private Long roomId;

    @NotBlank
    @Pattern(regexp = "PLUMBING|ELECTRICAL|FURNITURE|OTHER",
             message = "Invalid issue type")
    private String issueType;

    @NotBlank(message = "Description is required")
    private String description;
}