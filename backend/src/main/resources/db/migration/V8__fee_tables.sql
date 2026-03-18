CREATE TABLE apex_erp.fee_structures (
    id            BIGSERIAL PRIMARY KEY,
    program_id    BIGINT       NOT NULL REFERENCES apex_erp.programs(id),
    academic_year VARCHAR(10)  NOT NULL,
    fee_type      VARCHAR(50)  NOT NULL,
    amount        NUMERIC(12,2) NOT NULL,
    due_date      DATE,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    created_by    BIGINT,
    UNIQUE (program_id, academic_year, fee_type)
);

CREATE TABLE apex_erp.student_fee_records (
    id               BIGSERIAL PRIMARY KEY,
    student_id       BIGINT        NOT NULL REFERENCES apex_erp.students(id),
    fee_structure_id BIGINT        NOT NULL REFERENCES apex_erp.fee_structures(id),
    academic_year    VARCHAR(10)   NOT NULL,
    total_amount     NUMERIC(12,2) NOT NULL,
    paid_amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
    balance_amount   NUMERIC(12,2) NOT NULL DEFAULT 0,
    status           VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    created_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    created_by       BIGINT,
    UNIQUE (student_id, fee_structure_id, academic_year)
);

CREATE TABLE apex_erp.fee_payments (
    id               BIGSERIAL PRIMARY KEY,
    student_fee_id   BIGINT        NOT NULL REFERENCES apex_erp.student_fee_records(id),
    student_id       BIGINT        NOT NULL REFERENCES apex_erp.students(id),
    amount           NUMERIC(12,2) NOT NULL,
    payment_method   VARCHAR(30)   NOT NULL,
    transaction_id   VARCHAR(100),
    payment_gateway  VARCHAR(30),
    payment_status   VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    paid_at          TIMESTAMP,
    receipt_number   VARCHAR(50)   UNIQUE,
    remarks          TEXT,
    created_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    created_by       BIGINT
);

CREATE TABLE apex_erp.installment_plans (
    id                  BIGSERIAL PRIMARY KEY,
    student_fee_id      BIGINT        NOT NULL REFERENCES apex_erp.student_fee_records(id),
    installment_number  INT           NOT NULL,
    amount              NUMERIC(12,2) NOT NULL,
    due_date            DATE          NOT NULL,
    status              VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    paid_at             TIMESTAMP,
    UNIQUE (student_fee_id, installment_number)
);

CREATE INDEX idx_fee_student    ON apex_erp.student_fee_records(student_id, academic_year);
CREATE INDEX idx_fee_payments   ON apex_erp.fee_payments(student_id, payment_status);
CREATE INDEX idx_fee_receipt    ON apex_erp.fee_payments(receipt_number);
