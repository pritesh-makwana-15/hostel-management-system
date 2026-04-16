package com.hms.hms.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminComplaintDTO {
    private Long id;
    private String complaintCode;
    private String title;
    private String category;
    private String priority;
    private String description;
    private String roomNumber;
    private String status;
    private String submittedDate;
    private String submittedTime;
    
    // Student Info
    private String studentName;
    private Long studentId;
    private String hostelBlock;
    
    // Warden Info
    private String assignedWardenName;
    private Long assignedWardenId;
    
    // Relations
    private Long studentUserId;
    private Long createdAt;
}
