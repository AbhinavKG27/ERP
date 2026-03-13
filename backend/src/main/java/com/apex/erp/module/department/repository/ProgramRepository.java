package com.apex.erp.module.department.repository;

import com.apex.erp.module.department.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProgramRepository
        extends JpaRepository<Program, Long> {

    @Query("SELECT p FROM Program p " +
           "JOIN FETCH p.department " +
           "WHERE p.department.id = :deptId " +
           "AND p.isActive = true")
    List<Program> findByDepartmentId(
            @Param("deptId") Long deptId);

    boolean existsByCode(String code);
}