package com.apex.erp.grievance.repository;

import com.apex.erp.grievance.entity.GrievanceComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrievanceCommentRepository
        extends JpaRepository<GrievanceComment, Long> {

    List<GrievanceComment> findByGrievanceIdOrderByCommentedAtAsc(
            Long grievanceId);
}