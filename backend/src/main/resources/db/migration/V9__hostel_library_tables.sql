CREATE TABLE apex_erp.hostel_blocks (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    gender      VARCHAR(10)  NOT NULL,
    warden_id   BIGINT       REFERENCES apex_erp.users(id),
    total_rooms INT          NOT NULL,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    created_by  BIGINT
);

CREATE TABLE apex_erp.hostel_rooms (
    id             BIGSERIAL PRIMARY KEY,
    block_id       BIGINT      NOT NULL REFERENCES apex_erp.hostel_blocks(id),
    room_number    VARCHAR(10) NOT NULL,
    room_type      VARCHAR(20) NOT NULL,
    capacity       INT         NOT NULL,
    occupied_count INT         NOT NULL DEFAULT 0,
    floor_number   INT,
    is_available   BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP   NOT NULL DEFAULT NOW(),
    created_by     BIGINT,
    UNIQUE (block_id, room_number)
);

CREATE TABLE apex_erp.hostel_allotments (
    id             BIGSERIAL PRIMARY KEY,
    student_id     BIGINT      NOT NULL REFERENCES apex_erp.students(id),
    room_id        BIGINT      NOT NULL REFERENCES apex_erp.hostel_rooms(id),
    academic_year  VARCHAR(10) NOT NULL,
    allotment_date DATE        NOT NULL,
    vacating_date  DATE,
    status         VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at     TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP   NOT NULL DEFAULT NOW(),
    created_by     BIGINT,
    UNIQUE (student_id, academic_year)
);

CREATE TABLE apex_erp.hostel_maintenance_requests (
    id           BIGSERIAL PRIMARY KEY,
    student_id   BIGINT      NOT NULL REFERENCES apex_erp.students(id),
    room_id      BIGINT      NOT NULL REFERENCES apex_erp.hostel_rooms(id),
    issue_type   VARCHAR(50) NOT NULL,
    description  TEXT        NOT NULL,
    status       VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    raised_at    TIMESTAMP   NOT NULL DEFAULT NOW(),
    resolved_at  TIMESTAMP,
    resolved_by  BIGINT      REFERENCES apex_erp.users(id)
);

CREATE TABLE apex_erp.books (
    id                BIGSERIAL PRIMARY KEY,
    title             VARCHAR(200) NOT NULL,
    author            VARCHAR(200) NOT NULL,
    isbn              VARCHAR(20)  UNIQUE,
    publisher         VARCHAR(100),
    publication_year  INT,
    category          VARCHAR(50),
    department_id     BIGINT       REFERENCES apex_erp.departments(id),
    total_copies      INT          NOT NULL DEFAULT 1,
    available_copies  INT          NOT NULL DEFAULT 1,
    barcode           VARCHAR(50)  UNIQUE,
    is_ebook          BOOLEAN      NOT NULL DEFAULT FALSE,
    ebook_url         VARCHAR(500),
    location_shelf    VARCHAR(20),
    created_at        TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP    NOT NULL DEFAULT NOW(),
    created_by        BIGINT
);

CREATE TABLE apex_erp.book_issues (
    id           BIGSERIAL PRIMARY KEY,
    book_id      BIGINT       NOT NULL REFERENCES apex_erp.books(id),
    user_id      BIGINT       NOT NULL REFERENCES apex_erp.users(id),
    issued_by    BIGINT       NOT NULL REFERENCES apex_erp.users(id),
    issue_date   DATE         NOT NULL DEFAULT CURRENT_DATE,
    due_date     DATE         NOT NULL,
    return_date  DATE,
    status       VARCHAR(20)  NOT NULL DEFAULT 'ISSUED',
    fine_amount  NUMERIC(8,2) NOT NULL DEFAULT 0,
    fine_paid    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE apex_erp.book_reservations (
    id          BIGSERIAL PRIMARY KEY,
    book_id     BIGINT      NOT NULL REFERENCES apex_erp.books(id),
    user_id     BIGINT      NOT NULL REFERENCES apex_erp.users(id),
    reserved_at TIMESTAMP   NOT NULL DEFAULT NOW(),
    expires_at  TIMESTAMP   NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

CREATE INDEX idx_books_isbn      ON apex_erp.books(isbn);
CREATE INDEX idx_books_barcode   ON apex_erp.books(barcode);
CREATE INDEX idx_issues_user     ON apex_erp.book_issues(user_id, status);
CREATE INDEX idx_hostel_student  ON apex_erp.hostel_allotments(student_id);
