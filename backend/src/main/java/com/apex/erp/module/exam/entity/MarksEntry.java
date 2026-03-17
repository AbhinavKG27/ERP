package com.apex.erp.module.exam.entity;

import com.apex.erp.module.student.entity.Student;
import com.apex.erp.module.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "marks_entries", schema = "apex_erp",
    uniqueConstraints = @UniqueConstraint(columnNames = {"exam_id", "student_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarksEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "marks_obtained", nullable = false, precision = 5, scale = 2)
    private BigDecimal marksObtained;

    @Column(name = "is_absent", nullable = false)
    @Builder.Default
    private Boolean isAbsent = false;

    @Column(name = "is_malpractice", nullable = false)
    @Builder.Default
    private Boolean isMalpractice = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluated_by")
    private User evaluatedBy;

    @Column(name = "evaluated_at")
    @Builder.Default
    private LocalDateTime evaluatedAt = LocalDateTime.now();
}
