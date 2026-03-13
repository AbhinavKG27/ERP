package com.apex.erp.module.department.entity;

import com.apex.erp.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subjects", schema = "apex_erp")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subject extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "semester_number", nullable = false)
    private Integer semesterNumber;

    @Column(nullable = false)
    private Integer credits;

    @Column(name = "subject_type", nullable = false, length = 20)
    @Builder.Default
    private String subjectType = "THEORY";   // THEORY, LAB, ELECTIVE

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}