package com.apex.erp.module.hostel.entity;

import com.apex.erp.common.BaseEntity;
import com.apex.erp.module.student.entity.Student;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "hostel_allotments", schema = "apex_erp",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"student_id", "academic_year"}))
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HostelAllotment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private HostelRoom room;

    @Column(name = "academic_year", nullable = false, length = 10)
    private String academicYear;

    @Column(name = "allotment_date", nullable = false)
    private LocalDate allotmentDate;

    @Column(name = "vacating_date")
    private LocalDate vacatingDate;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, VACATED
}