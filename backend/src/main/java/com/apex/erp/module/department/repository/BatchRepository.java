package com.apex.erp.module.department.repository;

import com.apex.erp.module.department.entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BatchRepository
        extends JpaRepository<Batch, Long> {

    @Query("""
        SELECT b FROM Batch b
        JOIN FETCH b.program p
        JOIN FETCH p.department
        WHERE p.department.id = :deptId
        AND b.isActive = true
        """)
    List<Batch> findByDepartmentId(
            @Param("deptId") Long deptId);

    @Query("""
        SELECT b FROM Batch b
        JOIN FETCH b.program p
        JOIN FETCH p.department
        WHERE p.id = :programId
        AND b.isActive = true
        """)
    List<Batch> findByProgramId(
            @Param("programId") Long programId);
}