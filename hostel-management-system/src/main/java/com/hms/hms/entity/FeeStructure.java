package com.hms.hms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "fee_structures",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_fee_structures_block_room", columnNames = {"hostel_block", "room_type"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "hostel_block", nullable = false)
    public String hostelBlock;

    @Column(name = "room_type", nullable = false)
    public String roomType; // AC, Non-AC

    @Column(nullable = false)
    public Double monthlyFee;

    @Column(nullable = false)
    public Double securityDeposit;

    public Double utilities;

    public Double lateFee;

    @Column(nullable = false)
    @Builder.Default
    public String status = "Active";

    @Column(updatable = false)
    public LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}