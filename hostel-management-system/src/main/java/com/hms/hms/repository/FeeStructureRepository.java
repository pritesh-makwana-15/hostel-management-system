package com.hms.hms.repository;

import com.hms.hms.entity.FeeStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeeStructureRepository extends JpaRepository<FeeStructure, Long> {
    List<FeeStructure> findByHostelBlock(String hostelBlock);
    Optional<FeeStructure> findByHostelBlockAndRoomType(String hostelBlock, String roomType);
    List<FeeStructure> findByStatus(String status);
    List<FeeStructure> findByRoomType(String roomType);
}