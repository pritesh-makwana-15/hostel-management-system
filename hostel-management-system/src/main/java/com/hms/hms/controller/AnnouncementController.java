package com.hms.hms.controller;

import com.hms.hms.dto.AnnouncementDTO;
import com.hms.hms.dto.ApiResponse;
import com.hms.hms.entity.Announcement;
import com.hms.hms.service.AnnouncementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "http://localhost:5173")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    // Get all announcements for admin list
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AnnouncementDTO>>> getAllAnnouncements() {
        try {
            List<AnnouncementDTO> announcements = announcementService.getAnnouncementsForAdmin();
            return ResponseEntity.ok(ApiResponse.success("Announcements retrieved successfully", announcements));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error retrieving announcements: " + e.getMessage()));
        }
    }

    // Create a new announcement
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Announcement>> createAnnouncement(@Valid @RequestBody AnnouncementDTO announcementDTO) {
        try {
            // Get current admin user (simplified - in real app, get from security context)
            String createdBy = getCurrentUser();
            
            Announcement announcement = announcementService.createAnnouncement(announcementDTO, createdBy);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Announcement created successfully", announcement));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Error creating announcement: " + e.getMessage()));
        }
    }

    // Get announcement by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Announcement>> getAnnouncementById(@PathVariable Long id) {
        try {
            Optional<Announcement> announcement = announcementService.getAnnouncementById(id);
            if (announcement.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Announcement retrieved successfully", announcement.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Announcement not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error retrieving announcement: " + e.getMessage()));
        }
    }

    // Update an announcement
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Announcement>> updateAnnouncement(
            @PathVariable Long id, 
            @Valid @RequestBody AnnouncementDTO announcementDTO) {
        try {
            Announcement announcement = announcementService.updateAnnouncement(id, announcementDTO);
            if (announcement != null) {
                return ResponseEntity.ok(ApiResponse.success("Announcement updated successfully", announcement));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Announcement not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Error updating announcement: " + e.getMessage()));
        }
    }

    // Delete an announcement
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteAnnouncement(@PathVariable Long id) {
        try {
            boolean deleted = announcementService.deleteAnnouncement(id);
            if (deleted) {
                return ResponseEntity.ok(ApiResponse.success("Announcement deleted successfully", "Announcement with ID " + id + " has been deleted"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Announcement not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error deleting announcement: " + e.getMessage()));
        }
    }

    // Get active announcements (for students/wardens)
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Announcement>>> getActiveAnnouncements() {
        try {
            List<Announcement> announcements = announcementService.getActiveAnnouncements();
            return ResponseEntity.ok(ApiResponse.success("Active announcements retrieved successfully", announcements));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error retrieving active announcements: " + e.getMessage()));
        }
    }

    // Get announcements by audience
    @GetMapping("/audience/{audience}")
    public ResponseEntity<ApiResponse<List<Announcement>>> getAnnouncementsByAudience(@PathVariable String audience) {
        try {
            List<Announcement> announcements = announcementService.getAnnouncementsByAudience(audience);
            return ResponseEntity.ok(ApiResponse.success("Announcements for " + audience + " retrieved successfully", announcements));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error retrieving announcements: " + e.getMessage()));
        }
    }

    // Search announcements
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<Announcement>>> searchAnnouncements(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Announcement> announcements = announcementService.searchAnnouncements(keyword, page, size);
            return ResponseEntity.ok(ApiResponse.success("Search results retrieved successfully", announcements));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error searching announcements: " + e.getMessage()));
        }
    }

    // Get announcement statistics
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AnnouncementService.AnnouncementStats>> getAnnouncementStats() {
        try {
            AnnouncementService.AnnouncementStats stats = announcementService.getAnnouncementStats();
            return ResponseEntity.ok(ApiResponse.success("Announcement statistics retrieved successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error retrieving statistics: " + e.getMessage()));
        }
    }

    // Helper method to get current user (simplified)
    private String getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName(); // Returns email/username
        }
        return "Admin"; // Fallback
    }
}
