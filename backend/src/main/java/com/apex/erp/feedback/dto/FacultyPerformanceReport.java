// FacultyPerformanceReport.java
package com.apex.erp.feedback.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class FacultyPerformanceReport {
    private Long facultyId;
    private String facultyName;
    private Long totalResponses;
    private Double avgTeachingRating;
    private Double avgKnowledgeRating;
    private Double avgCommunicationRating;
    private Double avgPunctualityRating;
    private Double avgOverallRating;
}