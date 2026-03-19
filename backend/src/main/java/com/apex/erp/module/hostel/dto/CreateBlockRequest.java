package com.apex.erp.module.hostel.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateBlockRequest {

    @NotBlank(message = "Block name is required")
    private String name;

    @NotBlank
    @Pattern(regexp = "MALE|FEMALE",
             message = "Gender must be MALE or FEMALE")
    private String gender;

    @NotNull @Min(1)
    private Integer totalRooms;

    private Long wardenId;
}