package com.apex.erp.feedback.controller;

import com.apex.erp.common.ApiResponse;
import com.apex.erp.feedback.dto.*;
import com.apex.erp.feedback.service.FeedbackService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/feedback")
@RequiredArgsConstructor
@Tag(name = "Feedback", description = "Feedback management APIs")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/forms/{createdById}")
    @PreAuthorize("hasAnyRole('ADMIN','HOD')")
    public ResponseEntity<ApiResponse<FeedbackFormResponse>>
            createForm(
            @PathVariable Long createdById,
            @Valid @RequestBody FeedbackFormRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Form created",
                feedbackService.createForm(createdById, request)));
    }

    @GetMapping("/forms")
    @PreAuthorize("hasAnyRole('ADMIN','HOD','FACULTY','STUDENT')")
    public ResponseEntity<ApiResponse<List<FeedbackFormResponse>>>
            getAllForms() {
        return ResponseEntity.ok(ApiResponse.success(
            feedbackService.getAllForms()));
    }

    @GetMapping("/forms/{id:\\d+}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<FeedbackFormResponse>>
            getFormById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
            feedbackService.getFormById(id)));
    }

    @GetMapping("/forms/faculty/{facultyId}")
    @PreAuthorize("hasAnyRole('ADMIN','HOD','FACULTY')")
    public ResponseEntity<ApiResponse<List<FeedbackFormResponse>>>
            getByFaculty(@PathVariable Long facultyId) {
        return ResponseEntity.ok(ApiResponse.success(
            feedbackService.getFormsByFaculty(facultyId)));
    }

    @PutMapping("/forms/{id:\\d+}/close")
    @PreAuthorize("hasAnyRole('ADMIN','HOD')")
    public ResponseEntity<ApiResponse<FeedbackFormResponse>>
            closeForm(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
            "Form closed", feedbackService.closeForm(id)));
    }

    @PostMapping("/forms/{formId:\\d+}/submit")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public ResponseEntity<ApiResponse<FeedbackResponseDto>> submit(
            @PathVariable Long formId,
            @Valid @RequestBody FeedbackSubmitRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Feedback submitted",
                feedbackService.submitFeedback(
                    formId, request)));
    }

    @GetMapping("/forms/{formId:\\d+}/responses")
    @PreAuthorize("hasAnyRole('ADMIN','HOD')")
    public ResponseEntity<ApiResponse<List<FeedbackResponseDto>>>
            getResponses(@PathVariable Long formId) {
        return ResponseEntity.ok(ApiResponse.success(
            feedbackService.getResponsesForForm(formId)));
    }

    @GetMapping("/report/faculty/{facultyId}")
    @PreAuthorize("hasAnyRole('ADMIN','HOD','FACULTY')")
    public ResponseEntity<ApiResponse<FacultyPerformanceReport>>
            getFacultyReport(@PathVariable Long facultyId) {
        return ResponseEntity.ok(ApiResponse.success(
            feedbackService.getFacultyReport(facultyId)));
    }
}