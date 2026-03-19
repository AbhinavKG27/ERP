package com.apex.erp.grievance.repository;

import com.apex.erp.grievance.entity.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GrievanceRepository
        extends JpaRepository<Grievance, Long> {

    List<Grievance> findByStudentId(Long studentId);

    List<Grievance> findByAssignedFacultyId(Long facultyId);

    List<Grievance> findByStatus(String status);

    @Query("""
        SELECT g FROM Grievance g
        ORDER BY g.submittedAt DESC
        """)
    List<Grievance> findAllOrderBySubmittedAtDesc();
}