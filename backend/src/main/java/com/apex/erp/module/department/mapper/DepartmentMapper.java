package com.apex.erp.module.department.mapper;

import com.apex.erp.module.department.dto.*;
import com.apex.erp.module.department.entity.*;
import com.apex.erp.module.user.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy =
            NullValuePropertyMappingStrategy.IGNORE)
public interface DepartmentMapper {

    @Mapping(target = "hodId",   expression = "java(getHodId(department))")
    @Mapping(target = "hodName", expression = "java(getHodName(department))")
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

    default Long getHodId(Department department) {
        if (department == null) return null;
        User hod = department.getHod();
        return hod != null ? hod.getId() : null;
    }

    default String getHodName(Department department) {
        if (department == null) return null;
        User hod = department.getHod();
        return hod != null ? hod.getFullName() : null;
    }
}