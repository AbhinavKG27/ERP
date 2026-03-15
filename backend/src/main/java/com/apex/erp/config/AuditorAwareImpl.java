package com.apex.erp.config;

import com.apex.erp.security.CustomUserDetails;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("auditorAwareImpl")
public class AuditorAwareImpl implements AuditorAware<Long> {

    @Override
    public Optional<Long> getCurrentAuditor() {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(auth.getPrincipal())) {
            return Optional.empty();
        }

        try {
            CustomUserDetails userDetails =
                    (CustomUserDetails) auth.getPrincipal();

            return Optional.ofNullable(userDetails.getId());

        } catch (ClassCastException e) {
            return Optional.empty();
        }
    }
}