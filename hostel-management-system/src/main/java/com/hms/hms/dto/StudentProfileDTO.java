package com.hms.hms.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class StudentProfileDTO {

    // ── Identity ──────────────────────────────────────────────
    private Long id;
    private String enrollmentNo;
    private String status;

    // ── Personal ──────────────────────────────────────────────
    private String name;
    private String email;
    private String phone;
    private String gender;
    private LocalDate dob;
    private String nationality;
    private String photoUrl;

    // ── Academic ──────────────────────────────────────────────
    private String course;
    private String yearSemester;
    private String batch;
    private String program;

    // ── Guardian ──────────────────────────────────────────────
    private String guardianName;
    private String guardianPhone;
    private String guardianRelation;
    private String address;

    // ── Hostel Allocation ─────────────────────────────────────
    private String hostelBlock;
    private String roomType;
    private String roomNo;
    private String bedNo;
    private LocalDate allocatedOn;

    // ── Fee Summary (aggregated) ──────────────────────────────
    private Double totalFeesDue;
    private Double currentOutstanding;
    private LocalDate lastPaidDate;
    private LocalDate dueDate;
    private String feeStatus;

    // ── Complaint Summary (aggregated) ────────────────────────
    private Integer totalComplaints;
    private Integer openComplaints;
    private Integer resolvedComplaints;
    private String lastComplaint;

    // ── Relations ─────────────────────────────────────────────
    private Long wardenId;
    private String wardenName;
    private LocalDate joinDate;
}