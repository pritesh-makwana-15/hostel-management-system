package com.hms.hms.repository;

import com.hms.hms.entity.FeePaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface FeePaymentTransactionRepository extends JpaRepository<FeePaymentTransaction, Long> {

    boolean existsByTransactionIdIgnoreCase(String transactionId);

    Optional<FeePaymentTransaction> findByPaymentId(String paymentId);

    Optional<FeePaymentTransaction> findByPaymentIdAndStudentId(String paymentId, Long studentId);

    List<FeePaymentTransaction> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<FeePaymentTransaction> findByFeeRecordIdOrderByCreatedAtDesc(Long feeRecordId);

    @Query("select coalesce(sum(f.amount), 0) from FeePaymentTransaction f where f.feeRecord.id = :feeRecordId and upper(f.status) = 'PENDING'")
    BigDecimal sumPendingAmountByFeeRecordId(@Param("feeRecordId") Long feeRecordId);
}
