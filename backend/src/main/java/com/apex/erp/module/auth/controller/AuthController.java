package com.apex.erp.module.auth.controller;

import com.apex.erp.common.ApiResponse;
import com.apex.erp.module.auth.dto.*;
import com.apex.erp.module.auth.service.AuthService;
import com.apex.erp.security.CustomUserDetails;
import com.apex.erp.security.SecurityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login, logout, token refresh")
public class AuthController {

    private final AuthService     authService;
    private final SecurityService securityService;

    // ── POST /api/v1/auth/login ───────────────────────────────
    @PostMapping("/login")
    @Operation(summary = "Login and receive JWT tokens")
    public ResponseEntity<ApiResponse<TokenResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        TokenResponse token = authService.login(request);
        return ResponseEntity.ok(
            ApiResponse.success("Login successful", token));
    }

    // ── POST /api/v1/auth/refresh ─────────────────────────────
    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using refresh token")
    public ResponseEntity<ApiResponse<TokenResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request) {
        TokenResponse token = authService.refresh(request);
        return ResponseEntity.ok(
            ApiResponse.success("Token refreshed", token));
    }

    // ── POST /api/v1/auth/logout ──────────────────────────────
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Logout and revoke refresh token")
    public ResponseEntity<ApiResponse<Void>> logout() {
        Long userId = securityService.getCurrentUserId();
        authService.logout(userId);
        return ResponseEntity.ok(
            ApiResponse.success("Logged out successfully"));
    }

    // ── POST /api/v1/auth/change-password ────────────────────
    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Change current user password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        Long userId = securityService.getCurrentUserId();
        authService.changePassword(userId, request);
        return ResponseEntity.ok(
            ApiResponse.success("Password changed successfully"));
    }
}