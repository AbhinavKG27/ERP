package com.apex.erp.module.fee.repository;

import com.apex.erp.module.fee.entity.InstallmentPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InstallmentPlanRepository
        extends JpaRepository<InstallmentPlan, Long> {

    List<InstallmentPlan> findByStudentFeeRecordIdOrderByInstallmentNumber(
            Long studentFeeId);
}