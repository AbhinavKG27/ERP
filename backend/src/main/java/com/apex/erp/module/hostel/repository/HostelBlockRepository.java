package com.apex.erp.module.hostel.repository;

import com.apex.erp.module.hostel.entity.HostelBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HostelBlockRepository
        extends JpaRepository<HostelBlock, Long> {

    @Query("SELECT b FROM HostelBlock b " +
           "LEFT JOIN FETCH b.warden " +
           "WHERE b.isActive = true")
    List<HostelBlock> findAllActive();

    List<HostelBlock> findByGenderAndIsActiveTrue(String gender);
}