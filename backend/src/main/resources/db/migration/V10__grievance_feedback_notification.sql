SET search_path = apex_erp;

CREATE TABLE apex_erp.grievances (
    id                  BIGSERIAL PRIMARY KEY,
    student_id          BIGINT NOT NULL REFERENCES apex_erp.users(id),
    assigned_faculty_id BIGINT REFERENCES apex_erp.users(id),
    hod_id              BIGINT REFERENCES apex_erp.users(id),
    subject             VARCHAR(255) NOT NULL,
    description         TEXT NOT NULL,
    category            VARCHAR(30) NOT NULL DEFAULT 'OTHER',
    status              VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    is_anonymous        BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at        TIMESTAMP NOT NULL DEFAULT NOW(),
    assigned_at         TIMESTAMP,
    escalated_at        TIMESTAMP,
    resolved_at         TIMESTAMP,
    resolution_note     TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE apex_erp.grievance_comments (
    id             BIGSERIAL PRIMARY KEY,
    grievance_id   BIGINT NOT NULL REFERENCES apex_erp.grievances(id) ON DELETE CASCADE,
    commenter_id   BIGINT NOT NULL REFERENCES apex_erp.users(id),
    comment        TEXT NOT NULL,
    commented_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE apex_erp.feedback_forms (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    faculty_id      BIGINT NOT NULL REFERENCES apex_erp.users(id),
    department_id   BIGINT NOT NULL REFERENCES apex_erp.departments(id),
    academic_year   VARCHAR(20) NOT NULL,
    semester        INTEGER NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    deadline        DATE,
    created_by      BIGINT NOT NULL REFERENCES apex_erp.users(id),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE apex_erp.feedback_responses (
    id                   BIGSERIAL PRIMARY KEY,
    form_id              BIGINT NOT NULL REFERENCES apex_erp.feedback_forms(id) ON DELETE CASCADE,
    student_id           BIGINT REFERENCES apex_erp.users(id),
    is_anonymous         BOOLEAN NOT NULL DEFAULT FALSE,
    teaching_rating      INTEGER NOT NULL CHECK (teaching_rating BETWEEN 1 AND 5),
    knowledge_rating     INTEGER NOT NULL CHECK (knowledge_rating BETWEEN 1 AND 5),
    communication_rating INTEGER NOT NULL CHECK (communication_rating BETWEEN 1 AND 5),
    punctuality_rating   INTEGER NOT NULL CHECK (punctuality_rating BETWEEN 1 AND 5),
    overall_rating       INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    comments             TEXT,
    submitted_at         TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (form_id, student_id)
);

CREATE TABLE apex_erp.notifications (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    message         TEXT NOT NULL,
    type            VARCHAR(20) NOT NULL DEFAULT 'INFO',
    target_type     VARCHAR(20) NOT NULL DEFAULT 'USER',
    target_role     VARCHAR(50),
    target_user_id  BIGINT REFERENCES apex_erp.users(id),
    created_by      BIGINT REFERENCES apex_erp.users(id),
    is_broadcast    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE apex_erp.notification_reads (
    id               BIGSERIAL PRIMARY KEY,
    notification_id  BIGINT NOT NULL REFERENCES apex_erp.notifications(id) ON DELETE CASCADE,
    user_id          BIGINT NOT NULL REFERENCES apex_erp.users(id),
    read_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (notification_id, user_id)
);

CREATE INDEX idx_grievances_student   ON apex_erp.grievances(student_id);
CREATE INDEX idx_grievances_status    ON apex_erp.grievances(status);
CREATE INDEX idx_grievance_comments   ON apex_erp.grievance_comments(grievance_id);
CREATE INDEX idx_feedback_faculty     ON apex_erp.feedback_forms(faculty_id);
CREATE INDEX idx_feedback_responses   ON apex_erp.feedback_responses(form_id);
CREATE INDEX idx_notif_target_user    ON apex_erp.notifications(target_user_id);
CREATE INDEX idx_notif_target_role    ON apex_erp.notifications(target_role);
CREATE INDEX idx_notif_reads_user     ON apex_erp.notification_reads(user_id);