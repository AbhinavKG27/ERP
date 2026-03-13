CREATE TABLE apex_erp.subjects (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(20)  NOT NULL UNIQUE,
    department_id   BIGINT       NOT NULL REFERENCES apex_erp.departments(id),
    semester_number INT          NOT NULL,
    credits         INT          NOT NULL,
    subject_type    VARCHAR(20)  NOT NULL DEFAULT 'THEORY',
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    created_by      BIGINT
);

CREATE INDEX idx_subjects_dept ON apex_erp.subjects(department_id);
CREATE INDEX idx_subjects_code ON apex_erp.subjects(code);