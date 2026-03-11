package com.apex.erp.module.student.mapper;

import com.apex.erp.module.student.dto.StudentDto;
import com.apex.erp.module.student.entity.Student;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy =
            NullValuePropertyMappingStrategy.IGNORE)
public interface StudentMapper {

    @Mapping(source = "user.id",       target = "userId")
    @Mapping(source = "user.fullName", target = "fullName")
    @Mapping(source = "user.email",    target = "email")
    @Mapping(source = "user.phone",    target = "phone")
    @Mapping(source = "batchId",       target = "batchId")
    StudentDto toDto(Student student);
}