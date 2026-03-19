package com.apex.erp.notification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class NotificationRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String message;

    @NotBlank
    @Pattern(regexp = "INFO|WARNING|ALERT|SUCCESS")
    private String type;

    @NotNull
    @Pattern(regexp = "ALL|ROLE|USER")
    private String targetType;

    private String  targetRole;
    private Long    targetUserId;
    private boolean broadcast = false;
}