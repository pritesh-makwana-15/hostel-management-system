package com.hms.hms.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WardenComplaintDTO {
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
    private String studentId;
    private String hostelBlock;
    
    // Relations
    private Long studentUserId;
    private Long wardenId;
    private Long createdAt;
}
