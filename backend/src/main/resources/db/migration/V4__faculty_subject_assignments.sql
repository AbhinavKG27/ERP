CREATE TABLE apex_erp.faculty_subject_assignments (
    id              BIGSERIAL PRIMARY KEY,
    faculty_id      BIGINT      NOT NULL REFERENCES apex_erp.faculty(id),
    subject_id      BIGINT      NOT NULL REFERENCES apex_erp.subjects(id),
    batch_id        BIGINT      NOT NULL REFERENCES apex_erp.batches(id),
    academic_year   VARCHAR(10) NOT NULL,
    semester_number INT         NOT NULL,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP   NOT NULL DEFAULT NOW(),
    created_by      BIGINT,
    UNIQUE (faculty_id, subject_id, batch_id, academic_year)
);

CREATE INDEX idx_fsa_faculty ON apex_erp.faculty_subject_assignments(faculty_id);
CREATE INDEX idx_fsa_subject ON apex_erp.faculty_subject_assignments(subject_id);
CREATE INDEX idx_fsa_batch   ON apex_erp.faculty_subject_assignments(batch_id);