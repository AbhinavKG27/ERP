package com.apex.erp.module.faculty.repository;

import com.apex.erp.module.faculty.entity.FacultySubjectAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FacultySubjectAssignmentRepository
        extends JpaRepository<FacultySubjectAssignment, Long> {

    @Query("""
        SELECT a FROM FacultySubjectAssignment a
        JOIN FETCH a.subject
        JOIN FETCH a.batch b
        JOIN FETCH b.program
        WHERE a.faculty.id = :facultyId
        AND a.academicYear = :year
        AND a.isActive = true
        """)
    List<FacultySubjectAssignment> findByFacultyAndYear(
            @Param("facultyId") Long facultyId,
            @Param("year") String academicYear);

    @Query("""
        SELECT a FROM FacultySubjectAssignment a
        JOIN FETCH a.faculty f
        JOIN FETCH f.user
        WHERE a.subject.id = :subjectId
        AND a.batch.id = :batchId
        AND a.academicYear = :year
        AND a.isActive = true
        """)
    List<FacultySubjectAssignment> findBySubjectAndBatch(
            @Param("subjectId") Long subjectId,
            @Param("batchId")   Long batchId,
            @Param("year")      String academicYear);
}