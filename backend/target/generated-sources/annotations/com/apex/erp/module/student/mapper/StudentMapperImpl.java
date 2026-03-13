package com.apex.erp.module.student.mapper;

import com.apex.erp.module.student.dto.StudentDto;
import com.apex.erp.module.student.entity.Student;
import com.apex.erp.module.user.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-13T17:35:57+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class StudentMapperImpl implements StudentMapper {

    @Override
    public StudentDto toDto(Student student) {
        if ( student == null ) {
            return null;
        }

        StudentDto studentDto = new StudentDto();

        studentDto.setUserId( studentUserId( student ) );
        studentDto.setFullName( studentUserFullName( student ) );
        studentDto.setEmail( studentUserEmail( student ) );
        studentDto.setPhone( studentUserPhone( student ) );
        studentDto.setBatchId( student.getBatchId() );
        studentDto.setAddress( student.getAddress() );
        studentDto.setAdmissionDate( student.getAdmissionDate() );
        studentDto.setBloodGroup( student.getBloodGroup() );
        studentDto.setCurrentCgpa( student.getCurrentCgpa() );
        studentDto.setCurrentSemester( student.getCurrentSemester() );
        studentDto.setDateOfBirth( student.getDateOfBirth() );
        studentDto.setGender( student.getGender() );
        studentDto.setId( student.getId() );
        studentDto.setIsDetained( student.getIsDetained() );
        studentDto.setParentEmail( student.getParentEmail() );
        studentDto.setParentName( student.getParentName() );
        studentDto.setParentPhone( student.getParentPhone() );
        studentDto.setRegisterNumber( student.getRegisterNumber() );
        studentDto.setRollNumber( student.getRollNumber() );
        studentDto.setStatus( student.getStatus() );

        return studentDto;
    }

    private Long studentUserId(Student student) {
        if ( student == null ) {
            return null;
        }
        User user = student.getUser();
        if ( user == null ) {
            return null;
        }
        Long id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String studentUserFullName(Student student) {
        if ( student == null ) {
            return null;
        }
        User user = student.getUser();
        if ( user == null ) {
            return null;
        }
        String fullName = user.getFullName();
        if ( fullName == null ) {
            return null;
        }
        return fullName;
    }

    private String studentUserEmail(Student student) {
        if ( student == null ) {
            return null;
        }
        User user = student.getUser();
        if ( user == null ) {
            return null;
        }
        String email = user.getEmail();
        if ( email == null ) {
            return null;
        }
        return email;
    }

    private String studentUserPhone(Student student) {
        if ( student == null ) {
            return null;
        }
        User user = student.getUser();
        if ( user == null ) {
            return null;
        }
        String phone = user.getPhone();
        if ( phone == null ) {
            return null;
        }
        return phone;
    }
}
