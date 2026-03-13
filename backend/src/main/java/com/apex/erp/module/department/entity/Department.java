package com.apex.erp.module.department.entity;

import com.apex.erp.common.BaseEntity;
import com.apex.erp.module.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "departments", schema = "apex_erp")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 10)
    private String code;

    @Column(name = "program_type", nullable = false, length = 10)
    private String programType;   // UG, PG, BOTH

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hod_id")
    private User hod;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}