package com.hms.hms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "student")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Column(name = "room_id")
    private Long roomId;

    @Column(length = 50)
    private String course;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "join_date")
    private LocalDate joinDate;

    // Helper methods
    public String getName()  { return user != null ? user.getName()  : null; }
    public String getEmail() { return user != null ? user.getEmail() : null; }
    public String getPhone() { return user != null ? user.getPhone() : null; }
}