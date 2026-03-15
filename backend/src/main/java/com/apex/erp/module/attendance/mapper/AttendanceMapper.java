package com.apex.erp.module.attendance.mapper;

import com.apex.erp.module.attendance.dto.*;
import com.apex.erp.module.attendance.entity.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy =
            NullValuePropertyMappingStrategy.IGNORE)
public interface AttendanceMapper {

    @Mapping(source = "faculty.id",           target = "facultyId")
    @Mapping(source = "faculty.user.fullName",target = "facultyName")
    @Mapping(source = "subject.id",           target = "subjectId")
    @Mapping(source = "subject.name",         target = "subjectName")
    @Mapping(source = "subject.code",         target = "subjectCode")
    @Mapping(source = "batch.id",             target = "batchId")
    AttendanceSessionDto toSessionDto(
            AttendanceSession session);

    @Mapping(source = "student.id",           target = "studentId")
    @Mapping(source = "student.user.fullName",target = "studentName")
    @Mapping(source = "student.rollNumber",   target = "rollNumber")
    AttendanceRecordDto toRecordDto(
            AttendanceRecord record);

    @Mapping(source = "student.id",           target = "studentId")
    @Mapping(source = "student.user.fullName",target = "studentName")
    @Mapping(source = "student.rollNumber",   target = "rollNumber")
    @Mapping(source = "subject.id",           target = "subjectId")
    @Mapping(source = "subject.name",         target = "subjectName")
    AttendanceSummaryDto toSummaryDto(
            AttendanceSummary summary);
}