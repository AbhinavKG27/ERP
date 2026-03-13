INSERT INTO apex_erp.users
    (email, password_hash, role, full_name, is_active, created_at, updated_at)
VALUES (
    'admin@apex.edu',
    '$2a$12$/Sxziv/KQmDeT5nSfvj0Xu5niNeKlPxFin82.U3ynfnySBFUuZNQC',
    'ADMIN',
    'System Administrator',
    TRUE,
    NOW(),
    NOW()
);