package com.apex.erp.module.hostel.dto;

import lombok.Data;

@Data
public class HostelRoomDto {
    private Long    id;
    private Long    blockId;
    private String  blockName;
    private String  roomNumber;
    private String  roomType;
    private Integer capacity;
    private Integer occupiedCount;
    private Integer floorNumber;
    private Boolean isAvailable;
}