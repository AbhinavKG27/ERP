package com.apex.erp.module.hostel.entity;

import com.apex.erp.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hostel_rooms", schema = "apex_erp",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"block_id", "room_number"}))
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HostelRoom extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "block_id", nullable = false)
    private HostelBlock block;

    @Column(name = "room_number", nullable = false, length = 10)
    private String roomNumber;

    @Column(name = "room_type", nullable = false, length = 20)
    private String roomType; // SINGLE, DOUBLE, TRIPLE

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "occupied_count", nullable = false)
    @Builder.Default
    private Integer occupiedCount = 0;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;
}