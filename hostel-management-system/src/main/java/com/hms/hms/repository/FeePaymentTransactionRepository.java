package com.hms.hms.repository;

import com.hms.hms.entity.FeePaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeePaymentTransactionRepository extends JpaRepository<FeePaymentTransaction, Long> {

    boolean existsByTransactionIdIgnoreCase(String transactionId);

    Optional<FeePaymentTransaction> findByPaymentId(String paymentId);

    Optional<FeePaymentTransaction> findByPaymentIdAndStudentId(String paymentId, Long studentId);

    List<FeePaymentTransaction> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<FeePaymentTransaction> findByFeeRecordIdOrderByCreatedAtDesc(Long feeRecordId);
}
