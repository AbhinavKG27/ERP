package com.apex.erp.module.faculty.controller;

import com.apex.erp.common.ApiResponse;
import com.apex.erp.common.PagedResponse;
import com.apex.erp.module.faculty.dto.*;
import com.apex.erp.module.faculty.service.FacultyService;
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
@RequestMapping("/api/v1/faculty")
@RequiredArgsConstructor
@Tag(name = "Faculty", description = "Faculty management APIs")
public class FacultyController {

    private final FacultyService service;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create faculty member")
    public ResponseEntity<ApiResponse<FacultyDto>> create(
            @Valid @RequestBody CreateFacultyRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Faculty created", service.createFaculty(req)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HOD','COE') "
                + "or (hasRole('FACULTY') "
                + "and @securityService.isOwnUser(#id))")
    @Operation(summary = "Get faculty by ID")
    public ResponseEntity<ApiResponse<FacultyDto>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success(service.getFacultyById(id)));
    }

    @GetMapping("/department/{deptId}")
    @PreAuthorize("hasAnyRole('ADMIN','HOD','COE')")
    @Operation(summary = "Get faculty by department (paginated)")
    public ResponseEntity<PagedResponse<FacultyDto>> byDept(
            @PathVariable Long deptId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
            service.getFacultyByDepartment(deptId, page, size));
    }

    @PostMapping("/assign-subject")
    @PreAuthorize("hasAnyRole('ADMIN','HOD')")
    @Operation(summary = "Assign subject to faculty")
    public ResponseEntity<ApiResponse<SubjectAssignmentDto>> assign(
            @Valid @RequestBody AssignSubjectRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Subject assigned",
                service.assignSubject(req)));
    }

    @GetMapping("/{id}/assignments")
    @PreAuthorize("hasAnyRole('ADMIN','HOD') "
                + "or hasRole('FACULTY')")
    @Operation(summary = "Get faculty subject assignments")
    public ResponseEntity<ApiResponse<List<SubjectAssignmentDto>>>
            getAssignments(
            @PathVariable Long id,
            @RequestParam String academicYear) {
        return ResponseEntity.ok(ApiResponse.success(
            service.getFacultyAssignments(id, academicYear)));
    }
}