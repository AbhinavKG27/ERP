package com.apex.erp.module.attendance.entity;

import com.apex.erp.module.department.entity.Subject;
import com.apex.erp.module.student.entity.Student;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_summary", schema = "apex_erp",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"student_id","subject_id",
                       "academic_year","semester_number"}))
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceSummary {

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

    @Column(name = "total_sessions", nullable = false)
    @Builder.Default
    private Integer totalSessions = 0;

    @Column(name = "attended_sessions", nullable = false)
    @Builder.Default
    private Integer attendedSessions = 0;

    @Column(name = "percentage", precision = 5, scale = 2)
    private BigDecimal percentage;

    @Column(name = "eligibility_status", nullable = false, length = 20)
    @Builder.Default
    private String eligibilityStatus = "ELIGIBLE";
    // ELIGIBLE, NEEDS_APPROVAL, FINE_REQUIRED, NOT_ELIGIBLE

    @Column(name = "approval_granted")
    @Builder.Default
    private Boolean approvalGranted = false;

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}