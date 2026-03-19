package com.apex.erp.module.hostel.repository;

import com.apex.erp.module.hostel.entity.HostelRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HostelRoomRepository
        extends JpaRepository<HostelRoom, Long> {

    @Query("""
        SELECT r FROM HostelRoom r
        JOIN FETCH r.block
        WHERE r.block.id = :blockId
        """)
    List<HostelRoom> findByBlockId(
            @Param("blockId") Long blockId);

    @Query("""
        SELECT r FROM HostelRoom r
        JOIN FETCH r.block
        WHERE r.isAvailable = true
        AND r.block.gender = :gender
        """)
    List<HostelRoom> findAvailableByGender(
            @Param("gender") String gender);
}