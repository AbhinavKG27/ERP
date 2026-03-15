CREATE TABLE apex_erp.attendance_sessions (
    id              BIGSERIAL PRIMARY KEY,
    faculty_id      BIGINT    NOT NULL REFERENCES apex_erp.faculty(id),
    subject_id      BIGINT    NOT NULL REFERENCES apex_erp.subjects(id),
    batch_id        BIGINT    NOT NULL REFERENCES apex_erp.batches(id),
    session_date    DATE      NOT NULL,
    start_time      TIME      NOT NULL,
    end_time        TIME      NOT NULL,
    academic_year   VARCHAR(10) NOT NULL,
    semester_number INT       NOT NULL,
    is_finalized    BOOLEAN   NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by      BIGINT
);

CREATE TABLE apex_erp.attendance_records (
    id          BIGSERIAL PRIMARY KEY,
    session_id  BIGINT      NOT NULL REFERENCES apex_erp.attendance_sessions(id),
    student_id  BIGINT      NOT NULL REFERENCES apex_erp.students(id),
    status      VARCHAR(10) NOT NULL DEFAULT 'ABSENT',
    marked_by   BIGINT      NOT NULL REFERENCES apex_erp.users(id),
    marked_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
    UNIQUE (session_id, student_id)
);

CREATE TABLE apex_erp.attendance_summary (
    id                 BIGSERIAL PRIMARY KEY,
    student_id         BIGINT       NOT NULL REFERENCES apex_erp.students(id),
    subject_id         BIGINT       NOT NULL REFERENCES apex_erp.subjects(id),
    academic_year      VARCHAR(10)  NOT NULL,
    semester_number    INT          NOT NULL,
    total_sessions     INT          NOT NULL DEFAULT 0,
    attended_sessions  INT          NOT NULL DEFAULT 0,
    percentage         NUMERIC(5,2),
    eligibility_status VARCHAR(20)  NOT NULL DEFAULT 'ELIGIBLE',
    approval_granted   BOOLEAN      DEFAULT FALSE,
    updated_at         TIMESTAMP    NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, subject_id, academic_year, semester_number)
);

CREATE INDEX idx_att_sess_batch   ON apex_erp.attendance_sessions(batch_id, session_date);
CREATE INDEX idx_att_sess_faculty ON apex_erp.attendance_sessions(faculty_id);
CREATE INDEX idx_att_rec_student  ON apex_erp.attendance_records(student_id);
CREATE INDEX idx_att_rec_session  ON apex_erp.attendance_records(session_id);
CREATE INDEX idx_att_sum_student  ON apex_erp.attendance_summary(student_id, academic_year);
