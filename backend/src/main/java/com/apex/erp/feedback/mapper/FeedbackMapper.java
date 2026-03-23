package com.apex.erp.feedback.mapper;

import com.apex.erp.feedback.dto.FeedbackFormResponse;
import com.apex.erp.feedback.dto.FeedbackResponseDto;
import com.apex.erp.feedback.entity.FeedbackForm;
import com.apex.erp.feedback.entity.FeedbackResponse;
import org.hibernate.LazyInitializationException;
import org.springframework.stereotype.Component;

@Component
public class FeedbackMapper {

    public FeedbackFormResponse toFormResponse(FeedbackForm f) {
        if (f == null) return null;

        int responseCount = 0;
        try {
            responseCount = f.getResponses() != null
                ? f.getResponses().size() : 0;
        } catch (LazyInitializationException ex) {
            responseCount = 0;
        }

        return FeedbackFormResponse.builder()
            .id(f.getId())
            .title(f.getTitle())
            .description(f.getDescription())
            .facultyId(f.getFaculty() != null
                ? f.getFaculty().getId() : null)
            .facultyName(f.getFaculty() != null
                ? f.getFaculty().getFullName() : null)
            .departmentId(f.getDepartment() != null
                ? f.getDepartment().getId() : null)
            .departmentName(f.getDepartment() != null
                ? f.getDepartment().getName() : null)
            .academicYear(f.getAcademicYear())
            .semester(f.getSemester())
            .status(f.getStatus())
            .deadline(f.getDeadline())
            .createdById(f.getCreatedBy() != null
                ? f.getCreatedBy().getId() : null)
            .createdAt(f.getCreatedAt())
            .responseCount(responseCount)
            .build();
    }

    public FeedbackResponseDto toResponseDto(FeedbackResponse r) {
        if (r == null) return null;
        return FeedbackResponseDto.builder()
            .id(r.getId())
            .formId(r.getForm() != null
                ? r.getForm().getId() : null)
            .studentId(Boolean.TRUE.equals(r.getAnonymous())
                ? null
                : (r.getStudent() != null
                    ? r.getStudent().getId() : null))
            .studentName(Boolean.TRUE.equals(r.getAnonymous())
                ? "Anonymous"
                : (r.getStudent() != null
                    ? r.getStudent().getFullName() : null))
            .anonymous(Boolean.TRUE.equals(r.getAnonymous()))
            .teachingRating(r.getTeachingRating())
            .knowledgeRating(r.getKnowledgeRating())
            .communicationRating(r.getCommunicationRating())
            .punctualityRating(r.getPunctualityRating())
            .overallRating(r.getOverallRating())
            .comments(r.getComments())
            .submittedAt(r.getSubmittedAt())
            .build();
    }
}