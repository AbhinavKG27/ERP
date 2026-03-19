package com.apex.erp.grievance.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class GrievanceResponse {
    private Long   id;
    private Long   studentId;
    private String studentName;
    private Long   assignedFacultyId;
    private String assignedFacultyName;
    private Long   hodId;
    private String hodName;
    private String subject;
    private String description;
    private String category;
    private String status;
    private boolean anonymous;
    private LocalDateTime submittedAt;
    private LocalDateTime assignedAt;
    private LocalDateTime escalatedAt;
    private LocalDateTime resolvedAt;
    private String resolutionNote;
    private List<GrievanceCommentResponse> comments;
}