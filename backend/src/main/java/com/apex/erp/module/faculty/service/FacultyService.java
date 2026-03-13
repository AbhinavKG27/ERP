package com.apex.erp.module.faculty.service;

import com.apex.erp.common.PagedResponse;
import com.apex.erp.config.AppProperties;
import com.apex.erp.exception.BusinessRuleException;
import com.apex.erp.exception.ResourceNotFoundException;
import com.apex.erp.module.department.entity.Batch;
import com.apex.erp.module.department.entity.Subject;
import com.apex.erp.module.department.repository.BatchRepository;
import com.apex.erp.module.department.repository.SubjectRepository;
import com.apex.erp.module.faculty.dto.*;
import com.apex.erp.module.faculty.entity.Faculty;
import com.apex.erp.module.faculty.entity.FacultySubjectAssignment;
import com.apex.erp.module.faculty.mapper.FacultyMapper;
import com.apex.erp.module.faculty.repository.FacultyRepository;
import com.apex.erp.module.faculty.repository.FacultySubjectAssignmentRepository;
import com.apex.erp.module.user.entity.Role;
import com.apex.erp.module.user.entity.User;
import com.apex.erp.module.user.repository.UserRepository;
import com.apex.erp.module.department.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FacultyService {

    private final FacultyRepository            facultyRepository;
    private final FacultySubjectAssignmentRepository assignmentRepo;
    private final UserRepository               userRepository;
    private final DepartmentRepository         departmentRepository;
    private final SubjectRepository            subjectRepository;
    private final BatchRepository              batchRepository;
    private final FacultyMapper                mapper;
    private final PasswordEncoder              passwordEncoder;
    private final AppProperties                appProperties;

    // ── Create Faculty ────────────────────────────────────────
    @Transactional
    public FacultyDto createFaculty(CreateFacultyRequest req) {
        if (facultyRepository.existsByEmployeeId(req.getEmployeeId()))
            throw new BusinessRuleException(
                "DUPLICATE_EMPLOYEE_ID",
                "Employee ID already exists: " + req.getEmployeeId());

        if (userRepository.existsByEmail(req.getEmail()))
            throw new BusinessRuleException(
                "DUPLICATE_EMAIL",
                "Email already registered: " + req.getEmail());

        var dept = departmentRepository.findById(req.getDepartmentId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Department", "id", req.getDepartmentId()));

        // Default password = employeeId
        User user = User.builder()
            .email(req.getEmail())
            .passwordHash(passwordEncoder.encode(req.getEmployeeId()))
            .role(Role.FACULTY)
            .fullName(req.getFullName())
            .phone(req.getPhone())
            .isActive(true)
            .build();
        userRepository.save(user);

        Faculty faculty = Faculty.builder()
            .user(user)
            .employeeId(req.getEmployeeId())
            .department(dept)
            .designation(req.getDesignation())
            .specialization(req.getSpecialization())
            .qualification(req.getQualification())
            .joiningDate(req.getJoiningDate())
            .build();

        Faculty saved = facultyRepository.save(faculty);
        log.info("Faculty created: employeeId={}", saved.getEmployeeId());
        return mapper.toDto(saved);
    }

    // ── Get Faculty ───────────────────────────────────────────
    public FacultyDto getFacultyById(Long id) {
        return mapper.toDto(
            facultyRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Faculty", "id", id)));
    }

    public PagedResponse<FacultyDto> getFacultyByDepartment(
            Long deptId, int page, int size) {
        int maxSize = appProperties.getPagination().getMaxPageSize();
        var pageable = PageRequest.of(page, Math.min(size, maxSize));
        return new PagedResponse<>(
            facultyRepository.findByDepartmentId(deptId, pageable)
                .map(mapper::toDto));
    }

    // ── Assign Subject ────────────────────────────────────────
    @Transactional
    public SubjectAssignmentDto assignSubject(
            AssignSubjectRequest req) {
        Faculty faculty = facultyRepository
            .findById(req.getFacultyId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Faculty", "id", req.getFacultyId()));

        Subject subject = subjectRepository
            .findById(req.getSubjectId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Subject", "id", req.getSubjectId()));

        Batch batch = batchRepository
            .findById(req.getBatchId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Batch", "id", req.getBatchId()));

        FacultySubjectAssignment assignment =
            FacultySubjectAssignment.builder()
                .faculty(faculty)
                .subject(subject)
                .batch(batch)
                .academicYear(req.getAcademicYear())
                .semesterNumber(req.getSemesterNumber())
                .build();

        return mapper.toAssignmentDto(
            assignmentRepo.save(assignment));
    }

    // ── Get Assignments ───────────────────────────────────────
    public List<SubjectAssignmentDto> getFacultyAssignments(
            Long facultyId, String academicYear) {
        return assignmentRepo
            .findByFacultyAndYear(facultyId, academicYear)
            .stream().map(mapper::toAssignmentDto).toList();
    }
}