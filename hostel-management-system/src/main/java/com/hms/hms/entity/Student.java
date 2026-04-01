package com.hms.hms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "warden_id")
    private Warden warden;

    // ── Academic ──────────────────────────────────────────────
    @Column(name = "enrollment_no", length = 50)
    private String enrollmentNo;

    @Column(length = 50)
    private String course;

    @Column(name = "year_semester", length = 50)
    private String yearSemester;

    @Column(length = 30)
    private String batch;

    @Column(length = 30)
    private String program;

    // ── Personal ──────────────────────────────────────────────
    @Column(name = "dob")
    private LocalDate dob;

    @Column(length = 10)
    private String gender;

    @Column(length = 30)
    private String nationality;

    @Column(name = "photo_url", length = 255)
    private String photoUrl;

    // ── Guardian ──────────────────────────────────────────────
    @Column(name = "guardian_name", length = 100)
    private String guardianName;

    @Column(name = "guardian_phone", length = 15)
    private String guardianPhone;

    @Column(name = "guardian_relation", length = 30)
    private String guardianRelation;

    @Column(columnDefinition = "TEXT")
    private String address;

    // ── Hostel Allocation (denormalized for quick access) ─────
    @Column(name = "hostel_block", length = 30)
    private String hostelBlock;

    @Column(name = "room_type", length = 20)
    private String roomType;

    @Column(name = "room_no", length = 20)
    private String roomNo;

    @Column(name = "bed_no", length = 10)
    private String bedNo;

    @Column(name = "allocated_on")
    private LocalDate allocatedOn;

    @Column(name = "room_id")
    private Long roomId;

    // ── Status & Dates ────────────────────────────────────────
    @Column(length = 20)
    @Builder.Default
    private String status = "Active";

    @Column(name = "join_date")
    private LocalDate joinDate;

    // ── Auditing ──────────────────────────────────────────────
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Helper methods ────────────────────────────────────────
    public String getName()  { return user != null ? user.getName()  : null; }
    public String getEmail() { return user != null ? user.getEmail() : null; }
    public String getPhone() { return user != null ? user.getPhone() : null; }
}