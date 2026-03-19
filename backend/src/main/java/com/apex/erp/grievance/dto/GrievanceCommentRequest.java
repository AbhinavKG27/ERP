// GrievanceCommentRequest.java
package com.apex.erp.grievance.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GrievanceCommentRequest {
    @NotBlank
    private String comment;
}