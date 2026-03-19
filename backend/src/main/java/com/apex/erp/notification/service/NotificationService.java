package com.apex.erp.notification.service;

import com.apex.erp.exception.ResourceNotFoundException;
import com.apex.erp.module.user.entity.User;
import com.apex.erp.module.user.repository.UserRepository;
import com.apex.erp.notification.dto.NotificationRequest;
import com.apex.erp.notification.dto.NotificationResponse;
import com.apex.erp.notification.entity.Notification;
import com.apex.erp.notification.entity.NotificationRead;
import com.apex.erp.notification.mapper.NotificationMapper;
import com.apex.erp.notification.repository.NotificationReadRepository;
import com.apex.erp.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository     notificationRepository;
    private final NotificationReadRepository readRepository;
    private final UserRepository             userRepository;
    private final NotificationMapper         mapper;

    public NotificationResponse createNotification(
            Long createdById, NotificationRequest request) {
        User createdBy = userRepository.findById(createdById)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", createdById));

        User targetUser = null;
        if ("USER".equals(request.getTargetType())
                && request.getTargetUserId() != null) {
            targetUser = userRepository
                .findById(request.getTargetUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "User", "id", request.getTargetUserId()));
        }

        Notification notification = Notification.builder()
            .title(request.getTitle())
            .message(request.getMessage())
            .type(request.getType())
            .targetType(request.getTargetType())
            .targetRole(request.getTargetRole())
            .targetUser(targetUser)
            .createdBy(createdBy)
            .broadcast(request.isBroadcast())
            .build();

        Notification saved = notificationRepository
            .save(notification);
        return mapper.toResponse(saved, createdById);
    }

    public NotificationResponse broadcastToAll(
            Long createdById, NotificationRequest request) {
        request.setTargetType("ALL");
        request.setBroadcast(true);
        return createNotification(createdById, request);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsForUser(
            Long userId, String role) {
        return notificationRepository
            .findAllForUser(userId, role)
            .stream().map(n -> mapper.toResponse(n, userId))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getAll(Long requesterId) {
        return notificationRepository.findAll()
            .stream().map(n -> mapper.toResponse(n, requesterId))
            .toList();
    }

    public void markAsRead(Long notificationId, Long userId) {
        if (readRepository.existsByNotificationIdAndUserId(
                notificationId, userId)) return;

        Notification notification = notificationRepository
            .findById(notificationId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Notification", "id", notificationId));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", userId));

        readRepository.save(NotificationRead.builder()
            .notification(notification)
            .user(user)
            .build());
    }

    public void markAllAsRead(Long userId, String role) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", userId));

        notificationRepository.findAllForUser(userId, role)
            .forEach(n -> {
                if (!readRepository
                        .existsByNotificationIdAndUserId(
                            n.getId(), userId)) {
                    readRepository.save(
                        NotificationRead.builder()
                            .notification(n)
                            .user(user)
                            .build());
                }
            });
    }

    @Transactional(readOnly = true)
    public long countUnread(Long userId, String role) {
        return notificationRepository
            .findAllForUser(userId, role)
            .stream()
            .filter(n -> !readRepository
                .existsByNotificationIdAndUserId(
                    n.getId(), userId))
            .count();
    }
}