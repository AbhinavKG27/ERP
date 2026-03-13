package com.apex.erp.module.faculty.entity;

import com.apex.erp.common.BaseEntity;
import com.apex.erp.module.department.entity.Batch;
import com.apex.erp.module.department.entity.Subject;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "faculty_subject_assignments",
       schema = "apex_erp",
       uniqueConstraints = @UniqueConstraint(
           columnNames = {"faculty_id","subject_id",
                          "batch_id","academic_year"}))
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacultySubjectAssignment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;

    @Column(name = "academic_year", nullable = false, length = 10)
    private String academicYear;

    @Column(name = "semester_number", nullable = false)
    private Integer semesterNumber;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}