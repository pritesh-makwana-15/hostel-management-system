package com.hms.hms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "student_fee_record",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_student_cycle_block_room",
            columnNames = {"student_id", "academic_cycle", "hostel_block", "room_type"}
        )
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class StudentFeeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    public Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fee_structure_id")
    public FeeStructure feeStructure;

    @Column(name = "academic_cycle", nullable = false, length = 20)
    public String academicCycle;

    @Column(name = "hostel_block", nullable = false, length = 50)
    public String hostelBlock;

    @Column(name = "room_type", nullable = false, length = 30)
    public String roomType;

    @Column(name = "total_fee", nullable = false, precision = 12, scale = 2)
    public BigDecimal totalFee;

    @Column(name = "paid_amount", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    public BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "balance_amount", nullable = false, precision = 12, scale = 2)
    public BigDecimal balanceAmount;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    public String status = "PENDING";

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    public LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    public LocalDateTime updatedAt;
}
