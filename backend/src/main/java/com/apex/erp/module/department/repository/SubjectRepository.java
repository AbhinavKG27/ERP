package com.apex.erp.module.department.repository;

import com.apex.erp.module.department.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubjectRepository
        extends JpaRepository<Subject, Long> {

    @Query("""
        SELECT s FROM Subject s
        JOIN FETCH s.department
        WHERE s.department.id = :deptId
        AND s.isActive = true
        """)
    List<Subject> findByDepartmentId(
            @Param("deptId") Long deptId);

    @Query("""
        SELECT s FROM Subject s
        JOIN FETCH s.department
        WHERE s.department.id = :deptId
        AND s.semesterNumber = :sem
        AND s.isActive = true
        """)
    List<Subject> findByDepartmentAndSemester(
            @Param("deptId") Long deptId,
            @Param("sem") Integer semester);

    boolean existsByCode(String code);
}