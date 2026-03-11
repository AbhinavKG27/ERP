package com.apex.erp.module.student.entity;

import com.apex.erp.common.BaseEntity;
import com.apex.erp.module.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "students", schema = "apex_erp")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "roll_number", nullable = false, unique = true, length = 20)
    private String rollNumber;

    @Column(name = "register_number", nullable = false,
            unique = true, length = 30)
    private String registerNumber;

    // NOTE: Batch entity will be added in Phase 5 (Department module)
    // Temporarily store batchId as plain Long until Batch entity exists
    @Column(name = "batch_id", nullable = false)
    private Long batchId;

    @Column(name = "current_semester", nullable = false)
    @Builder.Default
    private Integer currentSemester = 1;

    @Column(name = "current_cgpa", precision = 4, scale = 2)
    @Builder.Default
    private BigDecimal currentCgpa = BigDecimal.ZERO;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false, length = 10)
    private String gender;

    @Column(name = "blood_group", length = 5)
    private String bloodGroup;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "parent_name", length = 100)
    private String parentName;

    @Column(name = "parent_phone", length = 15)
    private String parentPhone;

    @Column(name = "parent_email", length = 100)
    private String parentEmail;

    @Column(name = "admission_date", nullable = false)
    private LocalDate admissionDate;

    @Column(name = "is_detained", nullable = false)
    @Builder.Default
    private Boolean isDetained = false;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "ACTIVE";
}