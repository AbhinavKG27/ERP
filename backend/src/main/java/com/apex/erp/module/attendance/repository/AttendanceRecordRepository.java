package com.apex.erp.module.attendance.repository;

import com.apex.erp.module.attendance.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AttendanceRecordRepository
        extends JpaRepository<AttendanceRecord, Long> {

    List<AttendanceRecord> findBySessionId(Long sessionId);

    Optional<AttendanceRecord> findBySessionIdAndStudentId(
            Long sessionId, Long studentId);

    @Query("""
        SELECT COUNT(r) FROM AttendanceRecord r
        WHERE r.session.subject.id = :subjectId
        AND r.student.id = :studentId
        AND r.session.academicYear = :year
        AND r.status = 'PRESENT'
        """)
    Long countPresentByStudentAndSubject(
            @Param("subjectId")  Long subjectId,
            @Param("studentId")  Long studentId,
            @Param("year")       String year);
}