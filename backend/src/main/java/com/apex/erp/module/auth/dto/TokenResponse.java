package com.apex.erp.module.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TokenResponse {
    private String  accessToken;
    private String  refreshToken;
    private String  tokenType;
    private long    expiresIn;       // seconds
    private String  role;
    private Long    userId;
    private String  fullName;
    private String  email;
}