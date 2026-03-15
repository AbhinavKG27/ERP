package com.apex.erp.module.attendance.repository;

import com.apex.erp.module.attendance.entity.AttendanceSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceSessionRepository
        extends JpaRepository<AttendanceSession, Long> {

    @Query("""
        SELECT s FROM AttendanceSession s
        JOIN FETCH s.subject
        JOIN FETCH s.batch
        WHERE s.faculty.id = :facultyId
        AND s.academicYear = :year
        ORDER BY s.sessionDate DESC
        """)
    Page<AttendanceSession> findByFacultyAndYear(
            @Param("facultyId") Long facultyId,
            @Param("year") String year,
            Pageable pageable);

    @Query("""
        SELECT s FROM AttendanceSession s
        WHERE s.subject.id = :subjectId
        AND s.batch.id = :batchId
        AND s.academicYear = :year
        ORDER BY s.sessionDate DESC
        """)
    List<AttendanceSession> findBySubjectAndBatch(
            @Param("subjectId") Long subjectId,
            @Param("batchId")   Long batchId,
            @Param("year")      String year);

    @Query("""
        SELECT COUNT(s) FROM AttendanceSession s
        WHERE s.subject.id = :subjectId
        AND s.batch.id = :batchId
        AND s.academicYear = :year
        AND s.isFinalized = true
        """)
    Long countFinalizedSessions(
            @Param("subjectId") Long subjectId,
            @Param("batchId")   Long batchId,
            @Param("year")      String year);
}