package com.apex.erp.module.library.entity;

import com.apex.erp.common.BaseEntity;
import com.apex.erp.module.department.entity.Department;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "books", schema = "apex_erp")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 200)
    private String author;

    @Column(unique = true, length = 20)
    private String isbn;

    @Column(length = 100)
    private String publisher;

    @Column(name = "publication_year")
    private Integer publicationYear;

    @Column(length = 50)
    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "total_copies", nullable = false)
    @Builder.Default
    private Integer totalCopies = 1;

    @Column(name = "available_copies", nullable = false)
    @Builder.Default
    private Integer availableCopies = 1;

    @Column(unique = true, length = 50)
    private String barcode;

    @Column(name = "is_ebook", nullable = false)
    @Builder.Default
    private Boolean isEbook = false;

    @Column(name = "ebook_url", length = 500)
    private String ebookUrl;

    @Column(name = "location_shelf", length = 20)
    private String locationShelf;
}