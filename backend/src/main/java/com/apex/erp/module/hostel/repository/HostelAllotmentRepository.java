package com.apex.erp.module.hostel.repository;

import com.apex.erp.module.hostel.entity.HostelAllotment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface HostelAllotmentRepository
        extends JpaRepository<HostelAllotment, Long> {

    @Query("""
        SELECT a FROM HostelAllotment a
        JOIN FETCH a.room r
        JOIN FETCH r.block
        WHERE a.student.id = :studentId
        AND a.academicYear = :year
        AND a.status = 'ACTIVE'
        """)
    Optional<HostelAllotment> findActiveByStudentAndYear(
            @Param("studentId") Long studentId,
            @Param("year") String year);

    boolean existsByStudentIdAndAcademicYearAndStatus(
            Long studentId, String academicYear, String status);
}