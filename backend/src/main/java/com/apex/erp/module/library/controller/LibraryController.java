package com.apex.erp.module.library.controller;

import com.apex.erp.common.ApiResponse;
import com.apex.erp.module.library.dto.*;
import com.apex.erp.module.library.entity.BookReservation;
import com.apex.erp.module.library.service.LibraryService;
import com.apex.erp.security.SecurityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/library")
@RequiredArgsConstructor
@Tag(name = "Library", description = "Library management APIs")
public class LibraryController {

    private final LibraryService  libraryService;
    private final SecurityService securityService;

    @PostMapping("/books")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    @Operation(summary = "Add a new book")
    public ResponseEntity<ApiResponse<BookDto>> addBook(
            @Valid @RequestBody AddBookRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Book added",
                libraryService.addBook(req)));
    }

    @GetMapping("/books/search")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Search books")
    public ResponseEntity<Page<BookDto>> searchBooks(
            @RequestParam String query,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
            libraryService.searchBooks(query, page, size));
    }

    @GetMapping("/books")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get all books")
    public ResponseEntity<Page<BookDto>> getBooks(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
            libraryService.getAllBooks(page, size));
    }

    @GetMapping("/books/available")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get available books")
    public ResponseEntity<Page<BookDto>> getAvailable(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
            libraryService.getAvailableBooks(page, size));
    }

    @PostMapping("/issue")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    @Operation(summary = "Issue a book to user")
    public ResponseEntity<ApiResponse<BookIssueDto>> issue(
            @Valid @RequestBody IssueBookRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Book issued",
                libraryService.issueBook(req)));
    }

    @PatchMapping("/return/{issueId}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    @Operation(summary = "Return a book")
    public ResponseEntity<ApiResponse<BookIssueDto>> returnBook(
            @PathVariable Long issueId) {
        return ResponseEntity.ok(ApiResponse.success(
            "Book returned",
            libraryService.returnBook(issueId)));
    }

    @GetMapping("/user/{userId}/books")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN') "
                + "or @securityService.isOwnUser(#userId)")
    @Operation(summary = "Get books issued to user")
    public ResponseEntity<ApiResponse<List<BookIssueDto>>>
            getUserBooks(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(
            libraryService.getUserIssuedBooks(userId)));
    }

    @GetMapping("/books/overdue")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    @Operation(summary = "Get overdue books")
    public ResponseEntity<ApiResponse<List<BookIssueDto>>>
            getOverdue() {
        return ResponseEntity.ok(ApiResponse.success(
            libraryService.getOverdueBooks()));
    }

    @PostMapping("/books/{bookId}/reserve")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Reserve a book")
    public ResponseEntity<ApiResponse<BookReservation>> reserve(
            @PathVariable Long bookId) {
        Long userId = securityService.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Book reserved",
                libraryService.reserveBook(bookId, userId)));
    }
}