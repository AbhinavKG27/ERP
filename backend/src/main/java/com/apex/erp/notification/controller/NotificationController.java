package com.apex.erp.notification.controller;

import com.apex.erp.common.ApiResponse;
import com.apex.erp.notification.dto.NotificationRequest;
import com.apex.erp.notification.dto.NotificationResponse;
import com.apex.erp.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification",
     description = "Notification management APIs")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send/{createdById}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<NotificationResponse>> send(
            @PathVariable Long createdById,
            @Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Notification sent",
                notificationService.createNotification(
                    createdById, request)));
    }

    @PostMapping("/broadcast/{createdById}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<NotificationResponse>>
            broadcast(
            @PathVariable Long createdById,
            @Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Broadcast sent",
                notificationService.broadcastToAll(
                    createdById, request)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>>
            getAll(@RequestParam Long requesterId) {
        return ResponseEntity.ok(ApiResponse.success(
            notificationService.getAll(requesterId)));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>>
            getForUser(
            @PathVariable Long userId,
            @RequestParam String role) {
        return ResponseEntity.ok(ApiResponse.success(
            notificationService.getNotificationsForUser(
                userId, role)));
    }

    @GetMapping("/user/{userId}/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @PathVariable Long userId,
            @RequestParam String role) {
        return ResponseEntity.ok(Map.of("unreadCount",
            notificationService.countUnread(userId, role)));
    }

    @PutMapping("/{notificationId}/read/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long notificationId,
            @PathVariable Long userId) {
        notificationService.markAsRead(notificationId, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/user/{userId}/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAllAsRead(
            @PathVariable Long userId,
            @RequestParam String role) {
        notificationService.markAllAsRead(userId, role);
        return ResponseEntity.noContent().build();
    }
}