package com.apex.erp.module.faculty.mapper;

import com.apex.erp.module.faculty.dto.FacultyDto;
import com.apex.erp.module.faculty.dto.SubjectAssignmentDto;
import com.apex.erp.module.faculty.entity.Faculty;
import com.apex.erp.module.faculty.entity.FacultySubjectAssignment;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy =
            NullValuePropertyMappingStrategy.IGNORE)
public interface FacultyMapper {

    @Mapping(source = "user.id",         target = "userId")
    @Mapping(source = "user.fullName",   target = "fullName")
    @Mapping(source = "user.email",      target = "email")
    @Mapping(source = "user.phone",      target = "phone")
    @Mapping(source = "department.id",   target = "departmentId")
    @Mapping(source = "department.name", target = "departmentName")
    FacultyDto toDto(Faculty faculty);

    @Mapping(source = "faculty.id",          target = "facultyId")
    @Mapping(source = "faculty.user.fullName",target = "facultyName")
    @Mapping(source = "subject.id",          target = "subjectId")
    @Mapping(source = "subject.name",        target = "subjectName")
    @Mapping(source = "subject.code",        target = "subjectCode")
    @Mapping(source = "batch.id",            target = "batchId")
    SubjectAssignmentDto toAssignmentDto(
            FacultySubjectAssignment assignment);
}