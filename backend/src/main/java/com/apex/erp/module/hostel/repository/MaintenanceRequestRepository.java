package com.apex.erp.module.hostel.repository;

import com.apex.erp.module.hostel.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MaintenanceRequestRepository
        extends JpaRepository<MaintenanceRequest, Long> {

    @Query("""
        SELECT m FROM MaintenanceRequest m
        JOIN FETCH m.student s
        JOIN FETCH s.user
        JOIN FETCH m.room r
        JOIN FETCH r.block
        WHERE m.student.id = :studentId
        ORDER BY m.raisedAt DESC
        """)
    List<MaintenanceRequest> findByStudentId(
            @Param("studentId") Long studentId);

    @Query("""
        SELECT m FROM MaintenanceRequest m
        JOIN FETCH m.student s
        JOIN FETCH s.user
        JOIN FETCH m.room r
        JOIN FETCH r.block
        WHERE m.status = :status
        ORDER BY m.raisedAt DESC
        """)
    List<MaintenanceRequest> findByStatus(
            @Param("status") String status);
}