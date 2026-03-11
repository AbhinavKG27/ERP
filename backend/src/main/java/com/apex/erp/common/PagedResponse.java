package com.apex.erp.common;

import lombok.Getter;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class PagedResponse<T> {

    private final boolean success = true;
    private final List<T> data;
    private final int page;
    private final int size;
    private final long totalElements;
    private final int totalPages;
    private final boolean last;
    private final LocalDateTime timestamp = LocalDateTime.now();

    public PagedResponse(Page<T> pageData) {
        this.data          = pageData.getContent();
        this.page          = pageData.getNumber();
        this.size          = pageData.getSize();
        this.totalElements = pageData.getTotalElements();
        this.totalPages    = pageData.getTotalPages();
        this.last          = pageData.isLast();
    }
}