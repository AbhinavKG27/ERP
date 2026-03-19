package com.apex.erp.module.library.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BookIssueDto {
    private Long       id;
    private Long       bookId;
    private String     bookTitle;
    private String     isbn;
    private Long       userId;
    private String     userName;
    private LocalDate  issueDate;
    private LocalDate  dueDate;
    private LocalDate  returnDate;
    private String     status;
    private BigDecimal fineAmount;
    private Boolean    finePaid;
}