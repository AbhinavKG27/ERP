package com.apex.erp.notification.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class NotificationResponse {
    private Long          id;
    private String        title;
    private String        message;
    private String        type;
    private String        targetType;
    private String        targetRole;
    private Long          targetUserId;
    private String        targetUserName;
    private Long          createdById;
    private boolean       broadcast;
    private boolean       read;
    private LocalDateTime createdAt;
}