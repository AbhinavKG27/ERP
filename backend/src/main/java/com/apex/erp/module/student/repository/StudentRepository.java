package com.apex.erp.module.student.repository;

import com.apex.erp.module.student.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query("""
        SELECT s FROM Student s
        JOIN FETCH s.user
        WHERE s.id = :id
        """)
    Optional<Student> findByIdWithDetails(@Param("id") Long id);

    Optional<Student> findByRollNumber(String rollNumber);

    boolean existsByRollNumber(String rollNumber);

    boolean existsByRegisterNumber(String registerNumber);

    @Query("""
        SELECT s FROM Student s
        JOIN FETCH s.user u
        WHERE (LOWER(u.fullName) LIKE LOWER(CONCAT('%',:q,'%'))
           OR  LOWER(s.rollNumber) LIKE LOWER(CONCAT('%',:q,'%')))
        """)
    Page<Student> searchStudents(@Param("q") String query,
                                 Pageable pageable);
}