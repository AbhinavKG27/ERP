package com.apex.erp.security;

import com.apex.erp.module.user.repository.UserRepository;
import com.apex.erp.module.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("securityService")
@RequiredArgsConstructor
public class SecurityService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

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
            return studentRepository.findById(studentId)
                .map(s -> s.getUser() != null
                    && currentUserId != null
                    && currentUserId.equals(
                        s.getUser().getId()))
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