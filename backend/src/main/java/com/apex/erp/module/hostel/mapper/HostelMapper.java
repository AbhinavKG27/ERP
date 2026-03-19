package com.apex.erp.module.hostel.mapper;

import com.apex.erp.module.hostel.dto.*;
import com.apex.erp.module.hostel.entity.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy =
            NullValuePropertyMappingStrategy.IGNORE)
public interface HostelMapper {

    @Mapping(source = "warden.id",       target = "wardenId")
    @Mapping(source = "warden.fullName", target = "wardenName")
    HostelBlockDto toDto(HostelBlock block);

    @Mapping(source = "block.id",   target = "blockId")
    @Mapping(source = "block.name", target = "blockName")
    HostelRoomDto toDto(HostelRoom room);

    @Mapping(source = "student.id",           target = "studentId")
    @Mapping(source = "student.user.fullName", target = "studentName")
    @Mapping(source = "student.rollNumber",    target = "rollNumber")
    @Mapping(source = "room.id",              target = "roomId")
    @Mapping(source = "room.roomNumber",      target = "roomNumber")
    @Mapping(source = "room.block.name",      target = "blockName")
    AllotmentDto toDto(HostelAllotment allotment);

    @Mapping(source = "student.id",           target = "studentId")
    @Mapping(source = "student.user.fullName", target = "studentName")
    @Mapping(source = "room.id",              target = "roomId")
    @Mapping(source = "room.roomNumber",      target = "roomNumber")
    MaintenanceRequestDto toDto(MaintenanceRequest request);
}