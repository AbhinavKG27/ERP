package com.apex.erp.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final boolean success;
    private final String message;
    private final T data;
    private final Map<String, String> errors;

    @Builder.Default
    private final LocalDateTime timestamp = LocalDateTime.now();

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true).message(message).data(data).build();
    }

    public static <T> ApiResponse<T> success(T data) {
        return success("Operation successful", data);
    }

    public static ApiResponse<Void> success(String message) {
        return ApiResponse.<Void>builder()
                .success(true).message(message).build();
    }

    public static ApiResponse<Void> error(String message) {
        return ApiResponse.<Void>builder()
                .success(false).message(message).build();
    }

    public static ApiResponse<Void> validationError(
            String message, Map<String, String> errors) {
        return ApiResponse.<Void>builder()
                .success(false).message(message).errors(errors).build();
    }
}