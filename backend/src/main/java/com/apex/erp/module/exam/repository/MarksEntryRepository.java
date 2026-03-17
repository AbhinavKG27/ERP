package com.apex.erp.module.exam.repository;

import com.apex.erp.module.exam.entity.MarksEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MarksEntryRepository extends JpaRepository<MarksEntry, Long> {

    Optional<MarksEntry> findByExamIdAndStudentId(Long examId, Long studentId);

    List<MarksEntry> findByExamId(Long examId);

    List<MarksEntry> findByStudentIdAndExamSubjectIdAndExamAcademicYearAndExamSemesterNumber(
        Long studentId,
        Long subjectId,
        String academicYear,
        Integer semesterNumber
    );
}
