package com.apex.erp.module.fee.repository;

import com.apex.erp.module.fee.entity.FeeStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeeStructureRepository
        extends JpaRepository<FeeStructure, Long> {

    @Query("""
        SELECT f FROM FeeStructure f
        JOIN FETCH f.program p
        JOIN FETCH p.department
        WHERE f.program.id = :programId
        AND f.academicYear = :year
        AND f.isActive = true
        """)
    List<FeeStructure> findByProgramAndYear(
            @Param("programId") Long programId,
            @Param("year") String year);

    boolean existsByProgramIdAndAcademicYearAndFeeType(
            Long programId, String academicYear, String feeType);
}