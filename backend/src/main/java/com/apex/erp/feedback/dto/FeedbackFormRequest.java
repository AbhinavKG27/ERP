// FeedbackFormRequest.java
package com.apex.erp.feedback.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FeedbackFormRequest {
    @NotBlank
    private String title;

    private String description;

    @NotNull
    private Long facultyId;

    @NotNull
    private Long departmentId;

    @NotBlank
    private String academicYear;

    @Min(1) @Max(8)
    private Integer semester;

    private LocalDate deadline;
}