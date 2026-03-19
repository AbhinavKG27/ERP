// GrievanceRequest.java
package com.apex.erp.grievance.dto;

import com.apex.erp.grievance.entity.GrievanceCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GrievanceRequest {
    @NotBlank
    private String subject;

    @NotBlank
    private String description;

    @NotNull
    private GrievanceCategory category;

    private boolean anonymous = false;
}