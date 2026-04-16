package com.hms.hms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "complaint_code", nullable = false, unique = true, length = 30)
    public String complaintCode;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    public Student student;

    @ManyToOne
    @JoinColumn(name = "warden_id")
    public Warden warden;

    @Column(name = "title", nullable = false, length = 150)
    public String title;

    @Column(name = "category", nullable = false, length = 80)
    public String category;

    @Column(name = "priority_level", nullable = false, length = 20)
    public String priority;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    public String description;

    @Column(name = "room_number", length = 40)
    public String roomNumber;

    @Column(name = "status", length = 20)
    @Builder.Default
    public String status = "Open";

    @Column(name = "submitted_date", nullable = false)
    public LocalDate submittedDate;

    @Column(name = "submitted_time", nullable = false, length = 20)
    public String submittedTime;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    public LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    public LocalDateTime updatedAt;
}