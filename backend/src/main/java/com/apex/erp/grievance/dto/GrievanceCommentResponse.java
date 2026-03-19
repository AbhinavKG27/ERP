// GrievanceCommentResponse.java
package com.apex.erp.grievance.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class GrievanceCommentResponse {
    private Long id;
    private Long commenterId;
    private String commenterName;
    private String comment;
    private LocalDateTime commentedAt;
}