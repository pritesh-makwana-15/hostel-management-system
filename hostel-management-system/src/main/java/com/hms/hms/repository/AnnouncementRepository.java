package com.hms.hms.repository;

import com.hms.hms.entity.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    // Find announcements by status
    List<Announcement> findByStatus(Announcement.Status status);

    // Find announcements by audience
    List<Announcement> findByAudience(Announcement.Audience audience);

    // Find announcements by status and audience
    List<Announcement> findByStatusAndAudience(Announcement.Status status, Announcement.Audience audience);

    // Find published announcements that are currently active
    @Query("SELECT a FROM Announcement a WHERE a.status = 'PUBLISHED' AND " +
           "(a.publishDate IS NULL OR a.publishDate <= :currentDate) AND " +
           "(a.expiryDate IS NULL OR a.expiryDate > :currentDate)")
    List<Announcement> findActiveAnnouncements(@Param("currentDate") LocalDateTime currentDate);

    // Find announcements by priority
    List<Announcement> findByPriority(Announcement.Priority priority);

    // Find announcements created by a specific user
    List<Announcement> findByCreatedBy(String createdBy);

    // Search announcements by title or message
    @Query("SELECT a FROM Announcement a WHERE " +
           "LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.message) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Announcement> searchAnnouncements(@Param("keyword") String keyword, Pageable pageable);

    // Count announcements by status
    long countByStatus(Announcement.Status status);

    // Count announcements by audience
    long countByAudience(Announcement.Audience audience);

    // Find announcements expiring soon (within next 7 days)
    @Query("SELECT a FROM Announcement a WHERE a.status = 'PUBLISHED' AND " +
           "a.expiryDate BETWEEN :currentDate AND :weekLater")
    List<Announcement> findAnnouncementsExpiringSoon(
        @Param("currentDate") LocalDateTime currentDate,
        @Param("weekLater") LocalDateTime weekLater
    );

    // Find recently published announcements (last 30 days)
    @Query("SELECT a FROM Announcement a WHERE a.status = 'PUBLISHED' AND " +
           "a.createdAt >= :thirtyDaysAgo ORDER BY a.createdAt DESC")
    List<Announcement> findRecentAnnouncements(@Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);

    // Find all announcements with pagination and sorting
    @Query("SELECT a FROM Announcement a ORDER BY a.createdAt DESC")
    Page<Announcement> findAllOrderedByCreatedAt(Pageable pageable);

    // Find announcements by multiple criteria
    @Query("SELECT a FROM Announcement a WHERE " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:audience IS NULL OR a.audience = :audience) AND " +
           "(:priority IS NULL OR a.priority = :priority) AND " +
           "(:createdBy IS NULL OR a.createdBy = :createdBy)")
    Page<Announcement> findByMultipleCriteria(
        @Param("status") Announcement.Status status,
        @Param("audience") Announcement.Audience audience,
        @Param("priority") Announcement.Priority priority,
        @Param("createdBy") String createdBy,
        Pageable pageable
    );
}
