package com.apex.erp.module.department.mapper;

import com.apex.erp.module.department.dto.*;
import com.apex.erp.module.department.entity.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy =
            NullValuePropertyMappingStrategy.IGNORE)
public interface DepartmentMapper {

    @Mapping(source = "hod.id",       target = "hodId")
    @Mapping(source = "hod.fullName", target = "hodName")
    DepartmentDto toDto(Department department);

    @Mapping(source = "department.id",   target = "departmentId")
    @Mapping(source = "department.name", target = "departmentName")
    ProgramDto toDto(Program program);

    @Mapping(source = "program.id",              target = "programId")
    @Mapping(source = "program.name",            target = "programName")
    @Mapping(source = "program.department.name", target = "departmentName")
    BatchDto toDto(Batch batch);

    @Mapping(source = "department.id",   target = "departmentId")
    @Mapping(source = "department.name", target = "departmentName")
    SubjectDto toDto(Subject subject);
}