package com.apex.erp.module.library.repository;

import com.apex.erp.module.library.entity.BookReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookReservationRepository
        extends JpaRepository<BookReservation, Long> {

    @Query("""
        SELECT r FROM BookReservation r
        JOIN FETCH r.book
        WHERE r.user.id = :userId
        AND r.status = 'ACTIVE'
        """)
    List<BookReservation> findActiveByUser(
            @Param("userId") Long userId);
}