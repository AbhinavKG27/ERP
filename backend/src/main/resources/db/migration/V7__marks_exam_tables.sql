CREATE TABLE apex_erp.exams (
    id              BIGSERIAL PRIMARY KEY,
    subject_id      BIGINT       NOT NULL REFERENCES apex_erp.subjects(id),
    batch_id        BIGINT       NOT NULL REFERENCES apex_erp.batches(id),
    faculty_id      BIGINT       NOT NULL REFERENCES apex_erp.faculty(id),
    exam_type       VARCHAR(20)  NOT NULL,
    exam_date       DATE         NOT NULL,
    max_marks       NUMERIC(5,2) NOT NULL,
    academic_year   VARCHAR(10)  NOT NULL,
    semester_number INT          NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    created_by      BIGINT,
    UNIQUE (subject_id, batch_id, exam_type, academic_year, semester_number),
    CONSTRAINT chk_exam_type CHECK (exam_type IN ('CIA1', 'CIA2', 'EXTERNAL')),
    CONSTRAINT chk_exam_status CHECK (status IN ('DRAFT', 'PUBLISHED'))
);

CREATE TABLE apex_erp.marks_entries (
    id              BIGSERIAL PRIMARY KEY,
    exam_id         BIGINT       NOT NULL REFERENCES apex_erp.exams(id) ON DELETE CASCADE,
    student_id      BIGINT       NOT NULL REFERENCES apex_erp.students(id),
    marks_obtained  NUMERIC(5,2) NOT NULL,
    is_absent       BOOLEAN      NOT NULL DEFAULT FALSE,
    is_malpractice  BOOLEAN      NOT NULL DEFAULT FALSE,
    evaluated_by    BIGINT       REFERENCES apex_erp.users(id),
    evaluated_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    UNIQUE (exam_id, student_id)
);

CREATE TABLE apex_erp.student_subject_results (
    id               BIGSERIAL PRIMARY KEY,
    student_id       BIGINT       NOT NULL REFERENCES apex_erp.students(id),
    subject_id       BIGINT       NOT NULL REFERENCES apex_erp.subjects(id),
    academic_year    VARCHAR(10)  NOT NULL,
    semester_number  INT          NOT NULL,
    cia1_marks       NUMERIC(5,2) NOT NULL DEFAULT 0,
    cia2_marks       NUMERIC(5,2) NOT NULL DEFAULT 0,
    internal_marks   NUMERIC(5,2) NOT NULL DEFAULT 0,
    external_marks   NUMERIC(5,2) NOT NULL DEFAULT 0,
    combined_marks   NUMERIC(5,2) NOT NULL DEFAULT 0,
    grade_letter     VARCHAR(2)   NOT NULL DEFAULT 'F',
    grade_point      INT          NOT NULL DEFAULT 0,
    is_pass          BOOLEAN      NOT NULL DEFAULT FALSE,
    is_backlog       BOOLEAN      NOT NULL DEFAULT TRUE,
    updated_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, subject_id, academic_year, semester_number),
    CONSTRAINT chk_grade_letter CHECK (grade_letter IN ('O', 'A+', 'A', 'B+', 'B', 'C', 'F'))
);

CREATE INDEX idx_exams_subject_batch ON apex_erp.exams(subject_id, batch_id, academic_year);
CREATE INDEX idx_marks_exam_student  ON apex_erp.marks_entries(exam_id, student_id);
CREATE INDEX idx_result_student_year ON apex_erp.student_subject_results(student_id, academic_year);
