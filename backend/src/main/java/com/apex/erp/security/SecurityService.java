package com.apex.erp.security;

import com.apex.erp.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("securityService")
@RequiredArgsConstructor
public class SecurityService {

    private final UserRepository userRepository;

    // ── Get currently authenticated user ─────────────────────
    public CustomUserDetails getCurrentUser() {
        Authentication auth =
            SecurityContextHolder.getContext().getAuthentication();
        return (CustomUserDetails) auth.getPrincipal();
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    // ── isOwnStudent will be properly wired in Phase 5
    // ── once StudentRepository exists
    public boolean isOwnStudent(Long studentId) {
        // Placeholder — full implementation in Phase 5
        // For now returns false to prevent accidental access
        return false;
    }

    // ── Check if current user owns a user record ──────────────
    public boolean isOwnUser(Long userId) {
        return getCurrentUserId().equals(userId);
    }
}