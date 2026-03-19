package com.apex.erp.notification.repository;

import com.apex.erp.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    @Query("""
        SELECT n FROM Notification n
        WHERE (n.targetType = 'USER'
               AND n.targetUser.id = :userId)
           OR (n.targetType = 'ROLE'
               AND n.targetRole = :role)
           OR n.targetType = 'ALL'
        ORDER BY n.createdAt DESC
        """)
    List<Notification> findAllForUser(
            @Param("userId") Long userId,
            @Param("role") String role);
}