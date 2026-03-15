package com.apex.erp.module.attendance.repository;

import com.apex.erp.module.attendance.entity.AttendanceSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AttendanceSummaryRepository
        extends JpaRepository<AttendanceSummary, Long> {

    Optional<AttendanceSummary> findByStudentIdAndSubjectIdAndAcademicYear(
            Long studentId, Long subjectId, String academicYear);

    @Query("""
        SELECT s FROM AttendanceSummary s
        JOIN FETCH s.subject
        WHERE s.student.id = :studentId
        AND s.academicYear = :year
        ORDER BY s.semesterNumber
        """)
    List<AttendanceSummary> findByStudentAndYear(
            @Param("studentId") Long studentId,
            @Param("year")      String year);

    @Query("""
        SELECT s FROM AttendanceSummary s
        JOIN FETCH s.student st
        JOIN FETCH st.user
        WHERE s.subject.id = :subjectId
        AND s.academicYear = :year
        """)
    List<AttendanceSummary> findBySubjectAndYear(
            @Param("subjectId") Long subjectId,
            @Param("year")      String year);
}