package com.apex.erp.grievance.controller;

import com.apex.erp.common.ApiResponse;
import com.apex.erp.grievance.dto.*;
import com.apex.erp.grievance.service.GrievanceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/grievances")
@RequiredArgsConstructor
@Tag(name = "Grievance", description = "Grievance management APIs")
public class GrievanceController {

    private final GrievanceService grievanceService;

    @PostMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public ResponseEntity<ApiResponse<GrievanceResponse>> submit(
            @PathVariable Long studentId,
            @Valid @RequestBody GrievanceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Grievance submitted",
                grievanceService.submitGrievance(
                    studentId, request)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT','FACULTY','HOD','ADMIN')")
    public ResponseEntity<ApiResponse<GrievanceResponse>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
            grievanceService.getById(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','HOD')")
    public ResponseEntity<ApiResponse<List<GrievanceResponse>>>
            getAll() {
        return ResponseEntity.ok(ApiResponse.success(
            grievanceService.getAll()));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public ResponseEntity<ApiResponse<List<GrievanceResponse>>>
            getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(
            grievanceService.getByStudent(studentId)));
    }

    @GetMapping("/faculty/{facultyId}")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public ResponseEntity<ApiResponse<List<GrievanceResponse>>>
            getByFaculty(@PathVariable Long facultyId) {
        return ResponseEntity.ok(ApiResponse.success(
            grievanceService.getByFaculty(facultyId)));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN','HOD')")
    public ResponseEntity<ApiResponse<GrievanceResponse>> assign(
            @PathVariable Long id,
            @Valid @RequestBody GrievanceAssignRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
            "Assigned",
            grievanceService.assignGrievance(id, request)));
    }

    @PutMapping("/{id}/escalate/{hodId}")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public ResponseEntity<ApiResponse<GrievanceResponse>> escalate(
            @PathVariable Long id,
            @PathVariable Long hodId) {
        return ResponseEntity.ok(ApiResponse.success(
            "Escalated",
            grievanceService.escalateGrievance(id, hodId)));
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('FACULTY','HOD','ADMIN')")
    public ResponseEntity<ApiResponse<GrievanceResponse>> resolve(
            @PathVariable Long id,
            @Valid @RequestBody GrievanceResolveRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
            "Resolved",
            grievanceService.resolveGrievance(id, request)));
    }

    @PostMapping("/{grievanceId}/comments/{commenterId}")
    @PreAuthorize("hasAnyRole('STUDENT','FACULTY','HOD','ADMIN')")
    public ResponseEntity<ApiResponse<GrievanceCommentResponse>>
            addComment(
            @PathVariable Long grievanceId,
            @PathVariable Long commenterId,
            @Valid @RequestBody GrievanceCommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Comment added",
                grievanceService.addComment(
                    grievanceId, commenterId, request)));
    }

    @GetMapping("/{grievanceId}/comments")
    @PreAuthorize("hasAnyRole('STUDENT','FACULTY','HOD','ADMIN')")
    public ResponseEntity<ApiResponse<List<GrievanceCommentResponse>>>
            getComments(@PathVariable Long grievanceId) {
        return ResponseEntity.ok(ApiResponse.success(
            grievanceService.getComments(grievanceId)));
    }
}