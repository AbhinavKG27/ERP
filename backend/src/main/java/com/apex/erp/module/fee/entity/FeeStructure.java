package com.apex.erp.module.fee.entity;

import com.apex.erp.common.BaseEntity;
import com.apex.erp.module.department.entity.Program;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fee_structures", schema = "apex_erp",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"program_id","academic_year","fee_type"}))
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeStructure extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(name = "academic_year", nullable = false, length = 10)
    private String academicYear;

    @Column(name = "fee_type", nullable = false, length = 50)
    private String feeType; // TUITION, HOSTEL, EXAM, LIBRARY, LAB

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}