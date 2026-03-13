package com.apex.erp.module.department.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateBatchRequest {

    @NotNull(message = "Program ID is required")
    private Long programId;

    @NotNull @Min(2000) @Max(2100)
    private Integer joinYear;

    @NotNull @Min(2000) @Max(2104)
    private Integer graduationYear;

    @Size(max = 5)
    private String section;
}