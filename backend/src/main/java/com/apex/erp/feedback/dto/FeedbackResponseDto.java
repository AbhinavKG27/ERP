// FeedbackResponseDto.java
package com.apex.erp.feedback.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class FeedbackResponseDto {
    private Long id;
    private Long formId;
    private Long studentId;
    private String studentName;
    private boolean anonymous;
    private Integer teachingRating;
    private Integer knowledgeRating;
    private Integer communicationRating;
    private Integer punctualityRating;
    private Integer overallRating;
    private String comments;
    private LocalDateTime submittedAt;
}