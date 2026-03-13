package com.apex.erp.module.faculty.mapper;

import com.apex.erp.module.department.entity.Batch;
import com.apex.erp.module.department.entity.Department;
import com.apex.erp.module.department.entity.Subject;
import com.apex.erp.module.faculty.dto.FacultyDto;
import com.apex.erp.module.faculty.dto.SubjectAssignmentDto;
import com.apex.erp.module.faculty.entity.Faculty;
import com.apex.erp.module.faculty.entity.FacultySubjectAssignment;
import com.apex.erp.module.user.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-13T17:35:55+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class FacultyMapperImpl implements FacultyMapper {

    @Override
    public FacultyDto toDto(Faculty faculty) {
        if ( faculty == null ) {
            return null;
        }

        FacultyDto facultyDto = new FacultyDto();

        facultyDto.setUserId( facultyUserId( faculty ) );
        facultyDto.setFullName( facultyUserFullName( faculty ) );
        facultyDto.setEmail( facultyUserEmail( faculty ) );
        facultyDto.setPhone( facultyUserPhone( faculty ) );
        facultyDto.setDepartmentId( facultyDepartmentId( faculty ) );
        facultyDto.setDepartmentName( facultyDepartmentName( faculty ) );
        facultyDto.setDesignation( faculty.getDesignation() );
        facultyDto.setEmployeeId( faculty.getEmployeeId() );
        facultyDto.setId( faculty.getId() );
        facultyDto.setIsActive( faculty.getIsActive() );
        facultyDto.setJoiningDate( faculty.getJoiningDate() );
        facultyDto.setQualification( faculty.getQualification() );
        facultyDto.setSpecialization( faculty.getSpecialization() );

        return facultyDto;
    }

    @Override
    public SubjectAssignmentDto toAssignmentDto(FacultySubjectAssignment assignment) {
        if ( assignment == null ) {
            return null;
        }

        SubjectAssignmentDto subjectAssignmentDto = new SubjectAssignmentDto();

        subjectAssignmentDto.setFacultyId( assignmentFacultyId( assignment ) );
        subjectAssignmentDto.setFacultyName( assignmentFacultyUserFullName( assignment ) );
        subjectAssignmentDto.setSubjectId( assignmentSubjectId( assignment ) );
        subjectAssignmentDto.setSubjectName( assignmentSubjectName( assignment ) );
        subjectAssignmentDto.setSubjectCode( assignmentSubjectCode( assignment ) );
        subjectAssignmentDto.setBatchId( assignmentBatchId( assignment ) );
        subjectAssignmentDto.setAcademicYear( assignment.getAcademicYear() );
        subjectAssignmentDto.setSemesterNumber( assignment.getSemesterNumber() );

        return subjectAssignmentDto;
    }

    private Long facultyUserId(Faculty faculty) {
        if ( faculty == null ) {
            return null;
        }
        User user = faculty.getUser();
        if ( user == null ) {
            return null;
        }
        Long id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String facultyUserFullName(Faculty faculty) {
        if ( faculty == null ) {
            return null;
        }
        User user = faculty.getUser();
        if ( user == null ) {
            return null;
        }
        String fullName = user.getFullName();
        if ( fullName == null ) {
            return null;
        }
        return fullName;
    }

    private String facultyUserEmail(Faculty faculty) {
        if ( faculty == null ) {
            return null;
        }
        User user = faculty.getUser();
        if ( user == null ) {
            return null;
        }
        String email = user.getEmail();
        if ( email == null ) {
            return null;
        }
        return email;
    }

    private String facultyUserPhone(Faculty faculty) {
        if ( faculty == null ) {
            return null;
        }
        User user = faculty.getUser();
        if ( user == null ) {
            return null;
        }
        String phone = user.getPhone();
        if ( phone == null ) {
            return null;
        }
        return phone;
    }

    private Long facultyDepartmentId(Faculty faculty) {
        if ( faculty == null ) {
            return null;
        }
        Department department = faculty.getDepartment();
        if ( department == null ) {
            return null;
        }
        Long id = department.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String facultyDepartmentName(Faculty faculty) {
        if ( faculty == null ) {
            return null;
        }
        Department department = faculty.getDepartment();
        if ( department == null ) {
            return null;
        }
        String name = department.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long assignmentFacultyId(FacultySubjectAssignment facultySubjectAssignment) {
        if ( facultySubjectAssignment == null ) {
            return null;
        }
        Faculty faculty = facultySubjectAssignment.getFaculty();
        if ( faculty == null ) {
            return null;
        }
        Long id = faculty.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String assignmentFacultyUserFullName(FacultySubjectAssignment facultySubjectAssignment) {
        if ( facultySubjectAssignment == null ) {
            return null;
        }
        Faculty faculty = facultySubjectAssignment.getFaculty();
        if ( faculty == null ) {
            return null;
        }
        User user = faculty.getUser();
        if ( user == null ) {
            return null;
        }
        String fullName = user.getFullName();
        if ( fullName == null ) {
            return null;
        }
        return fullName;
    }

    private Long assignmentSubjectId(FacultySubjectAssignment facultySubjectAssignment) {
        if ( facultySubjectAssignment == null ) {
            return null;
        }
        Subject subject = facultySubjectAssignment.getSubject();
        if ( subject == null ) {
            return null;
        }
        Long id = subject.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String assignmentSubjectName(FacultySubjectAssignment facultySubjectAssignment) {
        if ( facultySubjectAssignment == null ) {
            return null;
        }
        Subject subject = facultySubjectAssignment.getSubject();
        if ( subject == null ) {
            return null;
        }
        String name = subject.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private String assignmentSubjectCode(FacultySubjectAssignment facultySubjectAssignment) {
        if ( facultySubjectAssignment == null ) {
            return null;
        }
        Subject subject = facultySubjectAssignment.getSubject();
        if ( subject == null ) {
            return null;
        }
        String code = subject.getCode();
        if ( code == null ) {
            return null;
        }
        return code;
    }

    private Long assignmentBatchId(FacultySubjectAssignment facultySubjectAssignment) {
        if ( facultySubjectAssignment == null ) {
            return null;
        }
        Batch batch = facultySubjectAssignment.getBatch();
        if ( batch == null ) {
            return null;
        }
        Long id = batch.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
