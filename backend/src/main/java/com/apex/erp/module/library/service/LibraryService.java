package com.apex.erp.module.library.service;

import com.apex.erp.config.AppProperties;
import com.apex.erp.exception.BusinessRuleException;
import com.apex.erp.exception.ResourceNotFoundException;
import com.apex.erp.module.department.repository.DepartmentRepository;
import com.apex.erp.module.library.dto.*;
import com.apex.erp.module.library.entity.*;
import com.apex.erp.module.library.mapper.LibraryMapper;
import com.apex.erp.module.library.repository.*;
import com.apex.erp.module.user.repository.UserRepository;
import com.apex.erp.security.CustomUserDetails;
import com.apex.erp.security.SecurityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LibraryService {

    private final BookRepository        bookRepo;
    private final BookIssueRepository   issueRepo;
    private final BookReservationRepository reservationRepo;
    private final UserRepository        userRepo;
    private final DepartmentRepository  deptRepo;
    private final LibraryMapper         mapper;
    private final AppProperties         appProperties;
    private final SecurityService       securityService;

    // ── Add book ──────────────────────────────────────────────
    @Transactional
    public BookDto addBook(AddBookRequest req) {
        Book book = Book.builder()
            .title(req.getTitle())
            .author(req.getAuthor())
            .isbn(req.getIsbn())
            .publisher(req.getPublisher())
            .publicationYear(req.getPublicationYear())
            .category(req.getCategory())
            .totalCopies(req.getTotalCopies())
            .availableCopies(req.getTotalCopies())
            .barcode(req.getBarcode())
            .isEbook(req.getIsEbook() != null
                && req.getIsEbook())
            .ebookUrl(req.getEbookUrl())
            .locationShelf(req.getLocationShelf())
            .build();

        if (req.getDepartmentId() != null) {
            var dept = deptRepo.findById(req.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Department", "id", req.getDepartmentId()));
            book.setDepartment(dept);
        }

        return mapper.toDto(bookRepo.save(book));
    }

    // ── Search books ──────────────────────────────────────────
    public Page<BookDto> searchBooks(String query,
            int page, int size) {
        return bookRepo.searchBooks(query,
            PageRequest.of(page, size)).map(mapper::toDto);
    }

    public Page<BookDto> getAvailableBooks(int page, int size) {
        return bookRepo.findAvailableBooks(
            PageRequest.of(page, size)).map(mapper::toDto);
    }

    public Page<BookDto> getAllBooks(int page, int size) {
        return bookRepo.findAll(
            PageRequest.of(page, size)).map(mapper::toDto);
    }

    // ── Issue book ────────────────────────────────────────────
    @Transactional
    public BookIssueDto issueBook(IssueBookRequest req) {
        Book book = bookRepo.findById(req.getBookId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Book", "id", req.getBookId()));

        if (book.getAvailableCopies() <= 0) {
            throw new BusinessRuleException(
                "NO_COPIES_AVAILABLE",
                "No copies available for: " + book.getTitle());
        }

        var user = userRepo.findById(req.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", req.getUserId()));

        // Check max books limit
        long activeIssues = issueRepo
            .countActiveIssuesByUser(req.getUserId());
        int maxBooks = appProperties.getLibrary().getMaxBooksPerUser();

        if (activeIssues >= maxBooks) {
            throw new BusinessRuleException(
                "MAX_BOOKS_LIMIT",
                "User has reached maximum book limit of " + maxBooks);
        }

        // Get current librarian
        Long currentUserId = securityService.getCurrentUserId();
        var librarian = userRepo.findById(currentUserId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", currentUserId));


        BookIssue issue = BookIssue.builder()
            .book(book)
            .user(user)
            .issuedBy(librarian)
            .issueDate(req.getIssueDate())
            .dueDate(req.getDueDate())
            .build();

        issueRepo.save(issue);

        // Update book availability
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepo.save(book);

        log.info("Book issued: bookId={}, userId={}",
                 req.getBookId(), req.getUserId());
        return mapper.toDto(issue);
    }

    // ── Return book ───────────────────────────────────────────
    @Transactional
    public BookIssueDto returnBook(Long issueId) {
        BookIssue issue = issueRepo.findById(issueId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "BookIssue", "id", issueId));

        if ("RETURNED".equals(issue.getStatus())) {
            throw new BusinessRuleException(
                "ALREADY_RETURNED", "Book already returned");
        }

        LocalDate today = LocalDate.now();
        issue.setReturnDate(today);
        issue.setStatus("RETURNED");

        // Calculate fine if overdue
        if (today.isAfter(issue.getDueDate())) {
            long overdueDays = ChronoUnit.DAYS.between(
                issue.getDueDate(), today);
            double finePerDay = appProperties
                .getLibrary().getFinePerDay();
            BigDecimal fine = BigDecimal.valueOf(
                overdueDays * finePerDay);
            issue.setFineAmount(fine);
            log.info("Fine calculated: issueId={}, days={}, fine={}",
                     issueId, overdueDays, fine);
        }

        issueRepo.save(issue);

        // Update book availability
        Book book = issue.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepo.save(book);

        return mapper.toDto(issue);
    }

    // ── Get user's issued books ───────────────────────────────
    public List<BookIssueDto> getUserIssuedBooks(Long userId) {
        return issueRepo.findActiveIssuesByUser(userId)
            .stream().map(mapper::toDto).toList();
    }

    // ── Get overdue books ─────────────────────────────────────
    public List<BookIssueDto> getOverdueBooks() {
        return issueRepo.findOverdueIssues()
            .stream().map(mapper::toDto).toList();
    }

    // ── Reserve book ──────────────────────────────────────────
    @Transactional
    public BookReservation reserveBook(Long bookId, Long userId) {
        var book = bookRepo.findById(bookId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Book", "id", bookId));
        var user = userRepo.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User", "id", userId));

        BookReservation reservation = BookReservation.builder()
            .book(book)
            .user(user)
            .expiresAt(LocalDateTime.now().plusDays(3))
            .build();

        return reservationRepo.save(reservation);
    }
}