package com.apex.erp.module.student.service;

import com.apex.erp.common.PagedResponse;
import com.apex.erp.config.AppProperties;
import com.apex.erp.exception.BusinessRuleException;
import com.apex.erp.exception.ResourceNotFoundException;
import com.apex.erp.module.department.repository.BatchRepository;
import com.apex.erp.module.student.dto.CreateStudentRequest;
import com.apex.erp.module.student.dto.StudentDto;
import com.apex.erp.module.student.entity.Student;
import com.apex.erp.module.student.mapper.StudentMapper;
import com.apex.erp.module.student.repository.StudentRepository;
import com.apex.erp.module.user.entity.Role;
import com.apex.erp.module.user.entity.User;
import com.apex.erp.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository    userRepository;
    private final BatchRepository   batchRepository;
    private final StudentMapper     studentMapper;
    private final PasswordEncoder   passwordEncoder;
    private final AppProperties     appProperties;

    @Transactional
    public StudentDto createStudent(CreateStudentRequest request) {
        if (studentRepository.existsByRollNumber(
                request.getRollNumber()))
            throw new BusinessRuleException(
                "DUPLICATE_ROLL_NUMBER",
                "Roll number already exists: "
                + request.getRollNumber());

        if (studentRepository.existsByRegisterNumber(
                request.getRegisterNumber()))
            throw new BusinessRuleException(
                "DUPLICATE_REGISTER_NUMBER",
                "Register number already exists: "
                + request.getRegisterNumber());

        if (userRepository.existsByEmail(request.getEmail()))
            throw new BusinessRuleException(
                "DUPLICATE_EMAIL",
                "Email already registered: "
                + request.getEmail());

        batchRepository.findById(request.getBatchId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Batch", "id", request.getBatchId()));

        User user = User.builder()
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(
                request.getRollNumber()))
            .role(Role.STUDENT)
            .fullName(request.getFullName())
            .phone(request.getPhone())
            .isActive(true)
            .build();
        userRepository.save(user);

        Student student = Student.builder()
            .user(user)
            .rollNumber(request.getRollNumber())
            .registerNumber(request.getRegisterNumber())
            .batchId(request.getBatchId())
            .dateOfBirth(request.getDateOfBirth())
            .gender(request.getGender())
            .bloodGroup(request.getBloodGroup())
            .address(request.getAddress())
            .parentName(request.getParentName())
            .parentPhone(request.getParentPhone())
            .parentEmail(request.getParentEmail())
            .admissionDate(request.getAdmissionDate())
            .build();

        Student saved = studentRepository.save(student);
        log.info("Student created: rollNumber={}",
                 saved.getRollNumber());
        return studentMapper.toDto(saved);
    }

    public StudentDto getStudentById(Long id) {
        return studentMapper.toDto(
            studentRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Student", "id", id)));
    }

    public PagedResponse<StudentDto> getAllStudents(
            int page, int size, String sort) {
        size = Math.min(size,
            appProperties.getPagination().getMaxPageSize());
        Pageable pageable = PageRequest.of(page, size,
            Sort.by(Sort.Direction.ASC, sort));
        Page<StudentDto> mapped = studentRepository
            .findAll(pageable)
            .map(studentMapper::toDto);
        return new PagedResponse<>(mapped);
    }

    public PagedResponse<StudentDto> searchStudents(
            String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return new PagedResponse<>(
            studentRepository
                .searchStudents(query, pageable)
                .map(studentMapper::toDto));
    }

    @Transactional
    public StudentDto updateStudentStatus(
            Long id, String status) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Student", "id", id));
        student.setStatus(status);
        if ("DETAINED".equals(status))
            student.setIsDetained(true);
        return studentMapper.toDto(
            studentRepository.save(student));
    }
}