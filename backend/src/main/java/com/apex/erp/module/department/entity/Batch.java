package com.apex.erp.module.department.entity;

import com.apex.erp.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "batches", schema = "apex_erp",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"program_id", "join_year", "section"}))
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Batch extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(name = "join_year", nullable = false)
    private Integer joinYear;

    @Column(name = "graduation_year", nullable = false)
    private Integer graduationYear;

    @Column(length = 5)
    private String section;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}