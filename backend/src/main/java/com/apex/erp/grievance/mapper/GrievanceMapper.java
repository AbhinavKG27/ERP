package com.apex.erp.grievance.mapper;

import com.apex.erp.grievance.dto.GrievanceCommentResponse;
import com.apex.erp.grievance.dto.GrievanceResponse;
import com.apex.erp.grievance.entity.Grievance;
import com.apex.erp.grievance.entity.GrievanceComment;
import org.springframework.stereotype.Component;

@Component
public class GrievanceMapper {

    public GrievanceResponse toResponse(Grievance g) {
        return GrievanceResponse.builder()
            .id(g.getId())
            .studentId(Boolean.TRUE.equals(g.getAnonymous())
                ? null : g.getStudent().getId())
            .studentName(Boolean.TRUE.equals(g.getAnonymous())
                ? "Anonymous" : g.getStudent().getFullName())
            .assignedFacultyId(g.getAssignedFaculty() != null
                ? g.getAssignedFaculty().getId() : null)
            .assignedFacultyName(g.getAssignedFaculty() != null
                ? g.getAssignedFaculty().getFullName() : null)
            .hodId(g.getHod() != null
                ? g.getHod().getId() : null)
            .hodName(g.getHod() != null
                ? g.getHod().getFullName() : null)
            .subject(g.getSubject())
            .description(g.getDescription())
            .category(g.getCategory())
            .status(g.getStatus())
            .anonymous(Boolean.TRUE.equals(g.getAnonymous()))
            .submittedAt(g.getSubmittedAt())
            .assignedAt(g.getAssignedAt())
            .escalatedAt(g.getEscalatedAt())
            .resolvedAt(g.getResolvedAt())
            .resolutionNote(g.getResolutionNote())
            .comments(g.getComments().stream()
                .map(this::toCommentResponse).toList())
            .build();
    }

    public GrievanceCommentResponse toCommentResponse(
            GrievanceComment c) {
        return GrievanceCommentResponse.builder()
            .id(c.getId())
            .commenterId(c.getCommenter().getId())
            .commenterName(c.getCommenter().getFullName())
            .comment(c.getComment())
            .commentedAt(c.getCommentedAt())
            .build();
    }
}