package com.apex.erp.feedback.repository;

import com.apex.erp.feedback.entity.FeedbackForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FeedbackFormRepository
        extends JpaRepository<FeedbackForm, Long> {
    List<FeedbackForm> findByFacultyId(Long facultyId);
    List<FeedbackForm> findByDepartmentId(Long departmentId);
    List<FeedbackForm> findByStatus(String status);
    List<FeedbackForm> findByAcademicYearAndSemester(
            String academicYear, Integer semester);

    @Query("""
        SELECT DISTINCT f FROM FeedbackForm f
        LEFT JOIN FETCH f.faculty
        LEFT JOIN FETCH f.department
        LEFT JOIN FETCH f.createdBy
        """)
    List<FeedbackForm> findAllWithRelations();
}