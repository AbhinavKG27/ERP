package com.apex.erp.grievance.entity;

import com.apex.erp.module.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "grievances", schema = "apex_erp")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Grievance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_faculty_id")
    private User assignedFaculty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hod_id")
    private User hod;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String category = "OTHER";

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "SUBMITTED";

    @Column(name = "is_anonymous", nullable = false)
    @Builder.Default
    private Boolean anonymous = false;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "escalated_at")
    private LocalDateTime escalatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "resolution_note", columnDefinition = "TEXT")
    private String resolutionNote;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "grievance",
               cascade = CascadeType.ALL,
               fetch = FetchType.LAZY)
    @Builder.Default
    private List<GrievanceComment> comments = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt   = LocalDateTime.now();
        updatedAt   = LocalDateTime.now();
        submittedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}