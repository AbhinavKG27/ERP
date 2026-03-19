package com.apex.erp.module.library.dto;

import lombok.Data;

@Data
public class BookDto {
    private Long    id;
    private String  title;
    private String  author;
    private String  isbn;
    private String  publisher;
    private Integer publicationYear;
    private String  category;
    private Long    departmentId;
    private String  departmentName;
    private Integer totalCopies;
    private Integer availableCopies;
    private String  barcode;
    private Boolean isEbook;
    private String  ebookUrl;
    private String  locationShelf;
}