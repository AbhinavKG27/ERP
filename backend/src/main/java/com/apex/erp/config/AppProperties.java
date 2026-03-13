package com.apex.erp.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private String name;
    private String baseUrl;
    private Jwt jwt = new Jwt();
    private Pagination pagination = new Pagination();
    private Attendance attendance = new Attendance();
    private Cgpa cgpa = new Cgpa();
    private Promotion promotion = new Promotion();
    private Library library = new Library();

    // Add this field to AppProperties.java
    private Cors cors = new Cors();

    @Data
    public static class Cors {
        private String allowedOrigins;
    }

    @Data
    public static class Jwt {
        private String secret;
        private long accessTokenExpiryMs;
        private long refreshTokenExpiryMs;
    }

    @Data
    public static class Pagination {
        private int defaultPageSize;
        private int maxPageSize;
    }

    @Data
    public static class Attendance {
        private double eligibleThreshold;
        private double approvalThreshold;
        private double fineThreshold;
        private double fineAmountPerSubject;
    }

    @Data
    public static class Cgpa {
        private double internalWeight;
        private double externalWeight;
    }

    @Data
    public static class Promotion {
        private int maxBacklogsBeforeDetention;
    }

    @Data
    public static class Library {
        private int maxBooksPerUser;
        private int loanPeriodDays;
        private double finePerDay;
    }
}