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

CREATE INDEX idx_fsa_faculty  ON apex_erp.faculty_subject_assignments(faculty_id);
CREATE INDEX idx_fsa_subject  ON apex_erp.faculty_subject_assignments(subject_id);
CREATE INDEX idx_fsa_batch    ON apex_erp.faculty_subject_assignments(batch_id);
```

---

## ✅ Department + Faculty Checklist
```
DEPARTMENT MODULE
✅ FILE 01 → entity/Department.java
✅ FILE 02 → entity/Program.java
✅ FILE 03 → entity/Batch.java
✅ FILE 04 → entity/Subject.java
✅ FILE 05 → dto/ (8 DTO files)
✅ FILE 06 → repository/ (4 repositories)
✅ FILE 07 → mapper/DepartmentMapper.java
✅ FILE 08 → service/DepartmentService.java
✅ FILE 09 → controller/DepartmentController.java
✅ FILE 10 → db/migration/V3__subjects_table.sql

FACULTY MODULE
✅ FILE 11 → entity/Faculty.java
✅ FILE 12 → dto/ (4 DTO files)
✅ FILE 13 → entity/FacultySubjectAssignment.java
✅ FILE 14 → repository/ (2 repositories)
✅ FILE 15 → mapper/FacultyMapper.java
✅ FILE 16 → service/FacultyService.java
✅ FILE 17 → controller/FacultyController.java
✅ FILE 18 → db/migration/V4__faculty_subject_assignments.sql