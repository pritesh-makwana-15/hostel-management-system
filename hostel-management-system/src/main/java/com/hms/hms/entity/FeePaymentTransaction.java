package com.hms.hms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fee_payment_transaction")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class FeePaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "payment_id", nullable = false, unique = true, length = 40)
    public String paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fee_id", nullable = false)
    public StudentFeeRecord feeRecord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    public Student student;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    public BigDecimal amount;

    @Column(name = "payment_method", nullable = false, length = 30)
    public String paymentMethod;

    @Column(name = "transaction_id", nullable = false, unique = true, length = 80)
    public String transactionId;

    @Column(name = "payment_date")
    public LocalDate paymentDate;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    public String status = "PENDING";

    @Column(name = "notes", columnDefinition = "TEXT")
    public String notes;

    @Column(name = "verified_at")
    public LocalDateTime verifiedAt;

    @Column(name = "verified_by", length = 100)
    public String verifiedBy;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    public LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    public LocalDateTime updatedAt;
}
