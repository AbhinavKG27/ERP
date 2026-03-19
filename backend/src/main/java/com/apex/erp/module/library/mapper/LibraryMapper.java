package com.apex.erp.module.library.mapper;

import com.apex.erp.module.library.dto.*;
import com.apex.erp.module.library.entity.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy =
            NullValuePropertyMappingStrategy.IGNORE)
public interface LibraryMapper {

    @Mapping(source = "department.id",   target = "departmentId")
    @Mapping(source = "department.name", target = "departmentName")
    BookDto toDto(Book book);

    @Mapping(source = "book.id",       target = "bookId")
    @Mapping(source = "book.title",    target = "bookTitle")
    @Mapping(source = "book.isbn",     target = "isbn")
    @Mapping(source = "user.id",       target = "userId")
    @Mapping(source = "user.fullName", target = "userName")
    BookIssueDto toDto(BookIssue issue);
}