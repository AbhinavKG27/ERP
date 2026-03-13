package com.apex.erp.module.department.mapper;

import com.apex.erp.module.department.dto.BatchDto;
import com.apex.erp.module.department.dto.DepartmentDto;
import com.apex.erp.module.department.dto.ProgramDto;
import com.apex.erp.module.department.dto.SubjectDto;
import com.apex.erp.module.department.entity.Batch;
import com.apex.erp.module.department.entity.Department;
import com.apex.erp.module.department.entity.Program;
import com.apex.erp.module.department.entity.Subject;
import com.apex.erp.module.user.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-13T17:35:56+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class DepartmentMapperImpl implements DepartmentMapper {

    @Override
    public DepartmentDto toDto(Department department) {
        if ( department == null ) {
            return null;
        }

        DepartmentDto departmentDto = new DepartmentDto();

        departmentDto.setHodId( departmentHodId( department ) );
        departmentDto.setHodName( departmentHodFullName( department ) );
        departmentDto.setCode( department.getCode() );
        departmentDto.setId( department.getId() );
        departmentDto.setIsActive( department.getIsActive() );
        departmentDto.setName( department.getName() );
        departmentDto.setProgramType( department.getProgramType() );

        return departmentDto;
    }

    @Override
    public ProgramDto toDto(Program program) {
        if ( program == null ) {
            return null;
        }

        ProgramDto programDto = new ProgramDto();

        programDto.setDepartmentId( programDepartmentId( program ) );
        programDto.setDepartmentName( programDepartmentName( program ) );
        programDto.setCode( program.getCode() );
        programDto.setDurationYears( program.getDurationYears() );
        programDto.setId( program.getId() );
        programDto.setIsActive( program.getIsActive() );
        programDto.setName( program.getName() );
        programDto.setTotalSemesters( program.getTotalSemesters() );

        return programDto;
    }

    @Override
    public BatchDto toDto(Batch batch) {
        if ( batch == null ) {
            return null;
        }

        BatchDto batchDto = new BatchDto();

        batchDto.setProgramId( batchProgramId( batch ) );
        batchDto.setProgramName( batchProgramName( batch ) );
        batchDto.setDepartmentName( batchProgramDepartmentName( batch ) );
        batchDto.setGraduationYear( batch.getGraduationYear() );
        batchDto.setId( batch.getId() );
        batchDto.setIsActive( batch.getIsActive() );
        batchDto.setJoinYear( batch.getJoinYear() );
        batchDto.setSection( batch.getSection() );

        return batchDto;
    }

    @Override
    public SubjectDto toDto(Subject subject) {
        if ( subject == null ) {
            return null;
        }

        SubjectDto subjectDto = new SubjectDto();

        subjectDto.setDepartmentId( subjectDepartmentId( subject ) );
        subjectDto.setDepartmentName( subjectDepartmentName( subject ) );
        subjectDto.setCode( subject.getCode() );
        subjectDto.setCredits( subject.getCredits() );
        subjectDto.setId( subject.getId() );
        subjectDto.setIsActive( subject.getIsActive() );
        subjectDto.setName( subject.getName() );
        subjectDto.setSemesterNumber( subject.getSemesterNumber() );
        subjectDto.setSubjectType( subject.getSubjectType() );

        return subjectDto;
    }

    private Long departmentHodId(Department department) {
        if ( department == null ) {
            return null;
        }
        User hod = department.getHod();
        if ( hod == null ) {
            return null;
        }
        Long id = hod.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String departmentHodFullName(Department department) {
        if ( department == null ) {
            return null;
        }
        User hod = department.getHod();
        if ( hod == null ) {
            return null;
        }
        String fullName = hod.getFullName();
        if ( fullName == null ) {
            return null;
        }
        return fullName;
    }

    private Long programDepartmentId(Program program) {
        if ( program == null ) {
            return null;
        }
        Department department = program.getDepartment();
        if ( department == null ) {
            return null;
        }
        Long id = department.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String programDepartmentName(Program program) {
        if ( program == null ) {
            return null;
        }
        Department department = program.getDepartment();
        if ( department == null ) {
            return null;
        }
        String name = department.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long batchProgramId(Batch batch) {
        if ( batch == null ) {
            return null;
        }
        Program program = batch.getProgram();
        if ( program == null ) {
            return null;
        }
        Long id = program.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String batchProgramName(Batch batch) {
        if ( batch == null ) {
            return null;
        }
        Program program = batch.getProgram();
        if ( program == null ) {
            return null;
        }
        String name = program.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private String batchProgramDepartmentName(Batch batch) {
        if ( batch == null ) {
            return null;
        }
        Program program = batch.getProgram();
        if ( program == null ) {
            return null;
        }
        Department department = program.getDepartment();
        if ( department == null ) {
            return null;
        }
        String name = department.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long subjectDepartmentId(Subject subject) {
        if ( subject == null ) {
            return null;
        }
        Department department = subject.getDepartment();
        if ( department == null ) {
            return null;
        }
        Long id = department.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String subjectDepartmentName(Subject subject) {
        if ( subject == null ) {
            return null;
        }
        Department department = subject.getDepartment();
        if ( department == null ) {
            return null;
        }
        String name = department.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
