package com.hms.hms.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {

    // ── Common (User table) ───────────────────────────────────
    public String name;
    public String email;
    public String password;
    public String phone;

    // ── Admin-specific ────────────────────────────────────────
    public String designation;

    // ── Warden-specific ───────────────────────────────────────
    public Long adminId;
    public String gender;
    public String address;
    public LocalDate joinDate;

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