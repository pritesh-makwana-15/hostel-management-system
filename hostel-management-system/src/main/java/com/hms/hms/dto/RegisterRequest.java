package com.hms.hms.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {

    // ── Common (User table) ───────────────────────────────────
    private String name;
    private String email;
    private String password;
    private String phone;

    // ── Admin-specific ────────────────────────────────────────
    private String designation;

    // ── Warden-specific ───────────────────────────────────────
    private Long adminId;
    private String gender;
    private String address;
    private LocalDate joinDate;

    // ── Student — Academic ────────────────────────────────────
    private Long wardenId;
    private Long roomId;
    private String course;
    private String enrollmentNo;
    private String yearSemester;
    private String batch;
    private String program;

    // ── Student — Personal ────────────────────────────────────
    private LocalDate dob;
    private String nationality;
    private String photoUrl;

    // ── Student — Guardian ────────────────────────────────────
    private String guardianName;
    private String guardianPhone;
    private String guardianRelation;

    // ── Student — Hostel ─────────────────────────────────────
    private String hostelBlock;
    private String roomType;
    private String roomNo;
    private String bedNo;
    private LocalDate allocatedOn;

    // ── Student — Status ──────────────────────────────────────
    private String status;
}