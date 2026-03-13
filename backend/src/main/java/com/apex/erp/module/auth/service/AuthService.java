package com.apex.erp.module.auth.service;

import com.apex.erp.config.AppProperties;
import com.apex.erp.exception.BusinessRuleException;
import com.apex.erp.exception.ResourceNotFoundException;
import com.apex.erp.module.auth.dto.*;
import com.apex.erp.module.auth.entity.RefreshToken;
import com.apex.erp.module.auth.repository.RefreshTokenRepository;
import com.apex.erp.module.user.entity.User;
import com.apex.erp.module.user.repository.UserRepository;
import com.apex.erp.security.CustomUserDetails;
import com.apex.erp.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager    authManager;
    private final JwtTokenProvider         jwtTokenProvider;
    private final RefreshTokenRepository   refreshTokenRepo;
    private final UserRepository           userRepository;
    private final PasswordEncoder          passwordEncoder;
    private final AppProperties            appProperties;

    // ── Login ─────────────────────────────────────────────────
    @Transactional
    public TokenResponse login(LoginRequest request) {
        // Spring Security handles credential validation
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword()));

        CustomUserDetails userDetails =
            (CustomUserDetails) auth.getPrincipal();

        // Revoke all previous refresh tokens for this user
        refreshTokenRepo.revokeAllUserTokens(userDetails.getId());

        // Generate tokens
        String accessToken  = jwtTokenProvider
            .generateAccessToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken();

        // Persist refresh token
        User user = userRepository.findById(userDetails.getId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", userDetails.getId()));

        RefreshToken refreshTokenEntity = RefreshToken.builder()
            .user(user)
            .token(refreshToken)
            .expiresAt(LocalDateTime.now().plusSeconds(
                appProperties.getJwt()
                    .getRefreshTokenExpiryMs() / 1000))
            .build();
        refreshTokenRepo.save(refreshTokenEntity);

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        log.info("User logged in: email={}, role={}",
                 user.getEmail(), userDetails.getRole());

        return TokenResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .expiresIn(appProperties.getJwt()
                .getAccessTokenExpiryMs() / 1000)
            .role(userDetails.getRole().name())
            .userId(userDetails.getId())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .build();
    }

    // ── Refresh access token ──────────────────────────────────
    @Transactional
    public TokenResponse refresh(RefreshTokenRequest request) {
        RefreshToken stored = refreshTokenRepo
            .findByToken(request.getRefreshToken())
            .orElseThrow(() -> new BusinessRuleException(
                "INVALID_REFRESH_TOKEN", "Invalid refresh token"));

        if (Boolean.TRUE.equals(stored.getIsRevoked())) {
            throw new BusinessRuleException(
                "REVOKED_TOKEN", "Refresh token has been revoked");
        }
        if (stored.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessRuleException(
                "EXPIRED_REFRESH_TOKEN", "Refresh token has expired");
        }

        User user = stored.getUser();
        CustomUserDetails userDetails = new CustomUserDetails(user);

        String newAccessToken  =
            jwtTokenProvider.generateAccessToken(userDetails);
        String newRefreshToken =
            jwtTokenProvider.generateRefreshToken();

        // Rotate refresh token
        stored.setIsRevoked(true);
        refreshTokenRepo.save(stored);

        RefreshToken newToken = RefreshToken.builder()
            .user(user)
            .token(newRefreshToken)
            .expiresAt(LocalDateTime.now().plusSeconds(
                appProperties.getJwt()
                    .getRefreshTokenExpiryMs() / 1000))
            .build();
        refreshTokenRepo.save(newToken);

        return TokenResponse.builder()
            .accessToken(newAccessToken)
            .refreshToken(newRefreshToken)
            .tokenType("Bearer")
            .expiresIn(appProperties.getJwt()
                .getAccessTokenExpiryMs() / 1000)
            .role(user.getRole().name())
            .userId(user.getId())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .build();
    }

    // ── Logout ────────────────────────────────────────────────
    @Transactional
    public void logout(Long userId) {
        refreshTokenRepo.revokeAllUserTokens(userId);
        log.info("User logged out: userId={}", userId);
    }

    // ── Change password ───────────────────────────────────────
    @Transactional
    public void changePassword(Long userId,
                               ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", userId));

        if (!passwordEncoder.matches(
                request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BusinessRuleException(
                "WRONG_PASSWORD", "Current password is incorrect");
        }

        user.setPasswordHash(
            passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Revoke all tokens — force re-login
        refreshTokenRepo.revokeAllUserTokens(userId);
        log.info("Password changed for userId={}", userId);
    }
}