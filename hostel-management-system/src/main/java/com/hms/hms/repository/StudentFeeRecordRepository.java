package com.hms.hms.repository;

import com.hms.hms.entity.StudentFeeRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentFeeRecordRepository extends JpaRepository<StudentFeeRecord, Long> {

    Optional<StudentFeeRecord> findByStudentIdAndAcademicCycleAndHostelBlockIgnoreCaseAndRoomTypeIgnoreCase(
            Long studentId,
            String academicCycle,
            String hostelBlock,
            String roomType
    );

    List<StudentFeeRecord> findByStudentIdOrderByAcademicCycleDesc(Long studentId);

    Optional<StudentFeeRecord> findTopByStudentIdOrderByAcademicCycleDesc(Long studentId);
}
