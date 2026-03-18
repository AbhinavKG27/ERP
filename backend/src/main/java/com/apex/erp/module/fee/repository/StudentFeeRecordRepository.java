package com.apex.erp.module.fee.repository;

import com.apex.erp.module.fee.entity.StudentFeeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentFeeRecordRepository
        extends JpaRepository<StudentFeeRecord, Long> {

    @Query("""
        SELECT r FROM StudentFeeRecord r
        JOIN FETCH r.feeStructure f
        JOIN FETCH f.program
        WHERE r.student.id = :studentId
        AND r.academicYear = :year
        """)
    List<StudentFeeRecord> findByStudentAndYear(
            @Param("studentId") Long studentId,
            @Param("year") String year);

    Optional<StudentFeeRecord> findByStudentIdAndFeeStructureIdAndAcademicYear(
            Long studentId, Long feeStructureId, String academicYear);
}