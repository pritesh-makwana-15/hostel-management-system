package com.hms.hms.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class StudentComplaintDTO {
    private String id;
    private String title;
    private String category;
    private String priority;
    private String description;
    private String roomNumber;
    private String hostelBlock;
    private String studentName;
    private String studentId;
    private String status;
    private String assignedWarden;
    private Long assignedWardenId;
    private LocalDate submittedDate;
    private String submittedTime;
}