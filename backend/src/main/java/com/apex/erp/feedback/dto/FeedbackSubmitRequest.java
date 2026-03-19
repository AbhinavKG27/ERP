// FeedbackSubmitRequest.java
package com.apex.erp.feedback.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FeedbackSubmitRequest {
    private Long studentId;
    private boolean anonymous = false;

    @NotNull @Min(1) @Max(5)
    private Integer teachingRating;

    @NotNull @Min(1) @Max(5)
    private Integer knowledgeRating;

    @NotNull @Min(1) @Max(5)
    private Integer communicationRating;

    @NotNull @Min(1) @Max(5)
    private Integer punctualityRating;

    @NotNull @Min(1) @Max(5)
    private Integer overallRating;

    private String comments;
}