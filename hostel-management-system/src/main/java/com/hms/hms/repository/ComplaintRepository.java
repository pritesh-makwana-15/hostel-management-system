package com.hms.hms.repository;

import com.hms.hms.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    Optional<Complaint> findByComplaintCodeAndStudentId(String complaintCode, Long studentId);

    long countByStudentId(Long studentId);

    long countByStudentIdAndStatus(Long studentId, String status);

    Optional<Complaint> findTopByStudentIdOrderByCreatedAtDesc(Long studentId);

    // Warden-specific queries
    List<Complaint> findByWardenIdOrderByCreatedAtDesc(Long wardenId);

    // Include complaints that are either directly assigned to a warden
    // or belong to a student currently mapped to that warden.
    List<Complaint> findByWardenIdOrStudent_WardenIdOrderByCreatedAtDesc(Long wardenId, Long studentWardenId);

    List<Complaint> findByWardenIdAndStatusOrderByCreatedAtDesc(Long wardenId, String status);

    long countByWardenId(Long wardenId);

    long countByWardenIdAndStatus(Long wardenId, String status);
}