package com.apex.erp.module.exam.repository;

import com.apex.erp.module.exam.entity.StudentSubjectResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentSubjectResultRepository extends JpaRepository<StudentSubjectResult, Long> {

    Optional<StudentSubjectResult> findByStudentIdAndSubjectIdAndAcademicYearAndSemesterNumber(
        Long studentId,
        Long subjectId,
        String academicYear,
        Integer semesterNumber
    );

    List<StudentSubjectResult> findByStudentIdAndAcademicYear(Long studentId, String academicYear);

    List<StudentSubjectResult> findByStudentIdAndAcademicYearAndSemesterNumber(
        Long studentId,
        String academicYear,
        Integer semesterNumber
    );
}
