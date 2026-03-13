package com.apex.erp.module.department.service;

import com.apex.erp.exception.BusinessRuleException;
import com.apex.erp.exception.ResourceNotFoundException;
import com.apex.erp.module.department.dto.*;
import com.apex.erp.module.department.entity.*;
import com.apex.erp.module.department.mapper.DepartmentMapper;
import com.apex.erp.module.department.repository.*;
import com.apex.erp.module.user.entity.User;
import com.apex.erp.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final ProgramRepository    programRepository;
    private final BatchRepository      batchRepository;
    private final SubjectRepository    subjectRepository;
    private final UserRepository       userRepository;
    private final DepartmentMapper     mapper;

    // ═══════════════════════════════════════════
    // DEPARTMENT
    // ═══════════════════════════════════════════

    @Transactional
    public DepartmentDto createDepartment(
            CreateDepartmentRequest req) {
        if (departmentRepository.existsByCode(req.getCode()))
            throw new BusinessRuleException(
                "DUPLICATE_DEPT_CODE",
                "Department code already exists: " + req.getCode());
        if (departmentRepository.existsByName(req.getName()))
            throw new BusinessRuleException(
                "DUPLICATE_DEPT_NAME",
                "Department name already exists: " + req.getName());

        Department dept = Department.builder()
            .name(req.getName())
            .code(req.getCode())
            .programType(req.getProgramType())
            .build();

        if (req.getHodId() != null) {
            User hod = userRepository.findById(req.getHodId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "User", "id", req.getHodId()));
            dept.setHod(hod);
        }

        Department saved = departmentRepository.save(dept);
        log.info("Department created: code={}", saved.getCode());
        return mapper.toDto(saved);
    }

    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAllActive()
            .stream().map(mapper::toDto).toList();
    }

    public DepartmentDto getDepartmentById(Long id) {
        return mapper.toDto(
            departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Department", "id", id)));
    }

    @Transactional
    public DepartmentDto assignHod(Long deptId, Long hodId) {
        Department dept = departmentRepository.findById(deptId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Department", "id", deptId));
        User hod = userRepository.findById(hodId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", hodId));
        dept.setHod(hod);
        return mapper.toDto(departmentRepository.save(dept));
    }

    // ═══════════════════════════════════════════
    // PROGRAM
    // ═══════════════════════════════════════════

    @Transactional
    public ProgramDto createProgram(CreateProgramRequest req) {
        if (programRepository.existsByCode(req.getCode()))
            throw new BusinessRuleException(
                "DUPLICATE_PROGRAM_CODE",
                "Program code already exists: " + req.getCode());

        Department dept = departmentRepository
            .findById(req.getDepartmentId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Department", "id", req.getDepartmentId()));

        Program program = Program.builder()
            .name(req.getName())
            .code(req.getCode())
            .department(dept)
            .durationYears(req.getDurationYears())
            .totalSemesters(req.getTotalSemesters())
            .build();

        return mapper.toDto(programRepository.save(program));
    }

    public List<ProgramDto> getProgramsByDepartment(Long deptId) {
        return programRepository.findByDepartmentId(deptId)
            .stream().map(mapper::toDto).toList();
    }

    public List<ProgramDto> getAllPrograms() {
        return programRepository.findAll()
            .stream().map(mapper::toDto).toList();
    }

    // ═══════════════════════════════════════════
    // BATCH
    // ═══════════════════════════════════════════

    @Transactional
    public BatchDto createBatch(CreateBatchRequest req) {
        Program program = programRepository
            .findById(req.getProgramId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Program", "id", req.getProgramId()));

        Batch batch = Batch.builder()
            .program(program)
            .joinYear(req.getJoinYear())
            .graduationYear(req.getGraduationYear())
            .section(req.getSection())
            .build();

        return mapper.toDto(batchRepository.save(batch));
    }

    public List<BatchDto> getBatchesByDepartment(Long deptId) {
        return batchRepository.findByDepartmentId(deptId)
            .stream().map(mapper::toDto).toList();
    }

    public List<BatchDto> getBatchesByProgram(Long programId) {
        return batchRepository.findByProgramId(programId)
            .stream().map(mapper::toDto).toList();
    }

    // ═══════════════════════════════════════════
    // SUBJECT
    // ═══════════════════════════════════════════

    @Transactional
    public SubjectDto createSubject(CreateSubjectRequest req) {
        if (subjectRepository.existsByCode(req.getCode()))
            throw new BusinessRuleException(
                "DUPLICATE_SUBJECT_CODE",
                "Subject code already exists: " + req.getCode());

        Department dept = departmentRepository
            .findById(req.getDepartmentId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Department", "id", req.getDepartmentId()));

        Subject subject = Subject.builder()
            .name(req.getName())
            .code(req.getCode())
            .department(dept)
            .semesterNumber(req.getSemesterNumber())
            .credits(req.getCredits())
            .subjectType(req.getSubjectType() != null
                ? req.getSubjectType() : "THEORY")
            .build();

        return mapper.toDto(subjectRepository.save(subject));
    }

    public List<SubjectDto> getSubjectsByDepartment(Long deptId) {
        return subjectRepository.findByDepartmentId(deptId)
            .stream().map(mapper::toDto).toList();
    }

    public List<SubjectDto> getSubjectsByDepartmentAndSemester(
            Long deptId, Integer semester) {
        return subjectRepository
            .findByDepartmentAndSemester(deptId, semester)
            .stream().map(mapper::toDto).toList();
    }
}