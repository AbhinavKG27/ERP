package com.apex.erp.module.library.mapper;

import com.apex.erp.module.library.dto.BookDto;
import com.apex.erp.module.library.dto.BookIssueDto;
import com.apex.erp.module.library.entity.Book;
import com.apex.erp.module.library.entity.BookIssue;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy =
            NullValuePropertyMappingStrategy.IGNORE)
public interface LibraryMapper {

    default BookDto toDto(Book book) {
        if (book == null) return null;
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setIsbn(book.getIsbn());
        dto.setPublisher(book.getPublisher());
        dto.setPublicationYear(book.getPublicationYear());
        dto.setCategory(book.getCategory());
        dto.setTotalCopies(book.getTotalCopies());
        dto.setAvailableCopies(book.getAvailableCopies());
        dto.setBarcode(book.getBarcode());
        dto.setIsEbook(book.getIsEbook());
        dto.setEbookUrl(book.getEbookUrl());
        dto.setLocationShelf(book.getLocationShelf());
        if (book.getDepartment() != null) {
            dto.setDepartmentId(book.getDepartment().getId());
            dto.setDepartmentName(book.getDepartment().getName());
        }
        return dto;
    }

    default BookIssueDto toDto(BookIssue issue) {
        if (issue == null) return null;
        BookIssueDto dto = new BookIssueDto();
        dto.setId(issue.getId());
        dto.setIssueDate(issue.getIssueDate());
        dto.setDueDate(issue.getDueDate());
        dto.setReturnDate(issue.getReturnDate());
        dto.setStatus(issue.getStatus());
        dto.setFineAmount(issue.getFineAmount());
        dto.setFinePaid(issue.getFinePaid());
        if (issue.getBook() != null) {
            dto.setBookId(issue.getBook().getId());
            dto.setBookTitle(issue.getBook().getTitle());
            dto.setIsbn(issue.getBook().getIsbn());
        }
        if (issue.getUser() != null) {
            dto.setUserId(issue.getUser().getId());
            dto.setUserName(issue.getUser().getFullName());
        }
        return dto;
    }
}