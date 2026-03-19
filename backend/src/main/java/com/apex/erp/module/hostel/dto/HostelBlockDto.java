package com.apex.erp.module.hostel.dto;

import lombok.Data;

@Data
public class HostelBlockDto {
    private Long    id;
    private String  name;
    private String  gender;
    private Long    wardenId;
    private String  wardenName;
    private Integer totalRooms;
    private Boolean isActive;
}