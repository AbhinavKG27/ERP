package com.apex.erp.feedback.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder
public class FeedbackFormResponse {
    private Long          id;
    private String        title;
    private String        description;
    private Long          facultyId;
    private String        facultyName;
    private Long          departmentId;
    private String        departmentName;
    private String        academicYear;
    private Integer       semester;
    private String        status;
    private LocalDate     deadline;
    private Long          createdById;
    private LocalDateTime createdAt;
    private int           responseCount;
}