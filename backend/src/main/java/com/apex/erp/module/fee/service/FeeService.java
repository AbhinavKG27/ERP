package com.apex.erp.module.fee.service;

import com.apex.erp.exception.BusinessRuleException;
import com.apex.erp.exception.ResourceNotFoundException;
import com.apex.erp.module.department.repository.ProgramRepository;
import com.apex.erp.module.fee.dto.*;
import com.apex.erp.module.fee.entity.*;
import com.apex.erp.module.fee.mapper.FeeMapper;
import com.apex.erp.module.fee.repository.*;
import com.apex.erp.module.student.entity.Student;
import com.apex.erp.module.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FeeService {

    private final FeeStructureRepository    feeStructureRepo;
    private final StudentFeeRecordRepository studentFeeRepo;
    private final FeePaymentRepository      paymentRepo;
    private final InstallmentPlanRepository installmentRepo;
    private final StudentRepository         studentRepo;
    private final ProgramRepository         programRepo;
    private final FeeMapper                 mapper;

    // ── Create fee structure ──────────────────────────────────
    @Transactional
    public FeeStructureDto createFeeStructure(
            CreateFeeStructureRequest req) {

        if (feeStructureRepo
                .existsByProgramIdAndAcademicYearAndFeeType(
                    req.getProgramId(),
                    req.getAcademicYear(),
                    req.getFeeType())) {
            throw new BusinessRuleException(
                "DUPLICATE_FEE_STRUCTURE",
                "Fee structure already exists for this " +
                "program/year/type combination");
        }

        var program = programRepo.findById(req.getProgramId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Program", "id", req.getProgramId()));

        FeeStructure structure = FeeStructure.builder()
            .program(program)
            .academicYear(req.getAcademicYear())
            .feeType(req.getFeeType())
            .amount(req.getAmount())
            .dueDate(req.getDueDate())
            .build();

        return mapper.toDto(feeStructureRepo.save(structure));
    }

    // ── Get fee structures by program ─────────────────────────
    public List<FeeStructureDto> getFeeStructures(
            Long programId, String academicYear) {
        return feeStructureRepo
            .findByProgramAndYear(programId, academicYear)
            .stream().map(mapper::toDto).toList();
    }

    // ── Assign fee to student ─────────────────────────────────
    @Transactional
    public StudentFeeRecordDto assignFeeToStudent(
            AssignFeeRequest req) {

        Student student = studentRepo
            .findById(req.getStudentId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Student", "id", req.getStudentId()));

        FeeStructure structure = feeStructureRepo
            .findById(req.getFeeStructureId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "FeeStructure", "id", req.getFeeStructureId()));

        // Check if already assigned
        if (studentFeeRepo
                .findByStudentIdAndFeeStructureIdAndAcademicYear(
                    req.getStudentId(),
                    req.getFeeStructureId(),
                    req.getAcademicYear()).isPresent()) {
            throw new BusinessRuleException(
                "DUPLICATE_FEE_RECORD",
                "Fee already assigned to this student");
        }

        StudentFeeRecord record = StudentFeeRecord.builder()
            .student(student)
            .feeStructure(structure)
            .academicYear(req.getAcademicYear())
            .totalAmount(structure.getAmount())
            .paidAmount(BigDecimal.ZERO)
            .balanceAmount(structure.getAmount())
            .status("PENDING")
            .build();

        return mapper.toDto(studentFeeRepo.save(record));
    }

    // ── Get student fee records ───────────────────────────────
    public List<StudentFeeRecordDto> getStudentFees(
            Long studentId, String academicYear) {
        return studentFeeRepo
            .findByStudentAndYear(studentId, academicYear)
            .stream().map(mapper::toDto).toList();
    }

    // ── Make payment ──────────────────────────────────────────
    @Transactional
    public FeePaymentDto makePayment(MakePaymentRequest req) {

        StudentFeeRecord feeRecord = studentFeeRepo
            .findById(req.getStudentFeeId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "StudentFeeRecord", "id", req.getStudentFeeId()));

        if ("PAID".equals(feeRecord.getStatus())) {
            throw new BusinessRuleException(
                "FEE_ALREADY_PAID",
                "Fee is already fully paid");
        }

        if (req.getAmount().compareTo(
                feeRecord.getBalanceAmount()) > 0) {
            throw new BusinessRuleException(
                "EXCESS_PAYMENT",
                "Payment amount exceeds balance: "
                + feeRecord.getBalanceAmount());
        }

        // Generate receipt number
        String receiptNumber = "RCP-" +
            LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMdd"))
            + "-" + UUID.randomUUID().toString()
                .substring(0, 6).toUpperCase();

        FeePayment payment = FeePayment.builder()
            .studentFeeRecord(feeRecord)
            .student(feeRecord.getStudent())
            .amount(req.getAmount())
            .paymentMethod(req.getPaymentMethod())
            .transactionId(req.getTransactionId())
            .paymentGateway(req.getPaymentGateway())
            .paymentStatus("SUCCESS")
            .paidAt(LocalDateTime.now())
            .receiptNumber(receiptNumber)
            .remarks(req.getRemarks())
            .build();

        paymentRepo.save(payment);

        // Update fee record
        BigDecimal newPaid = feeRecord.getPaidAmount()
            .add(req.getAmount());
        BigDecimal newBalance = feeRecord.getTotalAmount()
            .subtract(newPaid);

        feeRecord.setPaidAmount(newPaid);
        feeRecord.setBalanceAmount(newBalance);
        feeRecord.setStatus(
            newBalance.compareTo(BigDecimal.ZERO) == 0
                ? "PAID" : "PARTIAL");

        studentFeeRepo.save(feeRecord);

        log.info("Payment made: receipt={}, amount={}, student={}",
                 receiptNumber, req.getAmount(),
                 feeRecord.getStudent().getId());

        return mapper.toDto(payment);
    }

    // ── Create installment plan ───────────────────────────────
    @Transactional
    public List<InstallmentPlan> createInstallmentPlan(
            CreateInstallmentRequest req) {

        StudentFeeRecord feeRecord = studentFeeRepo
            .findById(req.getStudentFeeId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "StudentFeeRecord", "id", req.getStudentFeeId()));

        // Validate total installment amount
        BigDecimal total = req.getInstallments().stream()
            .map(CreateInstallmentRequest.InstallmentItem::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (total.compareTo(feeRecord.getBalanceAmount()) != 0) {
            throw new BusinessRuleException(
                "INSTALLMENT_MISMATCH",
                "Total installment amount must equal balance: "
                + feeRecord.getBalanceAmount());
        }

        List<InstallmentPlan> plans = req.getInstallments()
            .stream().map(item -> InstallmentPlan.builder()
                .studentFeeRecord(feeRecord)
                .installmentNumber(item.getInstallmentNumber())
                .amount(item.getAmount())
                .dueDate(item.getDueDate())
                .build())
            .toList();

        return installmentRepo.saveAll(plans);
    }

    // ── Generate attendance fine ──────────────────────────────
    @Transactional
    public StudentFeeRecordDto generateAttendanceFine(
            Long studentId, Long feeStructureId,
            String academicYear) {

        Student student = studentRepo.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Student", "id", studentId));

        FeeStructure fineStructure = feeStructureRepo
            .findById(feeStructureId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "FeeStructure", "id", feeStructureId));

        StudentFeeRecord record = StudentFeeRecord.builder()
            .student(student)
            .feeStructure(fineStructure)
            .academicYear(academicYear)
            .totalAmount(fineStructure.getAmount())
            .paidAmount(BigDecimal.ZERO)
            .balanceAmount(fineStructure.getAmount())
            .status("PENDING")
            .build();

        log.info("Attendance fine generated for studentId={}",
                 studentId);
        return mapper.toDto(studentFeeRepo.save(record));
    }

    // ── Get payment history ───────────────────────────────────
    public List<FeePaymentDto> getPaymentHistory(Long studentId) {
        return paymentRepo
            .findSuccessfulPaymentsByStudent(studentId)
            .stream().map(mapper::toDto).toList();
    }
}