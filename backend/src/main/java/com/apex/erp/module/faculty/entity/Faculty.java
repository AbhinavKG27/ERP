package com.apex.erp.module.faculty.entity;

import com.apex.erp.common.BaseEntity;
import com.apex.erp.module.department.entity.Department;
import com.apex.erp.module.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "faculty", schema = "apex_erp")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Faculty extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "employee_id", nullable = false,
            unique = true, length = 20)
    private String employeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(nullable = false, length = 50)
    private String designation;

    @Column(length = 100)
    private String specialization;

    @Column(name = "joining_date", nullable = false)
    private LocalDate joiningDate;

    @Column(length = 100)
    private String qualification;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}