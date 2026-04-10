package com.hms.hms.entity;

import jakarta.persistence.*;
import lombok.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "warden")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Warden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    public User user;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    public Admin admin;

    @Column(length = 10)
    public String gender;

    @Column(columnDefinition = "TEXT")
    public String address;

    @Column(name = "join_date")
    public LocalDate joinDate;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    public LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    public LocalDateTime updatedAt;

    // Helper methods
    public String getName()  { return user != null ? user.getName()  : null; }
    public String getEmail() { return user != null ? user.getEmail() : null; }
    public String getPhone() { return user != null ? user.getPhone() : null; }
}