package com.apex.erp.module.department.repository;

import com.apex.erp.module.department.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository
        extends JpaRepository<Department, Long> {

    Optional<Department> findByCode(String code);
    boolean existsByCode(String code);
    boolean existsByName(String name);

    @Query("SELECT DISTINCT d FROM Department d " +
           "LEFT JOIN FETCH d.hod " +
           "WHERE d.isActive = true")
    List<Department> findAllActive();

    @Query("SELECT d FROM Department d " +
           "LEFT JOIN FETCH d.hod " +
           "WHERE d.id = :id")
    Optional<Department> findByIdWithHod(@Param("id") Long id);
}