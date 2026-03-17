package com.apex.erp.module.exam.entity;

import com.apex.erp.module.department.entity.Batch;
import com.apex.erp.module.department.entity.Subject;
import com.apex.erp.module.faculty.entity.Faculty;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "exams", schema = "apex_erp",
    uniqueConstraints = @UniqueConstraint(columnNames = {
        "subject_id", "batch_id", "exam_type", "academic_year", "semester_number"
    }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    @Column(name = "exam_type", nullable = false, length = 20)
    private String examType;

    @Column(name = "exam_date", nullable = false)
    private LocalDate examDate;

    @Column(name = "max_marks", nullable = false, precision = 5, scale = 2)
    private BigDecimal maxMarks;

    @Column(name = "academic_year", nullable = false, length = 10)
    private String academicYear;

    @Column(name = "semester_number", nullable = false)
    private Integer semesterNumber;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "DRAFT";

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "created_by")
    private Long createdBy;
}
