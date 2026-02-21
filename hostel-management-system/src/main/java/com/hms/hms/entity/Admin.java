package com.hms.hms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 50)
    private String designation;

    @Column(length = 15)
    private String phone;

    // Helper: get name/email from user
    public String getName() { return user != null ? user.getName() : null; }
    public String getEmail() { return user != null ? user.getEmail() : null; }
}