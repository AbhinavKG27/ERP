package com.apex.erp.module.library.repository;

import com.apex.erp.module.library.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BookRepository
        extends JpaRepository<Book, Long> {

    Optional<Book> findByIsbn(String isbn);
    Optional<Book> findByBarcode(String barcode);

    @Query("""
        SELECT b FROM Book b
        LEFT JOIN FETCH b.department
        WHERE LOWER(b.title) LIKE LOWER(CONCAT('%',:q,'%'))
        OR LOWER(b.author) LIKE LOWER(CONCAT('%',:q,'%'))
        OR LOWER(b.isbn) LIKE LOWER(CONCAT('%',:q,'%'))
        """)
    Page<Book> searchBooks(
            @Param("q") String query, Pageable pageable);

    @Query("""
        SELECT b FROM Book b
        LEFT JOIN FETCH b.department
        WHERE b.availableCopies > 0
        """)
    Page<Book> findAvailableBooks(Pageable pageable);
}