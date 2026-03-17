package com.apex.erp.module.exam.controller;

import com.apex.erp.common.ApiResponse;
import com.apex.erp.module.exam.dto.*;
import com.apex.erp.module.exam.service.ExamService;
import com.apex.erp.security.SecurityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exams")
@RequiredArgsConstructor
@Tag(name = "Exams & Marks", description = "Exam scheduling and marks processing APIs")
public class ExamController {

    private final ExamService service;
    private final SecurityService securityService;

    @PostMapping
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN','COE')")
    @Operation(summary = "Create exam definition")
    public ResponseEntity<ApiResponse<ExamDto>> createExam(@Valid @RequestBody CreateExamRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Exam created", service.createExam(req, securityService.getCurrentUserId())));
    }

    @PostMapping("/marks")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN','COE')")
    @Operation(summary = "Create or update marks entries")
    public ResponseEntity<ApiResponse<List<MarksEntryDto>>> upsertMarks(@Valid @RequestBody UpsertMarksRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Marks updated",
            service.upsertMarks(req, securityService.getCurrentUserId())));
    }

    @PostMapping("/revaluation")
    @PreAuthorize("hasAnyRole('COE','ADMIN')")
    @Operation(summary = "Apply revaluation if improved marks")
    public ResponseEntity<ApiResponse<StudentResultDto>> revaluation(@Valid @RequestBody RevaluationRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Revaluation updated", service.revaluate(req)));
    }

    @GetMapping("/students/{studentId}/results")
    @PreAuthorize("hasAnyRole('ADMIN','COE','HOD','FACULTY') or (hasRole('STUDENT') and @securityService.isOwnStudent(#studentId))")
    @Operation(summary = "Get student results by academic year and semester")
    public ResponseEntity<ApiResponse<List<StudentResultDto>>> getStudentResults(
        @PathVariable Long studentId,
        @RequestParam String academicYear,
        @RequestParam Integer semesterNumber
    ) {
        return ResponseEntity.ok(ApiResponse.success(service.getStudentResults(studentId, academicYear, semesterNumber)));
    }
}
