package com.apex.erp.module.faculty.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AssignSubjectRequest {

    @NotNull private Long facultyId;
    @NotNull private Long subjectId;
    @NotNull private Long batchId;

    @NotBlank
    @Pattern(regexp = "^\\d{4}-\\d{2}$",
             message = "Academic year format: 2024-25")
    private String academicYear;

    @NotNull @Min(1) @Max(10)
    private Integer semesterNumber;
}