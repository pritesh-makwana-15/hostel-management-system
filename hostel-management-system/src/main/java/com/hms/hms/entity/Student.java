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
    public Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    public User user;

    @ManyToOne
    @JoinColumn(name = "warden_id")
    public Warden warden;

    // ── Academic ──────────────────────────────────────────────
    @Column(name = "enrollment_no", length = 50)
    public String enrollmentNo;

    @Column(length = 50)
    public String course;

    @Column(name = "year_semester", length = 50)
    public String yearSemester;

    @Column(length = 30)
    public String batch;

    @Column(length = 30)
    public String program;

    // ── Personal ──────────────────────────────────────────────
    @Column(name = "dob")
    public LocalDate dob;

    @Column(length = 10)
    public String gender;

    @Column(length = 30)
    public String nationality;

    @Column(name = "photo_url", length = 255)
    public String photoUrl;

    // ── Guardian ──────────────────────────────────────────────
    @Column(name = "guardian_name", length = 100)
    public String guardianName;

    @Column(name = "guardian_phone", length = 15)
    public String guardianPhone;

    @Column(name = "guardian_relation", length = 30)
    public String guardianRelation;

    @Column(columnDefinition = "TEXT")
    public String address;

    // ── Hostel Allocation (denormalized for quick access) ─────
    @Column(name = "hostel_block", length = 30)
    public String hostelBlock;

    @Column(name = "room_type", length = 20)
    public String roomType;

    @Column(name = "room_no", length = 20)
    public String roomNo;

    @Column(name = "bed_no", length = 10)
    public String bedNo;

    @Column(name = "allocated_on")
    public LocalDate allocatedOn;

    @ManyToOne
    @JoinColumn(name = "room_id")
    public Room room;

    @ManyToOne
    @JoinColumn(name = "bed_id")
    public Bed bed;

    // ── Status & Dates ────────────────────────────────────────
    @Column(length = 20)
    @Builder.Default
    public String status = "Active";

    @Column(name = "join_date")
    public LocalDate joinDate;

    // ── Auditing ──────────────────────────────────────────────
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    public LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    public LocalDateTime updatedAt;

    // ── Helper methods ────────────────────────────────────────
    public String getName()  { return user != null ? user.getName()  : null; }
    public String getEmail() { return user != null ? user.getEmail() : null; }
    public String getPhone() { return user != null ? user.getPhone() : null; }
}