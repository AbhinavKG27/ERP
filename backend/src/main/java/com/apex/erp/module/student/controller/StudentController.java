package com.apex.erp.module.student.controller;

import com.apex.erp.common.ApiResponse;
import com.apex.erp.common.PagedResponse;
import com.apex.erp.module.student.dto.CreateStudentRequest;
import com.apex.erp.module.student.dto.StudentDto;
import com.apex.erp.module.student.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Tag(name = "Student", description = "Student management APIs")
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new student")
    public ResponseEntity<ApiResponse<StudentDto>> create(
            @Valid @RequestBody CreateStudentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Student created successfully",
                studentService.createStudent(request)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HOD','FACULTY','COE') "
                + "or (hasRole('STUDENT') "
                + "and @securityService.isOwnStudent(#id))")
    @Operation(summary = "Get student by ID")
    public ResponseEntity<ApiResponse<StudentDto>> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
            ApiResponse.success(
                studentService.getStudentById(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','HOD','COE')")
    @Operation(summary = "Get all students (paginated)")
    public ResponseEntity<PagedResponse<StudentDto>> getAll(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "rollNumber")
                String sort) {
        return ResponseEntity.ok(
            studentService.getAllStudents(page, size, sort));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','HOD','FACULTY','COE')")
    @Operation(summary = "Search students by name or roll number")
    public ResponseEntity<PagedResponse<StudentDto>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
            studentService.searchStudents(query, page, size));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update student status")
    public ResponseEntity<ApiResponse<StudentDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success(
            "Status updated",
            studentService.updateStudentStatus(id, status)));
    }
}
