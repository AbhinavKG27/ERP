package com.apex.erp.module.attendance.controller;

import com.apex.erp.common.ApiResponse;
import com.apex.erp.module.attendance.dto.*;
import com.apex.erp.module.attendance.service.AttendanceService;
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
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
@Tag(name = "Attendance",
     description = "Attendance session and tracking APIs")
public class AttendanceController {

    private final AttendanceService service;
    private final SecurityService   securityService;

    @PostMapping("/sessions")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    @Operation(summary = "Create an attendance session")
    public ResponseEntity<ApiResponse<AttendanceSessionDto>>
            createSession(
            @Valid @RequestBody CreateSessionRequest req) {
        Long userId = securityService.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Session created",
                service.createSession(req, userId)));
    }

    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    @Operation(summary = "Mark attendance for a session")
    public ResponseEntity<ApiResponse<List<AttendanceRecordDto>>>
            markAttendance(
            @Valid @RequestBody MarkAttendanceRequest req) {
        return ResponseEntity.ok(ApiResponse.success(
            "Attendance marked",
            service.markAttendance(req)));
    }

    @PostMapping("/sessions/{id}/finalize")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    @Operation(summary = "Finalize session and update summaries")
    public ResponseEntity<ApiResponse<AttendanceSessionDto>>
            finalize(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
            "Session finalized",
            service.finalizeSession(id)));
    }

    @GetMapping("/student/{studentId}/summary")
    @PreAuthorize("hasAnyRole('ADMIN','HOD','FACULTY','COE') "
                + "or (hasRole('STUDENT') "
                + "and @securityService.isOwnStudent(#studentId))")
    @Operation(summary = "Get student attendance summary")
    public ResponseEntity<ApiResponse<List<AttendanceSummaryDto>>>
            studentSummary(
            @PathVariable Long studentId,
            @RequestParam String academicYear) {
        return ResponseEntity.ok(ApiResponse.success(
            service.getStudentSummary(studentId, academicYear)));
    }

    @GetMapping("/subject/{subjectId}/summary")
    @PreAuthorize("hasAnyRole('ADMIN','HOD','FACULTY','COE')")
    @Operation(summary = "Get all students summary for a subject")
    public ResponseEntity<ApiResponse<List<AttendanceSummaryDto>>>
            subjectSummary(
            @PathVariable Long subjectId,
            @RequestParam String academicYear) {
        return ResponseEntity.ok(ApiResponse.success(
            service.getSubjectSummary(subjectId, academicYear)));
    }

    @PostMapping("/approve")
    @PreAuthorize("hasAnyRole('FACULTY','HOD')")
    @Operation(summary = "Grant attendance approval to student")
    public ResponseEntity<ApiResponse<AttendanceSummaryDto>>
            grantApproval(
            @RequestParam Long studentId,
            @RequestParam Long subjectId,
            @RequestParam String academicYear) {
        return ResponseEntity.ok(ApiResponse.success(
            "Approval granted",
            service.grantApproval(
                studentId, subjectId, academicYear)));
    }
}