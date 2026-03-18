package com.apex.erp.module.fee.controller;

import com.apex.erp.common.ApiResponse;
import com.apex.erp.module.fee.dto.*;
import com.apex.erp.module.fee.entity.InstallmentPlan;
import com.apex.erp.module.fee.service.FeeService;
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
@RequestMapping("/api/v1/fees")
@RequiredArgsConstructor
@Tag(name = "Fee", description = "Fee management APIs")
public class FeeController {

    private final FeeService feeService;

    // ── Fee Structure ─────────────────────────────────────────

    @PostMapping("/structures")
    @PreAuthorize("hasAnyRole('ADMIN','FINANCE')")
    @Operation(summary = "Create fee structure for a program")
    public ResponseEntity<ApiResponse<FeeStructureDto>>
            createStructure(
            @Valid @RequestBody CreateFeeStructureRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Fee structure created",
                feeService.createFeeStructure(req)));
    }

    @GetMapping("/structures/program/{programId}")
    @PreAuthorize("hasAnyRole('ADMIN','FINANCE','HOD')")
    @Operation(summary = "Get fee structures by program")
    public ResponseEntity<ApiResponse<List<FeeStructureDto>>>
            getStructures(
            @PathVariable Long programId,
            @RequestParam String academicYear) {
        return ResponseEntity.ok(ApiResponse.success(
            feeService.getFeeStructures(programId, academicYear)));
    }

    // ── Student Fee ───────────────────────────────────────────

    @PostMapping("/assign")
    @PreAuthorize("hasAnyRole('ADMIN','FINANCE')")
    @Operation(summary = "Assign fee to student")
    public ResponseEntity<ApiResponse<StudentFeeRecordDto>>
            assignFee(
            @Valid @RequestBody AssignFeeRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Fee assigned",
                feeService.assignFeeToStudent(req)));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','FINANCE') "
                + "or (hasRole('STUDENT') "
                + "and @securityService.isOwnStudent(#studentId))")
    @Operation(summary = "Get student fee records")
    public ResponseEntity<ApiResponse<List<StudentFeeRecordDto>>>
            getStudentFees(
            @PathVariable Long studentId,
            @RequestParam String academicYear) {
        return ResponseEntity.ok(ApiResponse.success(
            feeService.getStudentFees(studentId, academicYear)));
    }

    // ── Payments ──────────────────────────────────────────────

    @PostMapping("/pay")
    @PreAuthorize("hasAnyRole('ADMIN','FINANCE')")
    @Operation(summary = "Make a fee payment")
    public ResponseEntity<ApiResponse<FeePaymentDto>> pay(
            @Valid @RequestBody MakePaymentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Payment successful",
                feeService.makePayment(req)));
    }

    @GetMapping("/student/{studentId}/payments")
    @PreAuthorize("hasAnyRole('ADMIN','FINANCE') "
                + "or (hasRole('STUDENT') "
                + "and @securityService.isOwnStudent(#studentId))")
    @Operation(summary = "Get student payment history")
    public ResponseEntity<ApiResponse<List<FeePaymentDto>>>
            getPayments(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(
            feeService.getPaymentHistory(studentId)));
    }

    // ── Installments ──────────────────────────────────────────

    @PostMapping("/installments")
    @PreAuthorize("hasAnyRole('ADMIN','FINANCE')")
    @Operation(summary = "Create installment plan")
    public ResponseEntity<ApiResponse<List<InstallmentPlan>>>
            createInstallments(
            @Valid @RequestBody CreateInstallmentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Installment plan created",
                feeService.createInstallmentPlan(req)));
    }

    // ── Attendance Fine ───────────────────────────────────────

    @PostMapping("/fine/attendance")
    @PreAuthorize("hasAnyRole('ADMIN','FINANCE')")
    @Operation(summary = "Generate attendance fine for student")
    public ResponseEntity<ApiResponse<StudentFeeRecordDto>>
            generateFine(
            @RequestParam Long studentId,
            @RequestParam Long feeStructureId,
            @RequestParam String academicYear) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Attendance fine generated",
                feeService.generateAttendanceFine(
                    studentId, feeStructureId, academicYear)));
    }
}