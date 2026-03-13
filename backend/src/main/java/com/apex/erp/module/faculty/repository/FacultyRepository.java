package com.apex.erp.module.faculty.repository;

import com.apex.erp.module.faculty.entity.Faculty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface FacultyRepository
        extends JpaRepository<Faculty, Long> {

    @Query("""
        SELECT f FROM Faculty f
        JOIN FETCH f.user
        JOIN FETCH f.department
        WHERE f.id = :id
        """)
    Optional<Faculty> findByIdWithDetails(@Param("id") Long id);

    @Query("""
        SELECT f FROM Faculty f
        JOIN FETCH f.user
        JOIN FETCH f.department
        WHERE f.department.id = :deptId
        AND f.isActive = true
        """)
    Page<Faculty> findByDepartmentId(
            @Param("deptId") Long deptId, Pageable pageable);

    boolean existsByEmployeeId(String employeeId);

    Optional<Faculty> findByUserId(Long userId);
}