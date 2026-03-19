package com.apex.erp.feedback.repository;

import com.apex.erp.feedback.entity.FeedbackResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FeedbackResponseRepository
        extends JpaRepository<FeedbackResponse, Long> {

    List<FeedbackResponse> findByFormId(Long formId);

    Optional<FeedbackResponse> findByFormIdAndStudentId(
            Long formId, Long studentId);

    boolean existsByFormIdAndStudentId(
            Long formId, Long studentId);

    @Query("SELECT AVG(r.overallRating) FROM FeedbackResponse r " +
           "WHERE r.form.faculty.id = :facultyId")
    Double findAvgOverallRatingByFaculty(
            @Param("facultyId") Long facultyId);

    @Query("SELECT AVG(r.teachingRating) FROM FeedbackResponse r " +
           "WHERE r.form.faculty.id = :facultyId")
    Double findAvgTeachingRatingByFaculty(
            @Param("facultyId") Long facultyId);

    @Query("SELECT AVG(r.knowledgeRating) FROM FeedbackResponse r " +
           "WHERE r.form.faculty.id = :facultyId")
    Double findAvgKnowledgeRatingByFaculty(
            @Param("facultyId") Long facultyId);

    @Query("SELECT AVG(r.communicationRating) " +
           "FROM FeedbackResponse r " +
           "WHERE r.form.faculty.id = :facultyId")
    Double findAvgCommunicationRatingByFaculty(
            @Param("facultyId") Long facultyId);

    @Query("SELECT AVG(r.punctualityRating) " +
           "FROM FeedbackResponse r " +
           "WHERE r.form.faculty.id = :facultyId")
    Double findAvgPunctualityRatingByFaculty(
            @Param("facultyId") Long facultyId);

    @Query("SELECT COUNT(r) FROM FeedbackResponse r " +
           "WHERE r.form.faculty.id = :facultyId")
    Long countByFaculty(@Param("facultyId") Long facultyId);
}