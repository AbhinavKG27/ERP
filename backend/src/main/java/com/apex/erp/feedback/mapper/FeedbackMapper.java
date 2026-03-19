package com.apex.erp.feedback.mapper;

import com.apex.erp.feedback.dto.FeedbackFormResponse;
import com.apex.erp.feedback.dto.FeedbackResponseDto;
import com.apex.erp.feedback.entity.FeedbackForm;
import com.apex.erp.feedback.entity.FeedbackResponse;
import org.springframework.stereotype.Component;

@Component
public class FeedbackMapper {

    public FeedbackFormResponse toFormResponse(FeedbackForm f) {
        return FeedbackFormResponse.builder()
            .id(f.getId())
            .title(f.getTitle())
            .description(f.getDescription())
            .facultyId(f.getFaculty().getId())
            .facultyName(f.getFaculty().getFullName())
            .departmentId(f.getDepartment().getId())
            .departmentName(f.getDepartment().getName())
            .academicYear(f.getAcademicYear())
            .semester(f.getSemester())
            .status(f.getStatus())
            .deadline(f.getDeadline())
            .createdById(f.getCreatedBy().getId())
            .createdAt(f.getCreatedAt())
            .responseCount(f.getResponses().size())
            .build();
    }

    public FeedbackResponseDto toResponseDto(FeedbackResponse r) {
        return FeedbackResponseDto.builder()
            .id(r.getId())
            .formId(r.getForm().getId())
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