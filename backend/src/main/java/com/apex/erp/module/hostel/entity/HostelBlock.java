package com.apex.erp.module.hostel.entity;

import com.apex.erp.common.BaseEntity;
import com.apex.erp.module.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hostel_blocks", schema = "apex_erp")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HostelBlock extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(nullable = false, length = 10)
    private String gender; // MALE, FEMALE

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warden_id")
    private User warden;

    @Column(name = "total_rooms", nullable = false)
    private Integer totalRooms;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}