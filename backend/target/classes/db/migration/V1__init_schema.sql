-- ============================================================
-- V1 - Initial Schema for Apex ERP
-- ============================================================
CREATE SCHEMA IF NOT EXISTS apex_erp;
SET search_path TO apex_erp;

CREATE TABLE users (
    id                BIGSERIAL PRIMARY KEY,
    email             VARCHAR(100) NOT NULL UNIQUE,
    password_hash     VARCHAR(255) NOT NULL,
    role              VARCHAR(30)  NOT NULL,
    full_name         VARCHAR(100) NOT NULL,
    phone             VARCHAR(15),
    profile_photo_url VARCHAR(500),
    is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login        TIMESTAMP,
    created_at        TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP    NOT NULL DEFAULT NOW(),
    created_by        BIGINT,
    CONSTRAINT chk_role CHECK (role IN (
        'ADMIN','COE','HOD','FACULTY','STUDENT',
        'FINANCE','HOSTEL_WARDEN','LIBRARIAN'))
);

CREATE TABLE refresh_tokens (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(500) NOT NULL UNIQUE,
    expires_at  TIMESTAMP    NOT NULL,
    is_revoked  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE departments (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL UNIQUE,
    code         VARCHAR(10)  NOT NULL UNIQUE,
    program_type VARCHAR(10)  NOT NULL,
    hod_id       BIGINT       REFERENCES users(id),
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE programs (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    code            VARCHAR(20)  NOT NULL UNIQUE,
    department_id   BIGINT       NOT NULL REFERENCES departments(id),
    duration_years  INT          NOT NULL,
    total_semesters INT          NOT NULL,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE batches (
    id              BIGSERIAL PRIMARY KEY,
    program_id      BIGINT   NOT NULL REFERENCES programs(id),
    join_year       INT      NOT NULL,
    graduation_year INT      NOT NULL,
    section         VARCHAR(5),
    is_active       BOOLEAN  NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (program_id, join_year, section)
);

CREATE TABLE students (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT       NOT NULL UNIQUE REFERENCES users(id),
    roll_number     VARCHAR(20)  NOT NULL UNIQUE,
    register_number VARCHAR(30)  NOT NULL UNIQUE,
    batch_id        BIGINT       NOT NULL REFERENCES batches(id),
    current_semester INT         NOT NULL DEFAULT 1,
    current_cgpa    NUMERIC(4,2) DEFAULT 0.00,
    date_of_birth   DATE         NOT NULL,
    gender          VARCHAR(10)  NOT NULL,
    blood_group     VARCHAR(5),
    address         TEXT,
    parent_name     VARCHAR(100),
    parent_phone    VARCHAR(15),
    parent_email    VARCHAR(100),
    admission_date  DATE         NOT NULL,
    is_detained     BOOLEAN      NOT NULL DEFAULT FALSE,
    status          VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    created_by      BIGINT
);

CREATE TABLE faculty (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT      NOT NULL UNIQUE REFERENCES users(id),
    employee_id    VARCHAR(20) NOT NULL UNIQUE,
    department_id  BIGINT      NOT NULL REFERENCES departments(id),
    designation    VARCHAR(50) NOT NULL,
    specialization VARCHAR(100),
    joining_date   DATE        NOT NULL,
    qualification  VARCHAR(100),
    is_active      BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP   NOT NULL DEFAULT NOW(),
    created_by     BIGINT
);

-- Indexes
CREATE INDEX idx_users_email      ON apex_erp.users(email);
CREATE INDEX idx_users_role       ON apex_erp.users(role);
CREATE INDEX idx_students_batch   ON apex_erp.students(batch_id);
CREATE INDEX idx_students_roll    ON apex_erp.students(roll_number);
CREATE INDEX idx_faculty_dept     ON apex_erp.faculty(department_id);