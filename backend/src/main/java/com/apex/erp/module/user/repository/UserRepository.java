package com.apex.erp.module.user.repository;

import com.apex.erp.module.user.entity.User;
import com.apex.erp.module.user.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByIsActiveTrue();
}
/*
```

---

## ✅ Phase 4 Complete — Copy-Paste Checklist
```
✅ FILE 01 → .../security/CustomUserDetails.java
✅ FILE 02 → .../security/CustomUserDetailsService.java
✅ FILE 03 → .../security/JwtTokenProvider.java
            (remember to add getEmailFromToken() method)
✅ FILE 04 → .../security/JwtAuthenticationFilter.java
            (use the CLEAN FINAL VERSION)
✅ FILE 05 → .../security/SecurityService.java
✅ FILE 06 → .../config/SecurityConfig.java
✅ FILE 07 → .../config/CorsConfig.java
            (remember to add Cors class to AppProperties.java)
✅ FILE 08 → .../config/SwaggerConfig.java
✅ FILE 09 → .../module/auth/entity/RefreshToken.java
✅ FILE 10 → .../module/auth/repository/RefreshTokenRepository.java
✅ FILE 11 → .../module/auth/dto/LoginRequest.java
           → .../module/auth/dto/TokenResponse.java
           → .../module/auth/dto/RefreshTokenRequest.java
           → .../module/auth/dto/ChangePasswordRequest.java
✅ FILE 12 → .../module/auth/service/AuthService.java
✅ FILE 13 → .../module/auth/controller/AuthController.java
✅ BONUS  → .../module/user/repository/UserRepository.java */