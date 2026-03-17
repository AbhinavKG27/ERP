package com.apex.erp.module.exam.repository;

import com.apex.erp.module.exam.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {

    List<Exam> findByAcademicYearAndSemesterNumber(String academicYear, Integer semesterNumber);
}
