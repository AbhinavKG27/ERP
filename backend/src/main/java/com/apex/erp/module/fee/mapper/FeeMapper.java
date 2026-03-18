package com.apex.erp.module.fee.mapper;

import com.apex.erp.module.fee.dto.*;
import com.apex.erp.module.fee.entity.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy =
            NullValuePropertyMappingStrategy.IGNORE)
public interface FeeMapper {

    @Mapping(source = "program.id",   target = "programId")
    @Mapping(source = "program.name", target = "programName")
    FeeStructureDto toDto(FeeStructure feeStructure);

    @Mapping(source = "student.id",           target = "studentId")
    @Mapping(source = "student.user.fullName", target = "studentName")
    @Mapping(source = "student.rollNumber",    target = "rollNumber")
    @Mapping(source = "feeStructure.feeType",  target = "feeType")
    StudentFeeRecordDto toDto(StudentFeeRecord record);

    @Mapping(source = "student.id",           target = "studentId")
    @Mapping(source = "student.user.fullName", target = "studentName")
    FeePaymentDto toDto(FeePayment payment);
}