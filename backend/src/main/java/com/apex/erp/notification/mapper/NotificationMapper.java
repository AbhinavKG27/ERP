package com.apex.erp.notification.mapper;

import com.apex.erp.notification.dto.NotificationResponse;
import com.apex.erp.notification.entity.Notification;
import com.apex.erp.notification.repository.NotificationReadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationMapper {

    private final NotificationReadRepository readRepository;

    public NotificationResponse toResponse(
            Notification n, Long currentUserId) {
        boolean isRead = readRepository
            .existsByNotificationIdAndUserId(
                n.getId(), currentUserId);

        return NotificationResponse.builder()
            .id(n.getId())
            .title(n.getTitle())
            .message(n.getMessage())
            .type(n.getType())
            .targetType(n.getTargetType())
            .targetRole(n.getTargetRole())
            .targetUserId(n.getTargetUser() != null
                ? n.getTargetUser().getId() : null)
            .targetUserName(n.getTargetUser() != null
                ? n.getTargetUser().getFullName() : null)
            .createdById(n.getCreatedBy() != null
                ? n.getCreatedBy().getId() : null)
            .broadcast(Boolean.TRUE.equals(n.getBroadcast()))
            .read(isRead)
            .createdAt(n.getCreatedAt())
            .build();
    }
}