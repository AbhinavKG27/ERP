package com.apex.erp.module.hostel.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateRoomRequest {

    @NotNull(message = "Block ID is required")
    private Long blockId;

    @NotBlank(message = "Room number is required")
    private String roomNumber;

    @NotBlank
    @Pattern(regexp = "SINGLE|DOUBLE|TRIPLE",
             message = "Type must be SINGLE, DOUBLE, or TRIPLE")
    private String roomType;

    @NotNull @Min(1) @Max(4)
    private Integer capacity;

    private Integer floorNumber;
}