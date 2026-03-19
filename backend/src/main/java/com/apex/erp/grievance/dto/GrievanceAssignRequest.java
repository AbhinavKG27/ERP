// GrievanceAssignRequest.java
package com.apex.erp.grievance.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GrievanceAssignRequest {
    @NotNull
    private Long facultyId;
}