package com.hms.hms.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    // Common fields (User table)
    private String name;
    private String email;
    private String password;
    private String phone;

    // Admin-specific
    private String designation;

    // Warden-specific
    private Long adminId;
    private String gender;
    private String address;
    private LocalDate joinDate;

    // Student-specific
    private Long wardenId;
    private Long roomId;
    private String course;
    private LocalDate dob;
}