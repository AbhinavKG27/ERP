package com.apex.erp.module.library.repository;

import com.apex.erp.module.library.entity.BookIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookIssueRepository
        extends JpaRepository<BookIssue, Long> {

    @Query("""
        SELECT i FROM BookIssue i
        JOIN FETCH i.book
        WHERE i.user.id = :userId
        AND i.status = 'ISSUED'
        """)
    List<BookIssue> findActiveIssuesByUser(
            @Param("userId") Long userId);

    @Query("""
        SELECT i FROM BookIssue i
        JOIN FETCH i.book
        JOIN FETCH i.user
        WHERE i.status = 'OVERDUE'
        """)
    List<BookIssue> findOverdueIssues();

    @Query("""
        SELECT COUNT(i) FROM BookIssue i
        WHERE i.user.id = :userId
        AND i.status = 'ISSUED'
        """)
    Long countActiveIssuesByUser(@Param("userId") Long userId);
}