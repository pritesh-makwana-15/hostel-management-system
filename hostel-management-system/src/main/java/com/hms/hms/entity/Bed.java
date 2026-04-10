package com.hms.hms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "beds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String bedNumber; // B1, B2, B3 ...

    @Column(nullable = false)
    @Builder.Default
    public String status = "Available"; // Available / Occupied / Maintenance

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    public Room room;

    @OneToOne
    @JoinColumn(name = "student_id")
    public Student student;
}
