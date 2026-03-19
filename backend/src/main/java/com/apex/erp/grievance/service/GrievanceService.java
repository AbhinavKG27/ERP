package com.apex.erp.grievance.service;

import com.apex.erp.exception.ResourceNotFoundException;
import com.apex.erp.grievance.dto.*;
import com.apex.erp.grievance.entity.*;
import com.apex.erp.grievance.mapper.GrievanceMapper;
import com.apex.erp.grievance.repository.*;
import com.apex.erp.module.user.entity.User;
import com.apex.erp.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GrievanceService {

    private final GrievanceRepository        grievanceRepository;
    private final GrievanceCommentRepository commentRepository;
    private final UserRepository             userRepository;
    private final GrievanceMapper            mapper;

    public GrievanceResponse submitGrievance(
            Long studentId, GrievanceRequest request) {
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", studentId));

        Grievance grievance = Grievance.builder()
            .student(student)
            .subject(request.getSubject())
            .description(request.getDescription())
            .category(request.getCategory().name())
            .status("SUBMITTED")
            .anonymous(request.isAnonymous())
            .build();

        return mapper.toResponse(grievanceRepository.save(grievance));
    }

    @Transactional(readOnly = true)
    public GrievanceResponse getById(Long id) {
        return mapper.toResponse(findGrievance(id));
    }

    @Transactional(readOnly = true)
    public List<GrievanceResponse> getByStudent(Long studentId) {
        return grievanceRepository.findByStudentId(studentId)
            .stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<GrievanceResponse> getAll() {
        return grievanceRepository.findAllOrderBySubmittedAtDesc()
            .stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<GrievanceResponse> getByFaculty(Long facultyId) {
        return grievanceRepository
            .findByAssignedFacultyId(facultyId)
            .stream().map(mapper::toResponse).toList();
    }

    public GrievanceResponse assignGrievance(
            Long grievanceId, GrievanceAssignRequest request) {
        Grievance grievance = findGrievance(grievanceId);
        User faculty = userRepository
            .findById(request.getFacultyId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", request.getFacultyId()));

        grievance.setAssignedFaculty(faculty);
        grievance.setStatus("ASSIGNED");
        grievance.setAssignedAt(LocalDateTime.now());

        return mapper.toResponse(
            grievanceRepository.save(grievance));
    }

    public GrievanceResponse escalateGrievance(
            Long grievanceId, Long hodId) {
        Grievance grievance = findGrievance(grievanceId);
        User hod = userRepository.findById(hodId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", hodId));

        grievance.setHod(hod);
        grievance.setStatus("ESCALATED");
        grievance.setEscalatedAt(LocalDateTime.now());

        return mapper.toResponse(
            grievanceRepository.save(grievance));
    }

    public GrievanceResponse resolveGrievance(
            Long grievanceId, GrievanceResolveRequest request) {
        Grievance grievance = findGrievance(grievanceId);
        grievance.setStatus("RESOLVED");
        grievance.setResolvedAt(LocalDateTime.now());
        grievance.setResolutionNote(request.getResolutionNote());

        return mapper.toResponse(
            grievanceRepository.save(grievance));
    }

    public GrievanceCommentResponse addComment(
            Long grievanceId, Long commenterId,
            GrievanceCommentRequest request) {
        Grievance grievance = findGrievance(grievanceId);
        User commenter = userRepository.findById(commenterId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", commenterId));

        GrievanceComment comment = GrievanceComment.builder()
            .grievance(grievance)
            .commenter(commenter)
            .comment(request.getComment())
            .build();

        return mapper.toCommentResponse(
            commentRepository.save(comment));
    }

    @Transactional(readOnly = true)
    public List<GrievanceCommentResponse> getComments(
            Long grievanceId) {
        return commentRepository
            .findByGrievanceIdOrderByCommentedAtAsc(grievanceId)
            .stream().map(mapper::toCommentResponse).toList();
    }

    private Grievance findGrievance(Long id) {
        return grievanceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Grievance", "id", id));
    }
}