package com.hms.hms.service;

import com.hms.hms.entity.Announcement;
import com.hms.hms.repository.AnnouncementRepository;
import com.hms.hms.dto.AnnouncementDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    // Create a new announcement
    public Announcement createAnnouncement(AnnouncementDTO announcementDTO, String createdBy) {
        Announcement announcement = new Announcement();
        announcement.setTitle(announcementDTO.getTitle());
        announcement.setMessage(announcementDTO.getMessage());
        announcement.setAudience(Announcement.Audience.valueOf(announcementDTO.getAudience().toUpperCase()));
        announcement.setPriority(Announcement.Priority.valueOf(announcementDTO.getPriority().toUpperCase()));
        announcement.setCreatedBy(createdBy);
        
        // Handle publication date
        if (announcementDTO.getPublishDate() != null && !announcementDTO.getPublishDate().isEmpty()) {
            LocalDateTime publishDate = LocalDateTime.parse(announcementDTO.getPublishDate());
            announcement.setPublishDate(publishDate);
            if (!publishDate.isAfter(LocalDateTime.now())) {
                announcement.setStatus(Announcement.Status.PUBLISHED); // Publish immediately if date has arrived
            } else {
                announcement.setStatus(Announcement.Status.DRAFT); // Schedule for future publish
            }
        } else {
            announcement.setPublishDate(LocalDateTime.now());
            announcement.setStatus(Announcement.Status.PUBLISHED); // Publish immediately
        }
        
        // Handle expiry date
        if (announcementDTO.getExpiryDate() != null && !announcementDTO.getExpiryDate().isEmpty()) {
            announcement.setExpiryDate(LocalDateTime.parse(announcementDTO.getExpiryDate()));
        }
        
        return announcementRepository.save(announcement);
    }

    // Get all announcements with pagination
    public Page<Announcement> getAllAnnouncements(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return announcementRepository.findAllOrderedByCreatedAt(pageable);
    }

    // Get announcement by ID
    public Optional<Announcement> getAnnouncementById(Long id) {
        return announcementRepository.findById(id);
    }

    // Update an announcement
    public Announcement updateAnnouncement(Long id, AnnouncementDTO announcementDTO) {
        Optional<Announcement> existingAnnouncement = announcementRepository.findById(id);
        if (existingAnnouncement.isPresent()) {
            Announcement announcement = existingAnnouncement.get();
            
            announcement.setTitle(announcementDTO.getTitle());
            announcement.setMessage(announcementDTO.getMessage());
            announcement.setAudience(Announcement.Audience.valueOf(announcementDTO.getAudience().toUpperCase()));
            announcement.setPriority(Announcement.Priority.valueOf(announcementDTO.getPriority().toUpperCase()));
            
            // Handle publication date
            if (announcementDTO.getPublishDate() != null && !announcementDTO.getPublishDate().isEmpty()) {
                LocalDateTime publishDate = LocalDateTime.parse(announcementDTO.getPublishDate());
                announcement.setPublishDate(publishDate);
                if (!publishDate.isAfter(LocalDateTime.now())) {
                    announcement.setStatus(Announcement.Status.PUBLISHED);
                } else {
                    announcement.setStatus(Announcement.Status.DRAFT);
                }
            }
            
            // Handle expiry date
            if (announcementDTO.getExpiryDate() != null && !announcementDTO.getExpiryDate().isEmpty()) {
                announcement.setExpiryDate(LocalDateTime.parse(announcementDTO.getExpiryDate()));
            }
            
            return announcementRepository.save(announcement);
        }
        return null;
    }

    // Delete an announcement
    public boolean deleteAnnouncement(Long id) {
        if (announcementRepository.existsById(id)) {
            announcementRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Get active announcements (published and not expired)
    public List<Announcement> getActiveAnnouncements() {
        return announcementRepository.findActiveAnnouncements(LocalDateTime.now());
    }

    // Get announcements by audience
    public List<Announcement> getAnnouncementsByAudience(String audience) {
        try {
            Announcement.Audience audienceEnum = Announcement.Audience.valueOf(audience.toUpperCase());
            return announcementRepository.findByAudience(audienceEnum);
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }

    // Search announcements
    public Page<Announcement> searchAnnouncements(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return announcementRepository.searchAnnouncements(keyword, pageable);
    }

    // Get announcement statistics
    public AnnouncementStats getAnnouncementStats() {
        AnnouncementStats stats = new AnnouncementStats();
        stats.setTotal(announcementRepository.count());
        stats.setPublished(announcementRepository.countByStatus(Announcement.Status.PUBLISHED));
        stats.setDraft(announcementRepository.countByStatus(Announcement.Status.DRAFT));
        stats.setExpired(announcementRepository.countByStatus(Announcement.Status.EXPIRED));
        stats.setStudents(announcementRepository.countByAudience(Announcement.Audience.STUDENTS));
        stats.setWardens(announcementRepository.countByAudience(Announcement.Audience.WARDENS));
        stats.setBoth(announcementRepository.countByAudience(Announcement.Audience.BOTH));
        return stats;
    }

    // Get announcements for admin list (convert to DTO format)
    public List<AnnouncementDTO> getAnnouncementsForAdmin() {
        List<Announcement> announcements = announcementRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return announcements.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Convert entity to DTO
    private AnnouncementDTO convertToDTO(Announcement announcement) {
        AnnouncementDTO dto = new AnnouncementDTO();
        dto.setId(announcement.getId());
        dto.setTitle(announcement.getTitle());
        dto.setMessage(announcement.getMessage());
        dto.setAudience(announcement.getAudience().toString());
        dto.setPriority(announcement.getPriority().toString());
        dto.setPublishDate(announcement.getPublishDate() != null ? announcement.getPublishDate().toString() : null);
        dto.setExpiryDate(announcement.getExpiryDate() != null ? announcement.getExpiryDate().toString() : null);
        dto.setCreatedBy(announcement.getCreatedBy());
        dto.setCreatedAt(announcement.getCreatedAt() != null ? announcement.getCreatedAt().toString() : null);
        dto.setStatus(announcement.getStatus().toString());
        return dto;
    }

    // Inner class for statistics
    public static class AnnouncementStats {
        private long total;
        private long published;
        private long draft;
        private long expired;
        private long students;
        private long wardens;
        private long both;

        // Getters and Setters
        public long getTotal() { return total; }
        public void setTotal(long total) { this.total = total; }
        public long getPublished() { return published; }
        public void setPublished(long published) { this.published = published; }
        public long getDraft() { return draft; }
        public void setDraft(long draft) { this.draft = draft; }
        public long getExpired() { return expired; }
        public void setExpired(long expired) { this.expired = expired; }
        public long getStudents() { return students; }
        public void setStudents(long students) { this.students = students; }
        public long getWardens() { return wardens; }
        public void setWardens(long wardens) { this.wardens = wardens; }
        public long getBoth() { return both; }
        public void setBoth(long both) { this.both = both; }
    }
}
