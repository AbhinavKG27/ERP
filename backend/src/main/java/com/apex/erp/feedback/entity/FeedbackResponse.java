package com.apex.erp.feedback.entity;

import com.apex.erp.module.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback_responses", schema = "apex_erp")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FeedbackResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_id", nullable = false)
    private FeedbackForm form;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private User student;

    @Column(name = "is_anonymous", nullable = false)
    @Builder.Default
    private Boolean anonymous = false;

    @Column(name = "teaching_rating", nullable = false)
    private Integer teachingRating;

    @Column(name = "knowledge_rating", nullable = false)
    private Integer knowledgeRating;

    @Column(name = "communication_rating", nullable = false)
    private Integer communicationRating;

    @Column(name = "punctuality_rating", nullable = false)
    private Integer punctualityRating;

    @Column(name = "overall_rating", nullable = false)
    private Integer overallRating;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}