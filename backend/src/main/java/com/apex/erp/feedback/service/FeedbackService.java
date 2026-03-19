package com.apex.erp.feedback.service;

import com.apex.erp.exception.ResourceNotFoundException;
import com.apex.erp.feedback.dto.*;
import com.apex.erp.feedback.entity.*;
import com.apex.erp.feedback.mapper.FeedbackMapper;
import com.apex.erp.feedback.repository.*;
import com.apex.erp.module.department.entity.Department;
import com.apex.erp.module.department.repository.DepartmentRepository;
import com.apex.erp.module.user.entity.User;
import com.apex.erp.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FeedbackService {

    private final FeedbackFormRepository     formRepository;
    private final FeedbackResponseRepository responseRepository;
    private final UserRepository             userRepository;
    private final DepartmentRepository       departmentRepository;
    private final FeedbackMapper             mapper;

    public FeedbackFormResponse createForm(
            Long createdById, FeedbackFormRequest request) {
        User faculty = userRepository
            .findById(request.getFacultyId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", request.getFacultyId()));
        Department dept = departmentRepository
            .findById(request.getDepartmentId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Department", "id", request.getDepartmentId()));
        User createdBy = userRepository.findById(createdById)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", createdById));

        FeedbackForm form = FeedbackForm.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .faculty(faculty)
            .department(dept)
            .academicYear(request.getAcademicYear())
            .semester(request.getSemester())
            .deadline(request.getDeadline())
            .createdBy(createdBy)
            .status("ACTIVE")
            .build();

        return mapper.toFormResponse(formRepository.save(form));
    }

    @Transactional(readOnly = true)
    public FeedbackFormResponse getFormById(Long id) {
        return mapper.toFormResponse(findForm(id));
    }

    @Transactional(readOnly = true)
    public List<FeedbackFormResponse> getAllForms() {
        return formRepository.findAll()
            .stream().map(mapper::toFormResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<FeedbackFormResponse> getFormsByFaculty(
            Long facultyId) {
        return formRepository.findByFacultyId(facultyId)
            .stream().map(mapper::toFormResponse).toList();
    }

    public FeedbackFormResponse closeForm(Long formId) {
        FeedbackForm form = findForm(formId);
        form.setStatus("CLOSED");
        return mapper.toFormResponse(formRepository.save(form));
    }

    public FeedbackResponseDto submitFeedback(
            Long formId, FeedbackSubmitRequest request) {
        FeedbackForm form = findForm(formId);

        if ("CLOSED".equals(form.getStatus())) {
            throw new com.apex.erp.exception.BusinessRuleException(
                "FORM_CLOSED", "Feedback form is closed");
        }

        if (!request.isAnonymous()
                && request.getStudentId() != null
                && responseRepository.existsByFormIdAndStudentId(
                    formId, request.getStudentId())) {
            throw new com.apex.erp.exception.BusinessRuleException(
                "ALREADY_SUBMITTED",
                "Student has already submitted feedback");
        }

        User student = null;
        if (!request.isAnonymous()
                && request.getStudentId() != null) {
            student = userRepository
                .findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "User", "id", request.getStudentId()));
        }

        FeedbackResponse response = FeedbackResponse.builder()
            .form(form)
            .student(student)
            .anonymous(request.isAnonymous())
            .teachingRating(request.getTeachingRating())
            .knowledgeRating(request.getKnowledgeRating())
            .communicationRating(request.getCommunicationRating())
            .punctualityRating(request.getPunctualityRating())
            .overallRating(request.getOverallRating())
            .comments(request.getComments())
            .build();

        return mapper.toResponseDto(
            responseRepository.save(response));
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponseDto> getResponsesForForm(
            Long formId) {
        return responseRepository.findByFormId(formId)
            .stream().map(mapper::toResponseDto).toList();
    }

    @Transactional(readOnly = true)
    public FacultyPerformanceReport getFacultyReport(
            Long facultyId) {
        User faculty = userRepository.findById(facultyId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", facultyId));

        return FacultyPerformanceReport.builder()
            .facultyId(facultyId)
            .facultyName(faculty.getFullName())
            .totalResponses(responseRepository
                .countByFaculty(facultyId))
            .avgTeachingRating(round(responseRepository
                .findAvgTeachingRatingByFaculty(facultyId)))
            .avgKnowledgeRating(round(responseRepository
                .findAvgKnowledgeRatingByFaculty(facultyId)))
            .avgCommunicationRating(round(responseRepository
                .findAvgCommunicationRatingByFaculty(facultyId)))
            .avgPunctualityRating(round(responseRepository
                .findAvgPunctualityRatingByFaculty(facultyId)))
            .avgOverallRating(round(responseRepository
                .findAvgOverallRatingByFaculty(facultyId)))
            .build();
    }

    private Double round(Double val) {
        if (val == null) return 0.0;
        return Math.round(val * 100.0) / 100.0;
    }

    private FeedbackForm findForm(Long id) {
        return formRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "FeedbackForm", "id", id));
    }
}