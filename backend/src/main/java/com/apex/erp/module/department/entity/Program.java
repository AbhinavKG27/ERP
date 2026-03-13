package com.apex.erp.module.department.entity;

import com.apex.erp.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "programs", schema = "apex_erp")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Program extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "duration_years", nullable = false)
    private Integer durationYears;

    @Column(name = "total_semesters", nullable = false)
    private Integer totalSemesters;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}