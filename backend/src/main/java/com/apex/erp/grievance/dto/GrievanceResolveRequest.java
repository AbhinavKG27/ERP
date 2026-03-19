// GrievanceResolveRequest.java
package com.apex.erp.grievance.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GrievanceResolveRequest {
    @NotBlank
    private String resolutionNote;
}