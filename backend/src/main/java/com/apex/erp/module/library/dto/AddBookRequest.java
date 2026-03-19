package com.apex.erp.module.library.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AddBookRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Author is required")
    private String author;

    private String  isbn;
    private String  publisher;
    private Integer publicationYear;
    private String  category;
    private Long    departmentId;

    @NotNull @Min(1)
    private Integer totalCopies;

    private String  barcode;
    private Boolean isEbook;
    private String  ebookUrl;
    private String  locationShelf;
}