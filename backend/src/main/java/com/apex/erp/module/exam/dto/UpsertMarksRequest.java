package com.apex.erp.module.exam.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class UpsertMarksRequest {

    @NotNull
    private Long examId;

    @NotEmpty
    @Valid
    private List<MarkEntryRequest> marks;
}
