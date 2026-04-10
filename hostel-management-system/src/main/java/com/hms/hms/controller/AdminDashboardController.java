package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.service.StudentService;
import com.hms.hms.service.RoomService;
import com.hms.hms.service.WardenService;
import com.hms.hms.repository.StudentRepository;
import com.hms.hms.repository.RoomRepository;
import com.hms.hms.repository.WardenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    @Autowired
    private StudentService studentService;
    
    @Autowired
    private RoomService roomService;
    
    @Autowired
    private WardenService wardenService;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private WardenRepository wardenRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Student Statistics
            long totalStudents = studentRepository.count();
            // long activeStudents = studentRepository.countByStatus("ACTIVE");
            // long pendingStudents = studentRepository.countByStatus("PENDING");
            long activeStudents = 0;
            long pendingStudents = 0;
            
            // Room Statistics
            long totalRooms = roomRepository.count();
            // long occupiedRooms = roomRepository.countByOccupancyGreaterThan(0);
            long occupiedRooms = 0;
            long availableRooms = totalRooms - occupiedRooms;
            
            // Warden Statistics
            long totalWardens = wardenRepository.count();
            // long activeWardens = wardenRepository.countByStatus("ACTIVE");
            long activeWardens = 0;
            
            // Build stats map
            stats.put("totalStudents", totalStudents);
            stats.put("activeStudents", activeStudents);
            stats.put("pendingStudents", pendingStudents);
            stats.put("totalRooms", totalRooms);
            stats.put("occupiedRooms", occupiedRooms);
            stats.put("availableRooms", availableRooms);
            stats.put("totalWardens", totalWardens);
            stats.put("activeWardens", activeWardens);
            
            // Calculate occupancy rate
            double occupancyRate = totalRooms > 0 ? (double) occupiedRooms / totalRooms * 100 : 0;
            stats.put("occupancyRate", Math.round(occupancyRate * 100.0) / 100.0);
            
            return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched successfully", stats));
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch dashboard stats: " + e.getMessage()));
        }
    }
    
    @GetMapping("/recent-activity")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRecentActivity() {
        try {
            Map<String, Object> activity = new HashMap<>();
            
            // Get recent student registrations (last 7 days)
            // This would require additional queries or methods in services
            // For now, returning empty data
            
            activity.put("recentRegistrations", 0);
            activity.put("recentComplaints", 0);
            activity.put("recentPayments", 0);
            
            return ResponseEntity.ok(ApiResponse.success("Recent activity fetched successfully", activity));
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(ApiResponse.error("Failed to fetch recent activity: " + e.getMessage()));
        }
    }
}
