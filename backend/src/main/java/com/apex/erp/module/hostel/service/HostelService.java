package com.apex.erp.module.hostel.service;

import com.apex.erp.exception.BusinessRuleException;
import com.apex.erp.exception.ResourceNotFoundException;
import com.apex.erp.module.hostel.dto.*;
import com.apex.erp.module.hostel.entity.*;
import com.apex.erp.module.hostel.mapper.HostelMapper;
import com.apex.erp.module.hostel.repository.*;
import com.apex.erp.module.student.repository.StudentRepository;
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
public class HostelService {

    private final HostelBlockRepository       blockRepo;
    private final HostelRoomRepository        roomRepo;
    private final HostelAllotmentRepository   allotmentRepo;
    private final MaintenanceRequestRepository maintenanceRepo;
    private final StudentRepository           studentRepo;
    private final UserRepository              userRepo;
    private final HostelMapper                mapper;

    // ── Block management ──────────────────────────────────────
    @Transactional
    public HostelBlockDto createBlock(CreateBlockRequest req) {
        HostelBlock block = HostelBlock.builder()
            .name(req.getName())
            .gender(req.getGender())
            .totalRooms(req.getTotalRooms())
            .build();

        if (req.getWardenId() != null) {
            var warden = userRepo.findById(req.getWardenId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "User", "id", req.getWardenId()));
            block.setWarden(warden);
        }
        return mapper.toDto(blockRepo.save(block));
    }

    public List<HostelBlockDto> getAllBlocks() {
        return blockRepo.findAllActive()
            .stream().map(mapper::toDto).toList();
    }

    // ── Room management ───────────────────────────────────────
    @Transactional
    public HostelRoomDto createRoom(CreateRoomRequest req) {
        var block = blockRepo.findById(req.getBlockId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "HostelBlock", "id", req.getBlockId()));

        HostelRoom room = HostelRoom.builder()
            .block(block)
            .roomNumber(req.getRoomNumber())
            .roomType(req.getRoomType())
            .capacity(req.getCapacity())
            .floorNumber(req.getFloorNumber())
            .isAvailable(true)
            .build();

        return mapper.toDto(roomRepo.save(room));
    }

    public List<HostelRoomDto> getRoomsByBlock(Long blockId) {
        return roomRepo.findByBlockId(blockId)
            .stream().map(mapper::toDto).toList();
    }

    public List<HostelRoomDto> getAvailableRooms(String gender) {
        return roomRepo.findAvailableByGender(gender)
            .stream().map(mapper::toDto).toList();
    }

    // ── Room allotment ────────────────────────────────────────
    @Transactional
    public AllotmentDto allotRoom(AllotRoomRequest req) {
        var student = studentRepo.findById(req.getStudentId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Student", "id", req.getStudentId()));

        var room = roomRepo.findById(req.getRoomId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "HostelRoom", "id", req.getRoomId()));

        // Check already allotted
        if (allotmentRepo
                .existsByStudentIdAndAcademicYearAndStatus(
                    req.getStudentId(),
                    req.getAcademicYear(), "ACTIVE")) {
            throw new BusinessRuleException(
                "ALREADY_ALLOTTED",
                "Student already has an active room allotment");
        }

        // Check room availability
        if (!Boolean.TRUE.equals(room.getIsAvailable())) {
            throw new BusinessRuleException(
                "ROOM_FULL",
                "Room is not available");
        }

        HostelAllotment allotment = HostelAllotment.builder()
            .student(student)
            .room(room)
            .academicYear(req.getAcademicYear())
            .allotmentDate(req.getAllotmentDate())
            .build();

        allotmentRepo.save(allotment);

        // Update room occupancy
        room.setOccupiedCount(room.getOccupiedCount() + 1);
        if (room.getOccupiedCount() >= room.getCapacity()) {
            room.setIsAvailable(false);
        }
        roomRepo.save(room);

        log.info("Room allotted: student={}, room={}",
                 req.getStudentId(), req.getRoomId());
        return mapper.toDto(allotment);
    }

    public AllotmentDto getStudentAllotment(
            Long studentId, String academicYear) {
        return allotmentRepo
            .findActiveByStudentAndYear(studentId, academicYear)
            .map(mapper::toDto)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Allotment", "studentId", studentId));
    }

    // ── Vacate room ───────────────────────────────────────────
    @Transactional
    public AllotmentDto vacateRoom(Long allotmentId) {
        HostelAllotment allotment = allotmentRepo
            .findById(allotmentId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Allotment", "id", allotmentId));

        allotment.setStatus("VACATED");
        allotment.setVacatingDate(java.time.LocalDate.now());
        allotmentRepo.save(allotment);

        // Update room occupancy
        HostelRoom room = allotment.getRoom();
        room.setOccupiedCount(
            Math.max(0, room.getOccupiedCount() - 1));
        room.setIsAvailable(true);
        roomRepo.save(room);

        return mapper.toDto(allotment);
    }

    // ── Maintenance requests ──────────────────────────────────
    @Transactional
    public MaintenanceRequestDto raiseRequest(
            RaiseMaintenanceRequest req) {
        var student = studentRepo.findById(req.getStudentId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Student", "id", req.getStudentId()));

        var room = roomRepo.findById(req.getRoomId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "HostelRoom", "id", req.getRoomId()));

        MaintenanceRequest request = MaintenanceRequest.builder()
            .student(student)
            .room(room)
            .issueType(req.getIssueType())
            .description(req.getDescription())
            .build();

        return mapper.toDto(maintenanceRepo.save(request));
    }

    public List<MaintenanceRequestDto> getStudentRequests(
            Long studentId) {
        return maintenanceRepo.findByStudentId(studentId)
            .stream().map(mapper::toDto).toList();
    }

    public List<MaintenanceRequestDto> getOpenRequests() {
        return maintenanceRepo.findByStatus("OPEN")
            .stream().map(mapper::toDto).toList();
    }

    @Transactional
    public MaintenanceRequestDto resolveRequest(
            Long requestId, Long resolvedByUserId) {
        MaintenanceRequest request = maintenanceRepo
            .findById(requestId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "MaintenanceRequest", "id", requestId));

        var resolvedBy = userRepo.findById(resolvedByUserId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", resolvedByUserId));

        request.setStatus("RESOLVED");
        request.setResolvedAt(java.time.LocalDateTime.now());
        request.setResolvedBy(resolvedBy);

        return mapper.toDto(maintenanceRepo.save(request));
    }
}