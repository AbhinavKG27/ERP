package com.apex.erp.module.attendance.service;

import com.apex.erp.config.AppProperties;
import com.apex.erp.exception.BusinessRuleException;
import com.apex.erp.exception.ResourceNotFoundException;
import com.apex.erp.module.attendance.dto.*;
import com.apex.erp.module.attendance.entity.*;
import com.apex.erp.module.attendance.mapper.AttendanceMapper;
import com.apex.erp.module.attendance.repository.*;
import com.apex.erp.module.department.entity.Subject;
import com.apex.erp.module.department.repository.BatchRepository;
import com.apex.erp.module.department.repository.SubjectRepository;
import com.apex.erp.module.faculty.repository.FacultyRepository;
import com.apex.erp.module.student.entity.Student;
import com.apex.erp.module.student.repository.StudentRepository;
import com.apex.erp.module.user.repository.UserRepository;
import com.apex.erp.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceService {

    private final AttendanceSessionRepository  sessionRepo;
    private final AttendanceRecordRepository   recordRepo;
    private final AttendanceSummaryRepository  summaryRepo;
    private final FacultyRepository            facultyRepo;
    private final SubjectRepository            subjectRepo;
    private final BatchRepository              batchRepo;
    private final StudentRepository            studentRepo;
    private final UserRepository               userRepo;
    private final AttendanceMapper             mapper;
    private final AppProperties                appProperties;

    // ── Create session ────────────────────────────────────────
    @Transactional
    public AttendanceSessionDto createSession(
            CreateSessionRequest req, Long facultyUserId) {

        var faculty = facultyRepo.findByUserId(facultyUserId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Faculty", "userId", facultyUserId));

        var subject = subjectRepo.findById(req.getSubjectId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Subject", "id", req.getSubjectId()));

        var batch = batchRepo.findById(req.getBatchId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Batch", "id", req.getBatchId()));

        AttendanceSession session = AttendanceSession.builder()
            .faculty(faculty)
            .subject(subject)
            .batch(batch)
            .sessionDate(req.getSessionDate())
            .startTime(req.getStartTime())
            .endTime(req.getEndTime())
            .academicYear(req.getAcademicYear())
            .semesterNumber(req.getSemesterNumber())
            .build();

        return mapper.toSessionDto(sessionRepo.save(session));
    }

    // ── Mark attendance ───────────────────────────────────────
    @Transactional
    public List<AttendanceRecordDto> markAttendance(
            MarkAttendanceRequest req) {

        AttendanceSession session = sessionRepo
            .findById(req.getSessionId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Session", "id", req.getSessionId()));

        if (Boolean.TRUE.equals(session.getIsFinalized())) {
            throw new BusinessRuleException(
                "SESSION_FINALIZED",
                "Cannot modify a finalized session");
        }

        CustomUserDetails currentUser =
            (CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();

        var markedByUser = userRepo
            .findById(currentUser.getId())
            .orElseThrow();

        // Save attendance for each student
        for (Map.Entry<Long, String> entry :
                req.getAttendanceMap().entrySet()) {
            Long   studentId = entry.getKey();
            String status    = entry.getValue();

            Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Student", "id", studentId));

            // Update existing or create new
            AttendanceRecord record = recordRepo
                .findBySessionIdAndStudentId(
                    session.getId(), studentId)
                .orElse(AttendanceRecord.builder()
                    .session(session)
                    .student(student)
                    .build());

            record.setStatus(status);
            record.setMarkedBy(markedByUser);
            recordRepo.save(record);
        }

        log.info("Attendance marked for sessionId={}",
                 session.getId());

        return recordRepo.findBySessionId(session.getId())
            .stream().map(mapper::toRecordDto).toList();
    }

    // ── Finalize session & update summary ────────────────────
    @Transactional
    public AttendanceSessionDto finalizeSession(Long sessionId) {
        AttendanceSession session = sessionRepo
            .findById(sessionId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Session", "id", sessionId));

        if (Boolean.TRUE.equals(session.getIsFinalized())) {
            throw new BusinessRuleException(
                "ALREADY_FINALIZED",
                "Session already finalized");
        }

        session.setIsFinalized(true);
        sessionRepo.save(session);

        // Update summary for all students in this session
        List<AttendanceRecord> records =
            recordRepo.findBySessionId(sessionId);

        for (AttendanceRecord record : records) {
            updateSummary(record.getStudent(),
                          session.getSubject(),
                          session.getAcademicYear(),
                          session.getSemesterNumber());
        }

        log.info("Session finalized: sessionId={}", sessionId);
        return mapper.toSessionDto(session);
    }

    // ── Get student attendance summary ────────────────────────
    public List<AttendanceSummaryDto> getStudentSummary(
            Long studentId, String academicYear) {
        return summaryRepo
            .findByStudentAndYear(studentId, academicYear)
            .stream().map(mapper::toSummaryDto).toList();
    }

    // ── Get subject attendance summary ────────────────────────
    public List<AttendanceSummaryDto> getSubjectSummary(
            Long subjectId, String academicYear) {
        return summaryRepo
            .findBySubjectAndYear(subjectId, academicYear)
            .stream().map(mapper::toSummaryDto).toList();
    }

    // ── Grant approval ────────────────────────────────────────
    @Transactional
    public AttendanceSummaryDto grantApproval(
            Long studentId, Long subjectId, String academicYear) {
        AttendanceSummary summary = summaryRepo
            .findByStudentIdAndSubjectIdAndAcademicYear(
                studentId, subjectId, academicYear)
            .orElseThrow(() -> new ResourceNotFoundException(
                "AttendanceSummary", "student/subject", studentId));

        if (!"NEEDS_APPROVAL".equals(summary.getEligibilityStatus())) {
            throw new BusinessRuleException(
                "APPROVAL_NOT_REQUIRED",
                "Approval not required for this student");
        }

        summary.setApprovalGranted(true);
        summary.setEligibilityStatus("ELIGIBLE");
        return mapper.toSummaryDto(summaryRepo.save(summary));
    }

    // ── Private: update attendance summary ───────────────────
    private void updateSummary(Student student, Subject subject,
            String academicYear, Integer semesterNumber) {

        AttendanceSummary summary = summaryRepo
            .findByStudentIdAndSubjectIdAndAcademicYear(
                student.getId(), subject.getId(), academicYear)
            .orElse(AttendanceSummary.builder()
                .student(student)
                .subject(subject)
                .academicYear(academicYear)
                .semesterNumber(semesterNumber)
                .build());

        // Count total finalized sessions
        Long total = sessionRepo.countFinalizedSessions(
            subject.getId(),
            student.getBatchId(),
            academicYear);

        // Count present sessions
        Long present = recordRepo.countPresentByStudentAndSubject(
            subject.getId(), student.getId(), academicYear);

        summary.setTotalSessions(total.intValue());
        summary.setAttendedSessions(present.intValue());

        // Calculate percentage
        BigDecimal percentage = total == 0
            ? BigDecimal.ZERO
            : BigDecimal.valueOf(present * 100.0 / total)
                .setScale(2, RoundingMode.HALF_UP);
        summary.setPercentage(percentage);

        // Apply business rules
        double pct = percentage.doubleValue();
        AppProperties.Attendance config =
            appProperties.getAttendance();

        if (pct >= config.getEligibleThreshold()) {
            summary.setEligibilityStatus("ELIGIBLE");
        } else if (pct >= config.getApprovalThreshold()) {
            summary.setEligibilityStatus("NEEDS_APPROVAL");
            summary.setApprovalGranted(false);
        } else if (pct >= config.getFineThreshold()) {
            summary.setEligibilityStatus("FINE_REQUIRED");
        } else {
            summary.setEligibilityStatus("NOT_ELIGIBLE");
        }

        summaryRepo.save(summary);
        log.info("Summary updated: student={}, subject={}, pct={}",
                 student.getId(), subject.getId(), percentage);
    }
}