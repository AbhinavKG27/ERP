package com.apex.erp.module.exam.service;

import com.apex.erp.exception.BusinessRuleException;
import com.apex.erp.exception.ResourceNotFoundException;
import com.apex.erp.module.department.repository.BatchRepository;
import com.apex.erp.module.department.repository.SubjectRepository;
import com.apex.erp.module.exam.dto.*;
import com.apex.erp.module.exam.entity.*;
import com.apex.erp.module.exam.mapper.ExamMapper;
import com.apex.erp.module.exam.repository.*;
import com.apex.erp.module.faculty.repository.FacultyRepository;
import com.apex.erp.module.student.entity.Student;
import com.apex.erp.module.student.repository.StudentRepository;
import com.apex.erp.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExamService {

    private static final BigDecimal WEIGHT_INTERNAL = BigDecimal.valueOf(0.40);
    private static final BigDecimal WEIGHT_EXTERNAL = BigDecimal.valueOf(0.60);

    private final ExamRepository examRepo;
    private final MarksEntryRepository marksRepo;
    private final StudentSubjectResultRepository resultRepo;
    private final SubjectRepository subjectRepo;
    private final BatchRepository batchRepo;
    private final FacultyRepository facultyRepo;
    private final StudentRepository studentRepo;
    private final UserRepository userRepo;
    private final ExamMapper mapper;

    @Transactional
    public ExamDto createExam(CreateExamRequest req, Long facultyUserId) {
        var faculty = facultyRepo.findByUserId(facultyUserId)
            .orElseThrow(() -> new ResourceNotFoundException("Faculty", "userId", facultyUserId));

        var subject = subjectRepo.findById(req.getSubjectId())
            .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", req.getSubjectId()));

        var batch = batchRepo.findById(req.getBatchId())
            .orElseThrow(() -> new ResourceNotFoundException("Batch", "id", req.getBatchId()));

        Exam exam = Exam.builder()
            .subject(subject)
            .batch(batch)
            .faculty(faculty)
            .examType(req.getExamType())
            .examDate(req.getExamDate())
            .maxMarks(req.getMaxMarks())
            .academicYear(req.getAcademicYear())
            .semesterNumber(req.getSemesterNumber())
            .createdBy(facultyUserId)
            .build();

        return mapper.toExamDto(examRepo.save(exam));
    }

    @Transactional
    public List<MarksEntryDto> upsertMarks(UpsertMarksRequest req, Long evaluatorUserId) {
        Exam exam = examRepo.findById(req.getExamId())
            .orElseThrow(() -> new ResourceNotFoundException("Exam", "id", req.getExamId()));

        var evaluator = userRepo.findById(evaluatorUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", evaluatorUserId));

        for (MarkEntryRequest item : req.getMarks()) {
            if (item.getMarksObtained().compareTo(exam.getMaxMarks()) > 0) {
                throw new BusinessRuleException("INVALID_MARKS", "Marks cannot exceed exam max marks");
            }

            Student student = studentRepo.findById(item.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", item.getStudentId()));

            MarksEntry entry = marksRepo.findByExamIdAndStudentId(exam.getId(), student.getId())
                .orElse(MarksEntry.builder()
                    .exam(exam)
                    .student(student)
                    .build());

            entry.setMarksObtained(item.getMarksObtained());
            entry.setIsAbsent(Boolean.TRUE.equals(item.getIsAbsent()));
            entry.setIsMalpractice(Boolean.TRUE.equals(item.getIsMalpractice()));
            entry.setEvaluatedBy(evaluator);
            entry.setEvaluatedAt(LocalDateTime.now());
            marksRepo.save(entry);

            recalculateResult(student, exam.getSubject().getId(), exam.getAcademicYear(), exam.getSemesterNumber());
        }

        return marksRepo.findByExamId(exam.getId()).stream().map(mapper::toMarksEntryDto).toList();
    }

    @Transactional
    public StudentResultDto revaluate(RevaluationRequest req) {
        MarksEntry entry = marksRepo.findByExamIdAndStudentId(req.getExamId(), req.getStudentId())
            .orElseThrow(() -> new ResourceNotFoundException("MarksEntry", "exam/student", req.getStudentId()));

        if (req.getNewMarks().compareTo(entry.getMarksObtained()) <= 0) {
            throw new BusinessRuleException("REVALUATION_RULE", "Revaluation marks must be greater than original marks");
        }

        if (req.getNewMarks().compareTo(entry.getExam().getMaxMarks()) > 0) {
            throw new BusinessRuleException("INVALID_MARKS", "Marks cannot exceed exam max marks");
        }

        entry.setMarksObtained(req.getNewMarks());
        entry.setEvaluatedAt(LocalDateTime.now());
        marksRepo.save(entry);

        return recalculateResult(
            entry.getStudent(),
            entry.getExam().getSubject().getId(),
            entry.getExam().getAcademicYear(),
            entry.getExam().getSemesterNumber()
        );
    }

    public List<StudentResultDto> getStudentResults(Long studentId, String academicYear, Integer semesterNumber) {
        var results = resultRepo.findByStudentIdAndAcademicYearAndSemesterNumber(studentId, academicYear, semesterNumber);
        return results.stream().map(mapper::toResultDto).toList();
    }

    private StudentResultDto recalculateResult(Student student, Long subjectId, String academicYear, Integer semesterNumber) {
        List<MarksEntry> entries = marksRepo
            .findByStudentIdAndExamSubjectIdAndExamAcademicYearAndExamSemesterNumber(
                student.getId(), subjectId, academicYear, semesterNumber);

        Map<String, BigDecimal> marksByType = new HashMap<>();
        for (MarksEntry entry : entries) {
            BigDecimal effectiveMarks = (Boolean.TRUE.equals(entry.getIsAbsent()) || Boolean.TRUE.equals(entry.getIsMalpractice()))
                ? BigDecimal.ZERO : entry.getMarksObtained();
            marksByType.put(entry.getExam().getExamType(), effectiveMarks);
        }

        BigDecimal cia1 = marksByType.getOrDefault("CIA1", BigDecimal.ZERO);
        BigDecimal cia2 = marksByType.getOrDefault("CIA2", BigDecimal.ZERO);
        BigDecimal external = marksByType.getOrDefault("EXTERNAL", BigDecimal.ZERO);
        BigDecimal internal = cia1.add(cia2).divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);
        BigDecimal combined = internal.multiply(WEIGHT_INTERNAL)
            .add(external.multiply(WEIGHT_EXTERNAL))
            .setScale(2, RoundingMode.HALF_UP);

        Grade grade = resolveGrade(combined);

        StudentSubjectResult result = resultRepo
            .findByStudentIdAndSubjectIdAndAcademicYearAndSemesterNumber(student.getId(), subjectId, academicYear, semesterNumber)
            .orElse(StudentSubjectResult.builder()
                .student(student)
                .subject(subjectRepo.findById(subjectId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", subjectId)))
                .academicYear(academicYear)
                .semesterNumber(semesterNumber)
                .build());

        result.setCia1Marks(cia1);
        result.setCia2Marks(cia2);
        result.setInternalMarks(internal);
        result.setExternalMarks(external);
        result.setCombinedMarks(combined);
        result.setGradeLetter(grade.letter());
        result.setGradePoint(grade.points());
        result.setIsPass(!"F".equals(grade.letter()));
        result.setIsBacklog("F".equals(grade.letter()));
        result.setUpdatedAt(LocalDateTime.now());
        var saved = resultRepo.save(result);

        recalculateStudentCgpaAndDetention(student, academicYear);
        return mapper.toResultDto(saved);
    }

    private void recalculateStudentCgpaAndDetention(Student student, String academicYear) {
        List<StudentSubjectResult> yearResults = resultRepo.findByStudentIdAndAcademicYear(student.getId(), academicYear);

        BigDecimal cgpa = yearResults.isEmpty()
            ? BigDecimal.ZERO
            : BigDecimal.valueOf(
                yearResults.stream().mapToInt(StudentSubjectResult::getGradePoint).average().orElse(0.0)
            ).setScale(2, RoundingMode.HALF_UP);

        if (cgpa.compareTo(BigDecimal.TEN) > 0) {
            cgpa = BigDecimal.TEN;
        }

        long backlogCount = yearResults.stream().filter(StudentSubjectResult::getIsBacklog).count();

        student.setCurrentCgpa(cgpa);
        student.setIsDetained(backlogCount > 4);
        studentRepo.save(student);

        log.info("Updated student performance: studentId={}, cgpa={}, backlogs={}, detained={}",
            student.getId(), cgpa, backlogCount, student.getIsDetained());
    }

    private Grade resolveGrade(BigDecimal combined) {
        double score = combined.doubleValue();
        if (score >= 90) return new Grade("O", 10);
        if (score >= 80) return new Grade("A+", 9);
        if (score >= 70) return new Grade("A", 8);
        if (score >= 60) return new Grade("B+", 7);
        if (score >= 50) return new Grade("B", 6);
        if (score >= 40) return new Grade("C", 5);
        return new Grade("F", 0);
    }

    private record Grade(String letter, Integer points) {}
}
