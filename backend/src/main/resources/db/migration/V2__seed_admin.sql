-- ============================================================
-- V2 - Seed default admin user
-- Password is: Admin@123
-- BCrypt hash generated with strength 12
-- IMPORTANT: Change this password immediately after first login
-- ============================================================
INSERT INTO apex_erp.users
    (email, password_hash, role, full_name,
     is_active, created_at, updated_at)
VALUES (
    'admin@apex.edu',
    '$2a$12$XFaENPWLiEGgBf3kVvzZoeS4ByK6mUP1FXIZxZkPvRE1yHvSFMPCa',
    'ADMIN',
    'System Administrator',
    TRUE,
    NOW(),
    NOW()
);
```

---

## ✅ All 18 Files Complete

Here is your copy-paste checklist:
```
✅ FILE 01 → backend/pom.xml
✅ FILE 02 → backend/src/main/resources/application.yml
✅ FILE 03 → .../com/apex/erp/ErpApplication.java
✅ FILE 04 → .../config/AppProperties.java
✅ FILE 05 → .../config/AuditorAwareImpl.java
✅ FILE 06 → .../common/BaseEntity.java
✅ FILE 07 → .../common/ApiResponse.java
✅ FILE 08 → .../common/PagedResponse.java
✅ FILE 09 → .../exception/ResourceNotFoundException.java
✅ FILE 10 → .../exception/BusinessRuleException.java
✅ FILE 11 → .../exception/UnauthorizedException.java
✅ FILE 12 → .../exception/GlobalExceptionHandler.java
✅ FILE 13 → .../module/user/entity/Role.java
✅ FILE 14 → .../module/user/entity/User.java
✅ FILE 15 → .../module/student/entity/Student.java
✅ FILE 16 → .../module/student/dto/StudentDto.java
           → .../module/student/dto/CreateStudentRequest.java
✅ FILE 17 → .../module/student/mapper/StudentMapper.java
✅ FILE 18 → .../resources/db/migration/V1__init_schema.sql
           → .../resources/db/migration/V2__seed_admin.sql