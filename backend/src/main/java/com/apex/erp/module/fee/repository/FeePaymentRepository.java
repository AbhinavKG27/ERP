package com.apex.erp.module.fee.repository;

import com.apex.erp.module.fee.entity.FeePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeePaymentRepository
        extends JpaRepository<FeePayment, Long> {

    @Query("""
        SELECT p FROM FeePayment p
        WHERE p.student.id = :studentId
        AND p.paymentStatus = 'SUCCESS'
        ORDER BY p.paidAt DESC
        """)
    List<FeePayment> findSuccessfulPaymentsByStudent(
            @Param("studentId") Long studentId);

    boolean existsByReceiptNumber(String receiptNumber);
}