package com.apex.erp.module.hostel.controller;

import com.apex.erp.common.ApiResponse;
import com.apex.erp.module.hostel.dto.*;
import com.apex.erp.module.hostel.service.HostelService;
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
@RequestMapping("/api/v1/hostel")
@RequiredArgsConstructor
@Tag(name = "Hostel", description = "Hostel management APIs")
public class HostelController {

    private final HostelService   hostelService;
    private final SecurityService securityService;

    @PostMapping("/blocks")
    @PreAuthorize("hasAnyRole('ADMIN','HOSTEL_WARDEN')")
    @Operation(summary = "Create hostel block")
    public ResponseEntity<ApiResponse<HostelBlockDto>> createBlock(
            @Valid @RequestBody CreateBlockRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Block created",
                hostelService.createBlock(req)));
    }

    @GetMapping("/blocks")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get all hostel blocks")
    public ResponseEntity<ApiResponse<List<HostelBlockDto>>>
            getAllBlocks() {
        return ResponseEntity.ok(ApiResponse.success(
            hostelService.getAllBlocks()));
    }

    @PostMapping("/rooms")
    @PreAuthorize("hasAnyRole('ADMIN','HOSTEL_WARDEN')")
    @Operation(summary = "Create hostel room")
    public ResponseEntity<ApiResponse<HostelRoomDto>> createRoom(
            @Valid @RequestBody CreateRoomRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Room created",
                hostelService.createRoom(req)));
    }

    @GetMapping("/blocks/{blockId}/rooms")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get rooms by block")
    public ResponseEntity<ApiResponse<List<HostelRoomDto>>>
            getRooms(@PathVariable Long blockId) {
        return ResponseEntity.ok(ApiResponse.success(
            hostelService.getRoomsByBlock(blockId)));
    }

    @GetMapping("/rooms/available")
    @PreAuthorize("hasAnyRole('ADMIN','HOSTEL_WARDEN')")
    @Operation(summary = "Get available rooms by gender")
    public ResponseEntity<ApiResponse<List<HostelRoomDto>>>
            getAvailable(@RequestParam String gender) {
        return ResponseEntity.ok(ApiResponse.success(
            hostelService.getAvailableRooms(gender)));
    }

    @PostMapping("/allot")
    @PreAuthorize("hasAnyRole('ADMIN','HOSTEL_WARDEN')")
    @Operation(summary = "Allot room to student")
    public ResponseEntity<ApiResponse<AllotmentDto>> allot(
            @Valid @RequestBody AllotRoomRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Room allotted",
                hostelService.allotRoom(req)));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','HOSTEL_WARDEN') "
                + "or (hasRole('STUDENT') "
                + "and @securityService.isOwnStudent(#studentId))")
    @Operation(summary = "Get student room allotment")
    public ResponseEntity<ApiResponse<AllotmentDto>>
            getStudentRoom(
            @PathVariable Long studentId,
            @RequestParam String academicYear) {
        return ResponseEntity.ok(ApiResponse.success(
            hostelService.getStudentAllotment(
                studentId, academicYear)));
    }

    @PatchMapping("/allotments/{id}/vacate")
    @PreAuthorize("hasAnyRole('ADMIN','HOSTEL_WARDEN')")
    @Operation(summary = "Vacate room")
    public ResponseEntity<ApiResponse<AllotmentDto>> vacate(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
            "Room vacated", hostelService.vacateRoom(id)));
    }

    @PostMapping("/maintenance")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN','HOSTEL_WARDEN')")
    @Operation(summary = "Raise maintenance request")
    public ResponseEntity<ApiResponse<MaintenanceRequestDto>>
            raiseRequest(
            @Valid @RequestBody RaiseMaintenanceRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Maintenance request raised",
                hostelService.raiseRequest(req)));
    }

    @GetMapping("/maintenance/open")
    @PreAuthorize("hasAnyRole('ADMIN','HOSTEL_WARDEN')")
    @Operation(summary = "Get all open maintenance requests")
    public ResponseEntity<ApiResponse<List<MaintenanceRequestDto>>>
            getOpenRequests() {
        return ResponseEntity.ok(ApiResponse.success(
            hostelService.getOpenRequests()));
    }

    @PatchMapping("/maintenance/{id}/resolve")
    @PreAuthorize("hasAnyRole('ADMIN','HOSTEL_WARDEN')")
    @Operation(summary = "Resolve maintenance request")
    public ResponseEntity<ApiResponse<MaintenanceRequestDto>>
            resolve(@PathVariable Long id) {
        Long userId = securityService.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(
            "Request resolved",
            hostelService.resolveRequest(id, userId)));
    }
}