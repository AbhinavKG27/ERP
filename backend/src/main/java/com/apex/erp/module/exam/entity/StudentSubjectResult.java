package com.apex.erp.module.exam.entity;

import com.apex.erp.module.department.entity.Subject;
import com.apex.erp.module.student.entity.Student;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_subject_results", schema = "apex_erp",
    uniqueConstraints = @UniqueConstraint(columnNames = {
        "student_id", "subject_id", "academic_year", "semester_number"
    }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentSubjectResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "academic_year", nullable = false, length = 10)
    private String academicYear;

    @Column(name = "semester_number", nullable = false)
    private Integer semesterNumber;

    @Column(name = "cia1_marks", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal cia1Marks = BigDecimal.ZERO;

    @Column(name = "cia2_marks", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal cia2Marks = BigDecimal.ZERO;

    @Column(name = "internal_marks", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal internalMarks = BigDecimal.ZERO;

    @Column(name = "external_marks", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal externalMarks = BigDecimal.ZERO;

    @Column(name = "combined_marks", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal combinedMarks = BigDecimal.ZERO;

    @Column(name = "grade_letter", nullable = false, length = 2)
    @Builder.Default
    private String gradeLetter = "F";

    @Column(name = "grade_point", nullable = false)
    @Builder.Default
    private Integer gradePoint = 0;

    @Column(name = "is_pass", nullable = false)
    @Builder.Default
    private Boolean isPass = false;

    @Column(name = "is_backlog", nullable = false)
    @Builder.Default
    private Boolean isBacklog = true;

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
