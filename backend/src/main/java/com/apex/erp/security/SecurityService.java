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

    public CustomUserDetails getCurrentUser() {
        Authentication auth =
            SecurityContextHolder.getContext().getAuthentication();
        return (CustomUserDetails) auth.getPrincipal();
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public boolean isOwnStudent(Long studentId) {
        try {
            Long currentUserId = getCurrentUserId();
            return userRepository.findById(currentUserId)
                .map(u -> {
                    // Will be properly implemented in Phase 5
                    // when Student-User link is confirmed
                    return false;
                })
                .orElse(false);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isOwnUser(Long userId) {
        try {
            Long currentId = getCurrentUserId();
            return currentId != null && currentId.equals(userId);
        } catch (Exception e) {
            return false;
        }
    }
}