package com.apex.erp.module.department.controller;

import com.apex.erp.common.ApiResponse;
import com.apex.erp.module.department.dto.*;
import com.apex.erp.module.department.service.DepartmentService;
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
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Department", description = "Department, Program, Batch, Subject APIs")
public class DepartmentController {

    private final DepartmentService service;

    // ── DEPARTMENT ────────────────────────────────────────────

    @PostMapping("/departments")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create department")
    public ResponseEntity<ApiResponse<DepartmentDto>> create(
            @Valid @RequestBody CreateDepartmentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Department created", service.createDepartment(req)));
    }

    @GetMapping("/departments")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get all active departments")
    public ResponseEntity<ApiResponse<List<DepartmentDto>>> getAll() {
        return ResponseEntity.ok(
            ApiResponse.success(service.getAllDepartments()));
    }

    @GetMapping("/departments/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get department by ID")
    public ResponseEntity<ApiResponse<DepartmentDto>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success(service.getDepartmentById(id)));
    }

    @PatchMapping("/departments/{id}/hod/{hodId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign HOD to department")
    public ResponseEntity<ApiResponse<DepartmentDto>> assignHod(
            @PathVariable Long id,
            @PathVariable Long hodId) {
        return ResponseEntity.ok(ApiResponse.success(
            "HOD assigned", service.assignHod(id, hodId)));
    }

    // ── PROGRAM ───────────────────────────────────────────────

    @PostMapping("/programs")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create program")
    public ResponseEntity<ApiResponse<ProgramDto>> createProgram(
            @Valid @RequestBody CreateProgramRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Program created", service.createProgram(req)));
    }

    @GetMapping("/programs")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get all programs")
    public ResponseEntity<ApiResponse<List<ProgramDto>>> getAllPrograms() {
        return ResponseEntity.ok(
            ApiResponse.success(service.getAllPrograms()));
    }

    @GetMapping("/departments/{id}/programs")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get programs by department")
    public ResponseEntity<ApiResponse<List<ProgramDto>>> byDept(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success(
                service.getProgramsByDepartment(id)));
    }

    // ── BATCH ─────────────────────────────────────────────────

    @PostMapping("/batches")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create batch")
    public ResponseEntity<ApiResponse<BatchDto>> createBatch(
            @Valid @RequestBody CreateBatchRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Batch created", service.createBatch(req)));
    }

    @GetMapping("/departments/{id}/batches")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get batches by department")
    public ResponseEntity<ApiResponse<List<BatchDto>>> batchByDept(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success(
                service.getBatchesByDepartment(id)));
    }

    @GetMapping("/programs/{id}/batches")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get batches by program")
    public ResponseEntity<ApiResponse<List<BatchDto>>> batchByProgram(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success(
                service.getBatchesByProgram(id)));
    }

    // ── SUBJECT ───────────────────────────────────────────────

    @PostMapping("/subjects")
    @PreAuthorize("hasAnyRole('ADMIN','HOD')")
    @Operation(summary = "Create subject")
    public ResponseEntity<ApiResponse<SubjectDto>> createSubject(
            @Valid @RequestBody CreateSubjectRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Subject created", service.createSubject(req)));
    }

    @GetMapping("/departments/{id}/subjects")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get subjects by department")
    public ResponseEntity<ApiResponse<List<SubjectDto>>> subjectByDept(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success(
                service.getSubjectsByDepartment(id)));
    }

    @GetMapping("/departments/{id}/subjects/semester/{sem}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get subjects by department and semester")
    public ResponseEntity<ApiResponse<List<SubjectDto>>> subjectBySem(
            @PathVariable Long id,
            @PathVariable Integer sem) {
        return ResponseEntity.ok(
            ApiResponse.success(
                service.getSubjectsByDepartmentAndSemester(id, sem)));
    }
}