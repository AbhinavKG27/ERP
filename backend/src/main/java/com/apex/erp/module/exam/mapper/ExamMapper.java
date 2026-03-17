package com.apex.erp.module.exam.mapper;

import com.apex.erp.module.exam.dto.*;
import com.apex.erp.module.exam.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ExamMapper {

    @Mapping(source = "subject.id", target = "subjectId")
    @Mapping(source = "subject.name", target = "subjectName")
    @Mapping(source = "batch.id", target = "batchId")
    @Mapping(source = "faculty.id", target = "facultyId")
    ExamDto toExamDto(Exam exam);

    @Mapping(source = "student.id", target = "studentId")
    @Mapping(source = "student.user.fullName", target = "studentName")
    @Mapping(source = "student.rollNumber", target = "rollNumber")
    MarksEntryDto toMarksEntryDto(MarksEntry entry);

    @Mapping(source = "student.id", target = "studentId")
    @Mapping(source = "student.user.fullName", target = "studentName")
    @Mapping(source = "student.rollNumber", target = "rollNumber")
    @Mapping(source = "subject.id", target = "subjectId")
    @Mapping(source = "subject.name", target = "subjectName")
    StudentResultDto toResultDto(StudentSubjectResult result);
}
